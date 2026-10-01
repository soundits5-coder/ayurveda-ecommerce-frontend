import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuHeart, LuTruck, LuShieldCheck, LuRotateCcw, LuMinus, LuPlus, LuCheck } from 'react-icons/lu';
import { FaStar, FaHeart } from 'react-icons/fa';
import Breadcrumb from '../components/ui/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';

const defaultProduct = {
  _id: 'prod-5',
  id: 'prod-5',
  name: 'Herbal Immunity Blend',
  slug: 'herbal-immunity-blend',
  price: 699,
  originalPrice: 999,
  discount: 30,
  category: { name: 'Immunity & Wellness', slug: 'immunity-wellness' },
  rating: 5.0,
  numReviews: 112,
  description: 'A powerful blend of traditional herbs to support your natural immunity and overall well-being. Made with pure, natural ingredients, this formulation helps you stay active, healthy and balanced.',
  tabDescription: 'This carefully crafted blend combines the goodness of nature to help boost your immunity, improve vitality and support overall health. It is made from time-tested Ayurvedic herbs and is free from artificial additives, preservatives and harmful chemicals.',
  ingredients: 'Ashwagandha (Withania somnifera), Turmeric (Curcuma longa), Black Pepper (Piper nigrum), Ginger (Zingiber officinale), Cardamom (Elettaria cardamomum), Tulsi extract.',
  benefits: [
    'Boosts natural immunity',
    'Improves energy & stamina',
    'Supports overall wellness',
    'Rich in antioxidants'
  ],
  images: [
    '/images/products/immunity-blend-large.jpg',
    '/images/products/thumb-1.jpg',
    '/images/products/thumb-2.jpg',
    '/images/products/thumb-3.jpg'
  ]
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(defaultProduct);
  const [activeImage, setActiveImage] = useState(defaultProduct.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data?.success && res.data.data) {
          const item = res.data.data;
          setProduct({
            ...defaultProduct,
            ...item,
            images: item.images?.length > 0 ? item.images : defaultProduct.images
          });
          setActiveImage(item.images?.[0] || defaultProduct.images[0]);
        }
      } catch (err) {
        // Fallback to default product matching UI
      }
    };
    if (slug && slug !== 'herbal-immunity-blend') {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.category?.name || 'Immunity & Wellness', href: `/shop?category=${product.category?.slug || 'immunity-wellness'}` },
    { label: product.name, href: '#' }
  ];

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumb items={breadcrumbs} />

        {/* Product Showcase matching UI Screen 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6 sm:mt-8">
          
          {/* Left: Product Images Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Main Featured Photo */}
            <div className="w-full aspect-[4/3] sm:aspect-square max-w-md rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#E8DEC8] p-4 flex items-center justify-center shadow-sm">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  e.target.src = '/images/products/immunity-blend.jpg';
                }}
              />
            </div>

            {/* Thumbnails Row */}
            <div className="flex gap-3 mt-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border p-1 bg-[#FDFBF7] transition-all ${
                    activeImage === img 
                      ? 'border-ayurveda ring-2 ring-ayurveda/20 shadow-sm' 
                      : 'border-[#E8DEC8] hover:border-earth-gold'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>

          </div>

          {/* Right: Product Buy Box & Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-earth-heading">
              {product.name}
            </h1>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-[#D99A26]">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-earth-muted">
                ({product.numReviews || 112} reviews)
              </span>
            </div>

            {/* Pricing Section with 30% OFF pill badge */}
            <div className="flex items-center gap-3 mt-4">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-earth-heading">
                ₹ {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-base text-earth-muted line-through font-light">
                  ₹ {product.originalPrice}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-[#2E633B] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-xs sm:text-sm text-earth-body font-light leading-relaxed">
              {product.description}
            </p>

            {/* 3 Pills Row matching UI */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EEE5] border border-[#E8DEC8] text-xs font-medium text-earth-heading">
                <span className="text-earth-gold">🌿</span>
                <span>100% Natural</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EEE5] border border-[#E8DEC8] text-xs font-medium text-earth-heading">
                <span className="text-earth-gold">🚫</span>
                <span>No Added Chemicals</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EEE5] border border-[#E8DEC8] text-xs font-medium text-earth-heading">
                <span className="text-earth-gold">📜</span>
                <span>Ayurvedic Formulation</span>
              </div>
            </div>

            {/* Quantity Selector + Add to Cart + Wishlist button */}
            <div className="flex items-center gap-3.5 mt-7">
              {/* Stepper */}
              <div className="flex items-center border border-earth-border rounded-lg bg-[#FDFBF7] px-2 py-1.5">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-1 text-earth-muted hover:text-earth-heading transition-colors"
                >
                  <LuMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-semibold text-sm text-earth-heading">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1 text-earth-muted hover:text-earth-heading transition-colors"
                >
                  <LuPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-ayurveda text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-ayurveda-dark active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <LuCheck className="w-4 h-4 text-green-300" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>

              {/* Heart button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3 border rounded-lg transition-all shadow-sm ${
                  isInWishlist(product._id || product.id)
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-earth-border bg-[#FDFBF7] text-earth-muted hover:text-red-500 hover:border-red-200'
                }`}
                aria-label="Wishlist"
              >
                {isInWishlist(product._id || product.id) ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <LuHeart className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Shipping & Guarantee badges row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-6 border-t border-[#ECE3D5]">
              <div className="flex items-center gap-2.5">
                <LuTruck className="w-5 h-5 text-earth-gold flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-earth-heading">Free Shipping</span>
                  <span className="text-[10px] text-earth-muted">On orders above ₹999</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <LuShieldCheck className="w-5 h-5 text-earth-gold flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-earth-heading">Secure Payment</span>
                  <span className="text-[10px] text-earth-muted">100% safe & secure</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <LuRotateCcw className="w-5 h-5 text-earth-gold flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-earth-heading">Easy Returns</span>
                  <span className="text-[10px] text-earth-muted">Within 7 days return</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Tabs & Key Benefits Section matching UI Screen 3 */}
        <div className="mt-14 pt-10 border-t border-[#E8DEC8]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Tabs Area (8 cols) */}
            <div className="lg:col-span-8">
              {/* Tab Navigation */}
              <div className="flex space-x-8 border-b border-[#ECE3D5] pb-3 text-sm">
                {['Description', 'Ingredients', 'Benefits', 'Reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-heading text-sm sm:text-base font-semibold transition-colors pb-2 -mb-3 relative ${
                      activeTab === tab
                        ? 'text-ayurveda after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-ayurveda'
                        : 'text-earth-muted hover:text-earth-heading'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-6 text-xs sm:text-sm text-earth-body font-light leading-relaxed">
                {activeTab === 'Description' && (
                  <p>{product.tabDescription || product.description}</p>
                )}
                {activeTab === 'Ingredients' && (
                  <div>
                    <p className="font-semibold mb-2 text-earth-heading">Pure Herbal Extracts:</p>
                    <p>{product.ingredients}</p>
                  </div>
                )}
                {activeTab === 'Benefits' && (
                  <ul className="space-y-2">
                    {product.benefits?.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <LuCheck className="text-ayurveda w-4 h-4" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'Reviews' && (
                  <div className="space-y-4">
                    <div className="bg-[#FDFBF7] p-4 rounded-xl border border-earth-border">
                      <div className="flex items-center gap-1 text-[#D99A26] mb-1">
                        {[...Array(5)].map((_, i) => <FaStar key={i} size={12} />)}
                      </div>
                      <p className="font-semibold text-earth-heading text-xs">Pooja M. — Verified Buyer</p>
                      <p className="text-xs text-earth-body mt-1">Excellent immunity blend. Noticeable increase in energy and stamina within 2 weeks of daily use.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Key Benefits Card matching UI Screen 3 */}
            <div className="lg:col-span-4">
              <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-base font-bold text-earth-heading mb-4">
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {product.benefits?.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-earth-heading font-normal">
                      <span className="text-ayurveda font-bold">✔</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
