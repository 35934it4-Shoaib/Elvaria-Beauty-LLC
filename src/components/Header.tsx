import React, { useState, useEffect } from 'react';
import {
  Search,
  User as UserIcon,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_IDENTITY } from '../data/config';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'PRODUCTS', path: '/products' },
    { label: 'TOOLS & ACCESSORIES', path: '/tools-accessories' },
    { label: 'SAVED ITEMS', path: '/saved-items' },
    { label: 'ABOUT', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'CONTACT US', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E8E4DC]'
          : 'bg-[#FBF9F5] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu toggle & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1C201D] hover:text-[#4E6155] rounded-full transition-colors focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <button
            id="header-brand-logo"
            onClick={() => handleNavClick('/')}
            className="text-left group flex items-center gap-3 focus:outline-hidden cursor-pointer"
          >
            {/* Elegant Monogram Seal */}
            <div className="w-8 h-8 rounded-full bg-[#EFEAE2] border border-[#E0D9CE] flex items-center justify-center text-[#4E6155] font-serif text-sm font-normal italic shadow-2xs group-hover:border-[#4E6155] transition-colors">
              E
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.24em] font-medium text-[#1C201D] group-hover:text-[#4E6155] transition-colors leading-none">
                ELVARIA
              </span>
              <span className="text-[9px] tracking-[0.38em] text-[#62756A] uppercase font-sans font-medium mt-1">
                BEAUTY
              </span>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation */}
        <nav id="desktop-navigation" className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/products' && (currentPath === '/shop' || currentPath.startsWith('/product/'))) ||
              (link.path === '/saved-items' && currentPath === '/wishlist');

            return (
              <button
                key={link.label}
                id={`nav-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                onClick={() => handleNavClick(link.path)}
                className={`text-[11px] tracking-[0.18em] uppercase font-semibold transition-colors duration-200 relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#4E6155] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#4E6155]'
                    : 'text-[#464D47] hover:text-[#1C201D]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            className="p-2.5 text-[#1C201D] hover:text-[#4E6155] hover:bg-[#EFEAE2] rounded-full transition-colors cursor-pointer"
            title="Search products and routines"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          {/* Account Icon */}
          <button
            id="header-account-btn"
            onClick={() => handleNavClick(user ? (isAdmin ? '/admin' : '/account') : '/account')}
            className="p-2.5 text-[#1C201D] hover:text-[#4E6155] hover:bg-[#EFEAE2] rounded-full transition-colors relative cursor-pointer"
            title={user ? (isAdmin ? 'Admin Dashboard' : `Signed in as ${user.name}`) : 'Account / Sign In'}
            aria-label="Account"
          >
            <UserIcon className="w-5 h-5 stroke-[1.75]" />
            {isAdmin && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#4E6155] text-white text-[8px] px-1 py-0.2 rounded font-mono font-bold">
                ADM
              </span>
            )}
          </button>

          {/* Saved Items / Wishlist Icon */}
          <button
            id="header-wishlist-btn"
            onClick={() => handleNavClick('/saved-items')}
            className="p-2.5 text-[#1C201D] hover:text-[#4E6155] hover:bg-[#EFEAE2] rounded-full transition-colors relative cursor-pointer"
            title="Saved Items"
            aria-label="Saved Items"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span
                id="wishlist-badge"
                className="absolute -top-0.5 -right-0.5 bg-[#4E6155] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon with Live Count */}
          <button
            id="header-cart-btn"
            onClick={openCart}
            className="p-2.5 text-[#1C201D] hover:text-[#4E6155] hover:bg-[#EFEAE2] rounded-full transition-colors relative flex items-center gap-1.5 cursor-pointer"
            title="Shopping Cart"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {totalItemsCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute -top-0.5 -right-0.5 bg-[#4E6155] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="lg:hidden bg-[#FBF9F5] border-b border-[#E8E4DC] px-6 py-6 shadow-xl animate-in slide-in-from-top-4 duration-200"
        >
          {/* Search Bar Shortcut inside Mobile Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#E8E4DC] text-xs text-[#828C84] mb-6"
          >
            <Search className="w-4 h-4 text-[#828C84]" />
            <span>Search formulas, ingredients, or tools...</span>
          </button>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path)}
                className="text-left text-sm tracking-[0.14em] uppercase font-medium text-[#1C201D] hover:text-[#4E6155] py-3 border-b border-[#EFEAE2] flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#828C84]" />
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="text-left text-sm tracking-[0.14em] uppercase font-semibold text-[#4E6155] py-3 border-b border-[#EFEAE2] flex items-center justify-between"
              >
                <span>Store Management (Admin)</span>
                <span className="bg-[#4E6155] text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Admin
                </span>
              </button>
            )}
          </nav>

          {/* Account and WhatsApp Concierge */}
          <div className="pt-6 mt-4 border-t border-[#E8E4DC] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#555C56]">
              <span>{user ? `Signed in as: ${user.name}` : 'Welcome to ELVARIA BEAUTY'}</span>
              <button
                onClick={() => handleNavClick('/account')}
                className="text-[#4E6155] font-semibold underline"
              >
                {user ? 'My Account' : 'Sign In / Register'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#828C84]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E6155]" />
              <span>Complimentary shipping on orders over $50.00</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
