import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    remainingForFreeShipping,
    freeShippingProgress,
  } = useCart();
  const { settings } = useSettings();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(couponCodeInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message || 'Invalid coupon code');
    } else {
      setCouponCodeInput('');
    }
  };

  const handleProceedCheckout = () => {
    closeCart();
    onNavigate('/checkout');
  };

  const handleViewFullCart = () => {
    closeCart();
    onNavigate('/cart');
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 overflow-hidden">
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[#E8E4DC]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4E6155]" />
              <h2 className="font-serif text-lg font-medium text-[#1C201D]">
                Shopping Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#828C84] hover:text-[#1C201D] transition-colors rounded-full hover:bg-[#EFEAE2] cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#EFEAE2] px-6 py-3 border-b border-[#E8E4DC]">
            <div className="flex items-center justify-between text-xs text-[#1C201D] mb-1.5 font-medium">
              <span>
                {remainingForFreeShipping <= 0 ? (
                  <span className="text-[#2E6B48] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Complimentary Standard Shipping unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#4E6155]">{formatPrice(remainingForFreeShipping, settings.currency)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-xs text-[#828C84]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#DCDDD8] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4E6155] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-[#EFEAE2]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-medium text-[#1C201D]">
                    Your bag is currently empty
                  </p>
                  <p className="text-xs text-[#555C56] max-w-xs mx-auto">
                    Explore daily body lotions, barrier replenishing creams, and accessories designed for skin comfort.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('/shop');
                  }}
                  className="bg-[#4E6155] hover:bg-[#3D4C43] text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedBundleId || 'single'}`;
                return (
                  <div key={itemKey} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        closeCart();
                        onNavigate(`/product/${item.product.slug}`);
                      }}
                      className="w-20 h-24 bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl overflow-hidden shrink-0 cursor-pointer"
                    >
                      <SafeImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4
                            onClick={() => {
                              closeCart();
                              onNavigate(`/product/${item.product.slug}`);
                            }}
                            className="font-serif text-sm font-medium text-[#1C201D] hover:text-[#4E6155] cursor-pointer transition-colors leading-snug"
                          >
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedBundleId)}
                            className="text-[#828C84] hover:text-[#A33833] transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#828C84] mt-0.5">
                          {item.variantName || item.product.size}
                        </p>
                      </div>

                      {/* Stepper and Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E8E4DC] rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedBundleId)}
                            className="p-1.5 text-[#555C56] hover:text-[#1C201D] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-[#1C201D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedBundleId)}
                            className="p-1.5 text-[#555C56] hover:text-[#1C201D] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#1C201D]">
                            {formatPrice(item.unitPrice * item.quantity, settings.currency)}
                          </span>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-[#828C84]">
                              {formatPrice(item.unitPrice, settings.currency)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-[#E8E4DC] bg-white p-6 space-y-4 shadow-lg">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#EFEAE2] px-3.5 py-2.5 rounded-xl border border-[#DCDDD8] text-xs">
                  <div className="flex items-center gap-1.5 text-[#4E6155] font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Coupon: {appliedCoupon.code} (-{formatPrice(appliedCoupon.calculatedDiscount, settings.currency)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#A33833] hover:underline font-medium ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Discount code (e.g. WELCOME10)"
                    className="flex-1 uppercase bg-[#FBF9F5] border border-[#E8E4DC] px-3.5 py-2 text-xs rounded-xl text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="bg-[#202420] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#383D39] transition-colors"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-[#A33833]">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#555C56]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C201D]">{formatPrice(subtotal, settings.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#2E6B48] font-semibold uppercase text-[11px]">Free</span>
                    ) : (
                      formatPrice(shippingFee, settings.currency)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E6B48] font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount, settings.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-[#1C201D] border-t border-[#EFEAE2] pt-2.5 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(total, settings.currency)}</span>
                </div>
              </div>

              {/* Checkout & Full Cart CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  id="cart-checkout-btn"
                  onClick={handleProceedCheckout}
                  className="w-full bg-[#4E6155] hover:bg-[#3D4C43] text-white py-3.5 text-xs tracking-widest uppercase font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleViewFullCart}
                  className="w-full text-center text-xs text-[#555C56] hover:text-[#1C201D] transition-colors py-1.5 font-medium cursor-pointer"
                >
                  View Full Cart & Save for Later →
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#828C84] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4E6155]" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
