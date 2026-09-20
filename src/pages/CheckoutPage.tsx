import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import { Address } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Tag,
  Globe,
  Smartphone,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'WW', name: 'Other / International' },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();

  // Contact Info
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : '');

  // Shipping Address
  const [country, setCountry] = useState('United States');
  const [stateProvince, setStateProvince] = useState('California');
  const [city, setCity] = useState('Los Angeles');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // UI State
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (items.length === 0) {
    return (
      <div id="checkout-empty-state" className="min-h-screen bg-[#FBF9F5] pt-32 pb-24">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto text-[#4E6155]">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#1C201D]">
            Your Bag is Empty
          </h2>
          <p className="text-sm text-[#555C56]">
            Add our daily body lotion or barrier replenishing formulas before proceeding to checkout.
          </p>
          <button
            onClick={() => onNavigate('/shop')}
            className="bg-[#4E6155] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#3D4C43] transition-colors cursor-pointer"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message || 'Invalid coupon code');
    } else {
      setCouponInput('');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!email.trim() || !phone.trim() || !firstName.trim() || !streetAddress.trim() || !city.trim()) {
      setOrderError('Please fill out all required customer information and shipping fields.');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);

      const shippingAddress: Address = {
        fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        phone: phone.trim(),
        street: apartment.trim() ? `${streetAddress.trim()}, ${apartment.trim()}` : streetAddress.trim(),
        city: city.trim(),
        province: stateProvince.trim(),
        postalCode: postalCode.trim() || '00000',
        country: country,
      };

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        variantName: item.variantName || item.product.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));

      const res = await api.createOrder({
        userId: user?.id,
        customerName: shippingAddress.fullName,
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        shippingAddress,
        items: orderItems,
        subtotal,
        shippingFee,
        discountAmount,
        couponCode: appliedCoupon?.code,
        totalAmount: total,
        paymentMethod: paymentMethod === 'card' ? 'credit_card' : paymentMethod === 'apple_pay' ? 'apple_pay' : 'cod',
        notes: notes.trim() || undefined,
      });

      if (res.success && res.order) {
        clearCart();
        onNavigate(`/order-confirmation/${res.order.id}`);
      } else {
        setOrderError(res.message || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setOrderError(err.message || 'A network error occurred while placing your order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="checkout-page" className="min-h-screen bg-[#FBF9F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/cart')}
            className="text-xs text-[#555C56] hover:text-[#1C201D] flex items-center gap-1.5 font-medium cursor-pointer"
          >
            ← Return to Bag
          </button>
          <div className="flex items-center gap-2 text-xs text-[#828C84]">
            <ShieldCheck className="w-4 h-4 text-[#4E6155]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {orderError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{orderError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Checkout Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Info */}
            <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4E6155] text-white text-xs flex items-center justify-center font-serif font-bold">
                  1
                </span>
                <h2 className="font-serif text-lg font-medium text-[#1C201D]">
                  Customer Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@example.com"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                  <span className="text-[11px] text-[#828C84] mt-1 block">
                    Your tracking link and order receipt will be sent here.
                  </span>
                </div>

                <div>
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Sarah"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div>
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Jenkins"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Mobile / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4E6155] text-white text-xs flex items-center justify-center font-serif font-bold">
                  2
                </span>
                <h2 className="font-serif text-lg font-medium text-[#1C201D]">
                  Shipping Destination
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Country / Region *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155] cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Street Address & House / Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="742 Evergreen Terrace"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div>
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Apartment, Suite, Unit (Optional)
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div>
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Springfield"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div>
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    State / Province / Region
                  </label>
                  <input
                    type="text"
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    placeholder="California"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div>
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="90210"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1C201D] font-medium mb-1.5">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave at front porch or gate code #1234"
                    className="w-full bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl p-3 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#4E6155] text-white text-xs flex items-center justify-center font-serif font-bold">
                  3
                </span>
                <h2 className="font-serif text-lg font-medium text-[#1C201D]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {/* Credit Card */}
                <label
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-[#4E6155] bg-[#EFEAE2]/60'
                      : 'border-[#E8E4DC] bg-white hover:border-[#828C84]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-[#4E6155] focus:ring-[#4E6155] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#4E6155]" />
                        <span className="font-medium text-xs text-[#1C201D]">
                          Credit or Debit Card
                        </span>
                      </div>
                      <span className="text-[11px] text-[#828C84]">Visa, MC, Amex</span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-[#E8E4DC] space-y-3">
                        <div>
                          <label className="block text-[11px] font-medium text-[#1C201D] mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 •••• •••• 4242"
                            className="w-full bg-white border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#1C201D] font-mono focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-[#1C201D] mb-1">
                              Exp (MM / YY)
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                              className="w-full bg-white border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#1C201D] font-mono focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#1C201D] mb-1">
                              CVC / CVV
                            </label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              className="w-full bg-white border border-[#E8E4DC] rounded-xl p-2.5 text-xs text-[#1C201D] font-mono focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Apple Pay / Google Pay */}
                <label
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#4E6155] bg-[#EFEAE2]/60'
                      : 'border-[#E8E4DC] bg-white hover:border-[#828C84]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="apple_pay"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="mt-1 text-[#4E6155] focus:ring-[#4E6155] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#4E6155]" />
                      <span className="font-medium text-xs text-[#1C201D]">
                        Apple Pay / Google Pay
                      </span>
                    </div>
                    <p className="text-[11px] text-[#828C84] mt-0.5">
                      Fast 1-click biometric verification on compatible mobile and desktop browsers.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery / Direct Wire */}
                <label
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#4E6155] bg-[#EFEAE2]/60'
                      : 'border-[#E8E4DC] bg-white hover:border-[#828C84]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#4E6155] focus:ring-[#4E6155] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#4E6155]" />
                      <span className="font-medium text-xs text-[#1C201D]">
                        Cash on Delivery / Direct Wire Transfer
                      </span>
                    </div>
                    <p className="text-[11px] text-[#828C84] mt-0.5">
                      Available for regional deliveries and qualifying wholesale or concierge skin orders.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
              <h3 className="font-serif text-lg font-medium text-[#1C201D] pb-3 border-b border-[#E8E4DC]">
                Order Summary ({items.reduce((acc, it) => acc + it.quantity, 0)} items)
              </h3>

              {/* Items preview list */}
              <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-[#EFEAE2]">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedBundleId || 'single'}`} className="pt-4 first:pt-0 flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-16 object-cover rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1C201D]">{item.product.name}</h4>
                      <p className="text-[11px] text-[#828C84]">
                        {item.variantName || item.product.size} × {item.quantity}
                      </p>
                      <span className="font-bold text-[#1C201D] block mt-1">
                        {formatPrice(item.unitPrice * item.quantity, settings.currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-[#E8E4DC]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#EFEAE2] px-3.5 py-2.5 rounded-xl border border-[#DCDDD8] text-xs">
                    <div className="flex items-center gap-1.5 text-[#4E6155] font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon applied: {appliedCoupon.code}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-[#A33833] hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Discount code (e.g. WELCOME10)"
                        className="flex-1 uppercase bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl px-3.5 py-2 text-xs text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-[#202420] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xl hover:bg-[#383D39] transition-colors cursor-pointer"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-[#A33833]">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Calculations */}
              <div className="space-y-2 text-xs text-[#555C56] pt-2 border-t border-[#E8E4DC]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C201D]">
                    {formatPrice(subtotal, settings.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
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
                <div className="flex justify-between text-base font-serif font-bold text-[#1C201D] pt-3 border-t border-[#EFEAE2]">
                  <span>Total Due</span>
                  <span>{formatPrice(total, settings.currency)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                id="submit-order-button"
                type="submit"
                disabled={loading}
                className="w-full bg-[#4E6155] hover:bg-[#3D4C43] text-white py-4 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading ? 'Confirming Order...' : `Complete Order • ${formatPrice(total, settings.currency)}`}
                </span>
              </button>

              <div className="text-[11px] text-[#828C84] text-center space-y-1 pt-1 leading-relaxed">
                <p>30-Day Skin Comfort Guarantee: Easy returns on qualifying orders.</p>
                <p>Protected by 256-bit bank-grade encryption.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
