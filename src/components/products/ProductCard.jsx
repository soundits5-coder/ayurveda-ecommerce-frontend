import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { LuHeart } from 'react-icons/lu';
import { FaStar, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFav = isInWishlist(product?._id || product?.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imageSrc = product.images?.[0] || product.image || '/images/products/immunity-blend.jpg';

  return (
    <div className="group flex flex-col bg-[#FDFBF7] border border-[#EBE3D7] rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:border-earth-gold/40 hover:-translate-y-1">
      
      {/* Product Image Container */}
      <Link to={`/product/${product.slug || product._id || product.id}`} className="relative block w-full aspect-square rounded-xl overflow-hidden bg-[#FAF6F0] mb-3.5 flex items-center justify-center p-3 border border-[#EFE7DD]">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/products/immunity-blend.jpg';
          }}
        />

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all shadow-sm ${
            isFav
              ? 'bg-red-50 border-red-200 text-red-500 scale-105'
              : 'bg-white/90 border-earth-border text-earth-muted hover:text-red-500 hover:border-red-200'
          }`}
          aria-label={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {isFav ? <FaHeart className="w-3.5 h-3.5 text-red-500" /> : <LuHeart className="w-3.5 h-3.5" />}
        </button>

        {/* Discount Badge if available */}
        {product.discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#2E633B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.discount}% OFF
          </span>
        )}
      </Link>

      {/* Product Meta */}
      <div className="flex flex-col flex-grow">
        <Link to={`/product/${product.slug || product._id || product.id}`}>
          <h3 className="font-heading text-sm sm:text-base font-semibold text-earth-heading group-hover:text-ayurveda transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Price & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-earth-heading font-heading">
              ₹ {product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-earth-muted line-through">
                ₹ {product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-earth-muted">
            <FaStar className="w-3 h-3 text-[#D99A26]" />
            <span className="font-medium text-earth-heading">
              {product.rating || 4.8}
            </span>
            <span>({product.numReviews || 84})</span>
          </div>
        </div>

        {/* Add to Cart Button matching UI */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-auto py-2.5 px-4 bg-ayurveda text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:bg-ayurveda-dark active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
