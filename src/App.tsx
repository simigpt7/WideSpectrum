import { lazy, Suspense, useCallback, useEffect, useRef } from 'react';
import { Header, Footer } from '@/components/layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { NoiseTexture } from '@/components/features';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { COLORS } from '@/constants';

// Lazy-load below-fold sections for code splitting + faster initial paint
const ServicesSection     = lazy(() => import('@/components/sections/ServicesSection').then(m => ({ default: m.ServicesSection })));
const AboutSection        = lazy(() => import('@/components/sections/AboutSection').then(m => ({ default: m.AboutSection })));
const PortfolioSection    = lazy(() => import('@/components/sections/PortfolioSection').then(m => ({ default: m.PortfolioSection })));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const ContactSection      = lazy(() => import('@/components/sections/ContactSection').then(m => ({ default: m.ContactSection })));

// Lightweight skeleton while lazy sections load
function SectionSkeleton() {
  return (
    <div
      className="w-full py-32 flex items-center justify-center"
      style={{ background: COLORS.darkBg }}
      aria-hidden="true"
    >
      <div className="w-8 h-8 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin" />
    </div>
  );
}

// Header scroll state managed via direct DOM mutation — no React state needed
function HeaderController({ scrollTo }: { scrollTo: (id: string) => void }) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafPending = false;
    const update = () => {
      rafPending = false;
      const scrolled = window.scrollY > 60;
      headerRef.current?.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
    };
    const onScroll = () => {
      if (!rafPending) { rafPending = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <Header ref={headerRef} scrollTo={scrollTo} />;
}

function App() {
  // Progress bar: direct DOM write, zero React re-renders on scroll
  const progressBarRef = useScrollProgress();

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

      {/* Scroll Progress Bar — width written directly, no state */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 h-0.5 z-[60]"
        style={{
          width: '0%',
          background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.aqua})`,
          willChange: 'width',
        }}
        aria-hidden="true"
      />

      {/* Navigation */}
      <HeaderController scrollTo={scrollTo} />

      {/* Hero — always eager-loaded (above the fold) */}
      <HeroSection scrollTo={scrollTo} />

      {/* Marquee — small, eager */}
      <MarqueeSection />

      {/* Below-fold sections — lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AboutSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PortfolioSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactSection />
      </Suspense>

      {/* Footer */}
      <Footer scrollTo={scrollTo} />
    </div>
  );
}

export default App;
