import { memo } from 'react';
import { useReducedMotion } from '@/hooks';
import { MARQUEE_ITEMS } from '@/constants';

export const MarqueeSection = memo(function MarqueeSection() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  const reducedMotion = useReducedMotion();

  return (
    <div className="overflow-hidden border-y border-teal-900/30 py-5 bg-gradient-to-r from-teal-950/50 via-dark-surface to-teal-950/50 relative">
      {/* Chrome accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div
        className="flex whitespace-nowrap"
        style={{
          animation: reducedMotion ? 'none' : 'marqueeLeft 40s linear linear infinite',
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm font-semibold tracking-[0.25em] text-teal-400/60 uppercase flex items-center gap-6"
          >
            {item}
            <span className="text-gold/40 text-xs">&#9830;</span>
          </span>
        ))}
      </div>
    </div>
  );
});
