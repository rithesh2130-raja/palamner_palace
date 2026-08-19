import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] tracking-tight';

  const variants = {
    primary: 'bg-[#E50914] hover:bg-[#B20710] text-white shadow-md hover:shadow-red-600/30',
    secondary: 'bg-black hover:bg-neutral-800 text-white shadow-md',
    outline: 'bg-white border-2 border-neutral-900 text-neutral-900 hover:border-[#E50914] hover:text-[#E50914] hover:bg-red-50/50',
    ghost: 'text-neutral-800 hover:text-[#E50914] hover:bg-neutral-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
