import React from 'react';
import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'eggless' | 'bestseller' | 'discount' | 'custom' | 'gold' | 'default';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const variants = {
    default: 'bg-cream-200 text-chocolate-800 border border-cream-300',
    eggless: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    bestseller: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
    discount: 'bg-rose-100 text-rose-800 border border-rose-200 font-semibold',
    custom: 'bg-blush-100 text-chocolate-900 border border-blush-300',
    gold: 'bg-gold-100 text-gold-700 border border-gold-300 font-semibold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {variant === 'eggless' && (
        <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 inline-block" />
      )}
      {children}
    </span>
  );
};
