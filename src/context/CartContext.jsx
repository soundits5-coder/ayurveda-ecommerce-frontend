import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const { data } = await api.get('/cart');
          if (data.success) {
            setCartItems(data.data.items || []);
          }
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      } else {
        const localCart = localStorage.getItem('ayurveda_cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      }
      setLoading(false);
    };
    
    fetchCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      localStorage.setItem('ayurveda_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated, loading]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const { data } = await api.post('/cart/add', { productId: product._id || product.id, quantity });
        if (data.success) setCartItems(data.data.items);
        toast.success('Added to cart');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    } else {
      setCartItems(prev => {
        const existing = prev.find(item => item.product._id === (product._id || product.id));
        if (existing) {
          return prev.map(item => 
            item.product._id === (product._id || product.id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
      toast.success('Added to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    if (isAuthenticated) {
      try {
        const { data } = await api.put('/cart/update', { productId, quantity });
        if (data.success) setCartItems(data.data.items);
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    } else {
      setCartItems(prev => prev.map(item => 
        item.product._id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const { data } = await api.delete(`/cart/remove/${productId}`);
        if (data.success) setCartItems(data.data.items);
        toast.success('Removed from cart');
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      setCartItems(prev => prev.filter(item => item.product._id !== productId));
      toast.success('Removed from cart');
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('ayurveda_cart');
    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear').catch(() => {});
      } catch (e) {}
    }
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
