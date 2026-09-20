import React, { useState, useEffect } from 'react';
import { CheckCircle2, Package, Truck, Clock, ArrowRight, MessageCircle, Printer } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await api.getOrder(orderId);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (e) {
        console.error('Failed to load order:', e);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-12 h-12 bg-[#EFEAE2] rounded-full mx-auto" />
        <div className="h-6 bg-[#EFEAE2] w-64 mx-auto" />
        <div className="h-32 bg-[#EFEAE2]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#202420]">Order Not Found</h2>
        <p className="text-sm text-[#68706B]">
          We could not locate this order. Please verify your reference number.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="bg-[#62756A] text-[#F7F5F0] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420]"
        >
          Return Home
        </button>
      </div>
    );
  }

  const cleanPhone = (settings?.whatsappPhone || '+18005553376').replace(/[^\d+]/g, '');
  const waHelpUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
    `Hi ELVARIA BEAUTY, I have an inquiry regarding my order ${order.orderNumber}.`
  )}`;

  const orderStages = [
    { key: 'order_placed', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Dispatched / In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStageIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending_confirmation':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(order.orderStatus);

  return (
    <div id="order-confirmation-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Success Header */}
      <div className="bg-white border border-[#DCDDD8] p-8 sm:p-12 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#DDE5DF] text-[#62756A] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A] block">
          Order Confirmed
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#202420]">
          Thank You for Your ELVARIA BEAUTY Order
        </h1>
        <p className="text-sm text-[#68706B] max-w-lg mx-auto leading-relaxed">
          Your order reference is <strong className="text-[#202420]">{order.orderNumber}</strong>. A confirmation email has been dispatched to <strong>{order.customerEmail}</strong>.
        </p>

        {order.paymentMethod === 'cod' && (
          <div className="inline-block bg-[#EFEAE2] border border-[#DCDDD8] px-4 py-2 text-xs text-[#202420] rounded-xl">
            <strong>Cash on Delivery (COD) / Direct Wire:</strong> Please prepare <strong>{formatPrice(order.totalAmount, settings.currency)}</strong> for the courier or follow transfer instructions sent to your email.
          </div>
        )}
      </div>

      {/* Interactive Tracking Timeline */}
      <div className="bg-white border border-[#DCDDD8] p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-[#DCDDD8] pb-4">
          <h2 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
            Order Tracking Status
          </h2>
          <span className="text-xs uppercase px-2.5 py-1 bg-[#DDE5DF] text-[#62756A] font-semibold rounded">
            Status: {order.orderStatus.replace('_', ' ')}
          </span>
        </div>

        {/* Timeline track */}
        <div className="grid grid-cols-5 gap-2 text-center pt-2">
          {orderStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            return (
              <div key={stage.key} className="space-y-2">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-[#62756A] text-white ring-4 ring-[#DDE5DF]'
                        : isCompleted
                        ? 'bg-[#62756A] text-white'
                        : 'bg-[#EFEAE2] text-[#68706B]'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                </div>
                <span
                  className={`text-[11px] block font-medium leading-tight ${
                    isCurrent ? 'text-[#202420] font-bold' : isCompleted ? 'text-[#62756A]' : 'text-[#68706B]'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div className="bg-[#F7F5F0] p-4 border border-[#DCDDD8] text-xs flex justify-between items-center">
            <span>
              Courier Tracking Number: <strong>{order.trackingNumber}</strong>
            </span>
            <span className="text-[#62756A] font-semibold">TCS / Leopards Courier</span>
          </div>
        )}
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Items */}
        <div className="bg-white border border-[#DCDDD8] p-6 space-y-4">
          <h3 className="font-heading text-sm font-bold text-[#202420] uppercase tracking-wider border-b border-[#DCDDD8] pb-3">
            Purchased Items
          </h3>
          <div className="divide-y divide-[#EFEAE2]">
            {order.items.map((item, i) => (
              <div key={i} className="py-3 flex gap-3 text-xs">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-14 h-16 object-cover bg-[#F7F5F0] border border-[#DCDDD8] shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#202420]">{item.productName}</h4>
                  <p className="text-[#68706B] text-[11px]">
                    Size: {item.size} &bull; Qty: {item.quantity}
                  </p>
                  <span className="font-bold text-[#202420] mt-1 block">
                    {formatPrice(item.totalPrice, settings.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#DCDDD8] pt-3 space-y-1.5 text-xs text-[#68706B]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#202420]">
                {formatPrice(order.subtotal, settings.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee, settings.currency)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#62756A] font-semibold">
                <span>Coupon Discount ({order.couponCode})</span>
                <span>-{formatPrice(order.discountAmount, settings.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-[#202420] border-t border-[#DCDDD8] pt-2">
              <span>Total Paid / Due</span>
              <span>{formatPrice(order.totalAmount, settings.currency)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Support */}
        <div className="space-y-6">
          <div className="bg-white border border-[#DCDDD8] p-6 space-y-3 text-xs">
            <h3 className="font-heading text-sm font-bold text-[#202420] uppercase tracking-wider border-b border-[#DCDDD8] pb-3">
              Shipping & Customer Info
            </h3>
            <p>
              <strong className="text-[#202420] block font-semibold">{order.shippingAddress.fullName}</strong>
              <span className="text-[#68706B]">{order.shippingAddress.streetAddress}</span>
              {order.shippingAddress.apartment && <span className="text-[#68706B]">, {order.shippingAddress.apartment}</span>}
              <br />
              <span className="text-[#68706B]">
                {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
              </span>
            </p>
            <p className="pt-2 text-[#68706B]">
              <strong>Phone:</strong> {order.customerPhone}
              <br />
              <strong>Email:</strong> {order.customerEmail}
            </p>
            <p className="pt-2 text-[#68706B]">
              <strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Card Payment'}
            </p>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-6 space-y-3 text-left">
            <h4 className="font-heading text-sm font-bold text-[#202420]">
              Have a question about your delivery?
            </h4>
            <p className="text-xs text-[#68706B] leading-relaxed">
              Our customer care team is available on WhatsApp to confirm delivery dates, special instructions, or dispatch updates.
            </p>
            <a
              href={waHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 text-xs font-semibold rounded hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Query via WhatsApp ({order.orderNumber})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
        <button
          onClick={() => window.print()}
          className="border border-[#DCDDD8] bg-white px-6 py-3 text-xs uppercase tracking-wider font-semibold text-[#202420] hover:bg-[#F7F5F0] transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>

        <button
          onClick={() => onNavigate('/shop')}
          className="bg-[#62756A] text-[#F7F5F0] px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
