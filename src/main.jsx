import React from 'react';
import ReactDOM from 'react-dom/client';
import { PDFViewer } from './components/PDFViewer';
import { WithScorm } from './context/WithScorm';
import { ScormProvider } from './context/ScormProvider';
import './index.css';

const ScormPDFViewer = WithScorm(PDFViewer);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScormProvider debug={true}>
      <ScormPDFViewer
        debug={true}
        url={'content.pdf'}
        onViewed={(onviewedEvent) => {
          if (onviewedEvent.sco) {
            onviewedEvent.sco.setStatus('completed');
            onviewedEvent.sco.setLessonLocation(JSON.stringify(onviewedEvent));
          }
        }}
      />
    </ScormProvider>
  </React.StrictMode>,
);
