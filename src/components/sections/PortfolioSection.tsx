import { useState } from 'react';
import { Section, SectionHeader } from '../ui/Section';
import VideoPlayer from '../features/VideoPlayer';
import Badge from '../ui/Badge';
import { PORTFOLIO_VIDEOS } from '../../constants/portfolio';
import useInView from '../../hooks/useInView';

const PortfolioSection = () => {
  const [selectedVideo, setSelectedVideo] = useState(PORTFOLIO_VIDEOS[0]);
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <Section id="portfolio" background="default">
      <SectionHeader
        title="Our Portfolio"
        subtitle="Explore our latest projects and see the quality we deliver"
      />

      <div ref={ref} className="space-y-8">
        {/* Main Video Player */}
        <div
          className={`transform transition-all duration-700 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <VideoPlayer videoId={selectedVideo.youtubeId} title={selectedVideo.title} />

          {/* Video Info */}
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              {selectedVideo.title}
            </h3>
            <p className="text-gray-400 mb-3">{selectedVideo.artist}</p>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              {selectedVideo.description}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              {selectedVideo.tags.map((tag) => (
                <Badge key={tag} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PORTFOLIO_VIDEOS.map((video, index) => (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className={`text-left p-4 rounded-xl transition-all duration-300 ${
                selectedVideo.id === video.id
                  ? 'bg-primary-500/20 border border-primary-500/50'
                  : 'bg-dark-800/50 border border-white/5 hover:bg-dark-800 hover:border-white/20'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-dark-700">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                {video.title}
              </h4>
              <p className="text-gray-500 text-xs">{video.artist}</p>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default PortfolioSection;
