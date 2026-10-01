import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';

const AyurvedaBanner = () => {
  return (
    <section className="py-6 sm:py-8 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-[#E6DDD1]">
          
          {/* Banner Artwork Container */}
          <div className="relative w-full min-h-[190px] sm:min-h-[220px] md:min-h-[260px] flex items-center">
            
            {/* Background Image extracted directly from UI design */}
            <img 
              src="/images/banners/ayurveda-daily-life.jpg" 
              alt="The Power of Ayurveda in Your Daily Life"
              className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
            />

            {/* Subtle left gradient overlay for responsive text clarity */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7D3418]/80 via-[#7D3418]/50 to-transparent sm:via-[#7D3418]/30 md:hidden"></div>

            {/* Content matching UI */}
            <div className="relative z-10 pl-6 sm:pl-10 md:pl-14 py-6 max-w-lg">
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                The Power of Ayurveda <br />
                <span className="font-normal italic">in Your Daily Life</span>
              </h2>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-cream-100 font-light leading-relaxed">
                Balanced living. Natural healing. Timeless wisdom.
              </p>

              <div className="mt-4 sm:mt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 bg-[#FAF6F0] text-earth-heading text-xs sm:text-sm font-semibold rounded-full shadow hover:bg-white hover:gap-3 transition-all"
                >
                  <span>Learn More</span>
                  <LuArrowRight className="w-3.5 h-3.5 text-ayurveda" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AyurvedaBanner;
