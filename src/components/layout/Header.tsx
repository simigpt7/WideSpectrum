import { useState, forwardRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { WaveEQ } from '@/components/features/WaveEQ';
import type { NavItem } from '@/types';

const NAV_ITEMS: NavItem[] = ['services', 'about', 'portfolio', 'testimonials', 'contact'];

interface HeaderProps {
  scrollTo: (id: string) => void;
  // Legacy prop kept for any direct usages — ignored when ref-controlled
  scrolled?: boolean;
}

/**
 * Header is forwardRef so App can pass a ref for direct DOM attribute mutation.
 * The [data-scrolled="true"] CSS selector drives all scroll-dependent styles,
 * meaning zero React re-renders happen on scroll (no state, no prop drilling).
 */
export const Header = forwardRef<HTMLDivElement, HeaderProps>(function Header({ scrollTo }, ref) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 right-0 z-50 wsp-header"
      data-scrolled="false"
    >
      <style>{`
        .wsp-header {
          padding-top: 1rem;
          padding-bottom: 1rem;
          background: transparent;
          border-bottom: none;
          transition: padding 500ms ease, background 500ms ease, border-color 500ms ease;
        }
        .wsp-header[data-scrolled="true"] {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          background: rgba(3, 10, 14, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(31, 138, 138, 0.15);
        }
        .wsp-logo {
          height: 2.5rem;
          transition: height 300ms ease;
        }
        .wsp-header[data-scrolled="true"] .wsp-logo {
          height: 2rem;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => scrollTo('home')}
          className="flex items-center gap-3 group"
          aria-label="Go to home"
        >
          <WaveEQ bars={6} />
          <img
            src="/logo.png"
            alt="Wide Spectrum Productions"
            className="wsp-logo"
          />
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <button
                onClick={() => scrollTo(item)}
                className="text-sm font-medium uppercase tracking-widest text-teal-300/70 hover:text-teal-300 transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-teal-400 to-aqua transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
          <li>
            <Button onClick={() => scrollTo('contact')} variant="primary" size="sm">
              Book a Free Consultation
            </Button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-teal-300 p-2 rounded-lg hover:bg-teal-900/30 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-4 flex flex-col gap-4" style={{ background: 'rgba(3, 10, 14, 0.95)' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => { scrollTo(item); setMobileOpen(false); }}
              className="text-left text-sm font-medium uppercase tracking-widest text-teal-300/70 hover:text-teal-300 transition-colors py-2"
            >
              {item}
            </button>
          ))}
          <Button
            onClick={() => { scrollTo('contact'); setMobileOpen(false); }}
            variant="primary"
            className="text-center"
          >
            Book a Free Consultation
          </Button>
        </div>
      </div>
    </nav>
  );
});
