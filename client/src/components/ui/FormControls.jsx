import React from 'react';

export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  isDisabled = false,
  rows = 4,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        disabled={isDisabled}
        className={`w-full p-3 text-sm bg-surface border text-text-primary rounded-md transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:bg-surface-secondary ${
          error ? 'border-status-danger focus:ring-status-danger' : 'border-border hover:border-text-muted'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-status-danger font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-muted mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  isDisabled = false,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        disabled={isDisabled}
        className={`w-full h-11 px-3.5 text-sm bg-surface border text-text-primary rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:bg-surface-secondary cursor-pointer ${
          error ? 'border-status-danger' : 'border-border hover:border-text-muted'
        } ${className}`}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error ? (
        <p className="text-xs text-status-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export const Checkbox = React.forwardRef(({
  label,
  id,
  isDisabled = false,
  className = '',
  ...props
}, ref) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={checkboxId} className={`inline-flex items-center gap-2.5 cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        disabled={isDisabled}
        className={`w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-sm font-medium text-text-primary select-none">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export const Radio = React.forwardRef(({
  label,
  id,
  name,
  isDisabled = false,
  className = '',
  ...props
}, ref) => {
  const radioId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={radioId} className={`inline-flex items-center gap-2.5 cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        ref={ref}
        id={radioId}
        name={name}
        type="radio"
        disabled={isDisabled}
        className={`w-4 h-4 border-border text-accent focus:ring-accent accent-accent cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-sm font-medium text-text-primary select-none">{label}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';

export const Switch = React.forwardRef(({
  label,
  checked = false,
  onChange,
  isDisabled = false,
  id,
  className = '',
  ...props
}, ref) => {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={switchId} className={`inline-flex items-center gap-3 cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className="relative">
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          className="sr-only"
          {...props}
        />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-surface-secondary border border-border'}`}></div>
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5 bg-gray-900' : 'translate-x-0'}`}></div>
      </div>
      {label && <span className="text-sm font-medium text-text-primary select-none">{label}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';
