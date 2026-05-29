import { memo, useState, useCallback } from 'react';
import { Play, X } from 'lucide-react';
import { useInView } from '@/hooks';
import { COLORS } from '@/constants';
import type { Video } from '@/types';

interface VideoPlayerProps {
  video: Video;
  index: number;
}

export const VideoPlayer = memo(function VideoPlayer({ video, index }: VideoPlayerProps) {
  const [ref, isInView] = useInView<HTMLDivElement>(0.1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      {isPlaying ? (
        <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
          {/* Mobile-friendly YouTube embed */}
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={`${video.title} - ${video.artist}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ border: 0 }}
          />
          {/* Close button for mobile */}
          <button
            onClick={handleStop}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className="video-thumb rounded-xl overflow-hidden relative cursor-pointer group"
          style={{ aspectRatio: '16/9', background: COLORS.darkCard }}
          onClick={handlePlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          aria-label={`Play ${video.title} by ${video.artist}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlay();
            }
          }}
        >
          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={`${video.title} - ${video.artist}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to medium quality if maxres not available
              const target = e.target as HTMLImageElement;
              if (target.src.includes('maxresdefault')) {
                target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
              }
            }}
          />

          {/* Play Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              background: isHovered ? 'rgba(3, 10, 14, 0.4)' : 'rgba(3, 10, 14, 0.5)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                border: `2px solid ${COLORS.teal}`,
                background: 'rgba(3, 10, 14, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isHovered ? `0 0 30px rgba(62, 214, 160, 0.3)` : 'none',
              }}
            >
              <Play size={24} fill="white" className="text-white ml-1" />
            </div>
          </div>

          {/* Video Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <p className="text-white font-bold text-sm mb-0.5">{video.title}</p>
            <p className="text-teal-400 text-xs">{video.artist}</p>
          </div>

          {/* Hover Glow Effect */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
            style={{
              border: isHovered ? `1px solid ${COLORS.aqua}40` : '1px solid transparent',
              boxShadow: isHovered ? `0 0 40px rgba(62, 214, 160, 0.1)` : 'none',
            }}
          />
        </div>
      )}
    </div>
  );
});
