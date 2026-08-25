import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { AlertCircle, Home, ShoppingBag } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="bg-surface text-text-primary min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="inline-flex p-5 rounded-2xl bg-status-danger/10 border border-status-danger/30 text-status-danger">
          <AlertCircle className="w-16 h-16" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">404 — Page Not Found</h1>
          <p className="text-sm text-text-muted">
            The page or route you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>

          <Link to="/products">
            <Button variant="outline" icon={ShoppingBag}>
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
