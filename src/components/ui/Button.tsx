import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'romantic' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 hover:shadow-lg hover:shadow-rose-300',
    romantic: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white shadow-md shadow-rose-200 hover:shadow-glow',
    secondary: 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-sm backdrop-blur-sm',
    outline: 'border-2 border-rose-300 text-rose-600 hover:bg-rose-50/70',
    ghost: 'text-slate-600 hover:bg-rose-50/60 hover:text-rose-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
    icon: 'p-2.5 text-sm',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
