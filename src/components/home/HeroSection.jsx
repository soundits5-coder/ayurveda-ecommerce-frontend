import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF6F0]">
      {/* Container matching aspect ratio of the hero artwork */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-[#ECE3D5] bg-[#EFE6D8]">
          {/* Main Hero Artwork extracted directly from design */}
          <div className="relative w-full min-h-[360px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[560px] flex items-center">
            
            {/* Background Image */}
            <img 
              src="/images/banners/hero-banner.jpg" 
              alt="Pure Ayurveda for a Healthier You"
              className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
            />

            {/* Gradient wash for mobile readability while keeping artwork visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/90 via-[#FAF6F0]/60 to-transparent sm:via-[#FAF6F0]/30 md:hidden"></div>

            {/* Foreground Content positioned exactly like the design */}
            <div className="relative z-10 max-w-xl pl-6 sm:pl-12 md:pl-16 lg:pl-20 py-8">
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-earth-heading leading-[1.15] tracking-tight">
                Pure Ayurveda <br />
                <span className="font-normal italic">for a Healthier You</span>
              </h1>
              
              <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-earth-body font-light max-w-md leading-relaxed">
                Rooted in tradition. Crafted for your modern life.
              </p>

              <div className="mt-6 sm:mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-ayurveda text-white text-sm sm:text-base font-medium rounded-full shadow-md hover:bg-ayurveda-dark hover:gap-3.5 transition-all duration-200"
                >
                  <span>Explore Products</span>
                  <LuArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
