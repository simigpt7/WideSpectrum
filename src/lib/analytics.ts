import { onCLS, onFID, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

// Send metrics to analytics or logging service
const sendToAnalytics = (metric: Metric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // Send to analytics endpoint or service
  // In production, you would send this to your analytics service
  if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      page: window.location.pathname,
      timestamp: Date.now(),
    });

    // Use navigator.sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(import.meta.env.VITE_ANALYTICS_ENDPOINT, body);
    } else {
      fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
        body,
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
        // Silently fail
      });
    }
  }

  // Also send to Sentry if configured
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    import('@sentry/react').then((Sentry) => {
      Sentry.captureMessage(`Performance: ${metric.name}`, {
        level: metric.rating === 'poor' ? 'warning' : 'info',
        extra: {
          metricName: metric.name,
          metricValue: metric.value,
          metricRating: metric.rating,
          page: window.location.pathname,
        },
      });
    });
  }
};

// Initialize web vitals tracking
export const initWebVitals = () => {
  // Core Web Vitals
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);

  // Additional metrics
  onFCP(sendToAnalytics); // First Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
};

// Performance observer for custom metrics
export const observePerformance = () => {
  if (typeof PerformanceObserver === 'undefined') return;

  // Long tasks
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('[Performance] Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Browser doesn't support longtask
  }

  // Layout shifts
  try {
    const layoutShiftObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if ('value' in entry) {
          console.log('[Performance] Layout shift:', entry);
        }
      });
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Browser doesn't support layout-shift
  }
};

// Initialize on load
initWebVitals();
observePerformance();
