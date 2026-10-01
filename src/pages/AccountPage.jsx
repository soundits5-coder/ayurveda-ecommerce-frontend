import React, { useState, useEffect } from 'react';
import {
  LuLayoutDashboard,
  LuPackage,
  LuMapPin,
  LuHeart,
  LuSettings,
  LuLogOut,
  LuPlus,
  LuTrash2,
  LuCheck,
  LuShoppingCart,
  LuLock,
  LuUser
} from 'react-icons/lu';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { user, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: false
  });

  // Profile Settings state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Settings state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Update tab in state and URL query param
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Update profile form when user object updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setNewAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await api.get('/users/addresses');
      if (res.data?.success) {
        setAddresses(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAddresses();
  }, []);

  // Save new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine1.trim() || !newAddress.city.trim() || !newAddress.pinCode.trim()) {
      toast.error('Please fill in all required address fields');
      return;
    }

    try {
      const res = await api.post('/users/addresses', newAddress);
      if (res.data?.success) {
        setAddresses(res.data.data || []);
        setShowAddAddressModal(false);
        setNewAddress({
          fullName: user?.name || '',
          phone: user?.phone || '',
          addressLine1: '',
          city: '',
          state: '',
          pinCode: '',
          isDefault: false
        });
        toast.success('Address saved successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    try {
      const res = await api.delete(`/users/addresses/${id}`);
      if (res.data?.success) {
        setAddresses(res.data.data || []);
        toast.success('Address removed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', profileForm);
      if (res.data?.success) {
        localStorage.setItem('ayurveda_user', JSON.stringify(res.data.data));
        toast.success('Profile details updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.data?.success) {
        toast.success('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const userName = user?.name || 'Customer';

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-earth-heading">
            My Account
          </h1>
          <p className="mt-1 text-sm font-semibold text-ayurveda">
            Hello, {userName}!
          </p>
          <p className="text-xs text-earth-muted font-light">
            Manage your profile, orders, addresses, and wishlist.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-1.5 sticky top-24">
              <button
                onClick={() => handleTabChange('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-ayurveda text-white shadow-sm'
                    : 'text-earth-heading hover:bg-[#F4EEE5]'
                }`}
              >
                <LuLayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleTabChange('orders')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-ayurveda text-white shadow-sm'
                    : 'text-earth-heading hover:bg-[#F4EEE5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LuPackage size={16} />
                  <span>My Orders</span>
                </div>
                {orders.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#EAF2EC] text-ayurveda'}`}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange('addresses')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-ayurveda text-white shadow-sm'
                    : 'text-earth-heading hover:bg-[#F4EEE5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LuMapPin size={16} />
                  <span>Saved Addresses</span>
                </div>
                {addresses.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-[#EAF2EC] text-ayurveda'}`}>
                    {addresses.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange('wishlist')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-ayurveda text-white shadow-sm'
                    : 'text-earth-heading hover:bg-[#F4EEE5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LuHeart size={16} />
                  <span>My Wishlist</span>
                </div>
                {wishlistItems.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabChange('settings')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-ayurveda text-white shadow-sm'
                    : 'text-earth-heading hover:bg-[#F4EEE5]'
                }`}
              >
                <LuSettings size={16} />
                <span>Account Settings</span>
              </button>

              <div className="pt-2 border-t border-[#ECE3D5]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                >
                  <LuLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div
                    onClick={() => handleTabChange('orders')}
                    className="p-4 bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#EAF2EC] text-ayurveda flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <LuPackage size={18} />
                    </div>
                    <span className="text-2xl font-bold font-heading text-earth-heading block">
                      {orders.length}
                    </span>
                    <span className="text-xs text-earth-muted">Total Orders</span>
                  </div>

                  <div
                    onClick={() => handleTabChange('wishlist')}
                    className="p-4 bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <LuHeart size={18} />
                    </div>
                    <span className="text-2xl font-bold font-heading text-earth-heading block">
                      {wishlistItems.length}
                    </span>
                    <span className="text-xs text-earth-muted">Wishlist Items</span>
                  </div>

                  <div
                    onClick={() => handleTabChange('addresses')}
                    className="p-4 bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <LuMapPin size={18} />
                    </div>
                    <span className="text-2xl font-bold font-heading text-earth-heading block">
                      {addresses.length}
                    </span>
                    <span className="text-xs text-earth-muted">Saved Addresses</span>
                  </div>
                </div>

                {/* Recent Orders section */}
                <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ECE3D5]">
                    <h2 className="font-heading text-lg font-bold text-earth-heading">
                      Recent Orders
                    </h2>
                    {orders.length > 0 && (
                      <button
                        onClick={() => handleTabChange('orders')}
                        className="text-xs text-earth-gold hover:underline font-semibold"
                      >
                        View All ({orders.length}) →
                      </button>
                    )}
                  </div>

                  {loadingOrders ? (
                    <div className="py-8 text-center text-xs text-earth-muted">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="py-8 text-center">
                      <LuPackage className="w-10 h-10 text-earth-muted mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-earth-muted">No orders placed yet.</p>
                      <Link
                        to="/shop"
                        className="mt-3 inline-block px-4 py-2 bg-ayurveda text-white rounded-lg text-xs font-semibold hover:bg-ayurveda-dark transition-colors"
                      >
                        Explore Remedies
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((ord) => {
                        const firstItem = ord.items?.[0] || {};
                        const dateStr = ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })
                          : 'Recent';
                        return (
                          <div
                            key={ord._id || ord.id}
                            className="p-3.5 bg-[#FAF6F0] border border-[#E8DEC8] rounded-xl flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-white border border-[#E8DEC8] p-1 flex items-center justify-center flex-shrink-0">
                                <img
                                  src={firstItem.image || '/images/products/immunity-support.jpg'}
                                  alt={firstItem.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              </div>
                              <div>
                                <h4 className="font-heading text-xs sm:text-sm font-semibold text-earth-heading">
                                  {firstItem.name || 'Ayurvedic Remedy'}
                                </h4>
                                <p className="text-[11px] text-earth-muted">
                                  #{ord.orderNumber || ord.id} • {dateStr}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-heading text-xs sm:text-sm font-bold text-earth-heading">
                                ₹ {ord.totalAmount}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#2E633B]">
                                {ord.status || 'Processing'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleTabChange('addresses')}
                    className="p-3 bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl text-center hover:bg-[#FAF6F0] transition-colors"
                  >
                    <LuMapPin className="mx-auto mb-1 text-earth-gold" />
                    <span className="text-xs font-semibold text-earth-heading block">Manage Addresses</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('wishlist')}
                    className="p-3 bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl text-center hover:bg-[#FAF6F0] transition-colors"
                  >
                    <LuHeart className="mx-auto mb-1 text-red-500" />
                    <span className="text-xs font-semibold text-earth-heading block">View Wishlist</span>
                  </button>
                  <button
                    onClick={() => handleTabChange('settings')}
                    className="p-3 bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl text-center hover:bg-[#FAF6F0] transition-colors"
                  >
                    <LuSettings className="mx-auto mb-1 text-earth-heading" />
                    <span className="text-xs font-semibold text-earth-heading block">Edit Profile</span>
                  </button>
                  <Link
                    to="/about#contact"
                    className="p-3 bg-[#FDFBF7] border border-[#E8DEC8] rounded-xl text-center hover:bg-[#FAF6F0] transition-colors"
                  >
                    <span className="text-earth-gold block text-sm mb-1">🌿</span>
                    <span className="text-xs font-semibold text-earth-heading block">Support Help</span>
                  </Link>
                </div>
              </div>
            )}

            {/* 2. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ECE3D5]">
                  <h2 className="font-heading text-lg font-bold text-earth-heading">
                    My Orders ({orders.length})
                  </h2>
                  <Link to="/shop" className="text-xs text-ayurveda hover:underline font-semibold">
                    + Shop More
                  </Link>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-earth-muted">Loading your orders...</div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center">
                    <LuPackage className="w-12 h-12 text-ayurveda mx-auto mb-3 opacity-60" />
                    <h3 className="font-heading text-base font-bold text-earth-heading">No Orders Yet</h3>
                    <p className="text-xs text-earth-muted mt-1 max-w-sm mx-auto">
                      You haven't placed any orders yet. Discover our authentic herbal remedies crafted with traditional purity.
                    </p>
                    <Link
                      to="/shop"
                      className="mt-4 inline-block px-5 py-2.5 bg-ayurveda text-white text-xs font-semibold rounded-lg hover:bg-ayurveda-dark transition-all"
                    >
                      Start Shopping →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => {
                      const dateStr = ord.createdAt
                        ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Recent';

                      return (
                        <div
                          key={ord._id || ord.id}
                          className="bg-[#FAF6F0] border border-[#E8DEC8] rounded-xl p-4 sm:p-5"
                        >
                          {/* Order Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8DEC8] text-xs">
                            <div>
                              <p className="font-bold text-earth-heading">
                                Order #{ord.orderNumber || ord.id}
                              </p>
                              <p className="text-earth-muted text-[11px]">{dateStr}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#EAF2EC] text-[#2E633B]">
                                {ord.status || 'Processing'}
                              </span>
                              <span className="font-bold font-heading text-sm text-earth-heading">
                                ₹ {ord.totalAmount}
                              </span>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="py-3 space-y-2">
                            {ord.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-10 h-10 rounded bg-white border border-[#E8DEC8] p-1 flex-shrink-0">
                                    <img
                                      src={item.image || '/images/products/immunity-support.jpg'}
                                      alt={item.name}
                                      className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-earth-heading">{item.name}</p>
                                    <p className="text-[11px] text-earth-muted">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-medium text-earth-heading">
                                  ₹ {(item.price || 0) * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Order Footer & Shipping info */}
                          <div className="pt-3 border-t border-[#E8DEC8] flex flex-wrap justify-between items-center text-[11px] text-earth-muted gap-2">
                            <div>
                              <span className="font-semibold text-earth-heading">Payment: </span>
                              <span>{ord.paymentMethod || 'Razorpay Online'} ({ord.paymentStatus || 'Paid'})</span>
                              {ord.paymentId && <span className="block font-mono text-[10px]">ID: {ord.paymentId}</span>}
                            </div>
                            {ord.shippingAddress?.city && (
                              <div>
                                <span className="font-semibold text-earth-heading">Delivering to: </span>
                                <span>{ord.shippingAddress.city}, {ord.shippingAddress.pinCode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ECE3D5]">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-earth-heading">
                      Saved Addresses
                    </h2>
                    <p className="text-xs text-earth-muted">
                      Your addresses are safely stored for quick checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-ayurveda text-white text-xs font-semibold rounded-lg hover:bg-ayurveda-dark transition-colors"
                  >
                    <LuPlus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Inline Add Address Form when opened */}
                {showAddAddressModal && (
                  <form onSubmit={handleAddAddress} className="mb-6 p-4 sm:p-5 bg-[#FAF6F0] border border-[#E8DEC8] rounded-xl space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E8DEC8]">
                      <h3 className="font-heading text-sm font-bold text-earth-heading">
                        Add New Delivery Address
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(false)}
                        className="text-xs text-earth-muted hover:text-earth-heading"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-earth-heading mb-1">Full Name*</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full bg-white border border-[#E8DEC8] rounded-lg px-3 py-2 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-earth-heading mb-1">Phone Number (10 Digits)*</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          pattern="[0-9]{10}"
                          value={newAddress.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setNewAddress({ ...newAddress, phone: val });
                          }}
                          className="w-full bg-white border border-[#E8DEC8] rounded-lg px-3 py-2 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-earth-heading mb-1">Address (House / Street / Area)*</label>
                      <input
                        type="text"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        className="w-full bg-white border border-[#E8DEC8] rounded-lg px-3 py-2 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                        placeholder="House no, Street name, Landmark"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-earth-heading mb-1">City*</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full bg-white border border-[#E8DEC8] rounded-lg px-3 py-2 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-earth-heading mb-1">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full bg-white border border-[#E8DEC8] rounded-lg px-3 py-2 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-earth-heading mb-1">PIN Code*</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pinCode}
                          onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                          className="w-full bg-white border border-[#E8DEC8] rounded-lg px-3 py-2 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                          placeholder="PIN Code"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        className="w-4 h-4 text-ayurveda focus:ring-ayurveda rounded border-[#E8DEC8]"
                      />
                      <label htmlFor="isDefault" className="text-xs text-earth-heading">
                        Set as default delivery address
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(false)}
                        className="px-4 py-2 border border-[#E8DEC8] rounded-lg text-xs font-semibold text-earth-muted hover:bg-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-ayurveda text-white rounded-lg text-xs font-semibold hover:bg-ayurveda-dark transition-colors"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                {loadingAddresses ? (
                  <div className="py-8 text-center text-xs text-earth-muted">Loading addresses...</div>
                ) : addresses.length === 0 && !showAddAddressModal ? (
                  <div className="py-10 text-center">
                    <LuMapPin className="w-10 h-10 text-earth-muted mx-auto mb-2 opacity-50" />
                    <h3 className="font-heading text-sm font-bold text-earth-heading">No Saved Addresses</h3>
                    <p className="text-xs text-earth-muted mt-1 max-w-sm mx-auto">
                      Add your address once so you can quickly checkout on every order.
                    </p>
                    <button
                      onClick={() => setShowAddAddressModal(true)}
                      className="mt-4 px-4 py-2 bg-ayurveda text-white text-xs font-semibold rounded-lg hover:bg-ayurveda-dark transition-all"
                    >
                      + Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id || addr._id}
                        className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                          addr.isDefault
                            ? 'bg-[#EAF2EC]/40 border-ayurveda ring-1 ring-ayurveda/20'
                            : 'bg-[#FAF6F0] border-[#E8DEC8]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-bold text-xs text-earth-heading">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ayurveda text-white">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-earth-heading leading-relaxed mb-1">
                            {addr.addressLine1}
                          </p>
                          <p className="text-xs text-earth-muted mb-1">
                            {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                          <p className="text-xs text-earth-muted">
                            Phone: {addr.phone}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#E8DEC8] flex items-center justify-between">
                          <span className="text-[10px] text-earth-muted">Ready for 1-Click Checkout</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id || addr._id)}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                            title="Delete Address"
                          >
                            <LuTrash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ECE3D5]">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-earth-heading">
                      My Wishlist ({wishlistItems.length})
                    </h2>
                    <p className="text-xs text-earth-muted">
                      Products you saved to purchase later.
                    </p>
                  </div>
                  {wishlistItems.length > 0 && (
                    <Link to="/shop" className="text-xs text-ayurveda hover:underline font-semibold">
                      Explore More →
                    </Link>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <LuHeart className="w-12 h-12 text-red-400 mx-auto mb-3 opacity-60" />
                    <h3 className="font-heading text-base font-bold text-earth-heading">Your Wishlist is Empty</h3>
                    <p className="text-xs text-earth-muted mt-1 max-w-sm mx-auto">
                      Save remedies you love by tapping the heart icon on any product.
                    </p>
                    <Link
                      to="/shop"
                      className="mt-4 inline-block px-5 py-2.5 bg-ayurveda text-white text-xs font-semibold rounded-lg hover:bg-ayurveda-dark transition-all"
                    >
                      Explore Products →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((prod) => (
                      <div
                        key={prod._id || prod.id}
                        className="p-4 bg-[#FAF6F0] border border-[#E8DEC8] rounded-xl flex items-center gap-3.5 relative group"
                      >
                        <div className="w-16 h-16 rounded-lg bg-white border border-[#E8DEC8] p-1.5 flex items-center justify-center flex-shrink-0">
                          <img
                            src={prod.images?.[0] || prod.image || '/images/products/immunity-support.jpg'}
                            alt={prod.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${prod.slug || prod._id || prod.id}`}
                            className="font-heading text-xs sm:text-sm font-semibold text-earth-heading hover:text-ayurveda transition-colors line-clamp-1 block"
                          >
                            {prod.name}
                          </Link>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-bold text-sm text-earth-heading font-heading">
                              ₹ {prod.price}
                            </span>
                            {prod.originalPrice && prod.originalPrice > prod.price && (
                              <span className="text-xs text-earth-muted line-through">
                                ₹ {prod.originalPrice}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(prod, 1);
                                toast.success(`Added ${prod.name} to Cart!`);
                              }}
                              className="px-2.5 py-1 bg-ayurveda hover:bg-ayurveda-dark text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <LuShoppingCart size={12} />
                              <span>Add to Cart</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(prod, 1);
                                navigate('/checkout');
                              }}
                              className="px-2.5 py-1 bg-earth-heading hover:bg-black text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              title="Order directly from wishlist"
                            >
                              <span>Order Now →</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromWishlist(prod._id || prod.id)}
                              className="p-1 text-earth-muted hover:text-red-500 transition-colors ml-auto"
                              title="Remove from wishlist"
                            >
                              <LuTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Profile Information Card */}
                <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ECE3D5]">
                    <LuUser className="text-ayurveda w-5 h-5" />
                    <div>
                      <h2 className="font-heading text-lg font-bold text-earth-heading">
                        Profile Information
                      </h2>
                      <p className="text-xs text-earth-muted">
                        Update your personal details and contact info.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold text-earth-heading mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-earth-heading mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-earth-heading mb-1">
                        Phone Number (10 Digits)
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        value={profileForm.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setProfileForm({ ...profileForm, phone: val });
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-2.5 bg-ayurveda hover:bg-ayurveda-dark text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
                    >
                      {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </form>
                </div>

                {/* Password Change Card */}
                <div className="bg-[#FDFBF7] border border-[#E8DEC8] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#ECE3D5]">
                    <LuLock className="text-ayurveda w-5 h-5" />
                    <div>
                      <h2 className="font-heading text-lg font-bold text-earth-heading">
                        Change Password
                      </h2>
                      <p className="text-xs text-earth-muted">
                        Ensure your account remains safe and secure.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold text-earth-heading mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-earth-heading mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          placeholder="Min 6 characters"
                          className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-earth-heading mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          placeholder="Re-type password"
                          className="w-full bg-[#FAF6F0] border border-[#E8DEC8] rounded-lg px-3.5 py-2.5 text-xs text-earth-heading focus:outline-none focus:border-ayurveda"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="px-6 py-2.5 bg-ayurveda hover:bg-ayurveda-dark text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
                    >
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AccountPage;
