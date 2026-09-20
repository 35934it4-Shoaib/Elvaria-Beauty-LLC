import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.wishlistProductIds) {
      setWishlistIds(user.wishlistProductIds);
    } else {
      try {
        const local = localStorage.getItem('elvaria_wishlist') || localStorage.getItem('dermavea_wishlist');
        if (local) {
          setWishlistIds(JSON.parse(local));
        }
      } catch (e) {
        console.error('Failed to parse wishlist storage:', e);
      }
    }
  }, [user]);

  const saveWishlist = (newIds: string[]) => {
    setWishlistIds(newIds);
    if (user) {
      updateUser({ wishlistProductIds: newIds });
    } else {
      localStorage.setItem('elvaria_wishlist', JSON.stringify(newIds));
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const removeFromWishlist = (productId: string) => {
    saveWishlist(wishlistIds.filter((id) => id !== productId));
  };

  const addToWishlist = (productId: string) => {
    if (!wishlistIds.includes(productId)) {
      saveWishlist([...wishlistIds, productId]);
    }
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      saveWishlist(wishlistIds.filter((id) => id !== productId));
    } else {
      saveWishlist([...wishlistIds, productId]);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistCount: wishlistIds.length,
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
