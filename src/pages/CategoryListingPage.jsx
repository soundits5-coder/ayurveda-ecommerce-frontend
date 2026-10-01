import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import Breadcrumb from '../components/ui/Breadcrumb';
import ProductCard from '../components/products/ProductCard';
import api from '../utils/api';

const categoriesList = [
  { id: 'cat-1', name: 'Immunity & Wellness', slug: 'immunity-wellness', count: '12 Products', image: '/images/categories/cat-grid-immunity.jpg' },
  { id: 'cat-2', name: 'Skin & Hair Care', slug: 'skin-hair-care', count: '18 Products', image: '/images/categories/cat-grid-skin.jpg' },
  { id: 'cat-3', name: 'Digestive Health', slug: 'digestive-health', count: '10 Products', image: '/images/categories/cat-grid-digestive.jpg' },
  { id: 'cat-4', name: 'Energy & Vitality', slug: 'energy-vitality', count: '8 Products', image: '/images/categories/cat-grid-energy.jpg' },
  { id: 'cat-5', name: 'Herbal Supplements', slug: 'herbal-supplements', count: '15 Products', image: '/images/categories/cat-grid-herbal.jpg' },
  { id: 'cat-6', name: 'Personal Care', slug: 'personal-care', count: '9 Products', image: '/images/categories/cat-grid-personal.jpg' },
  { id: 'cat-7', name: 'Wellness Kits', slug: 'wellness-kits', count: '6 Products', image: '/images/products/immunity-support.jpg' },
];

