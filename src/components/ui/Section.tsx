import React from 'react';
import { cn } from '../../utils/cn';
import Container from './Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  background?: 'default' | 'dark' | 'gradient' | 'pattern';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      children,
      containerSize = 'lg',
      background = 'default',
      padding = 'lg',
      id,
      ...props
    },
    ref
  ) => {
    const backgrounds = {
      default: 'bg-dark-950',
      dark: 'bg-dark-900',
      gradient: 'bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950',
      pattern: 'bg-dark-950 noise-overlay',
    };

    const paddings = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-20 md:py-32',
      xl: 'py-24 md:py-40',
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn(backgrounds[background], paddings[padding], className)}
        {...props}
      >
        <Container size={containerSize}>{children}</Container>
      </section>
    );
  }
);

Section.displayName = 'Section';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      className,
      title,
      subtitle,
      align = 'center',
      titleClassName,
      subtitleClassName,
      ...props
    },
    ref
  ) => {
    const alignments = {
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    };

    return (
      <div
        ref={ref}
        className={cn('max-w-3xl mb-12 md:mb-16', alignments[align], className)}
        {...props}
      >
        <h2
          className={cn(
            'text-headline font-display font-bold text-white mb-4',
            titleClassName
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              'text-lg md:text-xl text-gray-400',
              subtitleClassName
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export { Section, SectionHeader };
