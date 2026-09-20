import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Product, Order, Review, Coupon, SiteSettings } from '../types';
import { api } from '../services/api';
import { formatPrice } from '../utils/formatCurrency';
import {
  Package,
  ShoppingBag,
  Star,
  Tag,
  Settings,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Truck,
  Edit2,
  Trash2,
  Plus,
  Save,
  Search,
  Check,
  X,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, login } = useAuth();
  const { settings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'reviews' | 'coupons' | 'settings'>('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // Selected order modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState(2000);

  // Editing product modal / inline state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes, revRes, coupRes, setRes] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getReviews(),
        api.getCoupons(),
        api.getSettings(),
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (orderRes.success) setOrders(orderRes.orders);
      if (revRes.success) setReviews(revRes.reviews);
      if (coupRes.success) setCoupons(coupRes.coupons);
      if (setRes.success) setSettingsForm(setRes.settings);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick unlock if user is not admin
  const handleQuickAdminUnlock = async () => {
    await login('admin@elvariabeauty.com', 'admin123');
    loadData();
  };

  // KPI Calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.orderStatus !== 'cancelled' ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending_confirmation' || o.orderStatus === 'confirmed').length;
  const lowStockCount = products.filter((p) => p.stock < 20).length;

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    let trackingNumber = undefined;
    if (newStatus === 'shipped') {
      trackingNumber = 'TCS-' + Math.floor(100000 + Math.random() * 900000);
    }
    const res = await api.updateOrderStatus(orderId, newStatus, trackingNumber);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus, trackingNumber: trackingNumber || o.trackingNumber } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, trackingNumber: trackingNumber || selectedOrder.trackingNumber });
      }
    }
  };

  const handleReviewStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    const res = await api.moderateReview(reviewId, status);
    if (res.success) {
      setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const res = await api.updateSettings(settingsForm);
      if (res.success) {
        setSettingsMessage('Settings saved successfully. Changes updated across site.');
        refreshSettings();
      }
    } catch {
      setSettingsMessage('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const res = await api.createCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: newCouponDiscount,
      discountPercentage: newCouponType === 'percentage' ? newCouponDiscount : undefined,
      discountFixed: newCouponType === 'fixed' ? newCouponDiscount : undefined,
      minOrderAmount: newCouponMin,
      isActive: true,
      description: `${newCouponDiscount}${newCouponType === 'percentage' ? '%' : ` ${settings?.currency || 'USD'}`} off on orders over ${formatPrice(newCouponMin, settings?.currency || 'USD')}`,
    });
    if (res.success && res.coupon) {
      setCoupons([res.coupon, ...coupons]);
      setNewCouponCode('');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const res = await api.updateProduct(editingProduct.id, editingProduct);
    if (res.success) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
    }
  };

  return (
    <div id="admin-dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="bg-white border border-[#DCDDD8] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-[#202420] text-white px-2 py-0.5">
              Admin Portal
            </span>
            <span className="text-xs text-[#68706B]">ELVARIA BEAUTY Operations</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#202420] mt-1">
            Store Management & Orders
          </h1>
        </div>

        {/* Unlock Button if not signed in as admin */}
        {user?.role !== 'admin' ? (
          <button
            onClick={handleQuickAdminUnlock}
            className="bg-[#62756A] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#202420]"
          >
            One-Click Admin Login
          </button>
        ) : (
          <div className="text-xs text-[#68706B]">
            Logged in as <strong>{user.email}</strong>
          </div>
        )}
      </div>

      {/* Admin Tabs Navigation */}
      <div className="flex border-b border-[#DCDDD8] overflow-x-auto gap-2 text-xs font-semibold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'products', label: 'Products & Inventory', icon: Package },
          { id: 'orders', label: 'Orders & Shipments', icon: ShoppingBag },
          { id: 'reviews', label: 'Reviews Moderation', icon: Star },
          { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#62756A] text-[#202420]'
                  : 'border-transparent text-[#68706B] hover:text-[#202420]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#DCDDD8] p-6 space-y-2">
              <span className="text-xs text-[#68706B] uppercase tracking-wider block">Total Revenue</span>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#202420] block">
                {formatPrice(totalSales, settings?.currency || 'USD')}
              </span>
              <span className="text-[11px] text-[#62756A] block">From store orders</span>
            </div>

            <div className="bg-white border border-[#DCDDD8] p-6 space-y-2">
              <span className="text-xs text-[#68706B] uppercase tracking-wider block">Total Orders</span>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#202420] block">
                {totalOrdersCount}
              </span>
              <span className="text-[11px] text-[#68706B] block">Cash on Delivery & Cards</span>
            </div>

            <div className="bg-white border border-[#DCDDD8] p-6 space-y-2">
              <span className="text-xs text-[#68706B] uppercase tracking-wider block">Pending Actions</span>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-amber-600 block">
                {pendingOrders}
              </span>
              <span className="text-[11px] text-[#68706B] block">Awaiting confirmation / dispatch</span>
            </div>

            <div className="bg-white border border-[#DCDDD8] p-6 space-y-2">
              <span className="text-xs text-[#68706B] uppercase tracking-wider block">Catalog Items</span>
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[#202420] block">
                {products.length}
              </span>
              <span className="text-[11px] text-[#62756A] block">
                {lowStockCount > 0 ? `${lowStockCount} items low on stock` : 'Stock healthy'}
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white border border-[#DCDDD8] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
                Recent Customer Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#62756A] font-semibold hover:underline"
              >
                View All Orders &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202420]">
                <thead className="bg-[#F7F5F0] border-b border-[#DCDDD8] uppercase font-semibold text-[11px] text-[#68706B]">
                  <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD8]">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#F7F5F0]">
                      <td className="p-3 font-mono font-semibold">{order.orderNumber}</td>
                      <td className="p-3 font-medium">{order.customerName}</td>
                      <td className="p-3 text-[#68706B]">{order.shippingAddress.city}</td>
                      <td className="p-3 font-bold">{formatPrice(order.totalAmount, settings?.currency || 'USD')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-[#DDE5DF] text-[#62756A] rounded">
                          {order.orderStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-[#68706B] uppercase">{order.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#DCDDD8] p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
              Product Inventory & Pricing
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202420]">
                <thead className="bg-[#F7F5F0] border-b border-[#DCDDD8] uppercase font-semibold text-[11px] text-[#68706B]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Regular Price</th>
                    <th className="p-3">Sale Price</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD8]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F7F5F0]">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover border border-[#DCDDD8]" />
                        <div>
                          <strong className="block font-semibold">{p.name}</strong>
                          <span className="text-[11px] text-[#68706B]">{p.size}</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#68706B]">{p.category}</td>
                      <td className="p-3 font-semibold">{formatPrice(p.price, settings?.currency || 'USD')}</td>
                      <td className="p-3 font-semibold text-[#62756A]">
                        {p.salePrice ? formatPrice(p.salePrice, settings?.currency || 'USD') : '-'}
                      </td>
                      <td className="p-3">
                        <span className={`font-semibold ${p.stock < 20 ? 'text-amber-600' : 'text-[#202420]'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-[#DDE5DF] text-[#62756A] rounded">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="text-[#62756A] hover:text-[#202420] font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-[#202420]/50 flex items-center justify-center p-4">
              <div className="bg-white border border-[#DCDDD8] max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#DCDDD8] pb-3">
                  <h4 className="font-heading text-base font-bold text-[#202420]">
                    Edit Product: {editingProduct.name}
                  </h4>
                  <button onClick={() => setEditingProduct(null)} className="text-[#68706B] hover:text-[#202420]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#202420] font-semibold mb-1">Product Title</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#202420] font-semibold mb-1">
                        Regular Price ({settings?.currency || 'USD'})
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#202420] font-semibold mb-1">
                        Sale Price ({settings?.currency || 'USD'})
                      </label>
                      <input
                        type="number"
                        value={editingProduct.salePrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            salePrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#202420] font-semibold mb-1">Stock Units</label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#202420] font-semibold mb-1">Short Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.shortDescription}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#DCDDD8]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 border border-[#DCDDD8] text-xs font-semibold text-[#68706B]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#62756A] text-white text-xs uppercase font-semibold tracking-wider hover:bg-[#202420]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#DCDDD8] p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
              Customer Orders & Dispatch Management
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202420]">
                <thead className="bg-[#F7F5F0] border-b border-[#DCDDD8] uppercase font-semibold text-[11px] text-[#68706B]">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDD8]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F7F5F0]">
                      <td className="p-3 font-mono font-bold">{order.orderNumber}</td>
                      <td className="p-3 text-[#68706B]">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <strong className="block">{order.customerName}</strong>
                        <span className="text-[11px] text-[#68706B]">{order.customerPhone}</span>
                      </td>
                      <td className="p-3 text-[#68706B]">
                        {order.shippingAddress.city}, {order.shippingAddress.province}
                      </td>
                      <td className="p-3 font-bold">{formatPrice(order.totalAmount, settings?.currency || 'USD')}</td>
                      <td className="p-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className="bg-white border border-[#DCDDD8] p-1 text-[11px] rounded focus:outline-none"
                        >
                          <option value="pending_confirmation">Pending Confirmation</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped (TCS / Leopards)</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[#62756A] font-semibold hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* View Order Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-[#202420]/50 flex items-center justify-center p-4">
              <div className="bg-white border border-[#DCDDD8] max-w-lg w-full p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[#DCDDD8] pb-3">
                  <div>
                    <h4 className="font-heading text-base font-bold text-[#202420]">
                      Order {selectedOrder.orderNumber}
                    </h4>
                    <span className="text-xs text-[#68706B]">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-[#68706B] hover:text-[#202420]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <strong className="block text-[#202420]">Delivery Details:</strong>
                    <p className="text-[#68706B]">
                      {selectedOrder.shippingAddress.fullName} &bull; {selectedOrder.customerPhone}
                      <br />
                      {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.city},{' '}
                      {selectedOrder.shippingAddress.province}
                    </p>
                  </div>

                  {selectedOrder.trackingNumber && (
                    <div className="bg-[#EFEAE2] p-2.5 border border-[#DCDDD8] text-xs">
                      <strong>Tracking Number:</strong> {selectedOrder.trackingNumber} (TCS Courier)
                    </div>
                  )}

                  <div className="border-t border-[#DCDDD8] pt-2">
                    <strong className="block text-[#202420] mb-1">Items:</strong>
                    {selectedOrder.items.map((it, i) => (
                      <div key={i} className="flex justify-between py-1 text-[#68706B]">
                        <span>
                          {it.productName} ({it.size}) &times; {it.quantity}
                        </span>
                        <span className="font-semibold text-[#202420]">
                          {formatPrice(it.totalPrice, settings?.currency || 'USD')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#DCDDD8] pt-2 flex justify-between font-bold text-sm text-[#202420]">
                    <span>Total Amount:</span>
                    <span>{formatPrice(selectedOrder.totalAmount, settings?.currency || 'USD')}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-[#DCDDD8]">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-[#62756A] text-white text-xs uppercase font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. REVIEWS MODERATION TAB */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-[#DCDDD8] p-6 space-y-4">
          <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
            Customer Reviews Moderation ({reviews.length})
          </h3>

          <div className="divide-y divide-[#DCDDD8]">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-[#DCDDD8]'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#202420]">{rev.title}</span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        (rev.status === 'approved' || rev.isApproved)
                          ? 'bg-green-100 text-green-800'
                          : rev.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rev.status || (rev.isApproved ? 'approved' : 'pending')}
                    </span>
                  </div>
                  <p className="text-xs text-[#68706B]">{rev.content}</p>
                  <p className="text-[11px] text-[#68706B]">
                    By <strong>{rev.authorName}</strong> ({rev.authorEmail || 'email withheld'}) on {rev.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReviewStatus(rev.id, 'approved')}
                    className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded hover:bg-green-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReviewStatus(rev.id, 'rejected')}
                    className="px-3 py-1.5 border border-red-300 text-red-700 text-xs font-semibold rounded hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Coupon Form */}
          <div className="lg:col-span-5 bg-white border border-[#DCDDD8] p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#202420] font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. ELVARIA20"
                  className="w-full uppercase bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#202420] font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({settings?.currency || 'USD'})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#202420] font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#202420] font-semibold mb-1">
                  Minimum Order Amount ({settings?.currency || 'USD'})
                </label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#62756A] text-white py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420]"
              >
                Create Coupon
              </button>
            </form>
          </div>

          {/* Existing Coupons */}
          <div className="lg:col-span-7 bg-white border border-[#DCDDD8] p-6 space-y-4">
            <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
              Active Coupons ({coupons.length})
            </h3>
            <div className="divide-y divide-[#DCDDD8]">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#202420]">{coupon.code}</span>
                    <p className="text-[#68706B] text-[11px]">
                      {coupon.description || `Special discount on orders over ${formatPrice(coupon.minOrderAmount || 0, settings?.currency || 'USD')}`}
                    </p>
                  </div>
                  <span className="text-xs bg-[#DDE5DF] text-[#62756A] px-2.5 py-1 font-semibold rounded">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue || coupon.discountPercentage || 0}% OFF`
                      : `${formatPrice(coupon.discountValue || coupon.discountFixed || 0, settings?.currency || 'USD')} OFF`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. STORE SETTINGS TAB */}
      {activeTab === 'settings' && settingsForm && (
        <div className="bg-white border border-[#DCDDD8] p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <h3 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider">
              Store & Customer Care Settings
            </h3>
            <p className="text-xs text-[#68706B] mt-1">
              Changes here update the live WhatsApp button, contact numbers, shipping rules, and announcement bar.
            </p>
          </div>

          {settingsMessage && (
            <div className="bg-[#DDE5DF] text-[#202420] px-4 py-2.5 text-xs rounded font-medium">
              {settingsMessage}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#202420] font-semibold mb-1">Store / Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.brandName || settingsForm.storeName || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value, storeName: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#202420] font-semibold mb-1">
                  WhatsApp Care Phone (Pakistan / International)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs font-mono"
                />
                <span className="text-[10px] text-[#68706B]">Editable here — do not hard-code phone numbers.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#202420] font-semibold mb-1">Support Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail || settingsForm.supportEmail || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value, supportEmail: e.target.value })}
                  className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#202420] font-semibold mb-1">
                  Free Shipping Threshold ({settings?.currency || 'USD'})
                </label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#202420] font-semibold mb-1">Announcement Bar Message</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-[#202420] font-semibold mb-1">WhatsApp Default Welcome Message</label>
              <input
                type="text"
                value={settingsForm.whatsappDefaultMessage}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDefaultMessage: e.target.value })}
                className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="announcement-toggle"
                checked={settingsForm.announcementEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementEnabled: e.target.checked })}
                className="rounded text-[#62756A]"
              />
              <label htmlFor="announcement-toggle" className="text-xs text-[#202420]">
                Display announcement bar across all site pages
              </label>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="bg-[#62756A] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors"
            >
              {savingSettings ? 'Saving...' : 'Save Store Configuration'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
