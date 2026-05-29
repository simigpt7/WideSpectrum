import { useState, useEffect, useCallback, type RefCallback } from 'react';

/**
 * Hook to detect if an element is in the viewport
 * Uses Intersection Observer API for better performance
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1
): [RefCallback<T>, boolean] {
  const [element, setElement] = useState<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  const refCallback = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold, rootMargin: '-50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold]);

  return [refCallback, isInView];
}
