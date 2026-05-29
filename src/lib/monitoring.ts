/**
 * Error monitoring + Web Vitals reporting
 *
 * Uses Sentry for error logging and the web-vitals API for Core Web Vitals.
 * Both are configured via environment variables — all keys are server-side
 * or public-safe (Sentry DSN is public by design).
 *
 * SETUP:
 *   1. npm install @sentry/react web-vitals
 *   2. Add VITE_SENTRY_DSN to .env
 *   3. Import and call initMonitoring() in src/main.tsx
 */

// ─── Types ────────────────────────────────────────────────────────────────────
interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}

// ─── Sentry Error Monitoring ──────────────────────────────────────────────────
export async function initErrorMonitoring(): Promise<void> {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.info('[monitoring] VITE_SENTRY_DSN not set — error monitoring disabled');
    }
    return;
  }

  try {
    // Dynamic import keeps Sentry out of the critical bundle
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      // Only send errors in production; log to console in dev
      enabled: import.meta.env.PROD,
      // Sample 10% of sessions for performance tracing
      tracesSampleRate: 0.1,
      // Ignore browser extension noise
      ignoreErrors: [
        'ResizeObserver loop',
        'Non-Error promise rejection',
        /chrome-extension/,
        /moz-extension/,
      ],
      beforeSend(event) {
        // Strip PII from breadcrumbs
        if (event.breadcrumbs?.values) {
          event.breadcrumbs.values = event.breadcrumbs.values.map((b) => ({
            ...b,
            data: undefined,
          }));
        }
        return event;
      },
    });
  } catch {
    console.warn('[monitoring] Failed to load Sentry');
  }
}

// ─── Core Web Vitals Reporting ────────────────────────────────────────────────
export async function initWebVitals(): Promise<void> {
  if (!import.meta.env.PROD) return;

  try {
    const { onCLS, onFID, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

    const send = (metric: Metric) => {
      // 1. Log to console (always)
      const icon = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`[vitals] ${icon} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);

      // 2. Send to analytics endpoint (when GA is set up)
      const gaId = import.meta.env.VITE_GA_ID;
      if (gaId && typeof window.gtag === 'function') {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // 3. Send to Sentry as measurement
      if (import.meta.env.VITE_SENTRY_DSN) {
        import('@sentry/react').then((Sentry) => {
          Sentry.setMeasurement(metric.name, metric.value, 'millisecond');
        }).catch(() => undefined);
      }
    };

    onCLS(send);
    onFID(send);
    onINP(send);
    onFCP(send);
    onLCP(send);
    onTTFB(send);
  } catch {
    console.warn('[monitoring] web-vitals not available');
  }
}

// ─── Global Error Boundary Fallback ──────────────────────────────────────────
export function logError(error: Error, context?: Record<string, unknown>): void {
  console.error('[error]', error, context);

  if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
    import('@sentry/react').then((Sentry) => {
      Sentry.captureException(error, { extra: context });
    }).catch(() => undefined);
  }
}

// ─── Init (call once in main.tsx) ─────────────────────────────────────────────
export async function initMonitoring(): Promise<void> {
  await Promise.allSettled([
    initErrorMonitoring(),
    initWebVitals(),
  ]);
}

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
