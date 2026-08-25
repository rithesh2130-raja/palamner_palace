import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  isDisabled = false,
  fullWidth = true,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const baseInputStyles = 'h-11 px-3.5 text-sm bg-surface border text-text-primary rounded-md transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:bg-surface-secondary disabled:cursor-not-allowed';

  const borderStyles = error
    ? 'border-status-danger focus:ring-status-danger focus:border-status-danger'
    : 'border-border hover:border-text-muted';

  const iconPadding = Icon
    ? iconPosition === 'left'
      ? 'pl-10'
      : 'pr-10'
    : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} flex flex-col gap-1.5`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3.5 pointer-events-none text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={isDisabled}
          className={`${baseInputStyles} ${borderStyles} ${iconPadding} ${fullWidth ? 'w-full' : ''} ${className}`}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3.5 pointer-events-none text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-status-danger font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-muted mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
