import React, { useState } from 'react';
import { LuSearch, LuClock, LuCalendar } from 'react-icons/lu';

const articles = [
  {
    id: 1,
    title: 'The Power of Ayurveda in Modern Life',
    date: 'Apr 10, 2025',
    readTime: '5 min read',
    category: 'Ayurveda',
    image: '/images/blog/blog-1.jpg',
    excerpt: 'Explore how ancient holistic rituals can bring mental clarity, vitality, and inner peace in the midst of fast-paced modern living.'
  },
  {
    id: 2,
    title: 'How to Build a Natural Skincare Routine',
    date: 'Apr 05, 2025',
    readTime: '4 min read',
    category: 'Beauty',
    image: '/images/blog/blog-2.jpg',
    excerpt: 'Step-by-step Ayurvedic beauty rituals incorporating Kumkumadi oil, rose water, and gentle herbal cleansers for a radiant glow.'
  },
  {
    id: 3,
    title: 'Simple Ayurvedic Tips for Better Sleep',
    date: 'Mar 28, 2025',
    readTime: '6 min read',
    category: 'Wellness',
    image: '/images/blog/blog-3.jpg',
    excerpt: 'Restore natural circadian harmony using warm spiced golden milk, Brahmi teas, and gentle foot massages before bedtime.'
  },
  {
    id: 4,
    title: 'Healthy Gut, Happy You — Ayurvedic Insights',
    date: 'Mar 20, 2025',
    readTime: '4 min read',
    category: 'Lifestyle',
    image: '/images/blog/blog-4.jpg',
    excerpt: 'Unlock the secrets of balanced Agni (digestive fire) and gentle daily detox rituals using Triphala and warm herbal waters.'
  }
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Wellness', 'Ayurveda', 'Lifestyle', 'Beauty'];

  const filtered = articles.filter(art => {
    const matchCat = activeCategory === 'All' || art.category === activeCategory;
    const matchSearch = art.title.toLowerCase().includes(search.toLowerCase()) || art.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching UI Screen 7 */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-earth-heading">
            Wellness Blog
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-earth-muted font-light">
            Tips, insights and ancient wisdom for a healthier you.
          </p>
        </div>

        {/* Search bar matching UI Screen 7 */}
        <div className="relative max-w-md mx-auto mb-6">
          <LuSearch className="absolute left-3.5 top-3 text-earth-muted w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#E8DEC8] rounded-full text-xs text-earth-heading placeholder-earth-muted focus:outline-none focus:border-ayurveda"
          />
        </div>

        {/* Category Pills matching UI Screen 7 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-ayurveda text-white shadow-sm'
                  : 'bg-[#F4EEE5] text-earth-heading hover:bg-[#E8DEC8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles List matching UI Screen 7 */}
        <div className="space-y-4">
          {filtered.map((art) => (
            <article
              key={art.id}
              className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E8DEC8] flex-shrink-0">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/banners/nature-banner.jpg';
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[11px] text-earth-muted mb-1.5">
                  <span className="flex items-center gap-1">
                    <LuCalendar size={12} />
                    {art.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <LuClock size={12} />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="font-heading text-base sm:text-lg font-bold text-earth-heading hover:text-ayurveda transition-colors cursor-pointer mb-1.5">
                  {art.title}
                </h3>

                <p className="text-xs text-earth-body font-light line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
