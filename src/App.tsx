import { useEffect, useRef, useState, useCallback, memo } from 'react';
import {
  Music, Mic2, Film, Zap, Sliders, Disc, Megaphone,
  ChevronDown, Play, ArrowRight, MapPin, Mail,
  Instagram, Youtube, Star, Menu, X, ExternalLink, Headphones, Trophy, Handshake,
  Sparkles, Compass, Send, Shield, Check, AlertCircle, Loader2
} from 'lucide-react';

// ── Constants ─────────────────────────────────────────────────────────────────
const COLORS = {
  teal: '#1F8A8A',
  tealDark: '#082F3A',
  tealLight: '#7EE7C8',
  aqua: '#3ED6A0',
  chrome: '#C0C0C0',
  gold: '#D4AF37',
  goldSoft: '#F5E6A3',
  darkBg: '#030A0E',
  darkSurface: '#071520',
  darkCard: '#0A2030',
};

// ── Security Utilities ────────────────────────────────────────────────────────
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 2000); // Limit length
};

const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '');
};

const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^0-9+\-\s()]/g, '').trim();
};

const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

// Rate limiting
const rateLimiter = {
  submissions: [] as number[],
  maxPerHour: 5,
  check(): boolean {
    const now = Date.now();
    this.submissions = this.submissions.filter(t => now - t < 3600000);
    return this.submissions.length < this.maxPerHour;
  },
  record(): void {
    this.submissions.push(Date.now());
  }
};

// ── Types ────────────────────────────────────────────────────────────────────
interface Particle {
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

interface ScrollState {
  y: number;
  progress: number;
  direction: 'up' | 'down' | null;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

// ── Custom Hooks ──────────────────────────────────────────────────────────────
function useScrollProgress(): ScrollState {
  const [scroll, setScroll] = useState<ScrollState>({ y: 0, progress: 0, direction: null });
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? y / maxScroll : 0;
      const direction = y > lastY.current ? 'down' : y < lastY.current ? 'up' : null;
      lastY.current = y;
      setScroll({ y, progress, direction });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
}

function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.1): [React.RefCallback<T>, boolean] {
  const [element, setElement] = useState<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  const refCallback = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold, rootMargin: '-50px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, threshold]);

  return [refCallback, isInView];
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

function useTouch(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

// ── Particle System ───────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isMobile = useTouch();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true })!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    const particleCount = isMobile ? 50 : 120;
    const colors = [COLORS.teal, COLORS.aqua, COLORS.tealLight, COLORS.chrome, COLORS.gold];

    const createParticle = (width: number, height: number): Particle => {
      const type = Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'line' : 'circle';
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type,
        glow: Math.random() > 0.6,
        angle: Math.random() * Math.PI * 2,
      };
    };

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(width, height));

    const drawStar = (x: number, y: number, size: number) => {
      const spikes = 4;
      const outerRadius = size * 2;
      const innerRadius = size;
      let rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
    };

    const animate = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const pts = particlesRef.current;

      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Mouse repulsion
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        // Decelerate
        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.globalAlpha = p.opacity;

        if (p.glow) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;

        if (p.type === 'star') {
          drawStar(p.x, p.y, p.size);
          ctx.fill();
        } else if (p.type === 'line') {
          p.angle = (p.angle || 0) + 0.01;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(p.angle || 0) * p.size * 4, p.y + Math.sin(p.angle || 0) * p.size * 4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw connections
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = COLORS.teal;
            ctx.globalAlpha = (1 - d / 100) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animate();
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        mouseRef.current = {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onMouseMove, { passive: true });

    const handleResize = () => {
      resize();
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      particlesRef.current = Array.from({ length: particleCount }, () => createParticle(width, height));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    />
  );
}

// ── Noise Texture Component ──────────────────────────────────────────────────
function NoiseTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[100] opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }}
      aria-hidden="true"
    />
  );
}

