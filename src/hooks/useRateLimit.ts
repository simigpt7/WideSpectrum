import { useRef, useCallback } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Hook to implement rate limiting for form submissions
 * Prevents spam and abuse
 */
export function useRateLimit({ maxRequests, windowMs }: RateLimitConfig) {
  const submissionsRef = useRef<number[]>([]);

  const check = useCallback((): boolean => {
    const now = Date.now();
    // Clean up old submissions outside the window
    submissionsRef.current = submissionsRef.current.filter((t) => now - t < windowMs);
    return submissionsRef.current.length < maxRequests;
  }, [maxRequests, windowMs]);

  const record = useCallback((): void => {
    submissionsRef.current.push(Date.now());
  }, []);

  const reset = useCallback((): void => {
    submissionsRef.current = [];
  }, []);

  return { check, record, reset };
}
