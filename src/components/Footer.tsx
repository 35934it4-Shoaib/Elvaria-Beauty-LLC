import React, { useState } from 'react';
import { Mail, Check, AlertCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { BRAND_IDENTITY } from '../data/config';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    setNewsletterStatus('loading');
    try {
      const res = await api.subscribeNewsletter(email);
      if (res.success) {
        setNewsletterStatus('success');
        setNewsletterMessage(res.message);
        setEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(res.error || 'Failed to subscribe.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <footer id="main-footer" className="bg-[#EFEAE2] border-t border-[#E8E4DC] text-[#1C201D] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Promise Section (Section 17) */}
        <div className="border-b border-[#DCDDD8] pb-12 mb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#4E6155]">
              Thoughtful Everyday Skin Comfort
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1C201D]">
              Stay in the know about better skin care.
            </h3>
            <p className="text-[#555C56] text-sm max-w-lg leading-relaxed">
              Join our email circle for thoughtful routine guides, active ingredient highlights, and early access to new soothing body care formulas.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white border border-[#E8E4DC] px-4 py-3.5 text-xs text-[#1C201D] placeholder:text-[#828C84] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-[#4E6155] text-white px-7 py-3.5 text-xs tracking-wider uppercase font-semibold hover:bg-[#3D4C43] rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {newsletterStatus === 'loading' ? 'Joining...' : 'JOIN THE LIST'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {newsletterStatus === 'success' && (
                <p className="text-xs text-[#2E6B48] flex items-center gap-1.5 pt-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {newsletterMessage}
                </p>
              )}
              {newsletterStatus === 'error' && (
                <p className="text-xs text-[#A33833] flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Navigation Columns (Section 18) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          {/* Column 1: SHOP */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1C201D]">Shop</h4>
            <ul className="space-y-2.5 text-xs text-[#555C56]">
              <li>
                <button onClick={() => onNavigate('/products')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=body-care')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Body Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/product/elvaria-medicated-body-lotion')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Medicated Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop?category=moisturizers')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Moisturizers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/tools-accessories')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer font-medium text-[#4E6155]">
                  Tools & Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: HELP */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1C201D]">Help</h4>
            <ul className="space-y-2.5 text-xs text-[#555C56]">
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  FAQ & Care Help
                </button>
              </li>
              <li>
  <button onClick={() => onNavigate('/payment-security')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
    Payment & Security
  </button>
</li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shipping-policy')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/refund-policy')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Track Your Order
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1C201D]">About</h4>
            <ul className="space-y-2.5 text-xs text-[#555C56]">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  About ELVARIA BEAUTY
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Our Approach
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ingredients')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Ingredients Glossary
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/saved-items')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Saved Items
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: LEGAL */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1C201D]">Legal</h4>
            <ul className="space-y-2.5 text-xs text-[#555C56]">
              <li>
                <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms-and-conditions')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shipping-policy')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/refund-policy')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cancellation-policy')} className="hover:text-[#4E6155] transition-colors text-left cursor-pointer">
                  Order Cancellation Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer Box */}
        <div className="bg-[#FBF9F5] border border-[#E8E4DC] p-5 rounded-2xl text-[11px] text-[#6A736C] leading-relaxed mb-8">
          <p className="font-semibold text-[#1C201D] mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4E6155]" />
            <span>Cosmetic Hydration & Regulatory Safety Notice</span>
          </p>
          <p>
            {settings?.medicalDisclaimer ||
              'ELVARIA BEAUTY formulations are non-prescription cosmetic body care products designed for skin moisturization and comfort. Statements on this website have not been evaluated by regulatory health authorities. ELVARIA BEAUTY products do not claim to diagnose, cure, mitigate, treat, or prevent medical skin diseases, clinical eczema, or psoriasis. Always follow product packaging directions.'}
          </p>
        </div>

        {/* Bottom Strip: Brand, Copyright & Payment Badges */}
        <div className="border-t border-[#DCDDD8] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#828C84]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-serif text-sm font-semibold tracking-wider text-[#1C201D]">
              {BRAND_IDENTITY.name}
            </span>
            <span>&copy; {new Date().getFullYear()} {BRAND_IDENTITY.legalName}. All rights reserved.</span>
            <span>•</span>
            <span>Currency: <strong>USD ($)</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-2.5 py-1 bg-white rounded-md border border-[#DCDDD8] text-[10px] font-mono font-medium text-[#464D47]">
              VISA
            </div>
            <div className="px-2.5 py-1 bg-white rounded-md border border-[#DCDDD8] text-[10px] font-mono font-medium text-[#464D47]">
              MASTERCARD
            </div>
            <div className="px-2.5 py-1 bg-white rounded-md border border-[#DCDDD8] text-[10px] font-mono font-medium text-[#464D47]">
              AMEX
            </div>
            <div className="px-2.5 py-1 bg-white rounded-md border border-[#DCDDD8] text-[10px] font-mono font-medium text-[#464D47]">
              STRIPE
            </div>
            <div className="px-2.5 py-1 bg-white rounded-md border border-[#DCDDD8] text-[10px] font-mono font-medium text-[#464D47]">
              APPLE PAY
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
