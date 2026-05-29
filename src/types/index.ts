export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface PortfolioVideo {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  description: string;
  year: number;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  image?: string;
  rating: number;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  email: string;
  location: string;
  foundedYear: number;
  collaborators: string[];
  socialLinks: {
    youtube: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}
