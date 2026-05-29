import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect if user prefers reduced motion
 * Useful for accessibility - disables animations for users who prefer it
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
