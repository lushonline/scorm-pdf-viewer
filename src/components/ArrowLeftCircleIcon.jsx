import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ArrowLeftCircleIcon = ({ title, titleId, ...props }, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      width="1em"
      height="1em"
      ref={ref}
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
};

ArrowLeftCircleIcon.propTypes = {
  title: PropTypes.string.isRequired,
  titleId: PropTypes.func,
};

const ForwardRef = forwardRef(ArrowLeftCircleIcon);
export default ForwardRef;