// ── Wave Equalizer ────────────────────────────────────────────────────────────
const WaveEQ = memo(function WaveEQ({ bars = 8 }: { bars?: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-end gap-0.5" style={{ height: 24 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: 3,
            background: `linear-gradient(to top, ${COLORS.teal}, ${COLORS.aqua})`,
            height: reducedMotion ? 12 : undefined,
            animation: reducedMotion ? 'none' : `waveBar ${0.5 + Math.random() * 0.8}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
});

// ── Animated Letters Component ──────────────────────────────────────────────
const AnimatedLetters = memo(function AnimatedLetters({
  text,
  baseDelay = 0,
  className = '',
}: {
  text: string;
  baseDelay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden ${className}`} style={{ perspective: 800 }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: 'letterReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: `${baseDelay + i * 0.035}s`,
            transformOrigin: 'center bottom',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
});

// ── Marquee Section ──────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'MUSIC PRODUCTION', 'MIXING & MASTERING', 'LIVE BAND DESIGN',
  'BACKGROUND SCORING', 'ADS & JINGLES', 'PODCAST PRODUCTION',
  'LYRICS & COMPOSITION', 'SONIC BRANDING',
];

const Marquee = memo(function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  const reducedMotion = useReducedMotion();

  return (
    <div className="overflow-hidden border-y border-teal-900/30 py-5 bg-gradient-to-r from-teal-950/50 via-dark-surface to-teal-950/50 relative">
      {/* Chrome accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div
        className="flex whitespace-nowrap"
        style={{
          animation: reducedMotion ? 'none' : 'marqueeLeft 40s linear linear infinite',
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-semibold tracking-[0.25em] text-teal-400/60 uppercase flex items-center gap-6"
          >
            {item}
            <span className="text-gold/40 text-xs">&#9830;</span>
          </span>
        ))}
      </div>
    </div>
  );
});

// ── Services Data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: Sliders,
    title: 'Music Production',
    desc: 'Full-scale music production from concept to final record',
    features: ['Arrangement & orchestration', 'Live Instrumentation', 'Beat production', 'Artistic direction'],
    featured: true,
    num: '01'
  },
  {
    icon: Mic2,
    title: 'Lyrics & Composition',
    desc: 'Original songwriting that combines meaningful lyrics with compelling melodies tailored to your style.',
    features: ['Lyrics writing', 'Melody composition', 'Song structuring', 'Genre-specific writing'],
    num: '02'
  },
  {
    icon: Headphones,
    title: 'Live Band Design Production',
    desc: 'End-to-end design of your live sound, adapting studio records into powerful, stage-ready performances.',
    features: ['Band arrangement & restructuring', 'Live sound design', 'Playback & session design', 'Performance flow planning'],
    num: '03'
  },
  {
    icon: Music,
    title: 'Background Scoring',
    desc: 'Music composed to enhance visual storytelling with emotion, tension, and atmosphere.',
    features: ['Film, ads & visual scoring', 'Theme and motif creation', 'Scene-specific composition', 'Hybrid/orchestral sound design'],
    num: '04'
  },
  {
    icon: Megaphone,
    title: 'Ads & Jingles',
    desc: 'Catchy music crafted to build brand recall and connect with audiences',
    features: ['Sonic branding', 'Jingles & hooks', 'Voiceover integration', 'Format adaptations (TV, digital, radio)'],
    num: '05'
  },
  {
    icon: Play,
    title: 'Mixing',
    desc: 'Detailed mixing that balances, enhances, and refines each element into a cohesive, professional track',
    features: ['EQ, compression & dynamics control', 'Stereo imaging & depth', 'Vocal tuning & timing alignment'],
    num: '06'
  },
  {
    icon: Disc,
    title: 'Mastering',
    desc: 'Technical finalization to ensure translation, consistency, and competitive loudness across all systems.',
    features: ['Loudness & tonal balance optimization', 'Stereo enhancement', 'Multi-format exports (WAV, streaming specs)', 'Final quality checks'],
    num: '07'
  },
  {
    icon: Zap,
    title: 'Podcast Production',
    desc: 'Clean, professional podcast audio production designed for clarity, consistency, and listener engagement.',
    features: ['Audio editing & noise reduction', 'EQ, compression & leveling', 'Intro/outro production', 'Platform-ready exports'],
    num: '08'
  },
];

// ── Portfolio Videos Data ───────────────────────────────────────────────────
const VIDEOS = [
  { id: 'G-XMiVMlLRI', title: 'Dance Meri Rani', artist: 'Nora Fatehi' },
  { id: 'qutnNui6Jzc', title: 'Sin Denim X Hardik Pandya', artist: 'Hardik Pandya' },
  { id: 'a8dzL0rXRKE', title: 'Skoda', artist: 'Jubin Nautiyal' },
  { id: 'dH4ArcqAL3Y', title: 'Lakeerein', artist: 'Ashutosh Rana' },
  { id: 'oEBC1Or8teQ', title: 'Jind Mahiya', artist: 'Saaj Bhatt' },
  { id: 'qO_facOiG14', title: 'Mita Do', artist: 'Rohini Garg' },
  { id: 'p7IaOANvMOc', title: 'Kripayale', artist: 'Jijo Ganesan Attingal' },
  { id: 'wL_gLi4KLtg', title: 'Jhoom Baba', artist: 'Bhaswati Sengupta' },
  { id: 'iV5rNXgQySg', title: 'Teri Baaton Mein', artist: 'Benny John' },
];

// ── Testimonials Data ───────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "I wanted to take a moment to sincerely thank you and the entire team for your outstanding work and professionalism throughout our collaboration. Your expertise and the quality of your work truly exceptional and it has been an absolute pleasure working with you. From start to finish, your dedication, attention to detail, and clear communication made the process seamless and enjoyable. I deeply appreciate the effort and care you put into everything.",
    name: 'Subhashini Demkah',
    role: 'Pop Artist'
  },
  {
    text: "The production quality was more than what I expected. He really understands the requirement and executes it. Very professional and experienced.",
    name: 'Bhaswati Sengupta',
    role: 'Bollywood Pop Artist'
  },
  {
    text: "He is multi-talented artist and understands the requirements of the artist thoroughly. Very creative and gives new inputs to every phrase of the track. Since he plays multiple instruments and he has mastered programming with latest tools, so he has a great sense of instrument application and has latest collection of custom tones that gives an absolutely different array to the sound of my tracks. Great work always.",
    name: 'Anish Chabbra',
    role: 'Indie Pop Star'
  },
  {
    text: "I've known Benny for a very long time and have always been an enormous admirer of his work. He has an excellent comprehension of music and a natural ear for how a song should sound and be produced. Any composition would be enhanced and the melody would be lifted a hundred times over by the addition of contemporary components, funky bass lines, and imaginative arrangements. His work ethic is excellent, and he puts his heart and soul into each and every project.",
    name: 'Rachit',
    role: 'Singer-Songwriter'
  },
  {
    text: "Amazing music producer he is! I have worked with him for my original and cover songs. His sense of music is superb, his work is very clean. He will understand your work very calmly and give it the way you want.",
    name: 'Rohini Garg',
    role: 'Bollywood Pop Artist'
  },
  {
    text: "A Brilliant Music Producer! One of the best ones I've ever worked with. Understands what you want and delivers it right. Great nature and Super Fun to work with!",
    name: 'Pari Thakur',
    role: 'Bollywood Pop Artist'
  },
  {
    text: "Benny John is an emerging Music Producer from South India. Now he is located in Mumbai. His Music productions is having some unique features. His feel in his Music Productions is awesome. Wish him all the best in his career. May God Bless him.",
    name: 'Dr. P. J. Santhosh Kumar',
    role: 'Gospel Artist'
  },
];

// ── Navigation Component ─────────────────────────────────────────────────────
const NAV_ITEMS = ['services', 'about', 'portfolio', 'testimonials', 'contact'];

function Navigation({
  scrolled,
  scrollTo,
}: {
  scrolled: boolean;
  scrollTo: (id: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      style={{
        background: scrolled ? 'rgba(3, 10, 14, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(31, 138, 138, 0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-3 group"
          aria-label="Go to home"
        >
          <WaveEQ bars={6} />
          <img
            src="/logo.png"
            alt="Wide Spectrum Productions"
            className={`transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`}
          />
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <li key={item}>
              <button
                onClick={() => scrollTo(item)}
                className="text-sm font-medium uppercase tracking-widest text-teal-300/70 hover:text-teal-300 transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-teal-400 to-aqua transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => scrollTo('contact')}
              className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white relative overflow-hidden"
            >
              <span className="relative z-10">Book a Free Consultation</span>
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-teal-300 p-2 rounded-lg hover:bg-teal-900/30 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-4 flex flex-col gap-4" style={{ background: 'rgba(3, 10, 14, 0.95)' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item}
              onClick={() => {
                scrollTo(item);
                setMobileOpen(false);
              }}
              className="text-left text-sm font-medium uppercase tracking-widest text-teal-300/70 hover:text-teal-300 transition-colors py-2"
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => {
              scrollTo('contact');
              setMobileOpen(false);
            }}
            className="btn-primary px-5 py-3 rounded-full text-sm font-bold text-white text-center"
          >
            <span>Book a Free Consultation</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ scrollTo }: { scrollTo: (id: string) => void }) {
  const [contentRef] = useInView<HTMLDivElement>(0.1);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: COLORS.darkBg }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.5, zIndex: 1 }}
        poster="/hero-poster.jpg"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(31, 138, 138, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
            linear-gradient(180deg, rgba(3, 10, 14, 0.7) 0%, rgba(3, 10, 14, 0.5) 50%, rgba(3, 10, 14, 0.8) 100%)
          `,
        }}
      />

      {/* Particle Canvas */}
      <ParticleCanvas />

      {/* Cinematic Statement */}
      <div
        ref={contentRef}
        className="relative z-20 text-center px-6 max-w-6xl mx-auto w-full flex flex-col items-center"
        style={{ paddingTop: '80px', paddingBottom: '120px' }}
      >
        {/* Pre-title */}
        <div
          className="mb-6 animate-fade-up opacity-0"
          style={{
            animationDelay: '0.2s',
            animationFillMode: 'forwards',
          }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-900/20 backdrop-blur-sm">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-semibold tracking-[0.3em] text-teal-300/80 uppercase">
              Premium Music Production Studio
            </span>
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="mb-6 text-center w-full"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <AnimatedLetters
            text="Build Your Sound"
            baseDelay={0.4}
            className="block text-[clamp(2.5rem,10vw,6rem)] font-black leading-[0.95] tracking-tight text-white mb-3"
          />
          <AnimatedLetters
            text="Across the Spectrum"
            baseDelay={0.9}
            className="block text-[clamp(2.5rem,10vw,6rem)] font-black leading-[0.95] tracking-tight bg-gradient-to-r from-teal-300 via-aqua to-teal-light bg-clip-text text-transparent"
          />
        </h1>

        {/* Cinematic Statement */}
        <p
          className="animate-fade-up opacity-0 text-xl md:text-2xl font-light mb-4 tracking-wide"
          style={{
            animationDelay: '1.4s',
            animationFillMode: 'forwards',
            color: COLORS.goldSoft,
            textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
          }}
        >
          "Not just music. A universe."
        </p>

        {/* Description */}
        <p
          className="animate-fade-up opacity-0 text-lg md:text-xl text-teal-200/70 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          style={{
            animationDelay: '1.6s',
            animationFillMode: 'forwards',
          }}
        >
          Premium music production, mixing, mastering, and live band design —
          trusted by artists and brands worldwide.
        </p>

        {/* CTA Buttons */}
        <div
          className="animate-fade-up opacity-0 flex flex-col sm:flex-row gap-4 justify-center mb-16"
          style={{
            animationDelay: '1.8s',
            animationFillMode: 'forwards',
          }}
        >
          <button
            onClick={() => scrollTo('services')}
            className="btn-primary px-10 py-4 rounded-full text-base font-bold text-white flex items-center gap-3 group"
          >
            <Compass size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Explore World</span>
          </button>
          <button
            onClick={() => scrollTo('portfolio')}
            className="btn-outline px-10 py-4 rounded-full text-base font-bold flex items-center gap-3 group"
          >
            <Play size={18} />
            <span>Enter Experience</span>
          </button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up opacity-0 grid grid-cols-3 gap-8 md:gap-12 max-w-lg mx-auto"
          style={{
            animationDelay: '2s',
            animationFillMode: 'forwards',
          }}
        >
          {[
            ['300+', 'Projects Completed'],
            ['10+', 'Years Experience'],
            ['7+', 'Countries'],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div
                className="text-3xl md:text-4xl font-black"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.tealLight})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {num}
              </div>
              <div className="text-xs text-teal-400/50 mt-1 tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <button
          onClick={() => scrollTo('services')}
          className="text-teal-400/50 hover:text-teal-400 transition-colors p-2"
          aria-label="Scroll to services"
        >
          <ChevronDown size={32} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}

