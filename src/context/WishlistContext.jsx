import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ayurveda_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ayurveda_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(
      (item) => (item._id || item.id) === (productId._id || productId.id || productId)
    );
  };

  const addToWishlist = (product) => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (isInWishlist(prodId)) {
      toast('Product is already in your wishlist!', { icon: '✨' });
      return;
    }
    setWishlistItems((prev) => [product, ...prev]);
    toast.success(`${product.name || 'Product'} added to your Wishlist!`, { icon: '❤️' });
  };

  const removeFromWishlist = (productId) => {
    const idToMatch = productId?._id || productId?.id || productId;
    setWishlistItems((prev) =>
      prev.filter((item) => (item._id || item.id) !== idToMatch)
    );
    toast.success('Removed from Wishlist');
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (isInWishlist(prodId)) {
      removeFromWishlist(prodId);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('ayurveda_wishlist');
  };

  // Automatically remove ordered/purchased items from wishlist
  const removePurchasedItemsFromWishlist = (purchasedItems = []) => {
    if (!purchasedItems || !purchasedItems.length) return;

    const purchasedIdentifiers = new Set();
    purchasedItems.forEach((item) => {
      if (!item) return;
      const id = item.product?._id || item.product?.id || item._id || item.id || (typeof item.product === 'string' ? item.product : null);
      if (id) purchasedIdentifiers.add(String(id));
      if (item.product?.slug) purchasedIdentifiers.add(String(item.product.slug));
      if (item.slug) purchasedIdentifiers.add(String(item.slug));
      if (item.product?.name) purchasedIdentifiers.add(String(item.product.name).toLowerCase());
      if (item.name) purchasedIdentifiers.add(String(item.name).toLowerCase());
    });

    setWishlistItems((prev) =>
      prev.filter((wishItem) => {
        const wishId = String(wishItem._id || wishItem.id || '');
        const wishSlug = String(wishItem.slug || '');
        const wishName = String(wishItem.name || '').toLowerCase();

        const wasPurchased = purchasedIdentifiers.has(wishId) ||
                             (wishSlug && purchasedIdentifiers.has(wishSlug)) ||
                             (wishName && purchasedIdentifiers.has(wishName));
        return !wasPurchased;
      })
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        removePurchasedItemsFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
