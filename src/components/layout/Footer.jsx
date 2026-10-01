import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuSearch, LuArrowRight } from 'react-icons/lu';
import { FaFacebookF, FaInstagram, FaYoutube, FaPinterestP } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#16331C] text-cream-100 pt-16 pb-8 border-t border-[#234A29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns Row matching UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 flex items-center justify-center text-[#E5A85B]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
                  <path d="M12 3c1.5 3 4 5 7 5-1.5 4-4 7-7 13-3-6-5.5-9-7-13 3 0 5.5-2 7-5z" fill="#E5A85B" fillOpacity="0.3"/>
                  <path d="M12 21c-2-4-5-8-9-9 3-2 6-2 9 0 3-2 6-2 9 0-4 1-7 5-9 9z"/>
                  <path d="M12 14c-1.5-2-3-3-5-3 1.5-2 3.5-2 5 0 1.5-2 3.5-2 5 0-2 0-3.5 1-5 3z" fill="#E5A85B"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl tracking-wide text-white">
                  AyurVeda
                </span>
                <span className="text-[10px] text-cream-200/80 tracking-widest font-light uppercase">
                  Ancient Wisdom, Modern Wellness.
                </span>
              </div>
            </Link>
            <p className="text-xs text-cream-200/70 font-light leading-relaxed max-w-xs">
              Rooted in centuries-old Vedic traditions, bringing holistic wellness, balance and vitality to modern living.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-200/80 font-light">
              <li><Link to="/" className="hover:text-[#E5A85B] transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#E5A85B] transition-colors">Shop</Link></li>
              <li><Link to="/shop" className="hover:text-[#E5A85B] transition-colors">Categories</Link></li>
              <li><Link to="/about" className="hover:text-[#E5A85B] transition-colors">About</Link></li>
              <li><Link to="/about#contact" className="hover:text-[#E5A85B] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-cream-200/80 font-light">
              <li><Link to="/about" className="hover:text-[#E5A85B] transition-colors">FAQs</Link></li>
              <li><Link to="/about" className="hover:text-[#E5A85B] transition-colors">Shipping</Link></li>
              <li><Link to="/about" className="hover:text-[#E5A85B] transition-colors">Returns</Link></li>
              <li><Link to="/account" className="hover:text-[#E5A85B] transition-colors">Track Order</Link></li>
              <li><Link to="/about#contact" className="hover:text-[#E5A85B] transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wider text-white mb-3">
              Stay Connected
            </h4>
            <p className="text-xs text-cream-200/70 font-light mb-3">
              Subscribe to our newsletter for exclusive tips & wellness offers.
            </p>

            {/* Newsletter Pill Input matching UI */}
            <form onSubmit={handleSubscribe} className="relative mb-4 flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-[#FAF6F0] text-earth-heading text-xs pl-4 pr-10 py-2.5 rounded-full placeholder-earth-muted focus:outline-none focus:ring-2 focus:ring-[#E5A85B]"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-full bg-[#16331C] text-white flex items-center justify-center hover:bg-[#234A29] transition-colors"
                aria-label="Subscribe"
              >
                <LuSearch className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-[#A3E0B0] mb-3">
                Thank you for subscribing to Ayurvedic wellness!
              </p>
            )}

            {/* Social Icons */}
            <div className="flex items-center space-x-3.5 text-cream-200/80">
              <a href="#" className="w-7 h-7 rounded-full bg-[#204527] flex items-center justify-center hover:text-white hover:bg-[#E5A85B] transition-colors" aria-label="Facebook">
                <FaFacebookF size={12} />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#204527] flex items-center justify-center hover:text-white hover:bg-[#E5A85B] transition-colors" aria-label="Instagram">
                <FaInstagram size={12} />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#204527] flex items-center justify-center hover:text-white hover:bg-[#E5A85B] transition-colors" aria-label="YouTube">
                <FaYoutube size={12} />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#204527] flex items-center justify-center hover:text-white hover:bg-[#E5A85B] transition-colors" aria-label="Pinterest">
                <FaPinterestP size={12} />
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="border-t border-[#234A29] pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-cream-200/60 font-light gap-3">
          <p>© 2025 AyurVeda. All rights reserved.</p>
          <div className="flex space-x-5">
            <Link to="/about" className="hover:text-cream-100 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-cream-100 transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
