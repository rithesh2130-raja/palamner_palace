import React from 'react';

export const Section = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  return (
    <section className={`my-8 sm:my-10 ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-end justify-between mb-4 sm:mb-6 pb-2 border-b border-border">
          <div>
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-text-muted mt-1">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;
