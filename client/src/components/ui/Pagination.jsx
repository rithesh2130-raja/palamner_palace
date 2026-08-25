import React from 'react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between gap-2 py-4 ${className}`}>
      <p className="text-xs text-text-muted">
        Page <span className="font-bold text-text-primary">{currentPage}</span> of{' '}
        <span className="font-bold text-text-primary">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 px-3 text-xs font-medium border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 text-xs font-semibold rounded-md border transition-colors ${
                isActive
                  ? 'bg-accent border-accent text-gray-900 font-bold'
                  : 'border-border hover:bg-surface-secondary text-text-primary'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 px-3 text-xs font-medium border border-border rounded-md hover:bg-surface-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
