import { WaveEQ } from '@/components/features/WaveEQ';
import type { NavItem } from '@/types';

const NAV_ITEMS: NavItem[] = ['services', 'about', 'portfolio', 'testimonials', 'contact'];

interface FooterProps {
  scrollTo: (id: string) => void;
}

export function Footer({ scrollTo }: FooterProps) {
  return (
    <footer className="py-12 px-6 border-t border-teal-900/30 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <WaveEQ bars={5} />
            <img src="/logo.png" alt="Wide Spectrum Productions" className="h-8" />
          </div>

          <div className="flex items-center gap-6 text-xs text-teal-400/40 uppercase tracking-widest flex-wrap justify-center">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="hover:text-teal-400 transition-colors capitalize"
              >
                {item}
              </button>
            ))}
          </div>

          <p className="text-xs text-teal-400/30">
            {new Date().getFullYear()} Wide Spectrum Productions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
