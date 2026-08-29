import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'romantic' | 'white' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  className,
  ...props
}) => {
  const variants = {
    glass: 'glass-panel shadow-glass-card border border-white/60',
    romantic: 'glass-panel-romantic shadow-glass border border-rose-200/50',
    white: 'bg-white/90 backdrop-blur-md shadow-sm border border-slate-100',
    subtle: 'bg-white/40 backdrop-blur-sm border border-white/40',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl p-4 sm:p-5 transition-all duration-200',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
