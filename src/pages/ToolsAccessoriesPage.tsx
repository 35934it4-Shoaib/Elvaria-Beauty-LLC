import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORY_ASSETS } from '../data/config';

interface ToolsAccessoriesPageProps {
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const ToolsAccessoriesPage: React.FC<ToolsAccessoriesPageProps> = ({
  onNavigate,
  onQuickView,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'application' | 'brushes' | 'bath' | 'travel'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getProducts();
        if (res.success) {
          const tools = res.products.filter(
            (p) => p.category === 'Tools & Accessories' || p.category.toLowerCase().includes('tool')
          );
          setProducts(tools);
        }
      } catch (err) {
        console.error('Failed to load tools & accessories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'application') return p.slug.includes('applicator');
    if (activeFilter === 'brushes') return p.slug.includes('brush') || p.slug.includes('scrubber');
    if (activeFilter === 'bath') return p.slug.includes('wrap') || p.slug.includes('towel');
    if (activeFilter === 'travel') return p.slug.includes('travel') || p.slug.includes('pouch');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-[#202420] text-white">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img
              src={CATEGORY_ASSETS['tools-accessories'].image}
              alt="ELVARIA BEAUTY Tools and Accessories"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 p-8 sm:p-14 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold tracking-wider uppercase mb-4 text-[#DDE5DF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Elevated Application Rituals</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl tracking-tight mb-4 text-[#F7F5F0]">
              Tools & Accessories
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Crafted to complement your daily ELVARIA BEAUTY body-care regimen. From ergonomic long-reach lotion applicators to natural bristle dry brushes and travel pump locks.
            </p>
            <div className="flex items-center gap-6 text-xs text-[#DDE5DF]">
              <div>• FSC Beechwood & Natural Bristles</div>
              <div>• Hygienic Food-Grade Silicone</div>
              <div>• 100% Spill-Safe Travel Accessories</div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            <span className="text-xs font-medium text-[#555C56] mr-2 flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Category:
            </span>
            {[
              { id: 'all', label: 'All Accessories' },
              { id: 'application', label: 'Application Tools' },
              { id: 'brushes', label: 'Brushes & Scrubbers' },
              { id: 'bath', label: 'Bath & Towel Care' },
              { id: 'travel', label: 'Travel Accessories' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-[#4E6155] text-white shadow-xs'
                    : 'bg-white text-[#555C56] hover:bg-[#EFEAE2] border border-[#E8E4DC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#828C84]">
            Showing {filteredProducts.length} crafted tools
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-[#E8E4DC] h-96" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DC] p-8">
            <h3 className="font-serif text-lg text-[#1C201D] mb-2">No tools in this category</h3>
            <p className="text-sm text-[#555C56] mb-6">Explore our full line of accessories or view all skincare products.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-6 py-2.5 bg-[#4E6155] text-white text-xs font-medium uppercase tracking-wider rounded-full hover:bg-[#3D4C43] transition-colors"
            >
              View All Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
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
