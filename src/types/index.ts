// ── Particle Types ────────────────────────────────────────────────────────────
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'circle' | 'star' | 'line';
  glow?: boolean;
  angle?: number;
}

// ── Scroll Types ──────────────────────────────────────────────────────────────
export interface ScrollState {
  y: number;
  progress: number;
  direction: 'up' | 'down' | null;
}

// ── Form Types ───────────────────────────────────────────────────────────────
export interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

// ── Service Types ───────────────────────────────────────────────────────────
export interface Service {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  features: string[];
  featured?: boolean;
  num: string;
}

// ── Video Types ─────────────────────────────────────────────────────────────
export interface Video {
  id: string;
  title: string;
  artist: string;
}

// ── Testimonial Types ────────────────────────────────────────────────────────
export interface Testimonial {
  text: string;
  name: string;
  role: string;
}

// ── Nav Types ───────────────────────────────────────────────────────────────
export type NavItem = 'services' | 'about' | 'portfolio' | 'testimonials' | 'contact';
