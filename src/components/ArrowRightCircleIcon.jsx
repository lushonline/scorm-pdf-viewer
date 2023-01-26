import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const ArrowRightCircleIcon = ({ title, titleId, ...props }, ref) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="{1.5} "
      stroke="currentColor"
      className="w-6 h-6"
      width="1em"
      height="1em"
      ref={ref}
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

ArrowRightCircleIcon.propTypes = {
  title: PropTypes.string.isRequired,
  titleId: PropTypes.func,
};

const ForwardRef = forwardRef(ArrowRightCircleIcon);
export default ForwardRef;
