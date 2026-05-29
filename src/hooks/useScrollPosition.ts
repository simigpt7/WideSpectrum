import { useState, useEffect, useRef } from 'react';
import type { ScrollState } from '@/types';

/**
 * Hook to track scroll position and direction
 * Returns current scroll position, progress, and direction
 */
export function useScrollPosition(): ScrollState {
  const [scroll, setScroll] = useState<ScrollState>({ y: 0, progress: 0, direction: null });
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? y / maxScroll : 0;
      const direction = y > lastY.current ? 'down' : y < lastY.current ? 'up' : null;
      lastY.current = y;
      setScroll({ y, progress, direction });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
}
