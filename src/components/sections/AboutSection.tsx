import { Section } from '../ui/Section';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../../constants/company';
import useInView from '../../hooks/useInView';

const AboutSection = () => {
  const { ref: ref1, isInView: isInView1 } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: ref2, isInView: isInView2 } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <Section id="about" background="gradient">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div
            ref={ref1}
            className={`transition-all duration-700 ${
              isInView1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Crafting Sonic Excellence Since {COMPANY_INFO.foundedYear}
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              At Wide Spectrum Productions, we believe in the power of sound to move,
              inspire, and connect. Our journey has been defined by a relentless pursuit
              of audio perfection and a deep commitment to artist collaboration.
            </p>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              With over a decade of experience, we have had the privilege of working with
              some of the most talented artists in the industry, creating music that
              resonates with millions of listeners worldwide.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  100+
                </div>
                <div className="text-gray-500 text-sm">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  50+
                </div>
                <div className="text-gray-500 text-sm">Artists Collaborated</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  10+
                </div>
                <div className="text-gray-500 text-sm">Years Experience</div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Work With Us
            </Button>
          </div>

          {/* Images */}
          <div
            ref={ref2}
            className={`relative transition-all duration-700 delay-200 ${
              isInView2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/BJ.jpeg"
                  alt="Wide Spectrum Productions Studio"
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
              </div>

              {/* Overlapping Image */}
              <div className="absolute -bottom-6 -right-6 w-48 md:w-64 h-48 md:h-64 rounded-xl overflow-hidden shadow-xl border-4 border-dark-900">
                <img
                  src="/BJ2.jpeg"
                  alt="Studio Equipment"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 left-1/4 w-32 h-32 bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AboutSection;
