import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

const initializeSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        traceFetch: true,
        traceXHR: true,
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100% of transactions
    // In production, you may want to reduce this value
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

    // Set environment
    environment: import.meta.env.MODE,

    // Only enable in production or when explicitly configured
    enabled: import.meta.env.PROD || import.meta.env.VITE_SENTRY_ENABLED === 'true',

    // Capture user sessions for better debugging
    // This is optional but helps with context
    sendDefaultPii: false,

    // Before sending, filter out sensitive data
    beforeSend(event) {
      // Filter out any events that might contain sensitive information
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
  });
};

// Helper functions for manual error capture
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: { id: string; email?: string; name?: string }) => {
  Sentry.setUser(user);
};

export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Performance monitoring helpers
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({ name, op });
};

initializeSentry();

export default Sentry;
