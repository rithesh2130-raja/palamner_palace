import React from 'react';

export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`bg-surface-secondary/80 rounded animate-skeleton ${className}`}
    {...props}
  />
);

export const ProductSkeleton = () => (
  <div className="bg-surface border border-border rounded-lg p-3.5 flex flex-col gap-3">
    <Skeleton className="w-full aspect-square rounded-md" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <div className="flex justify-between items-center mt-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  </div>
);

export const ReelSkeleton = () => (
  <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden p-4 flex flex-col justify-end gap-3">
    <Skeleton className="h-4 w-1/3 bg-gray-700" />
    <Skeleton className="h-6 w-3/4 bg-gray-700" />
    <Skeleton className="h-12 w-full rounded-lg bg-gray-800" />
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="w-full border border-border rounded-lg overflow-hidden bg-surface">
    <div className="bg-surface-secondary p-4 flex gap-4 border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="p-4 flex gap-4 border-b border-border/50 items-center">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="bg-surface border border-border rounded-lg p-5 flex flex-col gap-3">
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-surface border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-5">
    <Skeleton className="w-20 h-20 rounded-full" />
    <div className="flex-1 flex flex-col gap-2.5 w-full">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);
