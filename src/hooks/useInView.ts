import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

const useInView = <T extends HTMLElement = HTMLElement>(
  options: UseInViewOptions = {}
): { ref: RefObject<T>; isInView: boolean } => {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;

        if (inView || !triggerOnce) {
          setIsInView(inView);
        }

        if (inView && triggerOnce) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
};

export default useInView;
