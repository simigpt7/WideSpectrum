import { useState, useEffect, useRef } from 'react';
import type { ScrollState } from '@/types';

/**
 * Throttled scroll position hook.
 * Reads scroll state on rAF cadence (~60fps) instead of every scroll event.
 * This prevents excessive React re-renders and keeps the main thread free.
 */
export function useScrollPosition(): ScrollState {
  const [scroll, setScroll] = useState<ScrollState>({ y: 0, progress: 0, direction: null });
  const lastY = useRef(0);
  const rafPending = useRef(false);

  useEffect(() => {
    const update = () => {
      rafPending.current = false;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? y / maxScroll : 0;
      const direction = y > lastY.current ? 'down' : y < lastY.current ? 'up' : null;
      lastY.current = y;
      setScroll(prev => {
        // Bail out if nothing meaningful changed (avoids unnecessary re-renders)
        if (Math.abs(prev.y - y) < 1) return prev;
        return { y, progress, direction };
      });
    };

    const handleScroll = () => {
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
}
