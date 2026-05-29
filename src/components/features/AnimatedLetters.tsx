import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import useReducedMotion from '../../hooks/useReducedMotion';

interface AnimatedLettersProps {
  text: string;
  className?: string;
}

const AnimatedLetters: React.FC<AnimatedLettersProps> = ({ text, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const letters = text.split('');

  if (prefersReducedMotion) {
    return (
      <h1 className={cn('text-hero font-display font-bold text-white', className)}>
        {text}
      </h1>
    );
  }

  return (
    <h1 className={cn('text-hero font-display font-bold', className)}>
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          className={cn(
            'inline-block transition-all duration-500',
            letter === ' ' ? 'w-4' : '',
            isVisible
              ? 'opacity-100 translate-y-0 text-white'
              : 'opacity-0 translate-y-8'
          )}
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedLetters;
