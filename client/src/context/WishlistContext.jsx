import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await wishlistService.getWishlist();
      if (res && res.success && res.data) {
        setWishlistItems(res.data.items || []);
        setWishlistCount(res.data.count || 0);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const extractProductId = (productOrId) => {
    if (!productOrId) return '';
    if (typeof productOrId === 'string') return productOrId;
    return productOrId._id || productOrId.id || '';
  };

  const isInWishlist = useCallback(
    (productOrId) => {
      const targetId = extractProductId(productOrId);
      if (!targetId) return false;
      return wishlistItems.some((item) => (item._id || item.id) === targetId);
    },
    [wishlistItems]
  );

  const addToWishlist = async (productOrId) => {
    const productId = extractProductId(productOrId);
    if (!productId) return null;

    setActionLoading(true);
    setError(null);
    try {
      const res = await wishlistService.addToWishlist(productId);
      if (res && res.success && res.data) {
        setWishlistItems(res.data.items || []);
        setWishlistCount(res.data.count || 0);
        return res.data;
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromWishlist = async (productOrId) => {
    const productId = extractProductId(productOrId);
    if (!productId) return null;

    setActionLoading(true);
    setError(null);
    try {
      const res = await wishlistService.removeFromWishlist(productId);
      if (res && res.success && res.data) {
        setWishlistItems(res.data.items || []);
        setWishlistCount(res.data.count || 0);
        return res.data;
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const toggleWishlist = async (productOrId) => {
    const productId = extractProductId(productOrId);
    if (!productId) return null;

    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productOrId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        loading,
        actionLoading,
        error,
        refetchWishlist: fetchWishlist,
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

export default WishlistContext;
