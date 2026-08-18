import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const alignmentClasses = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={toggle} className="cursor-pointer">
        {trigger(isOpen)}
      </div>

      {isOpen && (
        <div
          className={`absolute ${alignmentClasses} mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn ${className}`}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  );
};
