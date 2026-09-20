import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';
import { User, Package, LogOut, Shield, MapPin, Mail, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, login, register, logout } = useAuth();
  const { settings } = useSettings();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Logged-in state data
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const loadUserOrders = async () => {
        try {
          setOrdersLoading(true);
          const res = await api.getOrders();
          if (res.success) {
            // Filter user orders or all orders if admin
            const userOrders = res.orders.filter(
              (o) => o.customerId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
            );
            setOrders(userOrders);
          }
        } catch (e) {
          console.error('Failed to load user orders:', e);
        } finally {
          setOrdersLoading(false);
        }
      };
      loadUserOrders();
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setAuthError(res.error || 'Failed to sign in.');
        }
      } else {
        if (!name.trim()) {
          setAuthError('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password, phone);
        if (!res.success) {
          setAuthError(res.error || 'Failed to create account.');
        }
      }
    } catch {
      setAuthError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = async () => {
    setLoading(true);
    await login('customer@elvariabeauty.com', 'customer123');
    setLoading(false);
  };

  const handleDemoAdminLogin = async () => {
    setLoading(true);
    await login('admin@elvariabeauty.com', 'admin123');
    setLoading(false);
    onNavigate('/admin');
  };

  if (!user) {
    return (
      <div id="account-auth-page" className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
            ELVARIA BEAUTY Account
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#202420]">
            {authMode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
          </h1>
          <p className="text-xs text-[#68706B]">
            Track orders, save delivery addresses, and view your purchase history.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-[#EFEAE2] border border-[#DCDDD8] p-4 rounded-xs space-y-2">
          <span className="text-[11px] font-semibold text-[#202420] block">
            Quick One-Click Demo Access:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoCustomerLogin}
              className="bg-white border border-[#DCDDD8] text-[11px] font-semibold text-[#202420] py-2 px-2 hover:bg-[#F7F5F0] transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="bg-[#62756A] text-[11px] font-semibold text-white py-2 px-2 hover:bg-[#202420] transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex border-b border-[#DCDDD8]">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              authMode === 'login'
                ? 'border-[#62756A] text-[#202420]'
                : 'border-transparent text-[#68706B] hover:text-[#202420]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              authMode === 'register'
                ? 'border-[#62756A] text-[#202420]'
                : 'border-transparent text-[#68706B] hover:text-[#202420]'
            }`}
          >
            New Account
          </button>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ayesha Malik"
                className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
            />
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#202420] font-semibold uppercase tracking-wider mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F7F5F0] border border-[#DCDDD8] p-2.5 text-xs text-[#202420] focus:outline-none focus:border-[#62756A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#62756A] text-[#F7F5F0] py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors"
          >
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    );
  }

  // Logged-in View
  return (
    <div id="account-dashboard" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* User Header */}
      <div className="bg-white border border-[#DCDDD8] p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
            Welcome Back
          </span>
          <h1 className="font-heading text-2xl font-bold text-[#202420] mt-1">
            {user.name}
          </h1>
          <p className="text-xs text-[#68706B] mt-0.5">
            {user.email} &bull; {user.phone || 'Pakistan'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('/admin')}
              className="bg-[#202420] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#62756A] transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            onClick={logout}
            className="border border-[#DCDDD8] text-[#202420] px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#EFEAE2] transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders History */}
      <div className="bg-white border border-[#DCDDD8] p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-[#DCDDD8] pb-4">
          <h2 className="font-heading text-base font-bold text-[#202420] uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-[#62756A]" />
            <span>Order History ({orders.length})</span>
          </h2>
        </div>

        {ordersLoading ? (
          <div className="py-8 text-center text-xs text-[#68706B]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-xs text-[#68706B]">You haven't placed any orders with ELVARIA BEAUTY yet.</p>
            <button
              onClick={() => onNavigate('/shop')}
              className="bg-[#62756A] text-[#F7F5F0] px-5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#202420]"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#DCDDD8]">
            {orders.map((order) => (
              <div
                key={order.id}
                className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#202420]">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-[#DDE5DF] text-[#62756A] rounded">
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#68706B] mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} &bull; {order.items.length} item(s) &bull;{' '}
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-[#202420]">
                    {formatPrice(order.totalAmount, settings.currency)}
                  </span>
                  <button
                    onClick={() => onNavigate(`/order-confirmation/${order.id}`)}
                    className="text-xs text-[#62756A] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
