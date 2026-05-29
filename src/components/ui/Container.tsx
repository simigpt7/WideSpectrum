import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  as?: React.ElementType;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = 'xl', as: Component = 'div', children, ...props }, ref) => {
    const maxWidths = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    };

    return (
      <Component
        ref={ref}
        className={cn('mx-auto px-4 sm:px-6', maxWidths[maxWidth], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';
