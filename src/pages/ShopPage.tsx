import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, ArrowUpDown } from 'lucide-react';
import { CATEGORY_ASSETS } from '../data/config';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onNavigate,
  onQuickView,
  initialCategory = 'all',
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const loadShopData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        if (prodRes.success) {
          setProducts(prodRes.products.filter((p) => p.status === 'published'));
        }
        if (catRes.success) {
          setCategories(catRes.categories);
        }
      } catch (e) {
        console.error('Failed to load shop products & categories:', e);
      } finally {
        setLoading(false);
      }
    };
    loadShopData();
  }, []);

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== 'all') {
        const catObj = categories.find(
          (c) =>
            c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
            c.name.toLowerCase() === selectedCategory.toLowerCase()
        );
        const matchName = (catObj ? catObj.name : selectedCategory).toLowerCase();
        const pCat = p.category.toLowerCase();

        if (matchName === 'moisturizers') {
          const isMoisturizer =
            pCat === 'moisturizers' ||
            pCat === 'medicated care' ||
            p.name.toLowerCase().includes('lotion') ||
            p.name.toLowerCase().includes('cream') ||
            p.name.toLowerCase().includes('balm');
          if (!isMoisturizer) return false;
        } else if (pCat !== matchName) {
          return false;
        }
      }
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

  return (
    <div id="shop-page" className="min-h-screen bg-[#FBF9F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#202420] text-white p-8 sm:p-14 shadow-xs">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs text-xs uppercase tracking-[0.2em] font-semibold text-[#DDE5DF] rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> ELVARIA BEAUTY CURATED COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] tracking-tight">
              Everyday Skin Comfort Essentials
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light max-w-xl">
              Thoughtfully formulated body lotions, barrier replenishing creams, and ergonomic daily application tools designed for skin comfort.
            </p>
          </div>
        </div>

        {/* Category Pill Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#4E6155] text-white shadow-xs'
                : 'bg-white text-[#555C56] border border-[#E8E4DC] hover:bg-[#EFEAE2]'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4E6155] text-white shadow-xs'
                    : 'bg-white text-[#555C56] border border-[#E8E4DC] hover:bg-[#EFEAE2]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-xs">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#828C84] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by concern, ingredient, or product name..."
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl text-[#1C201D] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828C84] hover:text-[#1C201D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: In-Stock Toggle & Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-[#555C56] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#E8E4DC] text-[#4E6155] focus:ring-[#4E6155] cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#828C84]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FBF9F5] border border-[#E8E4DC] rounded-xl text-xs text-[#1C201D] px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-[#4E6155] cursor-pointer"
              >
                <option value="featured">Featured & Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#828C84] px-1">
          <span>
            Showing <strong>{filteredProducts.length}</strong> formula{filteredProducts.length === 1 ? '' : 's'}
          </span>
          {(selectedCategory !== 'all' || searchTerm || inStockOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setInStockOnly(false);
              }}
              className="text-[#4E6155] hover:underline font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white border border-[#E8E4DC] rounded-2xl p-4 animate-pulse space-y-4 h-96">
                <div className="aspect-4/5 bg-[#EFEAE2] rounded-xl" />
                <div className="h-4 bg-[#EFEAE2] w-3/4 rounded" />
                <div className="h-3 bg-[#EFEAE2] w-1/2 rounded" />
                <div className="h-6 bg-[#EFEAE2] w-1/3 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <p className="font-serif text-xl text-[#1C201D]">
              No formulas matched your criteria
            </p>
            <p className="text-xs text-[#555C56] max-w-sm mx-auto leading-relaxed">
              Try adjusting your search terms or clearing selected category filters to discover ELVARIA BEAUTY products.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setInStockOnly(false);
              }}
              className="bg-[#4E6155] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-[#3D4C43] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
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
