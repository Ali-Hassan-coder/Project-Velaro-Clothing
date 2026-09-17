import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await wishlistApi.getWishlist();
      if (res.data?.success) {
        setItems(res.data.data.items || []);
      }
    } catch {
      // ignore silently or fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (product) => {
    if (!user) {
      alert('Please log in to save items to your Atelier Wishlist.');
      return;
    }
    const productId = product._id || product.id;
    const isSaved = items.some((item) => (item.product?._id || item.product) === productId);

    try {
      if (isSaved) {
        await wishlistApi.removeFromWishlist(productId);
        setItems((prev) => prev.filter((item) => (item.product?._id || item.product) !== productId));
      } else {
        await wishlistApi.addToWishlist(productId);
        await fetchWishlist();
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const isInWishlist = (productId) => {
    return items.some((item) => (item.product?._id || item.product) === productId);
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
