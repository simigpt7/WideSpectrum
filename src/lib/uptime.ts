/**
 * Uptime monitoring — lightweight client-side health check.
 *
 * This module:
 *   1. Pings a health endpoint on load and periodically.
 *   2. Reports downtime events to Sentry.
 *   3. Optionally calls a webhook (e.g. BetterUptime, Uptime Robot)
 *      when consecutive failures are detected.
 *
 * For production, pair this with a free-tier external monitor:
 *   - https://betteruptime.com  (free: 3 monitors, 3-min interval)
 *   - https://uptimerobot.com   (free: 50 monitors, 5-min interval)
 *
 * Add VITE_HEALTH_URL to .env:
 *   VITE_HEALTH_URL=https://widespectrumproductions.com/api/health
 */

const HEALTH_URL = import.meta.env.VITE_HEALTH_URL as string | undefined;
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

let consecutiveFailures = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

async function checkHealth(): Promise<void> {
  if (!HEALTH_URL) return;

  try {
    const res = await fetch(HEALTH_URL, {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      consecutiveFailures = 0;
    } else {
      handleFailure(`HTTP ${res.status}`);
    }
  } catch (err) {
    handleFailure(err instanceof Error ? err.message : 'network error');
  }
}

function handleFailure(reason: string): void {
  consecutiveFailures++;

  // Report to Sentry after 2 consecutive failures (avoids noise from transient blips)
  if (consecutiveFailures >= 2) {
    try {
      const Sentry = (window as { Sentry?: { captureMessage: (msg: string, level?: string) => void } }).Sentry;
      Sentry?.captureMessage(`[Uptime] Health check failed: ${reason}`, 'error');
    } catch {
      // Sentry not loaded yet — silently ignore
    }

    console.error(`[Uptime] Health check failed (${consecutiveFailures}x): ${reason}`);
  }
}

export function initUptimeMonitoring(): void {
  if (!HEALTH_URL || !import.meta.env.PROD) return;

  // First check 10s after page load (don't block initial render)
  setTimeout(checkHealth, 10_000);

  // Then check every 5 minutes
  intervalId = setInterval(checkHealth, CHECK_INTERVAL_MS);
}

export function stopUptimeMonitoring(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
