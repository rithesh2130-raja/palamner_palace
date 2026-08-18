import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        )}
        <input
          type={type}
          className={`w-full bg-slate-900 border ${
            error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-amber-400 focus:ring-amber-400'
          } rounded-xl ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
