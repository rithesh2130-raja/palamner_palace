import React, { useState, useRef, useEffect } from 'react';

export const Divider = ({ orientation = 'horizontal', className = '' }) => {
  if (orientation === 'vertical') {
    return <div className={`w-[1px] bg-border self-stretch ${className}`} />;
  }
  return <hr className={`w-full border-t border-border my-2 ${className}`} />;
};

export const Tooltip = ({ children, content, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={`absolute ${positionStyles[position] || positionStyles.top} z-dropdown px-2.5 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export const Dropdown = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute ${alignmentClass} mt-2 w-56 rounded-md shadow-lg bg-surface border border-border ring-1 ring-black ring-opacity-5 z-dropdown focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 ${className}`}
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, className = '', danger = false, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
      danger
        ? 'text-status-danger hover:bg-red-50 dark:hover:bg-red-950/30'
        : 'text-text-primary hover:bg-surface-secondary'
    } ${className}`}
  >
    {Icon && <Icon className="w-4 h-4 shrink-0" />}
    <span>{children}</span>
  </button>
);

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-border gap-6 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-3 px-1 text-sm font-semibold whitespace-nowrap transition-colors relative ${
              isActive
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-surface-secondary text-text-secondary">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
