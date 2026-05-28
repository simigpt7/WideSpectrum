import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Music, Mic2, Radio, Film, Zap, Sliders, Disc, Podcast,
  ChevronDown, Play, ArrowRight, MapPin, Mail, Phone,
  Instagram, Youtube, Facebook, Star, Menu, X, ExternalLink
} from 'lucide-react';

// ── Video Background ───────────────────────────────────────────────────────
function VideoBackground() {
  return (
    <div className="hero-video-wrapper">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay so text stays readable */}
      <div className="hero-video-overlay" />
    </div>
  );
}

// ── Floating 3D Badge (persistent throughout scroll) ──────────────────────
function Floating3DBadge() {
  return (
    <div className="floating-3d-badge" aria-label="WideSpectrum 3D badge">
      <div className="badge-3d-inner">
        <div className="badge-face badge-front">
          <div className="badge-ring" />
          <div className="badge-ring badge-ring-2" />
          <div className="badge-ring badge-ring-3" />
          <div className="badge-core">
            <div className="badge-icon-wrap">
              {/* Vinyl / sound-wave SVG icon */}
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="badge-svg">
                <circle cx="20" cy="20" r="18" stroke="#3ED6A0" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="20" cy="20" r="12" stroke="#1F8A8A" strokeWidth="1" />
                <circle cx="20" cy="20" r="3" fill="#3ED6A0" />
                <path d="M20 8 Q28 14 28 20 Q28 26 20 32 Q12 26 12 20 Q12 14 20 8Z" fill="none" stroke="#7EE7C8" strokeWidth="0.8" opacity="0.6" />
              </svg>
            </div>
            <span className="badge-label">WSP</span>
            <span className="badge-sublabel">Productions</span>
          </div>
        </div>
      </div>
      <div className="badge-glow" />
    </div>
  );
}

