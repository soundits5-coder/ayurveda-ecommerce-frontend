import React from 'react';
import { LuUser, LuPackage, LuHeart, LuHelpCircle, LuLogOut } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSidebar = ({ activeTab, onTabChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <LuUser className="w-5 h-5" /> },
    { id: 'orders', label: 'My Orders', icon: <LuPackage className="w-5 h-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <LuHeart className="w-5 h-5" /> },
    { id: 'support', label: 'Support', icon: <LuHelpCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <nav className="flex flex-col">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors border-l-4 ${
              activeTab === item.id 
                ? 'border-ayurveda bg-ayurveda-light/10 text-ayurveda' 
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-dark'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
        
        <div className="border-t border-gray-100 my-2"></div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-left font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LuLogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AccountSidebar;
