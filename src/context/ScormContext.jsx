import { createContext } from 'react';

const ScormContext = createContext({
  apiConnected: false,
  completionStatus: 'unknown',
  setStatus: () => {},
  setLessonLocation: () => {},
  save: () => {},
  quit: () => {},
});

export default ScormContext;
