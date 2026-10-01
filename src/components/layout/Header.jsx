import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LuSearch, LuUser, LuShoppingBag, LuMenu, LuX, LuHeart } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  // Robust scroll lock for iOS Safari and mobile Chrome
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY || window.pageYOffset;
      document.body.dataset.scrollY = scrollY.toString();
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const savedScrollY = document.body.dataset.scrollY;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (savedScrollY !== undefined && savedScrollY !== '') {
        window.scrollTo(0, parseInt(savedScrollY || '0', 10));
        delete document.body.dataset.scrollY;
      }
    }

    return () => {
      const savedScrollY = document.body.dataset.scrollY;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (savedScrollY !== undefined && savedScrollY !== '') {
        window.scrollTo(0, parseInt(savedScrollY || '0', 10));
        delete document.body.dataset.scrollY;
      }
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/about#contact' },
  ];

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6F0] border-b border-[#ECE4D8]/80 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Lotus Emblem */}
            <div className="w-8 h-8 flex items-center justify-center text-earth-gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                <path d="M12 3c1.5 3 4 5 7 5-1.5 4-4 7-7 13-3-6-5.5-9-7-13 3 0 5.5-2 7-5z" fill="#B87834" fillOpacity="0.2"/>
                <path d="M12 21c-2-4-5-8-9-9 3-2 6-2 9 0 3-2 6-2 9 0-4 1-7 5-9 9z"/>
                <path d="M12 14c-1.5-2-3-3-5-3 1.5-2 3.5-2 5 0 1.5-2 3.5-2 5 0-2 0-3.5 1-5 3z" fill="#B87834"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl tracking-wide text-earth-heading leading-tight group-hover:text-ayurveda transition-colors">
                AyurVeda
              </span>
              <span className="text-[10px] text-earth-muted tracking-wider font-light">
                Ancient Wisdom, Modern Wellness.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors tracking-wide hover:text-ayurveda relative py-1 ${
                    isActive && link.path !== '/about#contact' 
                      ? 'text-ayurveda font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-ayurveda' 
                      : 'text-earth-heading/90'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Icons Section */}
          <div className="flex items-center space-x-5">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search herbs, remedies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-white border border-earth-border rounded-full focus:outline-none focus:border-ayurveda text-earth-heading"
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-2.5 text-earth-muted hover:text-earth-heading">
                  <LuX size={14} />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-earth-heading hover:text-ayurveda transition-colors p-1" 
                aria-label="Search"
              >
                <LuSearch className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={handleUserClick}
              className="flex items-center gap-1 text-earth-heading hover:text-ayurveda transition-colors p-1" 
              title={isAuthenticated ? `Account (${user?.name || 'User'})` : 'Sign In / Register'}
              aria-label="Account"
            >
              <div className="relative">
                <LuUser className="w-5 h-5" />
                {isAuthenticated && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
                )}
              </div>
              {isAuthenticated && user?.name && (
                <span className="hidden md:inline-block text-xs font-semibold text-earth-heading max-w-[85px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              )}
            </button>

            <Link to="/account?tab=wishlist" className="text-earth-heading hover:text-red-500 transition-colors relative p-1" title="Wishlist">
              <LuHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="text-earth-heading hover:text-ayurveda transition-colors relative p-1">
              <LuShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ayurveda text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-earth-heading hover:text-ayurveda p-1 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer-menu"
            >
              {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>
      
      {/* Mobile Drawer Menu Panel */}
      <div 
        id="mobile-drawer-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] border-l border-[#E6DEC8] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col overflow-y-auto overscroll-contain ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#FAF6F0', overscrollBehavior: 'contain' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col min-h-full justify-between" style={{ backgroundColor: '#FAF6F0' }}>
          <div>
            <div className="flex justify-between items-center mb-8 border-b border-earth-border pb-4">
              <span className="font-heading font-bold text-xl text-earth-heading">AyurVeda</span>
              <button 
                onClick={closeMenu} 
                className="text-earth-muted hover:text-earth-heading p-2 rounded-lg hover:bg-black/5 active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <LuX className="w-6 h-6 text-earth-heading" />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) => 
                    `text-base font-medium transition-colors hover:text-ayurveda ${isActive ? 'text-ayurveda font-semibold' : 'text-earth-heading'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto border-t border-earth-border pt-6 flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => { closeMenu(); navigate('/account'); }}
                  className="flex items-center gap-3 text-earth-heading hover:text-ayurveda text-sm font-medium py-2"
                >
                  <LuUser className="w-5 h-5 text-ayurveda" />
                  My Account ({user?.name || 'User'})
                </button>
                <button 
                  onClick={() => { closeMenu(); logout(); }}
                  className="text-left text-xs text-red-600 hover:text-red-700 py-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => { closeMenu(); navigate('/login'); }}
                className="flex items-center gap-3 text-earth-heading hover:text-ayurveda text-sm font-medium py-2"
              >
                <LuUser className="w-5 h-5" />
                Sign In / Register
              </button>
            )}
            <Link 
              to="/cart"
              onClick={closeMenu}
              className="flex items-center justify-between text-earth-heading hover:text-ayurveda text-sm font-medium py-2"
            >
              <span className="flex items-center gap-3">
                <LuShoppingBag className="w-5 h-5" />
                Cart
              </span>
              <span className="bg-ayurveda text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
