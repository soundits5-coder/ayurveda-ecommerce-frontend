import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

const CategoryListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSlug = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const query = selectedSlug ? `?category=${selectedSlug}` : '';
        const res = await api.get(`/products${query}`);
        if (res.data?.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error(err);
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
                  onClick={() => setSearchParams({})}
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
                      onClick={() => setSearchParams({ category: cat.slug })}
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
                    onClick={() => setSearchParams({ category: cat.slug })}
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
                    onClick={() => setSearchParams({})}
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
                    <button onClick={() => setSearchParams({})} className="mt-4 px-5 py-2 bg-ayurveda text-white text-xs rounded-full">
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
