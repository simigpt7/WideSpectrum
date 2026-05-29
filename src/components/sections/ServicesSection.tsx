import { memo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, Container, Badge } from '@/components/ui';
import { useInView } from '@/hooks';
import { SERVICES, COLORS } from '@/constants';

export const ServicesSection = memo(function ServicesSection() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);

  return (
    <Section id="services" background="default" padding="lg">
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
        style={{
          background: `radial-gradient(circle, ${COLORS.teal} 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      <Container className="relative z-10">
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
      </Container>
    </Section>
  );
});

interface ServiceCardProps {
  service: (typeof SERVICES)[0];
  index: number;
}

const ServiceCard = memo(function ServiceCard({ service, index }: ServiceCardProps) {
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
      {service.featured && <Badge variant="teal" size="sm" className="absolute top-4 right-4">Most Popular</Badge>}

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
          background: isHovered
            ? `linear-gradient(135deg, ${COLORS.tealDark}, ${COLORS.teal})`
            : 'rgba(31, 138, 138, 0.2)',
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
        {service.features.map((f) => (
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
