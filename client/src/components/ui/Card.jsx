import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl ${
        hover ? 'hover:border-slate-700 hover:shadow-2xl transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