// ── Wave Equalizer ─────────────────────────────────────────────────────────
function WaveEQ({ bars = 8, className = '' }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-0.5 ${className}`} style={{ height: 32 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            '--dur': `${0.5 + Math.random() * 0.7}s`,
            '--delay': `${i * 0.1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ── Animated letters ───────────────────────────────────────────────────────
function AnimLetters({ text, className = '', baseDelay = 0 }: {
  text: string; className?: string; baseDelay?: number;
}) {
  return (
    <span className={`inline-block overflow-hidden ${className}`} style={{ perspective: 600 }}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="inline-block animate-letter-reveal"
          style={{ animationDelay: `${baseDelay + i * 0.05}s` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
}

// ── Marquee ────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'MUSIC PRODUCTION', 'MIXING & MASTERING', 'LIVE BAND DESIGN',
  'BACKGROUND SCORING', 'ADS & JINGLES', 'PODCAST PRODUCTION',
  'LYRICS & COMPOSITION', 'SONIC BRANDING',
];

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-y border-teal-900/40 py-4 bg-[#071520]/60">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="mx-8 text-sm font-semibold tracking-widest text-teal-400/70 uppercase">
            {item}
            <span className="mx-8 text-teal-600/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Services data ──────────────────────────────────────────────────────────
const SERVICES = [
  { icon: Music, title: 'Music Production', desc: 'Full-scale production from concept to final record — arrangement, orchestration, live instrumentation, beat production, artistic direction.', num: '01' },
  { icon: Mic2, title: 'Lyrics & Composition', desc: 'Original songwriting combining meaningful lyrics with compelling melodies tailored to your artistic style and genre.', num: '02' },
  { icon: Radio, title: 'Live Band Design', desc: 'End-to-end design of your live sound, adapting studio records into powerful, stage-ready performances.', num: '03' },
  { icon: Film, title: 'Background Scoring', desc: 'Music composed to enhance visual storytelling with emotion, tension, and atmosphere for film, ads, and visuals.', num: '04' },
  { icon: Zap, title: 'Ads & Jingles', desc: 'Catchy sonic branding crafted to build brand recall and connect with audiences across TV, digital, and radio.', num: '05' },
  { icon: Sliders, title: 'Mixing', desc: 'Detailed mixing that balances and refines each element into a cohesive, professional track with depth and clarity.', num: '06' },
  { icon: Disc, title: 'Mastering', desc: 'Technical finalization ensuring translation, consistency, and competitive loudness across all playback systems.', num: '07' },
  { icon: Podcast, title: 'Podcast Production', desc: 'Clean, professional podcast audio designed for clarity, consistency, and listener engagement on all platforms.', num: '08' },
];

// ── Portfolio videos ───────────────────────────────────────────────────────
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

// ── Testimonials ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { text: "I wanted to take a moment to sincerely thank you and the entire team for your outstanding work and professionalism throughout our collaboration. Your expertise and the quality of your work truly exceptional.", name: 'Subhashini Demkah', role: 'Pop Artist' },
  { text: "The production quality was more than what I expected. He really understands the requirement and executes it. Very professional and experienced.", name: 'Bhaswati Sengupta', role: 'Bollywood Pop Artist' },
  { text: "He is multi-talented artist and understands the requirements of the artist thoroughly. Very creative and gives new inputs to every phrase of the track. Great work always.", name: 'Anish Chabbra', role: 'Indie PopStar' },
  { text: "He has an excellent comprehension of music and a natural ear for how a song should sound and be produced. His work ethic is excellent, and he puts his heart and soul into each and every project.", name: 'Rachit', role: 'Singer-Songwriter' },
  { text: "Amazing music producer! Understands your work very calmly and gives it the way you want. His sense of music is superb and his work is very clean.", name: 'Rohini Garg', role: 'Bollywood Pop Artist' },
  { text: "A Brilliant Music Producer! Understands what you want and delivers it right. Great nature and Super Fun to work with!", name: 'Pari Thakur', role: 'Bollywood Pop Artist' },
];

// ── useReveal hook ─────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useReveal();

  // Scroll watcher
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cursor glow
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Testimonial auto-advance
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    setNavOpen(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Hello Wide Spectrum Productions,\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nService: ${formData.service}\n\n${formData.message}`;
    window.open(`https://wa.me/919819025889?text=${encodeURIComponent(msg)}`, '_blank');
    setFormSent(true);
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    setTimeout(() => setFormSent(false), 5000);
  }

  const NAV = ['services', 'about', 'portfolio', 'testimonials', 'contact'];

  return (
    <div className="min-h-screen" style={{ background: 'var(--dark-bg)' }}>
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-glow" />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* ── FLOATING 3D BADGE (persistent) ────────────────────────── */}
      <Floating3DBadge />

      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-blur py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" onClick={() => scrollTo('home')} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-900/50">
                <Music size={18} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-teal-400/20 blur-md group-hover:blur-xl transition-all duration-300" />
            </div>
            <span className="font-black text-lg tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="gradient-text">Wide</span>
              <span className="text-white">Spectrum</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV.map(item => (
              <li key={item}>
                <button
                  onClick={() => scrollTo(item)}
                  className="text-sm font-medium uppercase tracking-widest text-teal-300/70 hover:text-teal-300 transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-400 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => scrollTo('contact')}
                className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              >
                <span>Book Now</span>
              </button>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button className="md:hidden text-teal-300 p-2" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${navOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="nav-blur px-6 pb-4 pt-2 flex flex-col gap-4">
            {[...NAV, 'Book Now'].map(item => (
              <button
                key={item}
                onClick={() => scrollTo(item === 'Book Now' ? 'contact' : item)}
                className="text-left text-sm font-medium uppercase tracking-widest text-teal-300/70 hover:text-teal-300 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <VideoBackground />

        {/* Scanline effect */}
        <div className="hero-scanline" />

        {/* Radial glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1F8A8A, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3ED6A0, transparent)', filter: 'blur(60px)' }} />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(31,138,138,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(31,138,138,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Pre-title */}
          <div className="animate-fade-up mb-6" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-teal-800/60 bg-teal-950/40">
              <WaveEQ bars={5} />
              <span className="text-xs font-semibold tracking-[0.2em] text-teal-400 uppercase">Mumbai, India</span>
              <WaveEQ bars={5} />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="mb-4" style={{ fontFamily: 'Montserrat, sans-serif', perspective: '800px' }}>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] font-black leading-none tracking-tighter text-white mb-2">
              <AnimLetters text="BUILD YOUR" baseDelay={0.4} />
            </span>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] font-black leading-none tracking-tighter gradient-text animate-glow-pulse mb-2">
              <AnimLetters text="SOUND ACROSS" baseDelay={0.9} />
            </span>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] font-black leading-none tracking-tighter text-white">
              <AnimLetters text="THE SPECTRUM" baseDelay={1.4} />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up text-lg md:text-xl text-teal-200/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
            style={{ animationDelay: '2s' }}>
            Premium music production, mixing, mastering, and live band design —
            trusted by artists and brands worldwide.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center mb-16"
            style={{ animationDelay: '2.2s' }}>
            <button onClick={() => scrollTo('contact')}
              className="btn-primary px-8 py-4 rounded-full text-base font-bold text-white flex items-center gap-2 justify-center">
              <span>Book Free Consultation</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo('portfolio')}
              className="btn-outline px-8 py-4 rounded-full text-base font-semibold text-teal-300 flex items-center gap-2 justify-center">
              <Play size={16} fill="currentColor" />
              <span>Listen to Our Work</span>
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up grid grid-cols-3 gap-6 max-w-lg mx-auto"
            style={{ animationDelay: '2.4s' }}>
            {[['300+', 'Projects Completed'], ['10+', 'Years Experience'], ['7+', 'Countries']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="stat-value text-3xl md:text-4xl">{num}</div>
                <div className="text-xs text-teal-400/50 mt-1 tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button onClick={() => scrollTo('services')} className="text-teal-400/50 hover:text-teal-400 transition-colors">
            <ChevronDown size={28} />
          </button>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────── */}
      <Marquee />

      {/* ── SERVICES ──────────────────────────────────────────────────── */}
      <section id="services" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-teal-200/50 max-w-xl mx-auto">
              End-to-end music production ecosystem under one roof
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((svc, i) => (
              <div
                key={svc.num}
                className="glass-card p-6 rounded-xl cursor-pointer group reveal"
                style={{ animationDelay: `${i * 0.08}s`, transitionDelay: `${i * 0.05}s` }}
              >
                <div className="service-number mb-2">{svc.num}</div>
                <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center mb-4 group-hover:bg-teal-700/50 transition-colors">
                  <svc.icon size={20} className="text-teal-400" />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm tracking-wide">{svc.title}</h3>
                <p className="text-teal-200/40 text-xs leading-relaxed line-clamp-4">{svc.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-teal-400 text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Book Now</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 px-6 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-5"
          style={{ background: 'radial-gradient(ellipse at right, #1F8A8A, transparent)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="reveal-left">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-4 block">About Us</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Where <span className="gradient-text">Creativity</span><br />Meets Technology
            </h2>
            <p className="text-teal-200/60 leading-relaxed mb-4">
              For <strong className="text-teal-300">Benny John</strong>, music has never been just about production — it's about turning emotion, stories, and ideas into something people can hear, feel, and carry with them.
            </p>
            <p className="text-teal-200/60 leading-relaxed mb-4">
              Over the years, this approach has led to collaborations with artists including <strong className="text-teal-300">Arijit Singh, Tanishk Bagchi, Faheem Abdullah, Dhvani Bhanushali,</strong> and Sunny M.R.
            </p>
            <p className="text-teal-200/60 leading-relaxed mb-8">
              <strong className="text-teal-300">WideSpectrum Productions (WSP)</strong> grew from that journey — a creative space where music is developed with clarity, collaboration, and attention to detail.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr"
                target="_blank" rel="noopener noreferrer"
                className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-teal-300 flex items-center gap-2">
                <Youtube size={15} />
                <span>YouTube Playlist</span>
                <ExternalLink size={12} />
              </a>
              <a href="https://www.imdb.com/name/nm17141531/?ref_=ext_shr_lnk"
                target="_blank" rel="noopener noreferrer"
                className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-teal-300 flex items-center gap-2">
                <Film size={15} />
                <span>IMDB Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Right: feature cards */}
          <div className="reveal-right space-y-4">
            {[
              { title: 'World-Class Sound', desc: 'Globally competitive production quality trusted by artists and brands across 7+ countries.', icon: Disc },
              { title: 'End-to-End Ecosystem', desc: 'From idea to final master, every stage handled seamlessly under one roof.', icon: Sliders },
              { title: 'Artist-Led Approach', desc: 'Every project is shaped around your creative vision, not a pre-built template.', icon: Mic2 },
            ].map((f, i) => (
              <div key={i} className="glass-card p-5 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                  <f.icon size={18} className="text-teal-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{f.title}</h4>
                  <p className="text-teal-200/50 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}

            {/* Collaborations ticker */}
            <div className="glass-card p-5 rounded-xl">
              <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-3">Collaborated With</p>
              <div className="flex flex-wrap gap-2">
                {['Arijit Singh', 'Tanishk Bagchi', 'Dhvani Bhanushali', 'Nora Fatehi', 'Jubin Nautiyal', 'Sunny M.R.'].map(name => (
                  <span key={name} className="px-3 py-1 rounded-full text-xs font-medium bg-teal-900/40 text-teal-300 border border-teal-800/40">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ─────────────────────────────────────────────────── */}
      <section id="portfolio" className="py-28 px-6" style={{ background: 'rgba(7,21,32,0.8)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-teal-200/50 max-w-xl mx-auto">
              Listen to some of our recent productions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map((v, i) => (
              <div key={v.id} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                {playingId === v.id ? (
                  <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="video-thumb rounded-xl glass-card border-0" onClick={() => setPlayingId(v.id)}>
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                      alt={v.title}
                    />
                    <div className="play-overlay rounded-xl">
                      <div className="w-14 h-14 rounded-full border-2 border-teal-400/70 flex items-center justify-center bg-teal-950/60 backdrop-blur-sm hover:scale-110 transition-transform">
                        <Play size={22} fill="white" className="text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent rounded-b-xl">
                      <p className="text-white font-bold text-sm">{v.title}</p>
                      <p className="text-teal-400 text-xs">{v.artist}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <a
              href="https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline px-8 py-3 rounded-full text-sm font-semibold text-teal-300 inline-flex items-center gap-2"
            >
              <Youtube size={16} />
              View Full Playlist on YouTube
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section id="testimonials" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(ellipse at center, #1F8A8A, transparent)', filter: 'blur(100px)' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">Client Reviews</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What <span className="gradient-text">Artists Say</span>
            </h2>
          </div>

          {/* Active testimonial */}
          <div className="reveal">
            <div className="glass-card p-8 md:p-12 rounded-2xl text-center relative">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#3ED6A0" className="text-teal-400" />)}
              </div>
              <div className="text-4xl text-teal-600/30 font-serif absolute top-6 left-8">"</div>
              <p className="text-teal-100/80 text-base md:text-lg leading-relaxed mb-8 relative z-10">
                {TESTIMONIALS[testimonialIdx].text}
              </p>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg">
                {TESTIMONIALS[testimonialIdx].name[0]}
              </div>
              <p className="font-bold text-white">{TESTIMONIALS[testimonialIdx].name}</p>
              <p className="text-teal-400 text-sm">{TESTIMONIALS[testimonialIdx].role}</p>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'w-8 bg-teal-400' : 'w-2 bg-teal-800'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────── */}
      <section id="contact" className="py-28 px-6" style={{ background: 'rgba(7,21,32,0.8)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Book Your Free <span className="gradient-text">Consultation</span>
            </h2>
            <p className="text-teal-200/50 max-w-xl mx-auto">
              Ready to start your next project? Let's create something amazing together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div className="reveal-left space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Let's Create Something Amazing</h3>
                <p className="text-teal-200/60 leading-relaxed">
                  Whether you're an established artist or just starting out, we're here to help bring your musical vision to life.
                </p>
              </div>

              {[
                { icon: MapPin, label: 'Located at', val: 'Mumbai, India' },
                { icon: Mail, label: 'Email Us', val: 'WideSpectrumProductions@gmail.com', href: 'mailto:WideSpectrumProductions@gmail.com' },
                { icon: Phone, label: 'Call / WhatsApp', val: '+91 98190 25889', href: 'tel:+919819025889' },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-teal-200 hover:text-teal-300 transition-colors font-medium text-sm">{val}</a>
                    ) : (
                      <p className="text-teal-200 font-medium text-sm">{val}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social icons */}
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Instagram, href: '#' },
                  { icon: Youtube, href: 'https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr' },
                  { icon: Facebook, href: '#' },
                ].map(({ icon: Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-teal-900/40 border border-teal-800/40 flex items-center justify-center text-teal-400 hover:text-teal-300 hover:border-teal-500 hover:bg-teal-800/30 transition-all duration-200">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="reveal-right">
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Full Name *</label>
                    <input type="text" required placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Email *</label>
                    <input type="email" required placeholder="your@email.com"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Phone</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Service</label>
                    <select value={formData.service}
                      onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm">
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s.num} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Project Details *</label>
                  <textarea required rows={4} placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="input-field w-full px-4 py-3 rounded-lg text-sm resize-none" />
                </div>

                {formSent && (
                  <div className="p-3 rounded-lg bg-teal-900/40 border border-teal-700/40 text-teal-300 text-sm">
                    Message sent! We'll get back to you shortly.
                  </div>
                )}

                <button type="submit"
                  className="btn-primary w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2">
                  <span>Send via WhatsApp</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-teal-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center">
                <Music size={16} className="text-white" />
              </div>
              <span className="font-black text-base tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="gradient-text">Wide</span>
                <span className="text-white">Spectrum</span>
                <span className="text-teal-400/50 text-sm font-medium"> Productions</span>
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-teal-400/40 uppercase tracking-widest">
              {NAV.map(item => (
                <button key={item} onClick={() => scrollTo(item)}
                  className="hover:text-teal-400 transition-colors capitalize">{item}</button>
              ))}
            </div>

            <p className="text-xs text-teal-400/30">
              © {new Date().getFullYear()} WideSpectrum Productions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
