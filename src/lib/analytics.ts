/**
 * Analytics module — Google Analytics 4 + event tracking
 *
 * SETUP:
 *   1. Add VITE_GA_ID=G-XXXXXXXXXX to .env
 *   2. Call initAnalytics() in src/main.tsx
 *   3. Use trackEvent() throughout the app for conversion tracking
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// ─── Init GA4 ─────────────────────────────────────────────────────────────────
export function initAnalytics(): void {
  const gaId = import.meta.env.VITE_GA_ID;
  if (!gaId || !import.meta.env.PROD) return;

  // Inject GA script dynamically — avoids blocking main thread
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    // Anonymize IP for GDPR compliance
    anonymize_ip: true,
    // Reduce data sent to GA
    send_page_view: true,
  });
}

// ─── Event Tracking ───────────────────────────────────────────────────────────
type EventCategory =
  | 'engagement'
  | 'conversion'
  | 'navigation'
  | 'contact'
  | 'portfolio';

interface TrackEventParams {
  action: string;
  category: EventCategory;
  label?: string;
  value?: number;
}

export function trackEvent({ action, category, label, value }: TrackEventParams): void {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}

// ─── Conversion Events ────────────────────────────────────────────────────────
/** Call when user submits the contact form */
export function trackContactFormSubmit(service: string): void {
  trackEvent({ action: 'contact_form_submit', category: 'conversion', label: service });
}

/** Call when user clicks a CTA button */
export function trackCTAClick(ctaName: string): void {
  trackEvent({ action: 'cta_click', category: 'conversion', label: ctaName });
}

/** Call when user plays a portfolio video */
export function trackVideoPlay(videoTitle: string): void {
  trackEvent({ action: 'video_play', category: 'portfolio', label: videoTitle });
}

/** Call when user navigates to a section */
export function trackSectionView(sectionId: string): void {
  trackEvent({ action: 'section_view', category: 'engagement', label: sectionId });
}
