import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'romantic' | 'luxury' | 'hologram' | 'white' | 'polaroid' | 'subtle';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  interactive = false,
  className,
  ...props
}) => {
  const variants = {
    glass: 'glass-panel shadow-glass-card hover:shadow-glass',
    romantic: 'glass-panel-romantic shadow-glass hover:shadow-luxury',
    luxury: 'glass-panel-luxury shadow-luxury',
    hologram: 'glass-panel-luxury hologram-border shadow-luxury',
    white: 'bg-white/95 backdrop-blur-md shadow-md border border-slate-100',
    polaroid: 'polaroid-card border border-slate-100',
    subtle: 'bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl p-4 sm:p-5 transition-all duration-300',
          variants[variant],
          interactive && 'hover:-translate-y-1 active:scale-[0.99] cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
