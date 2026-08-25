import React from 'react';

export const Badge = ({
  children,
  variant = 'info',
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-bold tracking-wide rounded-pill select-none uppercase';

  const variants = {
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
    danger: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800',
    deal: 'bg-accent text-gray-950 font-black',
    new: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800',
    featured: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800',
    verified: 'bg-blue-600 text-white font-semibold',
    prime: 'bg-primary-secondary text-accent font-black border border-accent/30',
    'out-of-stock': 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'low-stock': 'bg-amber-500 text-white font-black',
    creator: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black',
    sponsored: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.info} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
