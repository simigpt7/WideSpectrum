import { ArrowDown, Play } from 'lucide-react';
import Button from '../ui/Button';
import ParticleCanvas from '../features/ParticleCanvas';
import AnimatedLetters from '../features/AnimatedLetters';
import { COMPANY_INFO } from '../../constants/company';

const HeroSection = () => {
  const handleScrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Particle Background */}
      <ParticleCanvas />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950/80 via-transparent to-dark-950/90 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Animated Title */}
        <div className="mb-6">
          <AnimatedLetters text={COMPANY_INFO.name} />
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-fade-in-up animation-delay-200">
          {COMPANY_INFO.tagline}
        </p>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
          {COMPANY_INFO.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              const element = document.querySelector('#portfolio');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Play className="h-5 w-5" />
            View Our Work
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start a Project
          </Button>
        </div>

        {/* Collaborators Preview */}
        <div className="mt-16 animate-fade-in-up animation-delay-500">
          <p className="text-sm text-gray-500 mb-4">Trusted by top artists</p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
            {COMPANY_INFO.collaborators.slice(0, 5).map((collaborator) => (
              <span
                key={collaborator}
                className="px-3 py-1 bg-dark-800/50 rounded-full border border-white/5"
              >
                {collaborator}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white transition-colors duration-300 animate-bounce"
        aria-label="Scroll to services"
      >
        <ArrowDown className="h-8 w-8" />
      </button>
    </section>
  );
};

export default HeroSection;