export const allMockProducts = [
  {
    _id: 'prod-1',
    id: 'prod-1',
    name: 'Herbal Face Cream',
    slug: 'herbal-face-cream',
    description: 'A deeply hydrating natural cream for radiant, glowing skin crafted with Aloe Vera and Sandalwood.',
    price: 500,
    originalPrice: 650,
    discount: 23,
    category: { _id: 'cat-2', name: 'Skin & Hair Care', slug: 'skin-hair-care' },
    isFeatured: true,
    rating: 4.8,
    numReviews: 84,
    images: ['/images/products/face-cream.jpg']
  },
  {
    _id: 'prod-2',
    id: 'prod-2',
    name: 'Hair Nourishing Oil',
    slug: 'hair-nourishing-oil',
    description: 'Traditional Ayurvedic formulation enriched with Bhringraj and Amla for thick, lustrous hair.',
    price: 300,
    originalPrice: 400,
    discount: 25,
    category: { _id: 'cat-2', name: 'Skin & Hair Care', slug: 'skin-hair-care' },
    isFeatured: true,
    rating: 4.9,
    numReviews: 120,
    images: ['/images/products/hair-oil.jpg']
  },
  {
    _id: 'prod-3',
    id: 'prod-3',
    name: 'Digestive Care Powder',
    slug: 'digestive-care-powder',
    description: 'Ancient Ayurvedic blend designed to promote gentle digestion and balanced gut health.',
    price: 450,
    originalPrice: 550,
    discount: 18,
    category: { _id: 'cat-3', name: 'Digestive Health', slug: 'digestive-health' },
    isFeatured: true,
    rating: 4.7,
    numReviews: 95,
    images: ['/images/products/digestive-powder.jpg']
  },
  {
    _id: 'prod-4',
    id: 'prod-4',
    name: 'Immunity Support Blend',
    slug: 'immunity-support-blend',
    description: 'Potent immunity booster blend of wild-harvested Giloy, Tulsi, and organic Ashwagandha.',
    price: 699,
    originalPrice: 999,
    discount: 30,
    category: { _id: 'cat-1', name: 'Immunity & Wellness', slug: 'immunity-wellness' },
    isFeatured: true,
    rating: 4.9,
    numReviews: 112,
    images: ['/images/products/immunity-support.jpg']
  },
  {
    _id: 'prod-5',
    id: 'prod-5',
    name: 'Herbal Immunity Blend',
    slug: 'herbal-immunity-blend',
    description: 'A powerful blend of traditional herbs to support your natural immunity and overall well-being.',
    price: 699,
    originalPrice: 999,
    discount: 30,
    category: { _id: 'cat-1', name: 'Immunity & Wellness', slug: 'immunity-wellness' },
    isFeatured: true,
    rating: 5.0,
    numReviews: 112,
    images: ['/images/products/immunity-blend.jpg']
  },
  {
    _id: 'prod-6',
    id: 'prod-6',
    name: 'Ashwagandha Vitality Gold',
    slug: 'ashwagandha-vitality-gold',
    description: 'Pure Himalayan Ashwagandha root extract to recharge stamina, relieve stress and enhance natural energy.',
    price: 549,
    originalPrice: 799,
    discount: 31,
    category: { _id: 'cat-4', name: 'Energy & Vitality', slug: 'energy-vitality' },
    isFeatured: true,
    rating: 4.9,
    numReviews: 87,
    images: ['/images/categories/energy.jpg']
  },
  {
    _id: 'prod-7',
    id: 'prod-7',
    name: 'Pure Shilajit Resin',
    slug: 'pure-shilajit-resin',
    description: '100% natural purified Grade-A Himalayan Shilajit resin with 75%+ Fulvic Acid for strength and endurance.',
    price: 899,
    originalPrice: 1299,
    discount: 30,
    category: { _id: 'cat-4', name: 'Energy & Vitality', slug: 'energy-vitality' },
    isFeatured: true,
    rating: 4.9,
    numReviews: 154,
    images: ['/images/categories/energy.jpg']
  },
  {
    _id: 'prod-8',
    id: 'prod-8',
    name: 'Triphala Gut Cleanse Capsules',
    slug: 'triphala-gut-cleanse',
    description: 'Classic three-fruit formulation (Amla, Haritaki, Bibhitaki) for natural colon cleanse and gut balance.',
    price: 399,
    originalPrice: 499,
    discount: 20,
    category: { _id: 'cat-3', name: 'Digestive Health', slug: 'digestive-health' },
    isFeatured: false,
    rating: 4.8,
    numReviews: 63,
    images: ['/images/categories/digestion.jpg']
  },
  {
    _id: 'prod-9',
    id: 'prod-9',
    name: 'Organic Moringa Green Powder',
    slug: 'organic-moringa-powder',
    description: 'Nutrient-rich superfood powder loaded with essential vitamins, iron, and plant-based antioxidants.',
    price: 349,
    originalPrice: 450,
    discount: 22,
    category: { _id: 'cat-5', name: 'Herbal Supplements', slug: 'herbal-supplements' },
    isFeatured: false,
    rating: 4.7,
    numReviews: 52,
    images: ['/images/categories/herbal.jpg']
  },
  {
    _id: 'prod-10',
    id: 'prod-10',
    name: 'Brahmi Memory & Focus Tonic',
    slug: 'brahmi-memory-focus',
    description: 'Ancient medhya rasayana to enhance concentration, mental alertness and calm everyday cognitive fatigue.',
    price: 499,
    originalPrice: 650,
    discount: 23,
    category: { _id: 'cat-5', name: 'Herbal Supplements', slug: 'herbal-supplements' },
    isFeatured: false,
    rating: 4.8,
    numReviews: 76,
    images: ['/images/categories/herbal.jpg']
  },
  {
    _id: 'prod-11',
    id: 'prod-11',
    name: 'Neem & Basil Cleansing Bar',
    slug: 'neem-basil-cleansing-bar',
    description: 'Handcrafted cold-pressed herbal soap with pure neem oil and holy basil extract for blemish-free skin.',
    price: 199,
    originalPrice: 250,
    discount: 20,
    category: { _id: 'cat-6', name: 'Personal Care', slug: 'personal-care' },
    isFeatured: false,
    rating: 4.9,
    numReviews: 110,
    images: ['/images/categories/personal.jpg']
  },
  {
    _id: 'prod-12',
    id: 'prod-12',
    name: 'Kumkumadi Ayurvedic Face Glow Serum',
    slug: 'kumkumadi-face-glow-serum',
    description: 'Pure saffron miracle beauty oil formulated as per Ashtanga Hrudaya for youthful, luminous skin tone.',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    category: { _id: 'cat-2', name: 'Skin & Hair Care', slug: 'skin-hair-care' },
    isFeatured: true,
    rating: 5.0,
    numReviews: 142,
    images: ['/images/categories/skin.jpg']
  },
  {
    _id: 'prod-13',
    id: 'prod-13',
    name: 'Holistic Daily Wellness Kit',
    slug: 'holistic-daily-wellness-kit',
    description: 'Complete 30-day Ayurveda regimen bundle including Herbal Tea, Chyawanprash, and Immunity Blend.',
    price: 1499,
    originalPrice: 2199,
    discount: 31,
    category: { _id: 'cat-7', name: 'Wellness Kits', slug: 'wellness-kits' },
    isFeatured: true,
    rating: 4.9,
    numReviews: 98,
    images: ['/images/categories/kits.jpg']
  },
];

const CategoryListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();
  const selectedSlug = routeParams.slug || searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectCategory = (slug) => {
    if (!slug) {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${slug}`);
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const query = selectedSlug ? `?category=${selectedSlug}` : '';
        const res = await api.get(`/products${query}`);
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setProducts(res.data.data);
        } else {
          // If server returned empty or is offline, filter from comprehensive client catalog
          if (selectedSlug) {
            const clientFiltered = allMockProducts.filter(
              p => p.category?.slug === selectedSlug || p.category?._id === selectedSlug
            );
            setProducts(clientFiltered);
          } else {
            setProducts(allMockProducts);
          }
        }
      } catch (err) {
        // Fallback gracefully when API is unreachable
        if (selectedSlug) {
          const clientFiltered = allMockProducts.filter(
            p => p.category?.slug === selectedSlug || p.category?._id === selectedSlug
          );
          setProducts(clientFiltered);
        } else {
          setProducts(allMockProducts);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [selectedSlug]);

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(selectedSlug ? [{ label: categoriesList.find(c => c.slug === selectedSlug)?.name || 'Category', href: '#' }] : [])
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumb items={breadcrumbs} />

        {/* Page Heading */}
        <div className="my-6 sm:my-8">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-earth-heading">
            Shop by Category
          </h1>
          <p className="mt-2 text-sm sm:text-base text-earth-muted font-light">
            Discover natural care for every part of your well-being.
          </p>
        </div>

        {/* Two Column Layout matching UI Screen 2 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* Left Sidebar: All Categories Radio List */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-5 shadow-sm">
              <h3 className="font-heading text-base font-semibold text-earth-heading pb-3 mb-3 border-b border-[#ECE3D5]">
                All Categories
              </h3>

              <div className="space-y-1.5">
                <button
                  onClick={() => handleSelectCategory('')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                    !selectedSlug 
                      ? 'bg-ayurveda text-white font-semibold shadow-sm' 
                      : 'text-earth-heading hover:bg-[#F4EEE5]'
                  }`}
                >
                  <span>All Remedies</span>
                  <span className="text-[11px] opacity-75">All</span>
                </button>

                {categoriesList.map((cat) => {
                  const isActive = selectedSlug === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                        isActive 
                          ? 'bg-ayurveda text-white font-semibold shadow-sm' 
                          : 'text-earth-heading hover:bg-[#F4EEE5]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[11px] opacity-75 ml-2 flex-shrink-0">{cat.count.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Content: Category Visual Grid or Filtered Products */}
          <div className="flex-1 flex flex-col">
            {!selectedSlug ? (
              /* Visual Category Cards Grid (Screen 2) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoriesList.slice(0, 6).map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="group cursor-pointer bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:border-earth-gold/50 flex flex-col items-center text-center"
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0] mb-3.5 flex items-center justify-center p-2">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/categories/immunity.jpg';
                        }}
                      />
                    </div>
                    <h3 className="font-heading text-sm sm:text-base font-semibold text-earth-heading group-hover:text-ayurveda transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-earth-muted mt-1 font-light">
                      {cat.count}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Products List for Selected Category */
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-xl font-bold text-earth-heading">
                    {categoriesList.find(c => c.slug === selectedSlug)?.name || 'Products'}
                  </h2>
                  <button 
                    onClick={() => handleSelectCategory('')}
                    className="text-xs text-earth-gold hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>

                {loading ? (
                  <div className="py-20 text-center text-earth-muted">Loading authentic formulations...</div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map(p => (
                      <ProductCard key={p._id || p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#FDFBF7] p-10 rounded-2xl text-center border border-earth-border">
                    <p className="text-earth-heading font-medium">No formulations found for this category.</p>
                    <button onClick={() => handleSelectCategory('')} className="mt-4 px-5 py-2 bg-ayurveda text-white text-xs rounded-full">
                      View All Products
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Promotional Green Banner (Screen 2) */}
            <div className="mt-10 relative w-full rounded-2xl overflow-hidden shadow-sm border border-[#234A29]">
              <div className="relative w-full min-h-[160px] sm:min-h-[180px] flex items-center bg-[#1B3B22]">
                <img 
                  src="/images/banners/nature-banner.jpg" 
                  alt="Nature's Goodness for a Balanced Life"
                  className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
                />
                
                <div className="relative z-10 pl-6 sm:pl-10 py-6 max-w-md">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                    Nature's Goodness <br />
                    <span className="font-normal italic">for a Balanced Life</span>
                  </h3>
                  <p className="mt-1.5 text-xs text-cream-200/80 font-light">
                    Pure. Safe. Effective.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => setSearchParams({})}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-white text-earth-heading text-xs font-semibold rounded-full shadow hover:bg-[#FAF6F0] transition-colors"
                    >
                      <span>Explore All Products</span>
                      <LuArrowRight className="w-3.5 h-3.5 text-ayurveda" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CategoryListingPage;
