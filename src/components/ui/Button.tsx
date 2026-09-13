import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'romantic' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  whileTap = { scale: 0.97 },
  whileHover = { scale: 1.015 },
  transition = { type: 'spring', stiffness: 400, damping: 30 },
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const variants = {
    primary:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200/80 hover:shadow-glow',
    romantic:
      'shimmer-button bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white shadow-glow hover:shadow-glow-lg',
    luxury:
      'shimmer-button bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white shadow-luxury hover:shadow-glow-lg border border-white/20',
    secondary:
      'bg-white/85 hover:bg-white text-slate-700 hover:text-rose-600 border border-slate-200/70 shadow-sm hover:shadow-md backdrop-blur-md',
    outline:
      'border-2 border-rose-300/80 text-rose-600 hover:bg-rose-50/80 hover:border-rose-400 shadow-sm',
    ghost:
      'text-slate-600 hover:bg-rose-50/80 hover:text-rose-600',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200/80',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    icon: 'p-2.5 text-sm',
  };

  return (
    <motion.button
      whileTap={whileTap}
      whileHover={whileHover}
      transition={transition}
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
    </motion.button>
  );
};
