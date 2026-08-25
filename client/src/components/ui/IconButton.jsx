import React from 'react';

export const IconButton = React.forwardRef(({
  icon: Icon,
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'ghost',
  isDisabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  if (!ariaLabel) {
    console.warn('IconButton requires an aria-label for accessibility');
  }

  const baseStyles = 'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    ghost: 'text-text-primary hover:bg-surface-secondary',
    outline: 'border border-border text-text-primary hover:bg-surface-secondary',
    solid: 'bg-surface-secondary text-text-primary hover:bg-border',
    accent: 'bg-accent text-gray-900 hover:bg-accent-hover font-bold',
    dark: 'bg-primary text-white hover:bg-primary-secondary',
  };

  const sizes = {
    sm: 'w-8 h-8 min-w-[32px] min-h-[32px]',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px]',
    lg: 'w-11 h-11 min-w-[44px] min-h-[44px]', // Mobile 44px min touch target
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel || 'Button'}
      disabled={isDisabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.ghost} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
    </button>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
