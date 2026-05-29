import { memo } from 'react';
import { useReducedMotion } from '@/hooks';

interface AnimatedLettersProps {
  text: string;
  baseDelay?: number;
  className?: string;
}

export const AnimatedLetters = memo(function AnimatedLetters({
  text,
  baseDelay = 0,
  className = '',
}: AnimatedLettersProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={`inline-block overflow-hidden ${className}`}
      style={{ perspective: 800 }}
    >
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: 'letterReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: `${baseDelay + i * 0.035}s`,
            transformOrigin: 'center bottom',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
});
