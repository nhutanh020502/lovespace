import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  borderVariant?: 'rose' | 'pink' | 'white' | 'none';
  className?: string;
  badge?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  isOnline,
  borderVariant = 'rose',
  className,
  badge
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const borderClasses = {
    rose: 'border-2 border-rose-300 shadow-md shadow-rose-200/50',
    pink: 'border-2 border-pink-300 shadow-md shadow-pink-200/50',
    white: 'border-2 border-white shadow-md',
    none: '',
  };

  return (
    <div className={twMerge(clsx('relative inline-block shrink-0', className))}>
      <img
        src={src}
        alt={alt}
        className={clsx(
          'rounded-full object-cover bg-rose-50',
          sizeClasses[size],
          borderClasses[borderVariant]
        )}
      />

      {isOnline !== undefined && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'sm' ? 'w-2 h-2' : 'w-3 h-3',
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          )}
        />
      )}

      {badge && (
        <div className="absolute -bottom-1 -right-1">
          {badge}
        </div>
      )}
    </div>
  );
};
