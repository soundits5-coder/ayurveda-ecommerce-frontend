import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import QuantitySelector from '../ui/QuantitySelector';
import { LuTrash2 } from 'react-icons/lu';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-gray-200 gap-4 sm:gap-6">
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="w-24 h-24 sm:w-20 sm:h-20 flex-shrink-0 bg-cream-light rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">🌿</span>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <Link to={`/product/${product.slug}`} className="font-heading font-medium text-lg text-dark hover:text-ayurveda transition-colors line-clamp-2 sm:line-clamp-1 mb-1">
          {product.name}
        </Link>
        <div className="text-sm text-gray-500 mb-2">Unit Price: {formatPrice(product.price)}</div>
        
        {/* Mobile controls */}
        <div className="flex sm:hidden items-center justify-between mt-2">
          <QuantitySelector 
            quantity={quantity} 
            onIncrease={() => onUpdateQuantity(product._id || product.id, quantity + 1)}
            onDecrease={() => onUpdateQuantity(product._id || product.id, quantity - 1)}
          />
          <button 
            onClick={() => onRemove(product._id || product.id)}
            className="text-red-500 p-2 hover:bg-red-50 rounded"
          >
            <LuTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop controls */}
      <div className="hidden sm:flex items-center gap-8 flex-shrink-0">
        <QuantitySelector 
          quantity={quantity} 
          onIncrease={() => onUpdateQuantity(product._id || product.id, quantity + 1)}
          onDecrease={() => onUpdateQuantity(product._id || product.id, quantity - 1)}
        />
        <div className="w-24 text-right font-medium text-dark">
          {formatPrice(product.price * quantity)}
        </div>
        <button 
          onClick={() => onRemove(product._id || product.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <LuTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
