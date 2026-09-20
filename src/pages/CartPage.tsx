import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, Heart, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';
import { SafeImage } from '../components/SafeImage';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold,
    remainingForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const { addToWishlist } = useWishlist();
  const { settings } = useSettings();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await applyCoupon(couponCode.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.error || 'Invalid coupon code');
    } else {
      setCouponCode('');
    }
  };

  const handleSaveForLater = (productId: string, bundleId?: string) => {
    addToWishlist(productId);
    removeFromCart(productId, bundleId);
  };

  if (items.length === 0) {
    return (
      <div id="cart-page-empty" className="min-h-screen bg-[#FBF9F5] pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto mb-6 text-[#4E6155]">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">
            Your Bag is Empty
          </h1>
          <p className="text-[#555C56] max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Discover our dermatologist-crafted body care formulas designed to hydrate, soothe, and support your natural skin barrier.
          </p>
          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-2 bg-[#4E6155] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#3D4C43] transition-colors shadow-xs cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="min-h-screen bg-[#FBF9F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#E8E4DC] pb-6 mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#4E6155]">
              Review Your Essentials
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mt-1">
              Shopping Bag ({items.reduce((acc, it) => acc + it.quantity, 0)})
            </h1>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs text-[#4E6155] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#EFEAE2] border border-[#DCDDD8] rounded-2xl p-4 sm:p-5 mb-8">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 font-medium text-[#1C201D]">
              <Truck className="w-4 h-4 text-[#4E6155]" />
              {remainingForFreeShipping <= 0 ? (
                <span className="text-[#2E6B48] font-semibold">
                  You've unlocked Free Complimentary Shipping!
                </span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="text-[#4E6155]">
                    {formatPrice(remainingForFreeShipping, settings?.currency)}
                  </strong>{' '}
                  more for Free Worldwide Shipping
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#828C84] font-semibold">
              {Math.min(100, Math.round(freeShippingProgress))}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#DCDDD8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4E6155] transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, freeShippingProgress))}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List (Left Col) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8E4DC] overflow-hidden shadow-xs divide-y divide-[#EFEAE2]">
              {items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedBundleId || 'single'}`;
                return (
                  <div key={itemKey} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    {/* Image */}
                    <div
                      onClick={() => onNavigate(`/product/${item.product.slug}`)}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-[#FBF9F5] overflow-hidden shrink-0 cursor-pointer border border-[#E8E4DC]"
                    >
                      <SafeImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-[#4E6155] uppercase tracking-wider font-semibold mb-0.5">
                            {item.product.category}
                          </div>
                          <h3
                            onClick={() => onNavigate(`/product/${item.product.slug}`)}
                            className="font-serif text-base sm:text-lg text-[#1C201D] hover:text-[#4E6155] transition-colors cursor-pointer truncate"
                          >
                            {item.product.name}
                          </h3>
                          {item.variantName && (
                            <div className="text-xs text-[#828C84] mt-0.5">
                              Selection: {item.variantName}
                            </div>
                          )}
                          <div className="text-xs text-[#828C84] mt-0.5">
                            {item.product.size}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-[#1C201D] text-base sm:text-lg">
                            {formatPrice(item.unitPrice * item.quantity, settings?.currency)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-[#828C84]">
                              {formatPrice(item.unitPrice, settings?.currency)} each
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F7F5F0]">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-[#E8E4DC] rounded-xl overflow-hidden bg-[#FBF9F5]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedBundleId)}
                            className="px-3 py-1 text-xs text-[#555C56] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-semibold text-[#1C201D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedBundleId)}
                            className="px-3 py-1 text-xs text-[#555C56] hover:bg-[#EFEAE2] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 text-xs">
                          <button
                            onClick={() => handleSaveForLater(item.product.id, item.selectedBundleId)}
                            className="flex items-center gap-1.5 text-[#555C56] hover:text-[#4E6155] transition-colors cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>Save for Later</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedBundleId)}
                            className="flex items-center gap-1.5 text-[#A33833] hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quality badge footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#E8E4DC] text-xs text-[#555C56] shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4E6155]" />
                <span>30-Day Barrier Comfort Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4E6155]" />
                <span>100% Dermatologist Inspired & Tested</span>
              </div>
            </div>
          </div>

          {/* Order Summary (Right Col) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-7 shadow-xs space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-medium text-[#1C201D] pb-3 border-b border-[#E8E4DC]">
                Summary
              </h2>

              {/* Promo code form */}
              <div>
                <label className="block text-xs font-semibold text-[#1C201D] mb-2 uppercase tracking-wider">
                  Discount Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#EFEAE2] border border-[#DCDDD8] text-xs">
                    <div>
                      <div className="font-semibold text-[#4E6155] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{appliedCoupon.code}</span>
                      </div>
                      <div className="text-[11px] text-[#555C56] mt-0.5">
                        Discount applied to order
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#A33833] hover:underline font-semibold text-xs cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. WELCOME10"
                        className="flex-1 bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3.5 py-2.5 text-xs text-[#1C201D] uppercase tracking-wider focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading}
                        className="bg-[#202420] text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#3D4C43] transition-colors cursor-pointer"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-[#A33833]">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#E8E4DC] text-xs text-[#555C56]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C201D]">
                    {formatPrice(subtotal, settings?.currency)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#2E6B48] font-semibold uppercase text-[11px]">
                        Free
                      </span>
                    ) : (
                      formatPrice(shippingFee, settings?.currency)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E6B48] font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount, settings?.currency)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#EFEAE2] flex justify-between items-baseline text-base sm:text-lg font-serif font-bold text-[#1C201D]">
                  <span>Total Due</span>
                  <span>{formatPrice(total, settings?.currency)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full bg-[#4E6155] text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-[#3D4C43] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-[#828C84] leading-relaxed">
                  Taxes calculated at checkout. Free returns on all domestic orders within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
