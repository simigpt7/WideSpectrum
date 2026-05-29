import { Section, SectionHeader } from '../ui/Section';
import ContactForm from '../features/ContactForm';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { COMPANY_INFO } from '../../constants/company';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: COMPANY_INFO.email,
      href: `mailto:${COMPANY_INFO.email}`,
    },
    {
      icon: MapPin,
      title: 'Location',
      value: COMPANY_INFO.location,
      href: '#',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: 'Available upon request',
      href: '#',
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Within 24-48 hours',
      href: '#',
    },
  ];

  return (
    <Section id="contact" background="default">
      <SectionHeader
        title="Get in Touch"
        subtitle="Ready to bring your musical vision to life? Contact us today"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Contact Form */}
        <div className="order-2 lg:order-1">
          <ContactForm />
        </div>

        {/* Contact Info */}
        <div className="order-1 lg:order-2 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Let's Create Together
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Whether you have a project in mind or just want to explore possibilities,
              we would love to hear from you. Fill out the form and we will get back
              to you within 24-48 hours.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map((info) => (
              <a
                key={info.title}
                href={info.href}
                className="p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:bg-dark-700/50 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors duration-300">
                    <info.icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{info.title}</p>
                    <p className="text-white font-medium text-sm">
                      {info.value}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Working Hours */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20">
            <h4 className="text-white font-semibold mb-2">Working Hours</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p>Monday - Friday: 10:00 AM - 7:00 PM IST</p>
              <p>Saturday: 11:00 AM - 5:00 PM IST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>

          {/* Quick Note */}
          <div className="text-sm text-gray-500">
            <p>
              * For urgent inquiries, mention it in your message and we will
              prioritize your request.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ContactSection;
