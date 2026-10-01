import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';

const defaultCategories = [
  { id: 'cat-1', name: 'Immunity & Wellness', slug: 'immunity-wellness', image: '/images/categories/immunity.jpg' },
  { id: 'cat-2', name: 'Skin & Hair Care', slug: 'skin-hair-care', image: '/images/categories/skin.jpg' },
  { id: 'cat-3', name: 'Digestive Health', slug: 'digestive-health', image: '/images/categories/digestion.jpg' },
  { id: 'cat-4', name: 'Energy & Vitality', slug: 'energy-vitality', image: '/images/categories/energy.jpg' },
  { id: 'cat-5', name: 'Herbal Supplements', slug: 'herbal-supplements', image: '/images/categories/herbal.jpg' },
];

const CategorySection = ({ categories }) => {
  const displayCats = categories && categories.length >= 5 ? categories.slice(0, 5) : defaultCategories;

  return (
    <section className="py-12 sm:py-16 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-3">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-earth-heading tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm md:text-base text-earth-muted font-light">
              Explore our thoughtfully curated categories for your complete well-being.
            </p>
          </div>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-earth-heading hover:text-ayurveda transition-colors group"
          >
            <span>View All</span>
            <LuArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5 Category Cards matching UI */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {displayCats.map((cat, idx) => (
            <Link
              key={cat._id || cat.id || idx}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center bg-[#F4EEE5] border border-[#E8DEC8]/60 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-earth-gold/40 hover:-translate-y-1 text-center"
            >
              {/* Botanical circular photo container */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white/70 shadow-inner p-1 mb-3.5 flex items-center justify-center">
                <img
                  src={cat.image || defaultCategories[idx % defaultCategories.length].image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = defaultCategories[idx % defaultCategories.length].image;
                  }}
                />
              </div>

              <h3 className="font-heading text-xs sm:text-sm font-semibold text-earth-heading group-hover:text-ayurveda transition-colors leading-snug">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
