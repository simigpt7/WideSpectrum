/**
 * Design Tokens — single source of truth for all design decisions.
 *
 * These values are mirrored in:
 *   - CSS custom properties (src/index.css :root)
 *   - Tailwind config (tailwind.config.js)
 *   - JS constants (src/constants/*)
 *
 * Any future theme change should start here and propagate outward.
 */

// ── Color Tokens ─────────────────────────────────────────────────────────────
export const COLOR_TOKENS = {
  // Brand primary — teal family
  teal: {
    DEFAULT: '#1F8A8A',
    dark:    '#082F3A',
    light:   '#7EE7C8',
    50:      '#F0FAFA',
    100:     '#D5F2F2',
    200:     '#AAE6E6',
    300:     '#7EE7C8',
    400:     '#3ED6A0',
    500:     '#1F8A8A',
    600:     '#082F3A',
    700:     '#062030',
    800:     '#041520',
    900:     '#030A0E',
  },

  // Brand accent
  aqua:     '#3ED6A0',
  chrome:   '#C0C0C0',

  // Accent warm — gold family
  gold: {
    DEFAULT: '#D4AF37',
    soft:    '#F5E6A3',
  },

  // Semantic surfaces
  surface: {
    bg:    '#030A0E',  // page background
    card:  '#0A2030',  // card / modal surface
    dark:  '#071520',  // slightly elevated surface
  },
} as const;

// ── Typography Tokens ─────────────────────────────────────────────────────────
export const TYPE_TOKENS = {
  fontFamily: {
    display: 'Montserrat, sans-serif',     // headings, hero
    body:    'Space Grotesk, system-ui, sans-serif', // body, UI
  },
  fontWeight: {
    light:      300,
    regular:    400,
    medium:     500,
    semibold:   600,
    bold:       700,
    extrabold:  800,
    black:      900,
  },
  fontSize: {
    xs:   '0.75rem',   // 12px
    sm:   '0.875rem',  // 14px
    base: '1rem',      // 16px
    lg:   '1.125rem',  // 18px
    xl:   '1.25rem',   // 20px
    '2xl':'1.5rem',    // 24px
    '3xl':'1.875rem',  // 30px
    '4xl':'2.25rem',   // 36px
    hero: 'clamp(2.5rem, 10vw, 6rem)',
  },
} as const;

// ── Spacing Tokens ─────────────────────────────────────────────────────────────
export const SPACE_TOKENS = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  section: '6rem', // consistent section padding
} as const;

// ── Border Radius Tokens ──────────────────────────────────────────────────────
export const RADIUS_TOKENS = {
  sm:   '0.375rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  full: '9999px',
} as const;

// ── Motion / Easing Tokens ────────────────────────────────────────────────────
/**
 * Transition philosophy:
 *   - Micro-interactions (hover, focus): 150–200ms, ease-out
 *   - UI state (show/hide, collapse): 300–400ms, luxury
 *   - Page-level entrances: 600–1000ms, luxury
 *
 * The "luxury" easing (cubic-bezier(0.16, 1, 0.3, 1)) is an expo-out curve
 * that gives a fast initial movement and graceful deceleration — consistent
 * with high-end product aesthetics.
 */
export const MOTION_TOKENS = {
  easing: {
    standard: 'ease-out',
    luxury:   'cubic-bezier(0.16, 1, 0.3, 1)',
    spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  duration: {
    micro:    '150ms',
    fast:     '200ms',
    base:     '300ms',
    moderate: '500ms',
    slow:     '800ms',
    xslow:    '1000ms',
  },
} as const;

// ── Grid / Layout Tokens ──────────────────────────────────────────────────────
export const GRID_TOKENS = {
  maxWidth:   '80rem',      // 1280px — max-w-7xl
  gutterSm:   '1rem',       // px-4 on mobile
  gutterMd:   '1.5rem',     // px-6 on tablet
  gutterLg:   '1.5rem',     // px-6 on desktop (7xl container handles width)
  columns:    12,
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

// ── Shadow / Glow Tokens ──────────────────────────────────────────────────────
export const SHADOW_TOKENS = {
  glow:     '0 0 20px rgba(62, 214, 160, 0.3)',
  glowLg:   '0 0 40px rgba(62, 214, 160, 0.4)',
  glowGold: '0 0 20px rgba(212, 175, 55, 0.3)',
  card:     '0 8px 32px rgba(0, 0, 0, 0.4)',
} as const;
