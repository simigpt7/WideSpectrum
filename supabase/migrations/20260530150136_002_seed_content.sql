/*
  # Seed Initial Content for Wide Spectrum Productions

  This migration populates the database with initial content
  for services, portfolio, testimonials, and collaborators.
*/

-- Insert Services
INSERT INTO services (title, description, icon_name, features, is_featured, display_order, is_active) VALUES
(
  'Music Production',
  'Full-service music production from concept to final master. We work with artists across all genres to create polished, professional tracks.',
  'Music',
  '["Full arrangement & composition", "Professional recording", "Expert mixing & mastering", "Unlimited revisions"]',
  true,
  1,
  true
),
(
  'Mixing & Mastering',
  'Professional mixing and mastering services to give your tracks the polished, radio-ready sound they deserve.',
  'Volume2',
  '["Industry-standard plugins", "Stem mixing", "Analog warmth", "Multiple format delivery"]',
  true,
  2,
  true
),
(
  'Live Sound Design',
  'Complete live band setup and sound design for concerts, tours, and special events.',
  'Radio',
  '["System design & setup", "Sound check optimization", "Live mixing", "On-site engineering"]',
  true,
  3,
  true
),
(
  'Film Scoring',
  'Original compositions for films, documentaries, and visual media that enhance storytelling.',
  'Film',
  '["Custom composition", "Orchestral arranging", "Sync licensing", "ADR recording"]',
  false,
  4,
  true
),
(
  'Artist Development',
  'Comprehensive programs to develop emerging artists'' sound, brand, and career.',
  'UserPlus',
  '["Sound identity development", "Brand strategy", "Industry connections", "Release planning"]',
  false,
  5,
  true
),
(
  'Sound Design',
  'Custom sound design for commercials, games, and multimedia projects.',
  'Headphones',
  '["Foley recording", "Sound effects creation", "Spatial audio", "Interactive audio"]',
  false,
  6,
  true
),
(
  'Jingle Production',
  'Catchy, memorable jingles for brands and advertising campaigns.',
  'Music2',
  '["Concept development", "Quick turnaround", "Multiple variations", "Clearance assistance"]',
  false,
  7,
  true
),
(
  'Audio Post-Production',
  'Complete audio post-services for film, TV, and digital content.',
  'Mic',
  '["Dialogue editing", "ADR", "Sound effects editing", "Final mix"]',
  false,
  8,
  true
);

-- Insert Portfolio Items
INSERT INTO portfolio_items (youtube_id, title, artist, description, category, display_order, is_featured, is_active) VALUES
('G-XMiVMlLRI', 'Dance Meri Rani', 'Nora Fatehi', 'A high-energy dance track showcasing infectious beats and modern production.', 'music', 1, true, true),
('qutnNui6Jzc', 'Sin Denim', 'Artist', 'Commercial production with a contemporary edge.', 'commercial', 2, true, true),
('a8dzL0rXRKE', 'Skoda Campaign', 'Skoda', 'Brand jingle and background score for automotive advertisement.', 'commercial', 3, true, true),
('dH4ArcqAL3Y', 'Lakeerein', 'Artist', 'Melodic composition blending traditional elements with modern production.', 'music', 4, true, true),
('oEBC1Or8teQ', 'Jind Mahiya', 'Artist', 'Romantic ballad with lush arrangements.', 'music', 5, true, true),
('qO_facOiG14', 'Mita Do', 'Dhvani Bhanushali', 'Popular track with memorable hooks and polished production.', 'music', 6, true, true),
('p7IaOANvMOc', 'Kripayale', 'Artist', 'Devotional track with serene production.', 'music', 7, true, true),
('wL_gLi4KLtg', 'Jhoom Baba', 'Artist', 'Upbeat track with dynamic arrangement.', 'music', 8, true, true),
('iV5rNXgQySg', 'Teri Baaton', 'Artist', 'Romantic number with modern sound design.', 'music', 9, true, true);

-- Insert Testimonials
INSERT INTO testimonials (text, client_name, client_role, client_company, rating, display_order, is_active) VALUES
(
  'Wide Spectrum Productions transformed my vision into reality. Benny''s expertise in music production brought a level of professionalism that exceeded all expectations.',
  'Arijit Singh',
  'Playback Singer',
  'Bollywood',
  5,
  1,
  true
),
(
  'Working with WSP was an absolute pleasure. They understand the nuances of modern music production while respecting traditional elements.',
  'Tanishk Bagchi',
  'Music Composer',
  'Bollywood',
  5,
  2,
  true
),
(
  'Benny and his team delivered exceptional quality. The mixing and mastering services gave my tracks the radio-ready polish they needed.',
  'Dhvani Bhanushali',
  'Singer',
  'Bollywood',
  5,
  3,
  true
),
(
  'The live sound design for our tour was impeccable. Every venue, every show – the sound was always perfect.',
  'Jubin Nautiyal',
  'Playback Singer',
  'Bollywood',
  5,
  4,
  true
),
(
  'From composition to final master, WSP handles everything with remarkable attention to detail. Highly recommended!',
  'Sunny M.R.',
  'Music Producer',
  'Bollywood',
  5,
  5,
  true
),
(
  'Their film scoring work brought our movie to life. The emotional depth in the music elevated every scene.',
  'Film Director',
  'Director',
  'Independent Film',
  5,
  6,
  true
);

-- Insert Collaborators
INSERT INTO collaborators (name, profession, display_order, is_active) VALUES
('Arijit Singh', 'Playback Singer', 1, true),
('Tanishk Bagchi', 'Music Composer', 2, true),
('Dhvani Bhanushali', 'Singer', 3, true),
('Nora Fatehi', 'Actor & Dancer', 4, true),
('Jubin Nautiyal', 'Playback Singer', 5, true),
('Sunny M.R.', 'Music Producer', 6, true),
('Hardik Pandya', 'Cricketer', 7, true);

-- Insert About Content
INSERT INTO about_content (section, title, content, is_active) VALUES
(
  'mission',
  'Our Mission',
  'At Wide Spectrum Productions, we believe every sound tells a story. Founded by Benny John, our studio bridges the gap between artistic vision and sonic excellence. We''re not just producers; we''re partners in your creative journey.',
  true
),
(
  'approach',
  'Our Approach',
  'From intimate acoustic sessions to full-scale Bollywood productions, we handle projects across the spectrum. Our expertise spans music production, mixing, mastering, live sound design, and film scoring.',
  true
);

-- Insert Site Settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"Wide Spectrum Productions"', 'Website name'),
('contact_email', '"WideSpectrumProductions@gmail.com"', 'Primary contact email'),
('social_youtube', '"https://www.youtube.com/playlist?list=PLhNh5CSWfM_SI-ds5c3NV-s9JbCHlyidr"', 'YouTube playlist URL'),
('social_instagram', '"https://www.instagram.com/wide_spectrum_productions/"', 'Instagram profile URL'),
('social_imdb', '"https://www.imdb.com/name/nm17141531/"', 'IMDb profile URL'),
('location', '"Mumbai, Maharashtra, India"', 'Business location');
