import React from 'react';

const TrustBadges = () => {
  const badges = [
    {
      title: '100% Natural',
      subtitle: 'Ingredients',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8 text-earth-gold">
          <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11C3 6.03 7.03 2 12 2z"/>
          <path d="M12 6c-3 3-3 7 0 10 3-3 3-7 0-10z" fill="currentColor" fillOpacity="0.15"/>
        </svg>
      )
    },
    {
      title: 'Authentic',
      subtitle: 'Ayurvedic Formulas',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8 text-earth-gold">
          <path d="M4 11h16c0 5-3.5 9-8 9s-8-4-8-9z"/>
          <path d="M9 11V6a2 2 0 0 1 4 0v5"/>
          <path d="M2 11h20"/>
        </svg>
      )
    },
    {
      title: 'No Harmful',
      subtitle: 'Chemicals',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8 text-earth-gold">
          <path d="M10 2v5L5 16a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3l-5-9V2"/>
          <line x1="8" y1="2" x2="16" y2="2"/>
          <line x1="4" y1="4" x2="20" y2="20" strokeWidth="1.8"/>
        </svg>
      )
    },
    {
      title: 'Sustainable',
      subtitle: 'Practices',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8 text-earth-gold">
          <path d="M7 19a6 6 0 0 1-4-5.5 6 6 0 0 1 6-6c1.5 0 2.8.5 3.8 1.4"/>
          <path d="M17 5a6 6 0 0 1 4 5.5 6 6 0 0 1-6 6c-1.5 0-2.8-.5-3.8-1.4"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
        </svg>
      )
    },
    {
      title: 'Trusted',
      subtitle: 'for Generations',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-8 h-8 text-earth-gold">
          <circle cx="12" cy="9" r="6"/>
          <path d="M15.5 13.5L18 22l-6-3-6 3 2.5-8.5"/>
          <path d="M9 9l2 2 4-4"/>
        </svg>
      )
    },
  ];

  return (
    <section className="bg-[#FAF6F0] py-8 sm:py-10 border-b border-[#ECE3D5]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2 group">
              <div className="p-2 transition-transform duration-300 group-hover:-translate-y-0.5">
                {badge.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold text-earth-heading leading-tight">
                  {badge.title}
                </span>
                <span className="text-[11px] sm:text-xs text-earth-muted font-normal leading-tight">
                  {badge.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
