import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const cached = localStorage.getItem('velaro_guest_wishlist');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      try {
        const cached = localStorage.getItem('velaro_guest_wishlist');
        if (cached) setItems(JSON.parse(cached));
      } catch {}
      return;
    }
    setLoading(true);
    try {
      const res = await wishlistApi.getWishlist();
      if (res.data?.success) {
        // Backend returns data.wishlist.products or data.items
        const list = res.data.data?.wishlist?.products || res.data.data?.items || [];
        setItems(list);
      }
    } catch (err) {
      console.warn('Wishlist sync warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    const isSaved = items.some((item) => (item.product?._id || item.product?.id || item.product) === productId);

    if (!user) {
      // Allow guest saving directly to local archive so it works seamlessly!
      let updated;
      if (isSaved) {
        updated = items.filter((item) => (item.product?._id || item.product?.id || item.product) !== productId);
      } else {
        updated = [...items, { product, addedAt: new Date() }];
      }
      setItems(updated);
      try {
        localStorage.setItem('velaro_guest_wishlist', JSON.stringify(updated));
      } catch {}
      return;
    }

    // Authenticated user sync
    try {
      if (isSaved) {
        // Optimistic UI update
        setItems((prev) => prev.filter((item) => (item.product?._id || item.product?.id || item.product) !== productId));
        await wishlistApi.removeFromWishlist(productId);
      } else {
        // Optimistic UI update
        setItems((prev) => [...prev, { product, addedAt: new Date() }]);
        await wishlistApi.addToWishlist(productId);
      }
      await fetchWishlist();
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      // Re-fetch to ensure sync
      fetchWishlist();
    }
  };

  const isInWishlist = (productId) => {
    return items.some((item) => (item.product?._id || item.product?.id || item.product) === productId);
  };

  return (
    <WishlistContext.Provider value={{ items, loading, toggleWishlist, isInWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};


export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
