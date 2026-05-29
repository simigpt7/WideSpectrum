import { useEffect, useRef } from 'react';

/**
 * Directly writes scroll progress to a DOM element via CSS custom property.
 * Bypasses React state entirely — zero re-renders, max performance.
 * Use for the progress bar — it should never cause App to re-render.
 *
 * Usage:
 *   const barRef = useScrollProgress();
 *   <div ref={barRef} style={{ width: 'var(--sp, 0%)', height: '2px' }} />
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const rafPending = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      rafPending.current = false;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (y / maxScroll) * 100 : 0;
      el.style.width = `${pct}%`;
    };

    const onScroll = () => {
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return ref;
}
