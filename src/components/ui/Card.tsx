import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: 'glass' | 'romantic' | 'luxury' | 'hologram' | 'white' | 'polaroid' | 'subtle';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  interactive = false,
  className,
  whileHover,
  whileTap,
  transition = { type: 'spring', stiffness: 400, damping: 30 },
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

  const combinedClass = twMerge(
    clsx(
      'rounded-3xl p-4 sm:p-5 transition-colors duration-200',
      variants[variant],
      interactive && 'cursor-pointer select-none',
      className
    )
  );

  if (interactive) {
    return (
      <motion.div
        whileHover={whileHover !== undefined ? whileHover : { y: -3 }}
        whileTap={whileTap !== undefined ? whileTap : { scale: 0.985 }}
        transition={transition}
        className={combinedClass}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClass} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
};
