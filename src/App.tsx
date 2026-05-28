import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Music, Mic2, Radio, Film, Zap, Sliders, Disc, Megaphone,
  ChevronDown, Play, ArrowRight, MapPin, Mail, Phone,
  Instagram, Youtube, Star, Menu, X, ExternalLink, Headphones, Trophy, Handshake
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string;
}

// ── Hero Canvas ────────────────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const colors = ['#1F8A8A', '#3ED6A0', '#7EE7C8', '#082F3A'];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();

    function spawnParticles() {
      particlesRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    }
    spawnParticles();

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      const pts = particlesRef.current;

      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += dx / dist * 0.06;
          p.vy += dy / dist * 0.06;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = '#1F8A8A';
            ctx.globalAlpha = (1 - d / 120) * 0.12;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    const onMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onResize = () => { resize(); spawnParticles(); };
    canvas.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="heroCanvas" />;
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
            '--dur': `${0.5 + Math.random() * 0.8}s`,
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
          style={{ animationDelay: `${baseDelay + i * 0.04}s` }}
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

// ── Services data (from GitHub) ─────────────────────────────────────────────
const SERVICES = [
  { icon: Sliders, title: 'Music Production', desc: 'Full-scale music production from concept to final record', features: ['Arrangement & orchestration', 'Live Instrumentation', 'Beat production', 'Artistic direction'], featured: true, num: '01' },
  { icon: Mic2, title: 'Lyrics & Composition', desc: 'Original songwriting that combines meaningful lyrics with compelling melodies tailored to your style.', features: ['Lyrics writing', 'Melody composition', 'Song structuring', 'Genre-specific writing'], num: '02' },
  { icon: Headphones, title: 'Live Band Design Production', desc: 'End-to-end design of your live sound, adapting studio records into powerful, stage-ready performances.', features: ['Band arrangement & restructuring', 'Live sound design', 'Playback & session design', 'Performance flow planning'], num: '03' },
  { icon: Music, title: 'Background Scoring', desc: 'Music composed to enhance visual storytelling with emotion, tension, and atmosphere.', features: ['Film, ads & visual scoring', 'Theme and motif creation', 'Scene-specific composition', 'Hybrid/orchestral sound design'], num: '04' },
  { icon: Megaphone, title: 'Ads & Jingles', desc: 'Catchy music crafted to build brand recall and connect with audiences', features: ['Sonic branding', 'Jingles & hooks', 'Voiceover integration', 'Format adaptations (TV, digital, radio)'], num: '05' },
  { icon: Play, title: 'Mixing', desc: 'Detailed mixing that balances, enhances, and refines each element into a cohesive, professional track', features: ['EQ, compression & dynamics control', 'Stereo imaging & depth', 'Vocal tuning & timing alignment'], num: '06' },
  { icon: Disc, title: 'Mastering', desc: 'Technical finalization to ensure translation, consistency, and competitive loudness across all systems.', features: ['Loudness & tonal balance optimization', 'Stereo enhancement', 'Multi-format exports (WAV, streaming specs)', 'Final quality checks'], num: '07' },
  { icon: Zap, title: 'Podcast Production', desc: 'Clean, professional podcast audio production designed for clarity, consistency, and listener engagement.', features: ['Audio editing & noise reduction', 'EQ, compression & leveling', 'Intro/outro production', 'Platform-ready exports'], num: '08' },
];

// ── Portfolio videos (from GitHub) ─────────────────────────────────────────
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

