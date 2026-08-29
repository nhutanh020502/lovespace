import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'rose' | 'pink' | 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'rose',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    rose: 'bg-rose-100 text-rose-700 border-rose-200/60',
    pink: 'bg-pink-100 text-pink-700 border-pink-200/60',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-100 text-amber-700 border-amber-200/60',
    blue: 'bg-blue-100 text-blue-700 border-blue-200/60',
    purple: 'bg-purple-100 text-purple-700 border-purple-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/60',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-semibold rounded-full border shadow-sm transition-all',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
