import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ArrowLeftCircleIcon from './ArrowLeftCircleIcon';
import ArrowRightCircleIcon from './ArrowRightCircleIcon';
import ShieldCheckIcon from './ShieldCheckIcon';

import clsx from 'clsx';

import { PDFRenderer } from './PDFRenderer';

function PDFViewer({ url, onChangePage, onViewed, debug, sco }) {
  const [page, setPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [viewedAll, setViewedAll] = useState(false);

  const onChangePageRef = useRef(onChangePage);
  const onViewedRef = useRef(onViewed);

  const handleOnDocumentLoad = (event) => {
    if (debug) console.log(`onDocumentLoad. ${JSON.stringify(event)}`);
  };

  const handleOnPageLoad = (event) => {
    if (debug) console.log(`onPageLoad. ${JSON.stringify(event)}`);
  };

  const handleOnPageRender = (event) => {
    if (debug) console.log(`onPageRender. ${JSON.stringify(event)}`);
    setPreviousPage(event.page > 1);
    setNextPage(event.pagecount > event.page);
    if (event.page === event.pagecount) {
      setViewedAll(true);
      onViewedRef.current({ ...event, sco });
    }
  };

  const handleOnError = (error) => {
    console.log(`onError. ${error.message}`);
  };

  const handlePreviousPage = (event) => {
    setPage((value) => value - 1);
    onChangePageRef.current({ ...event, sco });
  };

  const handleNextPage = (event) => {
    setPage((value) => value + 1);
    onChangePageRef.current({ ...event, sco });
  };

  useEffect(() => {
    onChangePageRef.current = onChangePage;
  }, [onChangePage]);

  useEffect(() => {
    onViewedRef.current = onViewed;
  }, [onViewed]);

  return (
    <div className="container mx-auto p-4 bg-gray-200">
      <div className="grid grid-cols-12 gap-4 p-1">
        <div className="col-span-1 justify-center items-center text-center gap-2">
          <button
            disabled={!previousPage}
            onClick={handlePreviousPage}
            className={clsx(!previousPage && 'text-gray-300')}
          >
            <ArrowLeftCircleIcon className="h-12 w-12" />
          </button>
        </div>
        <div className="col-span-10 justify-center items-center text-center">
          <button disabled={!viewedAll} className={clsx(!viewedAll && 'invisible')}>
            <ShieldCheckIcon className="h-12 w-12 text-green-500" />
          </button>
        </div>
        <div className="col-span-1 justify-center items-center text-center">
          <button
            disabled={!nextPage}
            onClick={handleNextPage}
            className={clsx(!nextPage && 'text-gray-300')}
          >
            <ArrowRightCircleIcon className="h-12 w-12" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 p-2">
        <div className="col-span-12 justify-center items-center text-center">
          <PDFRenderer
            url={url}
            pageNum={page}
            fitToWidth={true}
            onDocumentLoad={handleOnDocumentLoad}
            onPageLoad={handleOnPageLoad}
            onPageRender={handleOnPageRender}
            onError={handleOnError}
            debug={debug}
          />
        </div>
      </div>
    </div>
  );
}

PDFViewer.propTypes = {
  url: PropTypes.string.isRequired,
  onChangePage: PropTypes.func,
  onViewed: PropTypes.func,
  debug: PropTypes.bool,
  sco: PropTypes.object,
};

PDFViewer.defaultProps = {
  onChangePage: () => {},
  onViewed: () => {},
  debug: false,
  sco: null,
};

export { PDFViewer };
