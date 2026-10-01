import React from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import ProductCard from '../products/ProductCard';

const fallbackProducts = [
  {
    _id: 'prod-1',
    name: 'Herbal Face Cream',
    slug: 'herbal-face-cream',
    price: 500,
    rating: 4.8,
    numReviews: 84,
    images: ['/images/products/face-cream.jpg']
  },
  {
    _id: 'prod-2',
    name: 'Hair Nourishing Oil',
    slug: 'hair-nourishing-oil',
    price: 300,
    rating: 4.9,
    numReviews: 120,
    images: ['/images/products/hair-oil.jpg']
  },
  {
    _id: 'prod-3',
    name: 'Digestive Care Powder',
    slug: 'digestive-care-powder',
    price: 450,
    rating: 4.7,
    numReviews: 95,
    images: ['/images/products/digestive-powder.jpg']
  },
  {
    _id: 'prod-4',
    name: 'Immunity Support Blend',
    slug: 'immunity-support-blend',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.9,
    numReviews: 112,
    images: ['/images/products/immunity-support.jpg']
  },
];

const FeaturedProducts = ({ products }) => {
  const displayProducts = products && products.length >= 4 ? products.slice(0, 4) : fallbackProducts;

  return (
    <section className="py-12 sm:py-16 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 gap-3">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-earth-heading tracking-tight">
              Featured Products
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm md:text-base text-earth-muted font-light">
              Handpicked for your health and wellness.
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

        {/* 4 Cards Grid matching UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
