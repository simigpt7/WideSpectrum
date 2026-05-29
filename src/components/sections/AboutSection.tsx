import { memo } from 'react';
import { Headphones, Trophy, Handshake, Youtube, Film, ExternalLink } from 'lucide-react';
import { Section, Container, Card } from '@/components/ui';
import { useInView } from '@/hooks';
import { COMPANY, COLORS } from '@/constants';

export const AboutSection = memo(function AboutSection() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);
  const [imagesRef, imagesInView] = useInView<HTMLDivElement>(0.1);

  return (
    <Section id="about" background="default" padding="lg">
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

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Images */}
          <div
            ref={imagesRef}
            className={`transition-all duration-1000 ${
              imagesInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="space-y-4">
              <Card variant="glass" padding="none" className="overflow-hidden relative group">
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
              </Card>
              <Card variant="glass" padding="none" className="overflow-hidden relative group">
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
              </Card>
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
                For <strong className="text-teal-300">Benny John</strong>, music has never been just
                about production — it's about turning emotion, stories and ideas into something
                people can hear, feel, and carry with them.
              </p>
              <p>
                Over the years, this approach has led to collaborations with artists including{' '}
                <strong className="text-teal-300">Arijit Singh, Tanishk Bagchi, Faheem Abdullah, Dhvani Bhanushali,</strong> and{' '}
                <strong className="text-teal-300">Sunny M.R</strong>.
              </p>
              <p>
                <strong className="text-teal-300">WideSpectrum Productions (WSP)</strong> grew from that
                journey — a creative space where music is developed with clarity, collaboration, and
                attention to detail. Supported by a skilled team of composers, producers, lyricists,
                and engineers actively working in the industry, WSP handles every stage of the
                process, from composition to final master.
              </p>
              <p>
                Benny John has contributed to projects including{' '}
                <strong className="text-teal-300">Dance Meri Rani, The Birthday Boy, Lakeerein, and The Wife</strong>, along with collaborations connected to
                Hardik Pandya. Today, WSP works with artists, filmmakers, and brands to create music
                that is thoughtful, refined, and built to connect.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mt-8">
              {[
                {
                  title: 'World-Class Sound',
                  desc: 'We deliver globally competitive production quality trusted by artists and brands',
                  icon: Headphones,
                },
                {
                  title: 'End-to-End Ecosystem',
                  desc: 'From idea to final master, everything happens seamlessly under one roof.',
                  icon: Trophy,
                },
                {
                  title: 'Artist-Led Approach',
                  desc: 'Every project is shaped around your vision, not a template',
                  icon: Handshake,
                },
              ].map((f, i) => (
                <Card
                  key={i}
                  variant="glass"
                  padding="sm"
                  className="flex items-start gap-4 hover:border-teal-500/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-900/50 flex items-center justify-center shrink-0">
                    <f.icon size={18} className="text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5">{f.title}</h4>
                    <p className="text-teal-200/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Worked With Section */}
        <Card variant="glass" padding="md" className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center mt-12">
          <p className="text-xs text-teal-400/50 uppercase tracking-widest mb-3">Worked With</p>
          <div className="flex flex-wrap justify-center gap-2">
            {COMPANY.collaborators.map((name) => (
              <span
                key={name}
                className="px-3 py-1 rounded-full text-xs font-medium bg-teal-900/40 text-teal-300 border border-teal-800/40 hover:border-teal-500/50 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </Card>

        {/* External Links */}
        <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
          <a
            href={COMPANY.youtubePlaylist}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-teal-300 flex items-center gap-2 hover:bg-teal-900/30 transition-all"
          >
            <Youtube size={15} />
            <span>YouTube Playlist</span>
            <ExternalLink size={12} />
          </a>
          <a
            href={COMPANY.imdbProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-teal-300 flex items-center gap-2 hover:bg-teal-900/30 transition-all"
          >
            <Film size={15} />
            <span>IMDB Profile</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </Container>
    </Section>
  );
});
