import { Music, Mail, MapPin, Phone, Youtube, Instagram, Linkedin, Twitter } from 'lucide-react';
import Container from '../ui/Container';
import { COMPANY_INFO } from '../../constants/company';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const services = [
    'Music Production',
    'Mixing',
    'Mastering',
    'Film Scoring',
    'Sound Design',
    'Live Sound',
  ];

  const socialLinks = [
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-dark-900 border-t border-white/5">
      {/* Main Footer */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Music className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">Wide Spectrum</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {COMPANY_INFO.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 flex items-center justify-center transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <button
                    onClick={() => handleNavClick('#services')}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-4 w-4 text-primary-400" />
                  <span className="text-sm">{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="h-4 w-4 text-primary-400" />
                  <span className="text-sm">{COMPANY_INFO.location}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-4 w-4 text-primary-400" />
                  <span className="text-sm">Available upon request</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} {COMPANY_INFO.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
