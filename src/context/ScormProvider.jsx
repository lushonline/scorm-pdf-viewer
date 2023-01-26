import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { SCORM, debug as scormDebug } from 'pipwerks-scorm-api-wrapper';
import ScormContext from './ScormContext';

const ScormProvider = ({ debug, ...props }) => {
  const [apiConnected, setApiConnected] = useState(false);
  const [completionStatus, setCompletionStatus] = useState('incomplete');
  const [location, setLocation] = useState('');

  const unloadEventListenerRef = useRef();

  const createScormAPIConnection = () => {
    if (apiConnected) return;

    SCORM.version = '1.2';
    scormDebug.isActive = debug;
    const scorm = SCORM.init();
    if (scorm) {
      const statusFromLMS = SCORM.status('get');
      const locationFromLMS = SCORM.get('cmi.core.lesson_location');

      setApiConnected(true);
      setCompletionStatus(statusFromLMS);
      setLocation(locationFromLMS);
    } else {
      // could not create the SCORM API connection
      if (debug)
        console.error('scormProvider init error: could not create the SCORM API connection');
    }
  };

  const closeScormAPIConnection = () => {
    if (!apiConnected) {
      if (debug) console.error('closeScormAPIConnection error: SCORM API connection not connected');
      return;
    }

    //this.setSuspendData();
    SCORM.status('set', completionStatus);
    SCORM.set('cmi.core.lesson_location', location);
    SCORM.save();
    const success = SCORM.quit();
    if (success) {
      setApiConnected(false);
      setCompletionStatus('unknown');
    } else {
      // could not close the SCORM API connection
      if (debug) console.error('scormProvider error: could not close the API connection');
    }
  };

  const setStatus = (value) => {
    if (!apiConnected) {
      if (debug) console.error('setStatus error: SCORM API connection not connected');
      return;
    }

    const validStatuses = [
      'passed',
      'completed',
      'failed',
      'incomplete',
      'browsed',
      'not attempted',
      'unknown',
    ];
    if (!validStatuses.includes(value)) {
      if (debug)
        console.error('scormProvider setStatus error: could not set the status provided', value);
    }

    const success = SCORM.status('set', value);
    if (success) {
      setCompletionStatus(value);
      SCORM.save();
    } else {
      if (debug)
        console.error('scormProvider setStatus error: could not set the status provided', value);
    }
  };

  const setLessonLocation = (value) => {
    if (!apiConnected) {
      if (debug) console.error('setLessonLocation error: SCORM API connection not connected');
      return;
    }

    // eslint-disable-next-line no-control-regex
    const validator = /^[\u0000-\uFFFF]{0,255}$/;
    if (!validator.test(value)) {
      if (debug)
        console.error(
          'scormProvider setLessonLocation error: could not set the value provided',
          value,
        );
    }

    const success = SCORM.set('cmi.core.lesson_location', value);
    if (success) {
      setLocation(value);
      SCORM.save();
    } else {
      if (debug)
        console.error('scormProvider setLessonLocation error: could not set the value provided');
    }
  };

  const save = () => {
    if (!apiConnected) {
      if (debug) console.error('save error: SCORM API connection not connected');
      return;
    }

    const success = SCORM.save();
    if (!success) {
      if (debug) console.error('scormProvider save error');
    }
  };

  const quit = () => {
    if (!apiConnected) {
      if (debug) console.error('quit error: SCORM API connection not connected');
      return;
    }

    const success = SCORM.quit();
    if (!success) {
      if (debug) console.error('scormProvider quit error');
    }
  };

  const val = {
    setStatus,
    setLessonLocation,
    save,
    quit,
  };

  useEffect(() => {
    unloadEventListenerRef.current = (event) => {
      const returnValue = closeScormAPIConnection?.(event);
      // Handle legacy `event.returnValue` property
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
      if (typeof returnValue === 'string') {
        return (event.returnValue = returnValue);
      }
      // Chrome doesn't support `event.preventDefault()` on `BeforeUnloadEvent`,
      // instead it requires `event.returnValue` to be set
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#browser_compatibility
      if (event.defaultPrevented) {
        return (event.returnValue = '');
      }
    };
  }, []);

  useEffect(() => {
    createScormAPIConnection();
    const eventListener = (event) => unloadEventListenerRef.current(event);
    window.addEventListener('beforeunload', eventListener);
    return () => {
      window.removeEventListener('beforeunload', eventListener);
    };
  }, []);

  return <ScormContext.Provider value={val}>{props.children}</ScormContext.Provider>;
};

ScormProvider.propTypes = {
  debug: PropTypes.bool,
  children: PropTypes.node,
};

ScormProvider.defaultProps = {
  debug: false,
};

export { ScormProvider };
