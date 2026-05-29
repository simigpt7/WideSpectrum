import { memo, useState } from 'react';
import { ChevronDown, Play, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui';
import { ParticleCanvas, AnimatedLetters } from '@/components/features';
import { useInView } from '@/hooks';
import { COMPANY, COLORS } from '@/constants';

interface HeroSectionProps {
  scrollTo: (id: string) => void;
}

export const HeroSection = memo(function HeroSection({ scrollTo }: HeroSectionProps) {
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
        style={{ opacity: 0.3, zIndex: 1 }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
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
          <Button
            onClick={() => scrollTo('services')}
            variant="primary"
            size="lg"
            leftIcon={<Compass size={18} className="group-hover:rotate-12 transition-transform" />}
          >
            Explore World
          </Button>
          <Button
            onClick={() => scrollTo('portfolio')}
            variant="outline"
            size="lg"
            leftIcon={<Play size={18} />}
          >
            Enter Experience
          </Button>
        </div>

        {/* Stats */}
        <div
          className="animate-fade-up opacity-0 grid grid-cols-3 gap-8 md:gap-12 max-w-lg mx-auto"
          style={{
            animationDelay: '2s',
            animationFillMode: 'forwards',
          }}
        >
          {COMPANY.stats.map(([num, label]) => (
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
});
