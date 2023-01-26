import React from 'react';
import ScormContext from './ScormContext';

function WithScorm(Component) {
  return function WithSCORMComponent(props) {
    return (
      <ScormContext.Consumer>
        {(value) => <Component {...props} sco={value} />}
      </ScormContext.Consumer>
    );
  };
}
export { WithScorm };
