import React from 'react';
import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverEffect = false, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-cream-50/80 border border-cream-200/80 rounded-3xl shadow-soft overflow-hidden transition-all duration-300',
          hoverEffect && 'hover:shadow-card hover:-translate-y-1 hover:border-chocolate-200',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
