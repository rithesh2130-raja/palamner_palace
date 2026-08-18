import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 animate-skeleton">
      <div className="w-full h-48 bg-slate-800 rounded-xl"></div>
      <div className="space-y-2">
        <div className="w-1/3 h-3 bg-slate-800 rounded"></div>
        <div className="w-3/4 h-4 bg-slate-800 rounded"></div>
        <div className="w-1/2 h-3 bg-slate-800 rounded"></div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="w-1/3 h-5 bg-slate-800 rounded"></div>
        <div className="w-1/4 h-8 bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 animate-skeleton">
      <div className="w-12 h-12 bg-slate-800 rounded-xl shrink-0"></div>
      <div className="space-y-2 flex-1">
        <div className="w-2/3 h-4 bg-slate-800 rounded"></div>
        <div className="w-1/3 h-3 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

export const ReelSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto h-[550px] bg-slate-900 border border-slate-800 rounded-3xl p-4 animate-skeleton flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
        <div className="w-1/2 h-4 bg-slate-800 rounded"></div>
      </div>
      <div className="w-full h-16 bg-slate-800/80 rounded-2xl"></div>
    </div>
  );
};
