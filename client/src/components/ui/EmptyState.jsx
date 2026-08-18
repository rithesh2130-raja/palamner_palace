import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button.jsx';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Looks like there is nothing here yet. Explore our products and add them to your list.',
  actionLabel = 'Explore Products',
  actionTo = '/products'
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 my-6">
      <div className="p-4 bg-slate-800/80 rounded-2xl text-amber-400">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md leading-relaxed">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="pt-2">
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};
