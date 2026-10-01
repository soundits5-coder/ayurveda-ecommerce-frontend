import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { LuArrowRight } from 'react-icons/lu';

const OrderSummary = ({ cartItems, shippingCost, onPlaceOrder }) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  return (
    <div className="bg-cream-light p-6 md:p-8 rounded-xl border border-cream-DEFAULT sticky top-24">
      <h2 className="font-heading text-xl font-bold text-dark mb-6">Order Summary</h2>
      
      {/* Items List */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.product._id || item.product.id} className="flex gap-4">
            <div className="w-16 h-16 rounded bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
               {item.product.images && item.product.images.length > 0 ? (
                 <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-2xl">🌿</span>
               )}
            </div>
            <div className="flex-grow flex flex-col justify-center">
              <h4 className="text-sm font-medium text-dark line-clamp-2">{item.product.name}</h4>
              <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
            </div>
            <div className="font-medium text-sm text-dark flex items-center">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3 text-sm text-dark-body mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingCost)}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-end">
        <span className="font-medium text-dark text-lg">Total</span>
        <span className="font-bold text-2xl text-dark">{formatPrice(total)}</span>
      </div>
      
      <button 
        type="submit"
        form="shipping-form" // Triggers form submit
        className="w-full flex items-center justify-center gap-2 py-4 bg-ayurveda text-white font-medium text-lg rounded hover:bg-ayurveda-dark transition-colors"
      >
        Place Order <LuArrowRight />
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-4">
        By placing your order, you agree to our Terms & Conditions.
      </p>
    </div>
  );
};

export default OrderSummary;
