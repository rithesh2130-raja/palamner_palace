import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton.jsx';

export const Drawer = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right', // 'right' or 'bottom'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-drawer overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-250"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none flex justify-end">
        {/*
          Desktop: Right slide-over panel
          Mobile: Bottom sheet on small screens if position is bottom or on mobile breakpoint
        */}
        <div
          className={`pointer-events-auto bg-surface text-text-primary border-border shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
            position === 'bottom'
              ? 'w-full max-h-[85vh] rounded-t-2xl border-t bottom-0 self-end animate-in slide-in-from-bottom duration-300'
              : 'w-full max-w-md h-full border-l right-0 md:rounded-l-xl animate-in slide-in-from-right duration-300'
          }`}
        >
          {/* Top Drag Handle for Mobile Bottom Sheet */}
          {position === 'bottom' && (
            <div className="w-full flex items-center justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-border rounded-full" />
            </div>
          )}

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0">
            <div>
              {title && <h2 className="text-lg font-bold text-text-primary">{title}</h2>}
              {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
            </div>
            <IconButton
              icon={X}
              aria-label="Close drawer"
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </div>

          {/* Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-sm text-text-secondary">
            {children}
          </div>

          {/* Footer Actions */}
          {footer && (
            <div className="p-4 sm:p-5 border-t border-border bg-surface-secondary/40 flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
