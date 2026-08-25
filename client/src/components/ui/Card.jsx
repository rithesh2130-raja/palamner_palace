import React from 'react';

export const Card = ({
  children,
  variant = 'default',
  radius = 'lg',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-surface text-text-primary transition-all duration-150 overflow-hidden';

  const variants = {
    default: 'border border-border shadow-sm',
    outlined: 'border border-border',
    elevated: 'border border-border/50 shadow-md hover:shadow-lg',
    interactive: 'border border-border shadow-sm hover:shadow-md hover:border-accent cursor-pointer active:scale-[0.995]',
  };

  const radiuses = {
    md: 'rounded-md', // 6px
    lg: 'rounded-lg', // 8px
    xl: 'rounded-xl', // 10px
    '2xl': 'rounded-2xl', // 12px
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.default} ${radiuses[radius] || radiuses.lg} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 border-b border-border flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-5 border-t border-border bg-surface-secondary/50 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export default Card;
