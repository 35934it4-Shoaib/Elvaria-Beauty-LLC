import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { Product, Ingredient, FAQ } from '../types';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
  const { settings } = useSettings();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadSearchData();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadSearchData = async () => {
    try {
      setLoading(true);
      const [prodRes, ingRes, faqRes] = await Promise.all([
        api.getProducts(),
        api.getIngredients(),
        api.getFaqs(),
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (ingRes.success) setIngredients(ingRes.ingredients);
      if (faqRes.success) setFaqs(faqRes.faqs);
    } catch (e) {
      console.error('Failed to load search data:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.shortDescription.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredIngredients = cleanQuery
    ? ingredients.filter(
        (i) =>
          i.name.toLowerCase().includes(cleanQuery) ||
          i.shortDescription.toLowerCase().includes(cleanQuery) ||
          i.function.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredFaqs = cleanQuery
    ? faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(cleanQuery) ||
          f.answer.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults = filteredProducts.length + filteredIngredients.length + filteredFaqs.length;

  const handleSelect = (path: string) => {
    onClose();
    onNavigate(path);
  };

  return (
    <div id="search-overlay" className="fixed inset-0 z-50 bg-[#F7F5F0]/98 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
        {/* Top bar with close button */}
        <div className="flex justify-between items-center pb-6 border-b border-[#DCDDD8]">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
            ELVARIA BEAUTY Search
          </span>
          <button
            onClick={onClose}
            className="p-2 text-[#68706B] hover:text-[#202420] transition-colors rounded-full hover:bg-[#EFEAE2]"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="py-8 border-b border-[#DCDDD8]">
          <div className="relative flex items-center">
            <Search className="w-8 h-8 text-[#62756A] absolute left-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, ingredients, FAQs, or routine advice..."
              className="w-full pl-12 pr-4 text-xl sm:text-2xl font-heading text-[#202420] placeholder-[#68706B]/60 bg-transparent border-none focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-[#68706B] hover:text-[#202420] uppercase font-semibold tracking-wider"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-2">
            <span className="text-xs text-[#68706B] font-medium mr-2">Popular:</span>
            {['Body Lotion', 'Ceramides', 'Dry Skin', 'How to Use', 'Sensitive Skin', 'Glycerin'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs bg-[#EFEAE2] hover:bg-[#DDE5DF] text-[#202420] px-3 py-1 rounded-full transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="py-8">
          {cleanQuery ? (
            totalResults === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-lg font-heading text-[#202420] font-semibold">
                  We couldn't find what you're looking for.
                </p>
                <p className="text-sm text-[#68706B] max-w-md mx-auto">
                  Try checking your spelling, using broader terms, or explore our curated skincare sections below.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleSelect('/shop')}
                    className="bg-[#62756A] text-[#F7F5F0] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors"
                  >
                    View All Products
                  </button>
                  <button
                    onClick={() => handleSelect('/skin-guide')}
                    className="border border-[#62756A] text-[#62756A] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#EFEAE2] transition-colors"
                  >
                    Read Skin Guide
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Products Result */}
                {filteredProducts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#62756A] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Products ({filteredProducts.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelect(`/product/${p.slug}`)}
                          className="bg-white border border-[#DCDDD8] p-4 flex gap-4 cursor-pointer hover:border-[#62756A] transition-colors group"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-16 h-20 object-cover bg-[#F7F5F0] shrink-0"
                          />
                          <div className="flex-1">
                            <h4 className="font-heading text-sm font-semibold text-[#202420] group-hover:text-[#62756A] transition-colors">
                              {p.name}
                            </h4>
                            <p className="text-xs text-[#68706B] line-clamp-2 mt-1">
                              {p.shortDescription}
                            </p>
                            <div className="mt-2 text-xs font-semibold text-[#202420]">
                              {formatPrice(p.salePrice || p.price, settings.currency)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients Result */}
                {filteredIngredients.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#62756A] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Ingredients ({filteredIngredients.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredIngredients.map((ing) => (
                        <div
                          key={ing.id}
                          onClick={() => handleSelect('/ingredients')}
                          className="bg-white border border-[#DCDDD8] p-4 cursor-pointer hover:border-[#62756A] transition-colors group"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-heading text-sm font-semibold text-[#202420] group-hover:text-[#62756A] transition-colors">
                              {ing.name}
                            </h4>
                            <span className="text-[10px] bg-[#EFEAE2] text-[#62756A] px-2 py-0.5 rounded font-mono">
                              {ing.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#68706B] mt-1.5 line-clamp-2">
                            {ing.shortDescription}
                          </p>
                          <div className="mt-2 text-[11px] text-[#62756A] font-medium flex items-center gap-1">
                            <span>Explore Ingredient Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Results */}
                {filteredFaqs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#62756A] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" /> Questions & Answers ({filteredFaqs.length})
                    </h3>
                    <div className="space-y-3">
                      {filteredFaqs.map((faq) => (
                        <div
                          key={faq.id}
                          onClick={() => handleSelect('/faq')}
                          className="bg-white border border-[#DCDDD8] p-4 cursor-pointer hover:border-[#62756A] transition-colors"
                        >
                          <h4 className="text-sm font-semibold text-[#202420]">
                            {faq.question}
                          </h4>
                          <p className="text-xs text-[#68706B] mt-1.5 line-clamp-2 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
              <div
                onClick={() => handleSelect('/shop')}
                className="bg-white border border-[#DCDDD8] p-6 cursor-pointer hover:border-[#62756A] transition-colors"
              >
                <span className="text-[11px] uppercase tracking-widest text-[#62756A] font-semibold block mb-1">
                  Product Catalog
                </span>
                <h4 className="font-heading text-base font-semibold text-[#202420] mb-2">
                  ELVARIA Medicated Body Lotion
                </h4>
                <p className="text-xs text-[#68706B] leading-relaxed mb-4">
                  Explore bottle sizes, daily duos, and routine bundles designed for dry-feeling skin.
                </p>
                <span className="text-xs font-semibold text-[#62756A] flex items-center gap-1">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => handleSelect('/ingredients')}
                className="bg-white border border-[#DCDDD8] p-6 cursor-pointer hover:border-[#62756A] transition-colors"
              >
                <span className="text-[11px] uppercase tracking-widest text-[#62756A] font-semibold block mb-1">
                  Formula Insights
                </span>
                <h4 className="font-heading text-base font-semibold text-[#202420] mb-2">
                  Thoughtful Ingredients
                </h4>
                <p className="text-xs text-[#68706B] leading-relaxed mb-4">
                  Learn about Glycerin, Ceramides, and Panthenol and how they assist skin comfort.
                </p>
                <span className="text-xs font-semibold text-[#62756A] flex items-center gap-1">
                  View Ingredients <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <div
                onClick={() => handleSelect('/skin-guide')}
                className="bg-white border border-[#DCDDD8] p-6 cursor-pointer hover:border-[#62756A] transition-colors"
              >
                <span className="text-[11px] uppercase tracking-widest text-[#62756A] font-semibold block mb-1">
                  Skin Care Advice
                </span>
                <h4 className="font-heading text-base font-semibold text-[#202420] mb-2">
                  Daily Skin Comfort Guide
                </h4>
                <p className="text-xs text-[#68706B] leading-relaxed mb-4">
                  Discover recommended application timings, seasonal tips, and sensitive skin care.
                </p>
                <span className="text-xs font-semibold text-[#62756A] flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
