import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
  direction: 'up' | 'down' | null;
  progress: number;
}

const useScrollPosition = (): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    direction: null,
    progress: 0,
  });

  useEffect(() => {
    let previousY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const currentX = window.scrollX;
      const direction = currentY > previousY ? 'down' : currentY < previousY ? 'up' : null;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (currentY / maxScroll) * 100 : 0;

      setScrollPosition({
        x: currentX,
        y: currentY,
        direction,
        progress,
      });

      previousY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
