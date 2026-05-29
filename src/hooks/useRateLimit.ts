import { useRef, useCallback } from 'react';

interface UseRateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

const useRateLimit = (options: UseRateLimitOptions) => {
  const { maxRequests, windowMs } = options;
  const requestsRef = useRef<number[]>([]);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    requestsRef.current = requestsRef.current.filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (requestsRef.current.length >= maxRequests) {
      return false;
    }

    requestsRef.current.push(now);
    return true;
  }, [maxRequests, windowMs]);

  const getRemainingTime = useCallback((): number => {
    const now = Date.now();
    const oldestRequest = requestsRef.current[0];
    if (!oldestRequest) return 0;

    const earliestAllowed = oldestRequest + windowMs;
    const remaining = earliestAllowed - now;
    return Math.max(0, Math.ceil(remaining / 1000));
  }, [windowMs]);

  const getRequestCount = useCallback((): number => {
    const now = Date.now();
    requestsRef.current = requestsRef.current.filter(
      (timestamp) => now - timestamp < windowMs
    );
    return requestsRef.current.length;
  }, [windowMs]);

  return { checkRateLimit, getRemainingTime, getRequestCount };
};

export default useRateLimit;
