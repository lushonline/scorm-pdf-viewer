import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFRenderer = ({
  url,
  pageNum,
  fitToWidth,
  onDocumentLoad,
  onPageLoad,
  onPageRender,
  onError,
  debug,
}) => {
  const [pdfDocument, setPdfDocument] = useState();
  const [numPages, setNumPages] = useState(null);

  const canvasRef = useRef(null);
  const renderTask = useRef(null);

  const onDocumentLoadRef = useRef(onDocumentLoad);
  const onPageLoadRef = useRef(onPageLoad);
  const onPageRenderRef = useRef(onPageRender);
  const onErrorRef = useRef(onPageRender);

  const prevUrl = useRef();

  const getPdf = () => {
    const config = { url };
    prevUrl.current = url;
    pdfjs.getDocument(config).promise.then(
      (loadedPdfDocument) => {
        setPdfDocument(loadedPdfDocument);
        setNumPages(loadedPdfDocument.numPages);
        onDocumentLoadRef.current({
          url,
          page: pageNum,
          pagecount: loadedPdfDocument.numPages,
        });
      },
      (error) => {
        if (debug) console.error(`error in getPDF. ${error.message}`);
        prevUrl.current = null;
        onErrorRef.current(error);
      },
    );
  };

  const drawPDF = (page) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      return;
    }
    const canvasContext = canvasEl.getContext('2d');
    if (!canvasContext) {
      return;
    }
    const dpRatio = window.devicePixelRatio;

    const originalWidth = page.view[2];
    const adjustedScale = fitToWidth
      ? (canvasEl.parentElement.clientWidth / originalWidth) * dpRatio
      : 1 * dpRatio;

    const viewport = page.getViewport({ scale: adjustedScale });

    canvasEl.style.width = `${viewport.width / dpRatio}px`;
    canvasEl.style.height = `${viewport.height / dpRatio}px`;
    canvasEl.height = viewport.height;
    canvasEl.width = viewport.width;
    if (renderTask.current) {
      renderTask.current.cancel();
      return;
    }
    renderTask.current = page.render({
      canvasContext,
      viewport,
      annotationMode: pdfjs.AnnotationMode.DISABLE,
    });
    return renderTask.current.promise.then(
      () => {
        renderTask.current = null;
        onPageRenderRef.current({
          url: prevUrl.current,
          page: page.pageNumber,
          pagecount: numPages,
        });
      },
      (error) => {
        renderTask.current = null;
        if (error && error.name === 'RenderingCancelledException') {
          if (debug) console.log(`drawPDF rendering cancelled.`);
          drawPDF(page);
        } else {
          if (debug) console.error(`error in drawPDF. ${error.message}`);
          onErrorRef.current(error);
        }
      },
    );
  };

  useEffect(() => {
    onDocumentLoadRef.current = onDocumentLoad;
  }, [onDocumentLoad]);

  useEffect(() => {
    onPageLoadRef.current = onPageLoad;
  }, [onPageLoad]);

  useEffect(() => {
    onPageRenderRef.current = onPageRender;
  }, [onPageRender]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (prevUrl.current != url) {
      getPdf();
    }
  }, [url]);

  useEffect(() => {
    if (pdfDocument) {
      pdfDocument.getPage(pageNum).then(
        (loadedPdfPage) => {
          onPageLoadRef.current({
            url: prevUrl.current,
            page: pageNum,
            pagecount: numPages,
          });
          drawPDF(loadedPdfPage);
        },
        (error) => {
          onErrorRef.current(error);
        },
      );
    }
  }, [pageNum, pdfDocument]);

  return <canvas ref={canvasRef} />;
};

PDFRenderer.propTypes = {
  url: PropTypes.string.isRequired,
  pageNum: PropTypes.number.isRequired,
  fitToWidth: PropTypes.bool,
  onDocumentLoad: PropTypes.func,
  onPageLoad: PropTypes.func,
  onPageRender: PropTypes.func,
  onError: PropTypes.func,
  debug: PropTypes.bool,
};

PDFRenderer.defaultProps = {
  fitToWidth: false,
  onDocumentLoad: () => {},
  onPageLoad: () => {},
  onPageRender: () => {},
  onError: () => {},
  debug: false,
};

export { PDFRenderer };
