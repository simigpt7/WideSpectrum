import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'teal' | 'gold' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-teal-900/40 text-teal-300 border-teal-800/40',
    teal: 'bg-gradient-to-r from-teal-600 to-teal-400 text-white',
    gold: 'bg-gradient-to-r from-amber-600 to-amber-400 text-white',
    outline: 'bg-transparent border-teal-500/50 text-teal-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold uppercase tracking-wider transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
