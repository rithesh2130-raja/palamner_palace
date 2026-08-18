import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button.jsx';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Unable to load content right now. Please check your network connection or try again later.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl space-y-4 my-6">
      <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm text-rose-200/70 max-w-md leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry} className="pt-2">
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
