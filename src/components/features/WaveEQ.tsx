import { memo } from 'react';
import { useReducedMotion } from '@/hooks';

interface WaveEQProps {
  bars?: number;
}

export const WaveEQ = memo(function WaveEQ({ bars = 8 }: WaveEQProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-end gap-0.5" style={{ height: 24 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: 3,
            background: 'linear-gradient(to top, #1F8A8A, #3ED6A0)',
            height: reducedMotion ? 12 : undefined,
            animation: reducedMotion
              ? 'none'
              : `waveBar ${0.5 + Math.random() * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
});
