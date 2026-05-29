export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  image?: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Arijit Singh',
    role: 'Playback Singer',
    company: 'Bollywood',
    quote: 'Working with Wide Spectrum Productions has been an incredible journey. Their attention to detail and innovative approach to music production elevates every project.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Tanishk Bagchi',
    role: 'Music Composer & Producer',
    company: 'Bollywood',
    quote: 'The team understands the essence of modern music while respecting traditional roots. Their mixing and mastering work is exceptional.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Dhvani Bhanushali',
    role: 'Singer & Performer',
    company: 'Independent Artist',
    quote: 'They helped shape my sound and bring my vision to life. The collaboration process was seamless and the results exceeded expectations.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Nora Fatehi',
    role: 'Actor & Performer',
    company: 'Bollywood',
    quote: 'Professional, creative, and always pushing boundaries. Wide Spectrum Productions delivers world-class music production.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Jubin Nautiyal',
    role: 'Playback Singer',
    company: 'Bollywood',
    quote: 'The technical expertise combined with artistic sensibility makes them stand out. Every track we have created together has been a masterpiece.',
    rating: 5,
  },
  {
    id: '6',
    name: 'Sunny M.R.',
    role: 'Music Director',
    company: 'Film Industry',
    quote: 'From film scoring to mixing, their versatility and commitment to quality is unmatched. A true partner in creating memorable music.',
    rating: 5,
  },
];
