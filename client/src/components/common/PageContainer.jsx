import React from 'react';

export const PageContainer = ({
  children,
  maxWidth = 'max-w-[1440px]',
  padding = 'px-4 sm:px-6 lg:px-8',
  className = '',
}) => {
  return (
    <div className={`w-full mx-auto ${maxWidth} ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
