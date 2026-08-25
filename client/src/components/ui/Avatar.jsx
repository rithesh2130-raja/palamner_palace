import React, { useState } from 'react';

export const Avatar = ({
  src,
  alt = 'User avatar',
  name = '',
  size = 'md',
  isOnline = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const dotSizes = {
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-4 h-4 bottom-1 right-1',
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <div className={`${sizes[size] || sizes.md} rounded-full overflow-hidden bg-primary-secondary text-accent font-bold flex items-center justify-center border border-border select-none`}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name || alt)}</span>
        )}
      </div>
      {isOnline && (
        <span className={`absolute ${dotSizes[size] || dotSizes.md} rounded-full bg-status-success ring-2 ring-surface`} />
      )}
    </div>
  );
};

export default Avatar;
