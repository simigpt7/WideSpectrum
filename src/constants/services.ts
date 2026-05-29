import { Music, Mic, Volume2, Radio, Film, Sparkles, Headphones, Music2 } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'music-production',
    title: 'Music Production',
    description: 'Full-scale music production from concept to final master, working closely with artists to realize their vision.',
    icon: Music,
    features: [
      'Full composition and arrangement',
      'Instrumental programming and recording',
      'Artist collaboration and development',
      'Genre-fluid production approach',
    ],
  },
  {
    id: 'mixing',
    title: 'Mixing',
    description: 'Professional mixing services that bring clarity, depth, and power to your tracks.',
    icon: Headphones,
    features: [
      'Balanced frequency spectrum',
      'Dynamic control and automation',
      'Spatial positioning and depth',
      'Industry-standard delivery',
    ],
  },
  {
    id: 'mastering',
    title: 'Mastering',
    description: 'Final polish that makes your music sound professional on any playback system.',
    icon: Volume2,
    features: [
      'Loudness optimization',
      'Format-specific mastering',
      'Stem mastering available',
      'Analog and digital processing',
    ],
  },
  {
    id: 'live-sound',
    title: 'Live Sound',
    description: 'Complete live sound solutions for concerts, events, and tours.',
    icon: Radio,
    features: [
      'FOH and monitor engineering',
      'System design and optimization',
      'Tour sound management',
      'Festival and venue support',
    ],
  },
  {
    id: 'film-scoring',
    title: 'Film Scoring',
    description: 'Cinematic scores that elevate storytelling and create emotional impact.',
    icon: Film,
    features: [
      'Orchestral arrangement',
      'Sync and licensing',
      'Theme development',
      'Full soundtrack production',
    ],
  },
  {
    id: 'artist-development',
    title: 'Artist Development',
    description: 'Comprehensive development programs to help artists reach their full potential.',
    icon: Sparkles,
    features: [
      'Sound identity crafting',
      'Repertoire planning',
      'Brand consistency',
      'Career strategy consulting',
    ],
  },
  {
    id: 'sound-design',
    title: 'Sound Design',
    description: 'Creative sound design for games, films, advertisements, and digital media.',
    icon: Music2,
    features: [
      'Custom sound creation',
      'Foley and SFX',
      'Audio branding',
      'Interactive audio for games',
    ],
  },
  {
    id: 'music-supervision',
    title: 'Music Supervision',
    description: 'Full-service music supervision for films, TV, and advertising campaigns.',
    icon: Mic,
    features: [
      'Music licensing and clearance',
      'Soundtrack curation',
      'Artist negotiations',
      'Budget management',
    ],
  },
];
