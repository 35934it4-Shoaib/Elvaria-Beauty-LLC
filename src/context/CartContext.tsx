import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { useSettings } from './SettingsContext';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, bundleId?: string) => void;
  removeFromCart: (productId: string, bundleId?: string) => void;
  updateQuantity: (productId: string, quantity: number, bundleId?: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  appliedCoupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    calculatedDiscount: number;
  } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  removeCoupon: () => void;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    calculatedDiscount: number;
  } | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('elvaria_cart') || localStorage.getItem('dermavea_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse cart storage:', e);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elvaria_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart storage:', e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity: number = 1, bundleId?: string) => {
    let unitPrice = product.salePrice || product.price;
    if (bundleId && product.bundles) {
      const b = product.bundles.find((bd) => bd.id === bundleId);
      if (b) unitPrice = b.price;
    }

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.selectedBundleId === bundleId
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIdx].quantity + quantity);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          unitPrice,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.stock, quantity),
          selectedBundleId: bundleId,
          unitPrice,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeFromCart = (productId: string, bundleId?: string) => {
    setItems((prev) =>
      prev.filter((it) => !(it.product.id === productId && it.selectedBundleId === bundleId))
    );
  };

  const updateQuantity = (productId: string, quantity: number, bundleId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, bundleId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => {
        if (it.product.id === productId && it.selectedBundleId === bundleId) {
          const clamped = Math.min(it.product.stock, quantity);
          return { ...it, quantity: clamped };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItemsCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);

  const freeShippingThreshold = settings?.freeShippingThreshold || 3000;
  const standardShippingFee = settings?.standardShippingFee || 200;

  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : standardShippingFee;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Recalculate coupon discount when subtotal changes
  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;

  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      return { success: false, error: 'Please enter a coupon code.', message: 'Please enter a coupon code.' };
    }
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        return { success: true, message: 'Coupon applied successfully.' };
      }
      return {
        success: false,
        error: res.error || 'Invalid promotional code.',
        message: res.error || 'Invalid promotional code.',
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Failed to validate coupon.',
        message: e.message || 'Failed to validate coupon.',
      };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        discountAmount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        freeShippingThreshold,
        remainingForFreeShipping,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
