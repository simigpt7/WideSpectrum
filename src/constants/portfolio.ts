export interface PortfolioVideo {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  description: string;
  year: number;
  tags: string[];
}

export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  {
    id: '1',
    youtubeId: 'G-XMiVMlLRI',
    title: 'Dance Meri Rani',
    artist: 'Nora Fatehi ft. Guru Randhawa',
    description: 'A peppy dance number that topped charts across platforms.',
    year: 2021,
    tags: ['Bollywood', 'Dance', 'Pop'],
  },
  {
    id: '2',
    youtubeId: 'qutnNui6Jzc',
    title: 'Sin Denim',
    artist: 'Arijit Singh',
    description: 'A soulful track showcasing vocal excellence and production mastery.',
    year: 2022,
    tags: ['Indie', 'Soul', 'Contemporary'],
  },
  {
    id: '3',
    youtubeId: 'a8dzL0rXRKE',
    title: 'Skoda Campaign',
    artist: 'Commercial Production',
    description: 'High-energy promotional music for automotive campaign.',
    year: 2023,
    tags: ['Commercial', 'Advertising', 'Brand'],
  },
  {
    id: '4',
    youtubeId: 'dH4ArcqAL3Y',
    title: 'Lakeerein',
    artist: 'Various Artists',
    description: 'A poignant ballad with layered arrangements and emotional depth.',
    year: 2022,
    tags: ['Bollywood', 'Ballad', 'Romantic'],
  },
  {
    id: '5',
    youtubeId: 'oEBC1Or8teQ',
    title: 'Jind Mahiya',
    artist: 'Dhvani Bhanushali',
    description: 'Modern romantic track blending traditional and contemporary sounds.',
    year: 2021,
    tags: ['Pop', 'Romantic', 'Contemporary'],
  },
  {
    id: '6',
    youtubeId: 'qO_facOiG14',
    title: 'Mita Do',
    artist: 'Jubin Nautiyal',
    description: 'Powerful vocals meets exceptional production in this chart-topping hit.',
    year: 2022,
    tags: ['Bollywood', 'Pop', 'Mainstream'],
  },
  {
    id: '7',
    youtubeId: 'p7IaOANvMOc',
    title: 'Kripayale',
    artist: 'Traditional Sounds',
    description: 'Fusion of devotional themes with modern production techniques.',
    year: 2020,
    tags: ['Devotional', 'Fusion', 'Traditional'],
  },
  {
    id: '8',
    youtubeId: 'wL_gLi4KLtg',
    title: 'Jhoom Baba',
    artist: 'Party Anthem',
    description: 'Energetic dance track that became a party essential.',
    year: 2021,
    tags: ['Party', 'Dance', 'Electronic'],
  },
  {
    id: '9',
    youtubeId: 'iV5rNXgQySg',
    title: 'Teri Baaton',
    artist: 'Arijit Singh',
    description: 'Romantic melody with innovative soundscapes and vocal processing.',
    year: 2023,
    tags: ['Romantic', 'Bollywood', 'Melodic'],
  },
];