// ── Services Section ─────────────────────────────────────────────────────────
function ServicesSection() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);

  return (
    <section id="services" className="py-28 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${COLORS.teal} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">
            What We Offer
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Service <span className="gradient-text">Spectrum</span>
          </h2>
          <p className="text-teal-200/50 max-w-xl mx-auto">
            Professional audio services tailored to bring your creative vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.num} service={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Service Card Component ───────────────────────────────────────────────────
const ServiceCard = memo(function ServiceCard({
  service,
  index,
}: {
  service: typeof SERVICES[0];
  index: number;
}) {
  const [ref, isInView] = useInView<HTMLDivElement>(0.1);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`glass-card p-6 rounded-xl cursor-pointer group relative transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Badge */}
      {service.featured && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
          style={{ background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.aqua})` }}>
          Most Popular
        </div>
      )}

      {/* Background Number */}
      <div
        className="absolute top-2 left-4 text-5xl font-black opacity-10 transition-all duration-300"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          color: COLORS.teal,
          opacity: isHovered ? 0.2 : 0.1,
        }}
      >
        {service.num}
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 relative overflow-hidden"
        style={{
          background: isHovered ? `linear-gradient(135deg, ${COLORS.tealDark}, ${COLORS.teal})` : 'rgba(31, 138, 138, 0.2)',
          boxShadow: isHovered ? `0 0 30px rgba(31, 138, 138, 0.3)` : 'none',
        }}
      >
        <service.icon
          size={28}
          className="transition-all duration-300"
          style={{ color: isHovered ? COLORS.aqua : COLORS.tealLight }}
        />
      </div>

      {/* Title */}
      <h3 className="font-bold text-white mb-2 text-lg tracking-wide">{service.title}</h3>

      {/* Description */}
      <p className="text-teal-200/40 text-xs leading-relaxed mb-4">{service.desc}</p>

      {/* Features */}
      <ul className="space-y-1.5 mb-4">
        {service.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-teal-300/50 text-xs">
            <span className="text-teal-400 mt-0.5">&#10003;</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Link */}
      <div className="mt-auto flex items-center gap-1 text-teal-400 text-xs font-semibold group-hover:gap-2 transition-all">
        <span>Learn More</span>
        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
});

// ── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);
  const [imagesRef, imagesInView] = useInView<HTMLDivElement>(0.1);

  return (
    <section id="about" className="py-28 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-5"
        style={{
          background: `radial-gradient(ellipse at right, ${COLORS.teal}, transparent)`,
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute left-1/4 top-1/3 w-64 h-64 rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${COLORS.gold}, transparent)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Images */}
          <div
            ref={imagesRef}
            className={`transition-all duration-1000 ${
              imagesInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="space-y-4">
              <div className="glass-card rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img
                  src="/BJ.jpeg"
                  alt="Benny John in Studio"
                  className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-bold text-sm">In The Studio</p>
                  <p className="text-teal-300 text-xs">Where the magic happens</p>
                </div>
              </div>
              <div className="glass-card rounded-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img
                  src="/BJ2.jpeg"
                  alt="Live Performance by Benny John"
                  className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-bold text-sm">Live Performance</p>
                  <p className="text-teal-300 text-xs">Bringing music to life</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div
            ref={headerRef}
            className={`transition-all duration-1000 ${
              headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-4 block">
              About Us
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Where <span className="gradient-text">Creativity</span>
              <br />
              Meets Technology
            </h2>

            <div className="space-y-4 text-teal-200/60 leading-relaxed">
              <p>
                For <strong className="text-teal-300">Benny John</strong>, music has never been just about production — it's about turning emotion, stories and ideas into something people can hear, feel, and carry with them.
              </p>
              <p>
                Over the years, this approach has led to collaborations with artists including{' '}
                <strong className="text-teal-300">Arijit Singh, Tanishk Bagchi, Faheem Abdullah, Dhvani Bhanushali,</strong> and{' '}
                <strong className="text-teal-300">Sunny M.R</strong>.
              </p>
              <p>
                <strong className="text-teal-300">WideSpectrum Productions (WSP)</strong> grew from that journey — a creative space where music is developed with clarity, collaboration, and attention to detail. Supported by a skilled team of composers, producers, lyricists, and engineers actively working in the industry, WSP handles every stage of the process, from composition to final master.
              </p>
              <p>
                Benny John has contributed to projects including{' '}
                <strong className="text-teal-300">Dance Meri Rani, The Birthday Boy, Lakeerein, and The Wife</strong>, along with collaborations connected to Hardik Pandya. Today, WSP works with artists, filmmakers, and brands to create music that is thoughtful, refined, and built to connect.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mt-8">
              {[
                { title: 'World-Class Sound', desc: 'We deliver globally competitive production quality trusted by artists and brands', icon: Headphones },
                { title: 'End-to-End Ecosystem', desc: 'From idea to final master, everything happens seamlessly under one roof.', icon: Trophy },
                { title: 'Artist-Led Approach', desc: 'Every project is shaped around your vision, not a template', icon: Handshake },
              ].map((f, i) => (
                <div key={i} className="glass-card p-4 rounded-xl flex items-start gap-4 hover:border-teal-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5">{f.title}</h4>
                    <p className="text-teal-200/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worked With Section */}
        <div className="glass-card w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-8 py-6 rounded-2xl mt-12">
          <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-3">Worked With</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Arijit Singh', 'Tanishk Bagchi', 'Dhvani Bhanushali', 'Nora Fatehi', 'Jubin Nautiyal', 'Sunny M.R.', 'Hardik Pandya'].map(name => (
              <span
                key={name}
                className="px-3 py-1 rounded-full text-xs font-medium bg-teal-900/40 text-teal-300 border border-teal-800/40 hover:border-teal-500/50 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
          <a
            href="https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-teal-300 flex items-center gap-2 hover:bg-teal-900/30 transition-all"
          >
            <Youtube size={15} />
            <span>YouTube Playlist</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="https://www.imdb.com/name/nm17141531/?ref_=ext_shr_lnk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-teal-300 flex items-center gap-2 hover:bg-teal-900/30 transition-all"
          >
            <Film size={15} />
            <span>IMDB Profile</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Portfolio Section ────────────────────────────────────────────────────────
function PortfolioSection() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);

  // Handle video click - supports touch and mouse
  const handleVideoClick = useCallback((videoId: string) => {
    setPlayingId(playingId === videoId ? null : videoId);
  }, [playingId]);

  return (
    <section id="portfolio" className="py-28 px-6 relative" style={{ background: 'rgba(7,21,32,0.8)' }}>
      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.teal}, transparent)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">
            Our Work
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-teal-200/50 max-w-xl mx-auto">
            Experience our recent productions across various genres and styles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEOS.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              isPlaying={playingId === video.id}
              onPlay={() => handleVideoClick(video.id)}
              onStop={() => setPlayingId(null)}
            />
          ))}
        </div>

        {/* External Links */}
        <div className="text-center mt-12 flex gap-4 justify-center flex-wrap">
          <a
            href="https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-8 py-3 rounded-full text-sm font-semibold text-teal-300 inline-flex items-center gap-2"
          >
            <Youtube size={16} />
            View Full Playlist on YouTube
            <ExternalLink size={14} />
          </a>
          <a
            href="https://www.imdb.com/name/nm17141531/?ref_=ext_shr_lnk"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-6 py-3 rounded-full text-sm font-semibold text-teal-300 inline-flex items-center gap-2"
          >
            <Film size={16} />
            Go to IMDB
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Video Card Component ─────────────────────────────────────────────────────
const VideoCard = memo(function VideoCard({
  video,
  index,
  isPlaying,
  onPlay,
  onStop,
}: {
  video: typeof VIDEOS[0];
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const [ref, isInView] = useInView<HTMLDivElement>(0.1);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      {isPlaying ? (
        <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
          {/* Mobile-friendly YouTube embed */}
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={`${video.title} - ${video.artist}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ border: 0 }}
          />
          {/* Close button for mobile */}
          <button
            onClick={onStop}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="video-thumb rounded-xl overflow-hidden relative cursor-pointer group"
          style={{ aspectRatio: '16/9', background: COLORS.darkCard }}
          onClick={onPlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          aria-label={`Play ${video.title} by ${video.artist}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPlay();
            }
          }}
        >
          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={`${video.title} - ${video.artist}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to medium quality if maxres not available
              const target = e.target as HTMLImageElement;
              if (target.src.includes('maxresdefault')) {
                target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
              }
            }}
          />

          {/* Play Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              background: isHovered ? 'rgba(3, 10, 14, 0.4)' : 'rgba(3, 10, 14, 0.5)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                border: `2px solid ${COLORS.teal}`,
                background: 'rgba(3, 10, 14, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isHovered ? `0 0 30px rgba(62, 214, 160, 0.3)` : 'none',
              }}
            >
              <Play
                size={24}
                fill="white"
                className="text-white ml-1"
              />
            </div>
          </div>

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <p className="text-white font-bold text-sm mb-0.5">{video.title}</p>
            <p className="text-teal-400 text-xs">{video.artist}</p>
          </div>

          {/* Hover Glow Effect */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
            style={{
              border: isHovered ? `1px solid ${COLORS.aqua}40` : '1px solid transparent',
              boxShadow: isHovered ? `0 0 40px rgba(62, 214, 160, 0.1)` : 'none',
            }}
          />
        </div>
      )}
    </div>
  );
});

// ── Testimonials Section ─────────────────────────────────────────────────────
function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);
  const reducedMotion = useReducedMotion();

  // Auto-scroll testimonials
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const interval = setInterval(() => {
      setCurrentIndex(i => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, reducedMotion]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <section id="testimonials" className="py-28 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${COLORS.gold}, transparent)`,
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">
            Client Reviews
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            What <span className="gradient-text">Artists Say</span>
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
          {/* Testimonial Cards */}
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))`,
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="glass-card p-8 rounded-2xl text-center relative h-full flex flex-col min-h-[280px]">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        fill={COLORS.aqua}
                        className="text-teal-400"
                      />
                    ))}
                  </div>

                  {/* Quote Mark */}
                  <div className="text-5xl font-serif absolute top-4 left-6 opacity-20" style={{ color: COLORS.teal }}>
                    "
                  </div>

                  {/* Text */}
                  <p className="text-teal-100/80 text-sm md:text-base leading-relaxed mb-6 flex-grow relative z-10">
                    {testimonial.text}
                  </p>

                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.aqua})`,
                    }}
                  >
                    {testimonial.name[0]}
                  </div>
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-teal-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#030A0E] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#030A0E] to-transparent pointer-events-none z-10" />
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-teal-400' : 'w-2 bg-teal-800 hover:bg-teal-600'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ─────────────────────────────────────────────────────────
function ContactSection() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [csrfToken] = useState(() => generateCSRFToken());
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle input change with sanitization
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let sanitizedValue: string;

    switch (name) {
      case 'email':
        sanitizedValue = sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = sanitizePhone(value);
        break;
      default:
        sanitizedValue = sanitizeInput(value);
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // Handle form submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check rate limit
    if (!rateLimiter.check()) {
      setSubmitStatus('error');
      alert('Too many submissions. Please wait before trying again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          _csrf: csrfToken,
        }),
      });

      if (response.ok) {
        rateLimiter.record();
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 6000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, csrfToken, validateForm]);

  return (
    <section id="contact" className="py-28 px-6 relative" style={{ background: 'rgba(7,21,32,0.8)' }}>
      {/* Background Glow */}
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${COLORS.teal}, transparent)`,
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">
            Get in Touch
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Book Your Free <span className="gradient-text">Consultation</span>
          </h2>
          <p className="text-teal-200/50 max-w-xl mx-auto">
            Ready to start your next project? Let's talk!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Let's Create Something Amazing</h3>
              <p className="text-teal-200/60 leading-relaxed">
                Whether you're an established artist or just starting out, we're here to help bring your musical vision to life.
              </p>
            </div>

            {/* Contact Info */}
            {[
              { icon: MapPin, label: 'Located at', val: 'Mumbai, Maharashtra, India' },
              { icon: Mail, label: 'Email Us', val: 'widespectrumproductions@gmail.com', href: 'mailto:widespectrumproductions@gmail.com' },
            ].map(({ icon: Icon, label, val, href }) => (
              <div key={label} className="flex items-start gap-4 glass-card p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-teal-200 hover:text-teal-300 transition-colors font-medium text-sm underline">
                      {val}
                    </a>
                  ) : (
                    <p className="text-teal-200 font-medium text-sm">{val}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Youtube, href: 'https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr', label: 'YouTube' },
                { icon: Instagram, href: 'https://www.instagram.com/wide_spectrum_productions/', label: 'Instagram' },
                { icon: Film, href: 'https://www.imdb.com/name/nm17141531/', label: 'IMDB' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-12 h-12 rounded-xl bg-teal-900/40 border border-teal-800/40 flex items-center justify-center text-teal-400 hover:text-teal-300 hover:border-teal-500 hover:bg-teal-800/30 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-teal-400/50 text-xs">
              <Shield size={14} />
              <span>Secure form with CSRF protection</span>
            </div>
          </div>

          {/* Right - Form */}
          <div className="glass-card p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field w-full px-4 py-3 rounded-lg text-sm ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field w-full px-4 py-3 rounded-lg text-sm ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & Service Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">
                    Service Interested In *
                  </label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className={`input-field w-full px-4 py-3 rounded-lg text-sm ${
                      errors.service ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!errors.service}
                    aria-describedby={errors.service ? 'service-error' : undefined}
                  >
                    <option value="">Select a service</option>
                    {SERVICES.map(s => (
                      <option key={s.num} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                  {errors.service && (
                    <p id="service-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.service}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">
                  Tell Us About Your Project *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Project details..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`input-field w-full px-4 py-3 rounded-lg text-sm resize-none ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.message}
                  </p>
                )}
              </div>

              {/* Hidden CSRF Field */}
              <input type="hidden" name="_csrf" value={csrfToken} />

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 rounded-lg bg-teal-900/40 border border-teal-700/40 text-teal-300 text-sm flex items-center gap-2">
                  <Check size={16} className="text-green-400" />
                  Message sent successfully! We'll get back to you shortly.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 rounded-lg bg-red-900/40 border border-red-700/40 text-red-300 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  Failed to send message. Please try again.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer Component ─────────────────────────────────────────────────────────
function Footer({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <footer className="py-12 px-6 border-t border-teal-900/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <WaveEQ bars={5} />
            <img src="/logo.png" alt="Wide Spectrum Productions" className="h-8" />
          </div>

          <div className="flex items-center gap-6 text-xs text-teal-400/40 uppercase tracking-widest flex-wrap justify-center">
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="hover:text-teal-400 transition-colors capitalize"
              >
                {item}
              </button>
            ))}
          </div>

          <p className="text-xs text-teal-400/30">
            {new Date().getFullYear()} Wide Spectrum Productions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main App Component ───────────────────────────────────────────────────────
export default function App() {
  const scroll = useScrollProgress();

  const scrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: COLORS.darkBg }}>
      {/* Noise Texture Overlay */}
      <NoiseTexture />

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-[60] transition-all duration-100"
        style={{
          width: `${scroll.progress * 100}%`,
          background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.aqua})`,
        }}
        aria-hidden="true"
      />

      {/* Navigation */}
      <Navigation scrolled={scroll.y > 60} scrollTo={scrollTo} />

      {/* Hero Section */}
      <HeroSection scrollTo={scrollTo} />

      {/* Marquee */}
      <Marquee />

      {/* Services Section */}
      <ServicesSection />

      {/* About Section */}
      <AboutSection />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer scrollTo={scrollTo} />
    </div>
  );
}
