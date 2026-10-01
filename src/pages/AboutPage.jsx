import React from 'react';
import { Link } from 'react-router-dom';
import { LuSparkles, LuBookOpen, LuHeart, LuLeaf } from 'react-icons/lu';

const AboutPage = () => {
  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching UI Screen 6 */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-earth-heading">
            About Us
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-earth-muted font-light italic">
            Rooted in Tradition, Driven by Wellness
          </p>
        </div>

        {/* Our Story Card with Image */}
        <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Story Text */}
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-heading text-2xl font-bold text-earth-heading">
                Our Story
              </h2>
              <p className="text-xs sm:text-sm text-earth-body font-light leading-relaxed">
                At AyurVeda, we believe in the timeless wisdom of nature. Our journey began with a simple mission: to bring the healing power of Ayurveda into modern everyday life.
              </p>
              <p className="text-xs sm:text-sm text-earth-body font-light leading-relaxed">
                We source the finest wild-harvested herbs, seeds, and oils, combining them with authentic Vedic knowledge to create pure, effective, and sustainable wellness formulations for you and your loved ones.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-block px-6 py-2.5 bg-ayurveda text-white rounded-full text-xs font-semibold shadow hover:bg-ayurveda-dark transition-all"
                >
                  Explore Remedies
                </Link>
              </div>
            </div>

            {/* Story Image matching UI */}
            <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E8DEC8] shadow-inner p-1">
              <img
                src="/images/about/our-story.jpg"
                alt="Our Ayurvedic Heritage"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/banners/hero-banner.jpg';
                }}
              />
            </div>

          </div>
        </div>

        {/* Our Values matching UI Screen 6 */}
        <div className="text-center mb-8">
          <h3 className="font-heading text-xl font-bold text-earth-heading mb-6">
            Our Values
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl p-4 flex flex-col items-center text-center">
              <LuSparkles className="w-6 h-6 text-earth-gold mb-2" />
              <span className="text-xs font-semibold text-earth-heading">Purity</span>
              <span className="text-[10px] text-earth-muted mt-0.5">100% pure organic extracts</span>
            </div>
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl p-4 flex flex-col items-center text-center">
              <LuBookOpen className="w-6 h-6 text-earth-gold mb-2" />
              <span className="text-xs font-semibold text-earth-heading">Tradition</span>
              <span className="text-[10px] text-earth-muted mt-0.5">Authentic Vedic texts</span>
            </div>
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl p-4 flex flex-col items-center text-center">
              <LuHeart className="w-6 h-6 text-earth-gold mb-2" />
              <span className="text-xs font-semibold text-earth-heading">Wellness</span>
              <span className="text-[10px] text-earth-muted mt-0.5">Holistic mind & body</span>
            </div>
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl p-4 flex flex-col items-center text-center">
              <LuLeaf className="w-6 h-6 text-earth-gold mb-2" />
              <span className="text-xs font-semibold text-earth-heading">Sustainability</span>
              <span className="text-[10px] text-earth-muted mt-0.5">Eco-friendly practices</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
