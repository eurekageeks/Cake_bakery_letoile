import React, { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'blush';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-chocolate-800 text-cream-50 hover:bg-chocolate-900 focus-visible:ring-chocolate-700 shadow-sm hover:shadow',
      secondary:
        'bg-cream-200 text-chocolate-800 hover:bg-cream-300 focus-visible:ring-cream-400',
      gold:
        'bg-gold-500 text-chocolate-950 font-semibold hover:bg-gold-600 focus-visible:ring-gold-500 shadow-gold',
      outline:
        'border border-chocolate-300 bg-transparent text-chocolate-800 hover:bg-cream-200/50 hover:border-chocolate-600 focus-visible:ring-chocolate-500',
      ghost:
        'text-chocolate-800 hover:bg-cream-200/60 focus-visible:ring-chocolate-400',
      blush:
        'bg-blush-200 text-chocolate-900 hover:bg-blush-300 focus-visible:ring-blush-400',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
