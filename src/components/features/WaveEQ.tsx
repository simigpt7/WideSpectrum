import React, { useEffect, useRef, useCallback } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';

interface Bar {
  height: number;
  targetHeight: number;
  speed: number;
}

const WaveEQ: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<Bar[]>([]);
  const animationRef = useRef<number>();
  const prefersReducedMotion = useReducedMotion();

  const initBars = useCallback(() => {
    const barCount = 20;
    barsRef.current = Array.from({ length: barCount }, () => ({
      height: Math.random() * 100,
      targetHeight: Math.random() * 100,
      speed: 0.02 + Math.random() * 0.03,
    }));
  }, []);

  useEffect(() => {
    initBars();

    if (prefersReducedMotion) {
      return;
    }

    const animate = () => {
      barsRef.current.forEach((bar) => {
        if (Math.abs(bar.height - bar.targetHeight) < 1) {
          bar.targetHeight = Math.random() * 100;
        }
        bar.height += (bar.targetHeight - bar.height) * bar.speed;
      });

      if (containerRef.current) {
        const bars = containerRef.current.children;
        barsRef.current.forEach((bar, i) => {
          if (bars[i]) {
            (bars[i] as HTMLElement).style.height = `${bar.height}%`;
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initBars, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="flex items-end justify-center gap-1 h-20"
      aria-hidden="true"
    >
      {barsRef.current.map((bar, index) => (
        <div
          key={index}
          className="w-1 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-full transition-all duration-75"
          style={{ height: prefersReducedMotion ? '50%' : `${bar.height}%` }}
        />
      ))}
    </div>
  );
};

export default WaveEQ;
