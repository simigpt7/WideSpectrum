import { useCallback } from 'react';
import { Header, Footer } from '@/components/layout';
import {
  HeroSection,
  ServicesSection,
  AboutSection,
  PortfolioSection,
  TestimonialsSection,
  ContactSection,
} from '@/components/sections';
import { MarqueeSection } from '@/components/sections/MarqueeSection';
import { NoiseTexture } from '@/components/features';
import { useScrollPosition } from '@/hooks';
import { COLORS } from '@/constants';

function App() {
  const scroll = useScrollPosition();

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
      <Header scrolled={scroll.y > 60} scrollTo={scrollTo} />

      {/* Hero Section */}
      <HeroSection scrollTo={scrollTo} />

      {/* Marquee */}
      <MarqueeSection />

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

export default App;