// ── Testimonials (from GitHub - 7 total) ───────────────────────────────────
const TESTIMONIALS = [
  { text: "I wanted to take a moment to sincerely thank you and the entire team for your outstanding work and professionalism throughout our collaboration. Your expertise and the quality of your work truly exceptional and it has been an absolute pleasure working with you. From start to finish, your dedication, attention to detail, and clear communication made the process seamless and enjoyable. I deeply appreciate the effort and care you put into everything.", name: 'Subhashini Demkah', role: 'Pop Artist' },
  { text: "The production quality was more than what I expected. He really understands the requirement and executes it. Very professional and experienced.", name: 'Bhaswati Sengupta', role: 'Bollywood Pop Artist' },
  { text: "He is multi-talented artist and understands the requirements of the artist thoroughly. Very creative and gives new inputs to every phrase of the track. Since he plays multiple instruments and he has mastered programming with latest tools, so he has a great sense of instrument application and has latest collection of custom tones that gives an absolutely different array to the sound of my tracks. Great work always.", name: 'Anish Chabbra', role: 'Indie PopStar' },
  { text: "I've known Benny for a very long time and have always been an enormous admirer of his work. He has an excellent comprehension of music and a natural ear for how a song should sound and be produced. Any composition would be enhanced and the melody would be lifted a hundred times over by the addition of contemporary components, funky bass lines, and imaginative arrangements. His work ethic is excellent, and he puts his heart and soul into each and every project.", name: 'Rachit', role: 'Singer-Songwriter' },
  { text: "Amazing music producer he is! I have worked with him for my original and cover songs. His sense of music is superb, his work is very clean. He will understand your work very calmly and give it the way you want.", name: 'Rohini Garg', role: 'Bollywood Pop Artist' },
  { text: "A Brilliant Music Producer! One of the best ones I've ever worked with. Understands what you want and delivers it right. Great nature and Super Fun to work with!", name: 'Pari Thakur', role: 'Bollywood Pop Artist' },
  { text: "Benny John is an emerging Music Producer from South India. Now he is located in Mumbai. His Music productions is having some unique features. His feel in his Music Productions is awesome. Wish him all the best in his career. May God Bless him.", name: 'Dr. P. J. Santhosh Kumar', role: 'Gospel Artist' },
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
  const [testimonialPaused, setTestimonialPaused] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  useEffect(() => {
    if (testimonialPaused) return;
    const id = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, [testimonialPaused]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    setNavOpen(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormSent(true);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTimeout(() => setFormSent(false), 6000);
      } else {
        console.error('Failed to send email');
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      alert('An error occurred. Please try again.');
    }
  }

  const NAV = ['services', 'about', 'portfolio', 'testimonials', 'contact'];

  return (
    <div className="min-h-screen" style={{ background: 'var(--dark-bg)' }}>
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-glow" />
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'nav-blur py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2 group">
            <WaveEQ bars={6} />
            <img src="/logo.png" alt="Wide Spectrum" className={`transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`} />
          </button>

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
                <span>Book a Free Consultation</span>
              </button>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button className="md:hidden text-teal-300 p-2" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${navOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <HeroCanvas />
        <div className="hero-scanline" />

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <h1 className="mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="block text-[clamp(2.2rem,7vw,5.5rem)] font-black leading-none tracking-tighter text-white mb-2">
              <AnimLetters text="Build Your Sound" baseDelay={0.4} />
            </span>
            <span className="block text-[clamp(2.2rem,7vw,5.5rem)] font-black leading-none tracking-tighter text-teal-300 mb-2" style={{ animation: 'none' }}>
              <AnimLetters text="Across the Spectrum" baseDelay={0.9} />
            </span>
          </h1>

          <p className="animate-fade-up text-lg md:text-xl text-teal-200/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
            style={{ animationDelay: '1.6s' }}>
            Premium music production, mixing, mastering, and live band design —
            trusted by artists and brands worldwide.
          </p>

          <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center mb-16"
            style={{ animationDelay: '1.8s' }}>
            <button onClick={() => scrollTo('contact')}
              className="btn-primary px-8 py-4 rounded-full text-base font-bold text-white flex items-center gap-2 justify-center">
              <span>Book a Free Consultation</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="animate-fade-up grid grid-cols-3 gap-6 max-w-lg mx-auto"
            style={{ animationDelay: '2s' }}>
            {[['300+', 'Projects Completed'], ['10+', 'Years Experience'], ['7+', 'Countries']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="stat-value text-3xl md:text-4xl">{num}</div>
                <div className="text-xs text-teal-400/50 mt-1 tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>

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
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              OUR SERVICE <span className="gradient-text">SPECTRUM</span>
            </h2>
            <p className="text-teal-200/50 max-w-xl mx-auto">
              Professional audio services tailored to bring your creative vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((svc, i) => (
              <div
                key={svc.num}
                className="glass-card p-6 rounded-xl cursor-pointer group reveal relative"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                {svc.featured && (
                  <div className="absolute top-4 right-4 px-2 py-0.5 bg-teal-600/80 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="w-16 h-16 rounded-lg bg-teal-900/50 flex items-center justify-center mb-6 group-hover:bg-teal-700/50 transition-colors">
                  <svc.icon size={36} className="text-teal-400" />
                </div>
                <h3 className="font-bold text-white mb-2 text-lg tracking-wide">{svc.title}</h3>
                <p className="text-teal-200/40 text-xs leading-relaxed mb-3">{svc.desc}</p>
                <ul className="space-y-1 mb-4">
                  {svc.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-teal-300/50 text-xs">
                      <span className="text-teal-400 mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-1 text-teal-400 text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Learn More</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────── */}
      <section id="about" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-5"
          style={{ background: 'radial-gradient(ellipse at right, #1F8A8A, transparent)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Images */}
          <div className="reveal-left">
            <div className="grid grid-cols-1 gap-4">
              <div className="glass-card rounded-xl overflow-hidden border-0">
                <img src="/BJ.jpeg" alt="Studio - Benny John" className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="glass-card rounded-xl overflow-hidden border-0">
                <img src="/BJ2.jpeg" alt="Live Performance" className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="reveal-right">
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
            <p className="text-teal-200/60 leading-relaxed mb-4">
              <strong className="text-teal-300">WideSpectrum Productions (WSP)</strong> grew from that journey — a creative space where music is developed with clarity, collaboration, and attention to detail.
            </p>
            <p className="text-teal-200/60 leading-relaxed mb-8">
              Benny John has contributed to projects including <strong className="text-teal-300">Dance Meri Rani, The Birthday Boy, Lakeerein, and The Wife</strong>, along with collaborations connected to Hardik Pandya.
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

            {/* Features */}
            <div className="space-y-4 mt-8">
            {[
              { title: 'World-Class Sound', desc: 'We deliver globally competitive production quality trusted by artists and brands', icon: Headphones },
              { title: 'End-to-End Ecosystem', desc: 'From idea to final master, everything happens seamlessly under one roof.', icon: Trophy },
              { title: 'Artist-Led Approach', desc: 'Every project is shaped around your vision, not a template', icon: Handshake },
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
            </div>

            <div className="glass-card p-5 rounded-xl mt-4">
              <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-3">Collaborated With</p>
              <div className="flex flex-wrap gap-2">
                {['Arijit Singh', 'Tanishk Bagchi', 'Dhvani Bhanushali', 'Nora Fatehi', 'Jubin Nautiyal', 'Sunny M.R.', 'Hardik Pandya'].map(name => (
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

          <div className="text-center mt-10 reveal flex gap-4 justify-center flex-wrap">
            <a
              href="https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline px-8 py-3 rounded-full text-sm font-semibold text-teal-300 inline-flex items-center gap-2"
            >
              <Youtube size={16} />
              View Full Playlist on YouTube
              <ExternalLink size={14} />
            </a>
            <a
              href="https://www.imdb.com/name/nm17141531/?ref_=ext_shr_lnk"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline px-6 py-3 rounded-full text-sm font-semibold text-teal-300 inline-flex items-center gap-2"
            >
              <Film size={16} />
              Go to IMDB
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section id="testimonials" className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">Client Reviews</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What <span className="gradient-text">Artists Say</span>
            </h2>
          </div>

          <div className="relative overflow-hidden" onMouseEnter={() => setTestimonialPaused(true)} onMouseLeave={() => setTestimonialPaused(false)}>
            <div
              className="flex gap-6 transition-transform duration-300"
              style={{
                transform: `translateX(calc(-${testimonialIdx * 100}% - ${testimonialIdx * 24}px))`,
              }}
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, i) => (
                <div key={i} className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <div className="glass-card p-8 rounded-2xl text-center relative h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#3ED6A0" className="text-teal-400" />)}
                    </div>
                    <div className="text-3xl text-teal-600/30 font-serif absolute top-4 left-6">"</div>
                    <p className="text-teal-100/80 text-sm md:text-base leading-relaxed mb-6 relative z-10 flex-grow">
                      {testimonial.text}
                    </p>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-700 to-teal-400 flex items-center justify-center mx-auto mb-3 text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-teal-400 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10" />
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'w-8 bg-teal-400' : 'w-2 bg-teal-800'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────── */}
      <section id="contact" className="py-28 px-6" style={{ background: 'rgba(7,21,32,0.8)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Book your free <span className="gradient-text">Consultation</span>
            </h2>
            <p className="text-teal-200/50 max-w-xl mx-auto">
              Ready to start your next project? Let's talk!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="reveal-left space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Let's Create Something Amazing</h3>
                <p className="text-teal-200/60 leading-relaxed">
                  Whether you're an established artist or just starting out, we're here to help bring your musical vision to life.
                </p>
              </div>

              {[
                { icon: MapPin, label: 'Located at', val: 'Mumbai, Maharashtra, India' },
                { icon: Mail, label: 'Email Us', val: 'WideSpectrumProductions@gmail.com', href: 'mailto:WideSpectrumProductions@gmail.com' },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-teal-200 hover:text-teal-300 transition-colors font-medium text-sm underline">{val}</a>
                    ) : (
                      <p className="text-teal-200 font-medium text-sm">{val}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                {[
                  { icon: Youtube, href: 'https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr' },
                  { icon: Instagram, href: 'https://www.instagram.com/wide_spectrum_productions/' },
                  { icon: Film, href: 'https://www.imdb.com/name/nm17141531/' },
                ].map(({ icon: Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-teal-900/40 border border-teal-800/40 flex items-center justify-center text-teal-400 hover:text-teal-300 hover:border-teal-500 hover:bg-teal-800/30 transition-all duration-200">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div className="reveal-right">
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Your Name *</label>
                    <input type="text" required placeholder="Your name"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Email Address *</label>
                    <input type="email" required placeholder="your@email.com"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                    <input type="tel" placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Service Interested In *</label>
                    <select value={formData.service}
                      onChange={e => setFormData(p => ({ ...p, service: e.target.value }))}
                      className="input-field w-full px-4 py-3 rounded-lg text-sm" required>
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s.num} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block">Tell Us About Your Project *</label>
                  <textarea required rows={5} placeholder="Project details..."
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
                  <span>Send Message</span>
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
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Wide Spectrum" className="h-8" />
            </div>

            <div className="flex items-center gap-6 text-xs text-teal-400/40 uppercase tracking-widest">
              {NAV.map(item => (
                <button key={item} onClick={() => scrollTo(item)}
                  className="hover:text-teal-400 transition-colors capitalize">{item}</button>
              ))}
            </div>

            <p className="text-xs text-teal-400/30">
              © 2025 Wide Spectrum Productions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
