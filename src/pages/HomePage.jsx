import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import TrustBadges from '../components/home/TrustBadges';
import CategorySection from '../components/home/CategorySection';
import AyurvedaBanner from '../components/home/AyurvedaBanner';
import FeaturedProducts from '../components/home/FeaturedProducts';
import api from '../utils/api';

const initialCategories = [
  { _id: 'cat-1', id: 'cat-1', name: 'Immunity & Wellness', slug: 'immunity-wellness', image: '/images/categories/immunity.jpg' },
  { _id: 'cat-2', id: 'cat-2', name: 'Skin & Hair Care', slug: 'skin-hair-care', image: '/images/categories/skin.jpg' },
  { _id: 'cat-3', id: 'cat-3', name: 'Digestive Health', slug: 'digestive-health', image: '/images/categories/digestion.jpg' },
  { _id: 'cat-4', id: 'cat-4', name: 'Energy & Vitality', slug: 'energy-vitality', image: '/images/categories/energy.jpg' },
  { _id: 'cat-5', id: 'cat-5', name: 'Herbal Supplements', slug: 'herbal-supplements', image: '/images/categories/herbal.jpg' }
];

const initialProducts = [
  {
    _id: 'prod-1',
    id: 'prod-1',
    name: 'Herbal Face Cream',
    slug: 'herbal-face-cream',
    price: 500,
    rating: 4.8,
    numReviews: 84,
    images: ['/images/products/face-cream.jpg']
  },
  {
    _id: 'prod-2',
    id: 'prod-2',
    name: 'Hair Nourishing Oil',
    slug: 'hair-nourishing-oil',
    price: 300,
    rating: 4.9,
    numReviews: 120,
    images: ['/images/products/hair-oil.jpg']
  },
  {
    _id: 'prod-3',
    id: 'prod-3',
    name: 'Digestive Care Powder',
    slug: 'digestive-care-powder',
    price: 450,
    rating: 4.7,
    numReviews: 95,
    images: ['/images/products/digestive-powder.jpg']
  },
  {
    _id: 'prod-4',
    id: 'prod-4',
    name: 'Immunity Support Blend',
    slug: 'immunity-support-blend',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.9,
    numReviews: 112,
    images: ['/images/products/immunity-support.jpg']
  }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products/featured').catch(() => null),
          api.get('/categories').catch(() => null)
        ]);

        if (productsRes?.data?.success && productsRes.data.data.length > 0) {
          setFeaturedProducts(productsRes.data.data);
        }

        if (categoriesRes?.data?.success && categoriesRes.data.data.length > 0) {
          setCategories(categoriesRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching home data", error);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col bg-[#FAF6F0]">
      <HeroSection />
      <TrustBadges />
      <CategorySection categories={categories} />
      <AyurvedaBanner />
      <FeaturedProducts products={featuredProducts} />
    </div>
  );
};

export default HomePage;
