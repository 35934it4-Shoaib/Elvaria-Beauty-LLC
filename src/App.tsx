/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuickViewModal } from './components/QuickViewModal';
import { ReviewModal } from './components/ReviewModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ToolsAccessoriesPage } from './pages/ToolsAccessoriesPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { IngredientsPage } from './pages/IngredientsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { Product } from './types';

const MainApp: React.FC = () => {
  // Client-side routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Global modals and drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: '',
    productName: '',
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReviewModal = (productId: string, productName: string) => {
    setReviewModalData({
      isOpen: true,
      productId,
      productName,
    });
  };

  const handleCloseReviewModal = () => {
    setReviewModalData((prev) => ({ ...prev, isOpen: false }));
  };

  // Route matching
  const renderCurrentPage = () => {
    // Check for /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').split('/')[0];
      return (
        <ProductPage
          slug={slug || 'elvaria-medicated-body-lotion'}
          onNavigate={navigate}
          onOpenReviewModal={handleOpenReviewModal}
        />
      );
    }

    // Check for /order-confirmation/:id
    if (currentPath.startsWith('/order-confirmation/')) {
      const orderId = currentPath.replace('/order-confirmation/', '').split('/')[0];
      return <OrderConfirmationPage orderId={orderId} onNavigate={navigate} />;
    }

    // Check for /search or /search?q=...
    if (currentPath.startsWith('/search')) {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q') || '';
      return (
        <SearchResultsPage
          initialQuery={query}
          onNavigate={navigate}
          onQuickView={setQuickViewProduct}
        />
      );
    }

    // Check for /shop or /products with optional query params
    if (currentPath.startsWith('/shop') || currentPath.startsWith('/products')) {
      let cat = 'all';
      if (currentPath.includes('category=')) {
        const match = currentPath.match(/category=([^&]+)/);
        if (match) {
          cat = decodeURIComponent(match[1]);
        }
      }
      return <ShopPage onNavigate={navigate} onQuickView={setQuickViewProduct} initialCategory={cat} />;
    }

    if (currentPath.startsWith('/category/')) {
      const cat = currentPath.replace('/category/', '').split('/')[0].split('?')[0];
      return <ShopPage onNavigate={navigate} onQuickView={setQuickViewProduct} initialCategory={cat} />;
    }

    switch (currentPath) {
      case '/tools-accessories':
        return <ToolsAccessoriesPage onNavigate={navigate} onQuickView={setQuickViewProduct} />;
      case '/cart':
        return <CartPage onNavigate={navigate} />;
      case '/checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case '/ingredients':
        return <IngredientsPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/faq':
        return <FAQPage onNavigate={navigate} />;
      case '/saved-items':
      case '/wishlist':
      case '/account/wishlist':
        return <WishlistPage onNavigate={navigate} onQuickView={setQuickViewProduct} />;
      case '/account':
      case '/account/orders':
      case '/account/profile':
      case '/login':
      case '/register':
        return <AccountPage onNavigate={navigate} />;
      case '/admin':
      case '/admin/products':
      case '/admin/orders':
      case '/admin/categories':
      case '/admin/customers':
      case '/admin/settings':
        return <AdminPage onNavigate={navigate} />;
      case '/privacy-policy':
      case '/privacy':
        return <PrivacyPolicyPage />;
      case '/terms-and-conditions':
      case '/terms':
        return <TermsPage />;
      case '/shipping-policy':
      case '/shipping':
        return <ShippingPolicyPage />;
      case '/refund-policy':
      case '/refund':
      case '/returns':
        return <RefundPolicyPage />;
      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onOpenReviewModal={handleOpenReviewModal}
            onQuickView={setQuickViewProduct}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C201D] selection:bg-[#4E6155] selection:text-white">
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Global Navigation Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Drawers & Floating Buttons */}
      <CartDrawer onNavigate={navigate} />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />
      <WhatsAppButton />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={navigate}
      />

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={reviewModalData.isOpen}
        onClose={handleCloseReviewModal}
        productId={reviewModalData.productId}
        productName={reviewModalData.productName}
      />
    </div>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
