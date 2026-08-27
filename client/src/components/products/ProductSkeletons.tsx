import React from 'react';
import { Skeleton } from '../ui/Skeletons.jsx';

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between gap-3 animate-pulse">
    <Skeleton className="w-full aspect-square rounded-lg bg-surface-secondary" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/4 bg-surface-secondary" />
      <Skeleton className="h-4 w-3/4 bg-surface-secondary" />
      <Skeleton className="h-3 w-1/2 bg-surface-secondary" />
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton className="h-6 w-1/3 bg-surface-secondary" />
      <Skeleton className="h-9 w-full rounded-lg bg-surface-secondary" />
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <ProductCardSkeleton key={idx} />
    ))}
  </div>
);

export const ProductDetailsSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
    {/* Left Gallery Skeleton */}
    <div className="space-y-4">
      <Skeleton className="w-full aspect-square rounded-2xl bg-surface-secondary" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="w-20 h-20 rounded-lg bg-surface-secondary" />
        ))}
      </div>
    </div>

    {/* Right Info Skeleton */}
    <div className="space-y-6">
      <Skeleton className="h-4 w-1/4 bg-surface-secondary" />
      <Skeleton className="h-8 w-3/4 bg-surface-secondary" />
      <Skeleton className="h-4 w-1/3 bg-surface-secondary" />
      <Skeleton className="h-10 w-1/2 bg-surface-secondary" />
      <Skeleton className="h-20 w-full rounded-xl bg-surface-secondary" />
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-xl bg-surface-secondary" />
        <Skeleton className="h-12 flex-1 rounded-xl bg-surface-secondary" />
      </div>
    </div>
  </div>
);

export default ProductGridSkeleton;
