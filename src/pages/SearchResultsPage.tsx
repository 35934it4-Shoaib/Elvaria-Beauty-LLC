import React, { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface SearchResultsPageProps {
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
  initialQuery?: string;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  onNavigate,
  onQuickView,
  initialQuery = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getProducts();
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load products for search:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const results = products.filter((p) => {
    const matchesSearch =
      !searchTerm.trim() ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Input */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-4">
            Search ELVARIA BEAUTY
          </h1>
          <p className="text-sm text-[#555C56] mb-6">
            Find formulas, tools, and everyday skin comfort essentials.
          </p>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, concern, ingredient, or tool..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-[#E8E4DC] text-sm text-[#1C201D] placeholder:text-[#828C84] focus:outline-hidden focus:ring-2 focus:ring-[#4E6155] shadow-xs"
              autoFocus
            />
            <Search className="w-5 h-5 text-[#828C84] absolute left-4 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#828C84] hover:text-[#1C201D]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-[#555C56]">
            <span className="text-[#828C84]">Popular searches:</span>
            {['Medicated Body Lotion', 'Dry Brush', 'Ceramides', 'Back Applicator', 'Sensitive Skin'].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setSearchTerm(s)}
                  className="px-2.5 py-1 rounded-full bg-[#EFEAE2] hover:bg-[#DDE5DF] text-[#1C201D] transition-colors"
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-[#555C56] mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#4E6155] text-white'
                    : 'bg-white text-[#555C56] border border-[#E8E4DC] hover:bg-[#EFEAE2]'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#828C84]">
            {results.length} result{results.length === 1 ? '' : 's'} found
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-[#E8E4DC]" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E4DC] p-8 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto mb-4 text-[#4E6155]">
              <Search className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl text-[#1C201D] mb-2">
              We couldn&apos;t find what you&apos;re looking for
            </h2>
            <p className="text-sm text-[#555C56] mb-6">
              Try searching with another keyword or explore our full collection of skin comfort essentials.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                onNavigate('/shop');
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4E6155] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#3D4C43] transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
