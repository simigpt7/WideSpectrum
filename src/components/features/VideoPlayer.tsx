import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

const VideoPlayer = ({ videoId, title }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-800 shadow-2xl">
      {!isPlaying ? (
        // Thumbnail with play button
        <button
          onClick={() => setIsPlaying(true)}
          className="relative w-full h-full group"
          aria-label={`Play ${title}`}
        >
          {/* Thumbnail */}
          <img
            src={thumbnailSrc}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-dark-950/40 group-hover:bg-dark-950/20 transition-colors duration-300" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Play className="h-10 w-10 text-white ml-1" />
            </div>
          </div>

          {/* Gradient Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/50 rounded-xl transition-colors duration-300" />
        </button>
      ) : (
        // YouTube iframe
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-800/80 hover:bg-dark-700 flex items-center justify-center transition-colors duration-200 z-10"
            aria-label="Close video"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
