import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LuCheck, LuLock, LuShoppingBag, LuCreditCard, LuMapPin } from 'react-icons/lu';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { openRazorpayCheckout } from '../utils/razorpay';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { removePurchasedItemsFromWishlist } = useWishlist();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pinCode: '',
    saveAddress: false
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Load saved addresses from user profile
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get('/users/addresses');
        if (res.data?.success && res.data.data?.length > 0) {
          const list = res.data.data;
          setSavedAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setFormData((prev) => ({
            ...prev,
            fullName: defaultAddr.fullName || prev.fullName || user?.name || '',
            phone: defaultAddr.phone || prev.phone || user?.phone || '',
            address: defaultAddr.addressLine1 || prev.address,
            city: defaultAddr.city || prev.city,
            pinCode: defaultAddr.pinCode || prev.pinCode
          }));
        }
      } catch (e) {
        // ignore
      }
    };
    loadAddresses();
  }, [user]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const handleOrderSubmission = async (paymentDetails = {}) => {
    try {
      const res = await api.post('/orders', {
        items: cartItems,
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: user?.email || '',
          addressLine1: formData.address.trim(),
          city: formData.city.trim(),
          pinCode: formData.pinCode.trim()
        },
        shippingCost: shipping,
        paymentMethod: 'Razorpay Online',
        paymentStatus: 'Paid',
        paymentId: paymentDetails.paymentId || ''
      });

      if (res.data?.success) {
        const orderData = res.data.data;
        setCreatedOrder(orderData);

        // Also save address if user opted in
        if (formData.saveAddress) {
          api.post('/users/addresses', {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            addressLine1: formData.address.trim(),
            city: formData.city.trim(),
            pinCode: formData.pinCode.trim(),
            isDefault: false
          }).catch(() => {});
        }

        // Also record order in Firebase Firestore with consistent data structure
        try {
          const itemsSummary = cartItems
            .map((item) => `${item.quantity}x ${item.product?.name || item.name} (₹${(item.product?.price || item.price || 0) * item.quantity})`)
            .join(', ');

          await addDoc(collection(db, 'orders'), {
            orderNumber: orderData?.orderNumber || `AYUR-${Date.now()}`,
            customerEmail: user?.email || '',
            customerName: formData.fullName.trim(),
            customerPhone: formData.phone.trim(),
            itemsSummary: itemsSummary,
            total_amount: total,
            paymentStatus: paymentDetails.paymentStatus || 'Paid',
            shippingAddress: {
              addressLine1: formData.address.trim(),
              city: formData.city.trim(),
              pinCode: formData.pinCode.trim()
            },
            status: 'Processing',
            paymentMethod: 'Razorpay Online',
            paymentId: paymentDetails.paymentId || '',
            createdAt: serverTimestamp()
          });
        } catch (fsErr) {
          console.warn('Firestore order log note:', fsErr.message);
        }

        clearCart();
        removePurchasedItemsFromWishlist(cartItems);
        setSuccess(true);
        toast.success('Order placed successfully!');
      } else {
        toast.error(res.data?.message || 'Failed to place order');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pinCode.trim()) {
      toast.error('Please fill in all shipping fields');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }

    setLoading(true);

    try {
      toast.loading('Opening Razorpay Payment Gateway...', { id: 'rzp-load' });
      const paymentResult = await openRazorpayCheckout({
        amount: total,
        name: formData.fullName.trim(),
        email: user?.email || 'customer@ayurveda.com',
        phone: formData.phone.trim(),
        description: `Payment for Ayurvedic Remedies - ₹${total}`
      });

      toast.dismiss('rzp-load');

      if (paymentResult.success) {
        toast.success('Payment verified successfully!');
        await handleOrderSubmission({
          paymentMethod: 'Razorpay Online',
          paymentStatus: 'Paid',
          paymentId: paymentResult.paymentId
        });
      } else if (paymentResult.dismissed) {
        toast('Payment was cancelled. You can retry when ready.', { icon: 'ℹ️' });
      } else {
        toast.error(paymentResult.error || 'Payment failed. Please try again.');
      }
    } catch (rzpErr) {
      toast.dismiss('rzp-load');
      toast.error(rzpErr.message || 'Error opening payment gateway');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#FAF6F0] min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-8 text-center shadow-md">
          <div className="w-16 h-16 bg-[#EAF2EC] text-ayurveda rounded-full flex items-center justify-center mx-auto mb-4">
            <LuCheck className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-earth-heading">Order Placed Successfully!</h2>
          <p className="text-xs text-earth-muted mt-2">
            Your sacred Ayurvedic remedies are being prepared with love and natural purity.
          </p>
          <div className="my-4 p-3 bg-[#FAF6F0] border border-[#E8DEC8] rounded-xl text-left text-xs space-y-1">
            <p className="text-earth-muted">
              Order ID: <span className="font-semibold text-earth-heading">{createdOrder?.orderNumber || createdOrder?.id || 'Confirmed'}</span>
            </p>
            <p className="text-earth-muted">
              Payment Method: <span className="font-semibold text-ayurveda">Razorpay Online</span>
            </p>
            {createdOrder?.paymentId && (
              <p className="text-earth-muted">
                Payment Ref ID: <span className="font-mono text-[11px] text-gray-700">{createdOrder.paymentId}</span>
              </p>
            )}
            <p className="text-earth-muted">
              Total Paid: <span className="font-bold text-earth-heading">₹ {createdOrder?.totalAmount || total}</span>
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => navigate('/account?tab=orders')}
              className="w-full py-2.5 bg-ayurveda hover:bg-ayurveda-dark text-white rounded-lg text-xs font-semibold transition-colors"
            >
              View My Orders
            </button>
            <Link to="/shop" className="text-xs text-earth-gold hover:underline py-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="bg-[#FAF6F0] min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-[#EAF2EC] text-ayurveda rounded-full flex items-center justify-center mx-auto mb-4">
            <LuShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-earth-heading">Your Cart is Empty</h2>
          <p className="text-xs text-earth-muted mt-2">
            There are no products in your cart to checkout. Please explore our Ayurvedic remedies and add items to your cart.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 bg-ayurveda hover:bg-ayurveda-dark text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Explore Products →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator matching UI Screen 5 */}
        <div className="flex items-center justify-center space-x-6 sm:space-x-12 mb-10 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-ayurveda font-semibold">
            <span className="w-6 h-6 rounded-full bg-ayurveda text-white flex items-center justify-center text-xs">
              1
            </span>
            <span>Shipping</span>
          </div>
          <div className="w-12 h-0.5 bg-[#E8DEC8]"></div>
          <div className="flex items-center gap-2 text-ayurveda font-semibold">
            <span className="w-6 h-6 rounded-full bg-ayurveda text-white flex items-center justify-center text-xs">
              2
            </span>
            <span>Payment (Razorpay)</span>
          </div>
          <div className="w-12 h-0.5 bg-[#E8DEC8]"></div>
          <div className="flex items-center gap-2 text-earth-muted">
            <span className="w-6 h-6 rounded-full bg-[#E8DEC8] text-earth-heading flex items-center justify-center text-xs">
              3
            </span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left: Shipping Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl font-bold text-earth-heading">
                  Shipping Address
                </h2>
              </div>

              {/* Saved Addresses quick-picker */}
              {savedAddresses.length > 0 && (
                <div className="mb-5 p-3.5 bg-[#FAF6F0] border border-[#E8DEC8] rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-earth-heading mb-2">
                    <LuMapPin className="text-ayurveda" />
                    <span>Choose from saved addresses:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr.id || addr._id}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            fullName: addr.fullName,
                            phone: addr.phone,
                            address: addr.addressLine1,
                            city: addr.city,
                            pinCode: addr.pinCode
                          }));
                          toast.success(`Selected address: ${addr.city}`);
                        }}
                        className="px-3 py-1.5 text-xs bg-white border border-[#E8DEC8] rounded-lg hover:border-ayurveda hover:text-ayurveda transition-all shadow-2xs text-left"
                      >
                        <span className="font-medium">{addr.fullName}</span> - {addr.city} ({addr.pinCode})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-earth-heading mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-earth-heading mb-1">
                    Phone Number (10 Digits)*
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs text-earth-muted bg-[#F4EEE5] border border-r-0 border-[#E8DEC8] rounded-l-lg font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: digitsOnly });
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-r-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-earth-heading mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat, Street, Area"
                    className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-earth-heading mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City (e.g. Mumbai, Delhi, Jaipur)"
                      className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-earth-heading mb-1">
                      Pincode*
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      placeholder="6-digit pincode"
                      className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={formData.saveAddress}
                    onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
                    className="w-4 h-4 text-ayurveda rounded border-earth-border focus:ring-ayurveda"
                  />
                  <label htmlFor="saveAddress" className="ml-2 text-xs text-earth-body">
                    Save this address to my profile
                  </label>
                </div>

                {/* Razorpay Online Payment Badge (Cash on Delivery Removed) */}
                <div className="pt-6 border-t border-[#E8DEC8]">
                  <h3 className="font-heading text-sm font-bold text-earth-heading mb-3">
                    Payment Method
                  </h3>
                  <div className="p-4 rounded-xl border border-ayurveda bg-[#EAF2EC]/50 ring-1 ring-ayurveda flex items-start gap-3">
                    <LuCreditCard className="w-5 h-5 text-ayurveda mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-earth-heading">
                          Razorpay Secure Online Payment
                        </p>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-ayurveda text-white rounded">
                          Fast & Secure
                        </span>
                      </div>
                      <p className="text-[11px] text-earth-muted mt-1 leading-relaxed">
                        Pay securely with UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking, and Wallets.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 lg:hidden">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-ayurveda text-white rounded-lg text-xs font-semibold hover:bg-ayurveda-dark transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-sm"
                  >
                    <LuLock size={14} />
                    <span>{loading ? 'Opening Gateway...' : `Pay ₹${total} with Razorpay`}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="font-heading text-lg font-bold text-earth-heading mb-4">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="divide-y divide-[#ECE3D5] mb-4 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => {
                  const prod = item.product || {};
                  return (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#FAF6F0] border border-[#E8DEC8] p-1 flex items-center justify-center flex-shrink-0">
                        <img
                          src={prod.images?.[0] || prod.image || '/images/products/immunity-support.jpg'}
                          alt={prod.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-earth-heading truncate">{prod.name}</p>
                        <p className="text-[11px] text-earth-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-earth-heading font-heading">
                        ₹ {(prod.price || 0) * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Cost breakdown */}
              <div className="border-t border-[#ECE3D5] pt-3 space-y-2 text-xs text-earth-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-earth-heading">₹ {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-ayurveda font-semibold">{shipping === 0 ? 'Free' : `₹ ${shipping}`}</span>
                </div>
                <div className="border-t border-[#ECE3D5] pt-2 flex justify-between text-base font-bold text-earth-heading font-heading">
                  <span>Total Payable</span>
                  <span className="text-ayurveda">₹ {total}</span>
                </div>
              </div>

              {/* Place Order CTA matching UI Screen 5 */}
              <div className="mt-6 hidden lg:block">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3.5 bg-ayurveda text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-ayurveda-dark active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <LuLock size={15} />
                  <span>{loading ? 'Connecting to Razorpay...' : `Pay ₹${total} with Razorpay`}</span>
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-[10px] text-earth-muted">
                  🔒 256-bit encrypted secure checkout powered by Razorpay
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
