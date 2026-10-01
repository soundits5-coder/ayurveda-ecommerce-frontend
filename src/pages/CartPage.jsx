import React from 'react';
import { Link } from 'react-router-dom';
import { LuMinus, LuPlus, LuX, LuArrowRight, LuArrowLeft, LuShoppingBag } from 'react-icons/lu';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const items = cartItems;

  const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-earth-heading">
            Your Cart
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-earth-muted font-light">
            Review your items before checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#FDFBF7] border border-earth-border rounded-2xl p-12 text-center">
            <LuShoppingBag className="w-12 h-12 text-earth-muted mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold text-earth-heading">Your cart is empty</h2>
            <p className="text-earth-muted text-xs sm:text-sm mt-1">Explore our Ayurvedic remedies to nourish your wellness.</p>
            <Link to="/shop" className="inline-block mt-6 px-6 py-2.5 bg-ayurveda text-white rounded-full text-xs font-semibold">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl overflow-hidden shadow-sm">
            
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#F5EFEB] border-b border-[#ECE3D5] text-xs font-semibold text-earth-muted uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-[#ECE3D5]">
              {items.map((item, idx) => {
                const prod = item.product || {};
                const lineTotal = (prod.price || 0) * item.quantity;
                const pId = prod._id || prod.id;

                return (
                  <div key={pId || idx} className="p-4 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                    
                    {/* Product thumbnail & title */}
                    <div className="col-span-6 w-full flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl bg-[#FAF6F0] border border-[#E8DEC8] p-1.5 flex items-center justify-center flex-shrink-0">
                        <img
                          src={prod.images?.[0] || prod.image || '/images/products/immunity-blend.jpg'}
                          alt={prod.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            e.target.src = '/images/products/immunity-blend.jpg';
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading text-sm sm:text-base font-semibold text-earth-heading leading-snug">
                          {prod.name}
                        </span>
                        <span className="text-[11px] text-earth-muted">
                          ₹ {prod.price}
                        </span>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 hidden sm:block text-center text-sm text-earth-heading font-medium">
                      ₹ {prod.price}
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-earth-border rounded-lg bg-white px-2 py-1">
                        <button
                          onClick={() => updateQuantity(pId, Math.max(1, item.quantity - 1))}
                          className="p-1 text-earth-muted hover:text-earth-heading"
                        >
                          <LuMinus size={12} />
                        </button>
                        <span className="w-7 text-center font-semibold text-xs text-earth-heading">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(pId, item.quantity + 1)}
                          className="p-1 text-earth-muted hover:text-earth-heading"
                        >
                          <LuPlus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 text-right">
                      <span className="text-sm font-bold text-earth-heading font-heading">
                        ₹ {lineTotal}
                      </span>
                      <button
                        onClick={() => removeFromCart(pId)}
                        className="text-earth-muted hover:text-red-500 p-1 transition-colors"
                        title="Remove item"
                      >
                        <LuX size={15} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Actions and Summary matching UI Screen 4 */}
            <div className="p-6 bg-[#F5EFEB]/60 border-t border-[#ECE3D5] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-earth-heading hover:text-ayurveda transition-colors"
              >
                <LuArrowLeft size={14} />
                <span>Continue Shopping</span>
              </Link>

              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between text-xs text-earth-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-earth-heading">₹ {subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-earth-muted">
                  <span>Shipping</span>
                  <span className="text-ayurveda font-semibold">Free</span>
                </div>
                <div className="border-t border-[#ECE3D5] pt-2 flex justify-between text-base font-bold text-earth-heading font-heading">
                  <span>Total</span>
                  <span>₹ {total}</span>
                </div>

                <div className="pt-2">
                  <Link
                    to="/checkout"
                    className="w-full py-3 px-6 bg-ayurveda text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:bg-ayurveda-dark transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <LuArrowRight size={14} />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
