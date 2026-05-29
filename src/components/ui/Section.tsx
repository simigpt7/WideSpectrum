import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: 'default' | 'surface' | 'dark';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  as?: React.ElementType;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, background = 'default', padding = 'lg', as: Component = 'section', ...props }, ref) => {
    const backgrounds = {
      default: 'bg-[#030A0E]',
      surface: 'bg-[rgba(7,21,32,0.8)]',
      dark: 'bg-slate-950',
    };

    const paddings = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-20 md:py-28',
      xl: 'py-24 md:py-32',
    };

    return (
      <Component
        ref={ref}
        className={cn('relative overflow-hidden', backgrounds[background], paddings[padding], className)}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';
