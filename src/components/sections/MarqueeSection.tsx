import { COMPANY_INFO } from '../../constants/company';

const MarqueeSection = () => {
  const collaborators = [...COMPANY_INFO.collaborators, ...COMPANY_INFO.collaborators];

  return (
    <section className="py-8 md:py-12 bg-dark-900 border-y border-white/5 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {collaborators.map((collaborator, index) => (
            <div
              key={`${collaborator}-${index}`}
              className="flex items-center gap-2 px-6 text-gray-400 whitespace-nowrap"
            >
              <span className="text-lg md:text-xl font-medium hover:text-white transition-colors duration-300 cursor-default">
                {collaborator}
              </span>
              <span className="text-primary-500 text-2xl">&bull;</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarqueeSection;
