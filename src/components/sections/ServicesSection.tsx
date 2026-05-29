import { Section, SectionHeader } from '../ui/Section';
import { Card, CardContent, CardTitle } from '../ui/Card';
import { SERVICES } from '../../constants/services';
import useInView from '../../hooks/useInView';

const ServicesSection = () => {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <Section id="services" background="default">
      <SectionHeader
        title="Our Services"
        subtitle="Comprehensive music production services tailored to bring your vision to life"
      />

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((service, index) => (
          <Card
            key={service.id}
            variant="glass"
            hover
            className={`transform transition-all duration-500 ${
              isInView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardContent className="space-y-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border border-primary-500/30">
                <service.icon className="h-6 w-6 text-primary-400" />
              </div>

              {/* Title */}
              <CardTitle className="text-lg">{service.title}</CardTitle>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="text-xs text-gray-500 flex items-start gap-2"
                  >
                    <span className="text-primary-500 mt-1">&#8226;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default ServicesSection;
