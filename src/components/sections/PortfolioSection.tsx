import { memo } from 'react';
import { Youtube, Film, ExternalLink } from 'lucide-react';
import { Section, Container, Button } from '@/components/ui';
import { VideoPlayer } from '@/components/features';
import { useInView } from '@/hooks';
import { VIDEOS, COMPANY, COLORS } from '@/constants';

export const PortfolioSection = memo(function PortfolioSection() {
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);

  return (
    <Section id="portfolio" background="surface" padding="lg">
      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.teal}, transparent)`,
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
            <VideoPlayer key={video.id} video={video} index={i} />
          ))}
        </div>

        {/* External Links */}
        <div className="text-center mt-12 flex gap-4 justify-center flex-wrap">
          <Button
            as="a"
            href={COMPANY.youtubePlaylist}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="md"
            leftIcon={<Youtube size={16} />}
            rightIcon={<ExternalLink size={14} />}
          >
            View Full Playlist on YouTube
          </Button>
          <Button
            as="a"
            href={COMPANY.imdbProfile}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="md"
            leftIcon={<Film size={16} />}
            rightIcon={<ExternalLink size={14} />}
          >
            Go to IMDB
          </Button>
        </div>
      </Container>
    </Section>
  );
});
