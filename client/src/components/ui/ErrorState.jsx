import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

export const ErrorState = ({
  icon: Icon = AlertTriangle,
  title = 'Something went wrong',
  description = 'We encountered an error while processing your request. Please try again or return to the homepage.',
  onRetry,
  onBack,
  retryLabel = 'Try Again',
  backLabel = 'Go Back',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-red-50/50 dark:bg-red-950/20 border border-status-danger/30 rounded-xl my-4 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-status-danger/10 text-status-danger flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-md mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            {backLabel}
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
