import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { AlertCircle, Home, ShoppingBag } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-flex p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
        <AlertCircle className="w-16 h-16" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight">404 — Page Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The page or route you are looking for does not exist or may have been moved.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link to="/">
          <Button variant="primary" size="lg">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>

        <Link to="/products">
          <Button variant="secondary" size="lg">
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
