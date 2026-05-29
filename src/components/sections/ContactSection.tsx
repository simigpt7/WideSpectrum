import { memo } from 'react';
import { MapPin, Mail, Youtube, Instagram, Film } from 'lucide-react';
import { Section, Container, Card } from '@/components/ui';
import { ContactForm } from '@/components/features';
import { useInView } from '@/hooks';
import { COMPANY, SERVICES, COLORS } from '@/constants';

export const ContactSection = memo(function ContactSection() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);

  const serviceOptions = [
    { value: '', label: 'Select a service' },
    ...SERVICES.map((s) => ({ value: s.title, label: s.title })),
  ];

  return (
    <Section id="contact" background="surface" padding="lg">
      {/* Background Glow */}
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${COLORS.teal}, transparent)`,
          filter: 'blur(60px)',
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
                Whether you're an established artist or just starting out, we're here to help bring
                your musical vision to life.
              </p>
            </div>

            {/* Contact Info */}
            {[
              { icon: MapPin, label: 'Located at', val: COMPANY.location },
              {
                icon: Mail,
                label: 'Email Us',
                val: COMPANY.email,
                href: `mailto:${COMPANY.email}`,
              },
            ].map(({ icon: Icon, label, val, href }) => (
              <Card key={label} variant="glass" padding="sm" className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-0.5">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-teal-200 hover:text-teal-300 transition-colors font-medium text-sm underline"
                    >
                      {val}
                    </a>
                  ) : (
                    <p className="text-teal-200 font-medium text-sm">{val}</p>
                  )}
                </div>
              </Card>
            ))}

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Youtube, href: COMPANY.youtubePlaylist, label: 'YouTube' },
                { icon: Instagram, href: COMPANY.instagram, label: 'Instagram' },
                { icon: Film, href: COMPANY.imdbProfile, label: 'IMDB' },
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
          </div>

          {/* Right - Form */}
          <ContactForm services={serviceOptions} />
        </div>
      </Container>
    </Section>
  );
});
