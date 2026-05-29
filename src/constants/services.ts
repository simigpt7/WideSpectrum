import {
  Sliders,
  Mic2,
  Headphones,
  Music,
  Megaphone,
  Play,
  Disc,
  Zap,
} from 'lucide-react';
import type { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    icon: Sliders,
    title: 'Music Production',
    desc: 'Full-scale music production from concept to final record',
    features: ['Arrangement & orchestration', 'Live Instrumentation', 'Beat production', 'Artistic direction'],
    featured: true,
    num: '01',
  },
  {
    icon: Mic2,
    title: 'Lyrics & Composition',
    desc: 'Original songwriting that combines meaningful lyrics with compelling melodies tailored to your style.',
    features: ['Lyrics writing', 'Melody composition', 'Song structuring', 'Genre-specific writing'],
    num: '02',
  },
  {
    icon: Headphones,
    title: 'Live Band Design Production',
    desc: 'End-to-end design of your live sound, adapting studio records into powerful, stage-ready performances.',
    features: ['Band arrangement & restructuring', 'Live sound design', 'Playback & session design', 'Performance flow planning'],
    num: '03',
  },
  {
    icon: Music,
    title: 'Background Scoring',
    desc: 'Music composed to enhance visual storytelling with emotion, tension, and atmosphere.',
    features: ['Film, ads & visual scoring', 'Theme and motif creation', 'Scene-specific composition', 'Hybrid/orchestral sound design'],
    num: '04',
  },
  {
    icon: Megaphone,
    title: 'Ads & Jingles',
    desc: 'Catchy music crafted to build brand recall and connect with audiences',
    features: ['Sonic branding', 'Jingles & hooks', 'Voiceover integration', 'Format adaptations (TV, digital, radio)'],
    num: '05',
  },
  {
    icon: Play,
    title: 'Mixing',
    desc: 'Detailed mixing that balances, enhances, and refines each element into a cohesive, professional track',
    features: ['EQ, compression & dynamics control', 'Stereo imaging & depth', 'Vocal tuning & timing alignment'],
    num: '06',
  },
  {
    icon: Disc,
    title: 'Mastering',
    desc: 'Technical finalization to ensure translation, consistency, and competitive loudness across all systems.',
    features: ['Loudness & tonal balance optimization', 'Stereo enhancement', 'Multi-format exports (WAV, streaming specs)', 'Final quality checks'],
    num: '07',
  },
  {
    icon: Zap,
    title: 'Podcast Production',
    desc: 'Clean, professional podcast audio production designed for clarity, consistency, and listener engagement.',
    features: ['Audio editing & noise reduction', 'EQ, compression & leveling', 'Intro/outro production', 'Platform-ready exports'],
    num: '08',
  },
];

export const MARQUEE_ITEMS = [
  'MUSIC PRODUCTION',
  'MIXING & MASTERING',
  'LIVE BAND DESIGN',
  'BACKGROUND SCORING',
  'ADS & JINGLES',
  'PODCAST PRODUCTION',
  'LYRICS & COMPOSITION',
  'SONIC BRANDING',
];
