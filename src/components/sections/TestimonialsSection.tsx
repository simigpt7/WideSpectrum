import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { Star } from 'lucide-react';
import { Section, Container, Card } from '@/components/ui';
import { useInView, useReducedMotion } from '@/hooks';
import { TESTIMONIALS, COLORS } from '@/constants';

export const TestimonialsSection = memo(function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [headerRef, headerInView] = useInView<HTMLDivElement>(0.1);
  const reducedMotion = useReducedMotion();

  // Auto-scroll testimonials
  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, reducedMotion]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <Section id="testimonials" background="default" padding="lg">
      {/* Background Elements */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${COLORS.gold}, transparent)`,
          filter: 'blur(80px)',
        }}
      />

      <Container className="relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-teal-400 uppercase mb-3 block">
            Client Reviews
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            What <span className="gradient-text">Artists Say</span>
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
          {/* Testimonial Cards */}
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 24}px))`,
            }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Card
                  variant="glass"
                  padding="lg"
                  className="text-center relative h-full flex flex-col min-h-[280px]"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        fill={COLORS.aqua}
                        className="text-teal-400"
                      />
                    ))}
                  </div>

                  {/* Quote Mark */}
                  <div
                    className="text-5xl font-serif absolute top-4 left-6 opacity-20"
                    style={{ color: COLORS.teal }}
                  >
                    "
                  </div>

                  {/* Text */}
                  <p className="text-teal-100/80 text-sm md:text-base leading-relaxed mb-6 flex-grow relative z-10">
                    {testimonial.text}
                  </p>

                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.aqua})`,
                    }}
                  >
                    {testimonial.name[0]}
                  </div>
                  <p className="font-bold text-white text-sm">{testimonial.name}</p>
                  <p className="text-teal-400 text-xs">{testimonial.role}</p>
                </Card>
              </div>
            ))}
          </div>

          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#030A0E] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#030A0E] to-transparent pointer-events-none z-10" />
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-teal-400' : 'w-2 bg-teal-800 hover:bg-teal-600'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
});
