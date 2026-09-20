import React, { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Product } from '../types';
import { api } from '../services/api';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onQuickView }) => {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.getProducts();
        if (res.success) {
          setProducts(res.products);
        }
      } catch (e) {
        console.error('Failed to load wishlist products:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] pt-32 pb-24 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs text-[#828C84] animate-pulse">
          Loading your saved items...
        </div>
      </div>
    );
  }

  return (
    <div id="wishlist-page" className="min-h-screen bg-[#FBF9F5] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#E8E4DC] pb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#4E6155]">
              Saved Formulas
            </span>
            <h1 className="font-serif text-3xl font-medium text-[#1C201D]">
              Your Saved Items ({wishlistedProducts.length})
            </h1>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs text-[#4E6155] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-[#E8E4DC] rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto text-[#4E6155]">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl font-medium text-[#1C201D]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-[#555C56] max-w-sm mx-auto leading-relaxed">
              Explore our soothing barrier lotions, targeted treatments, and application tools to save your favorites for later.
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="bg-[#4E6155] hover:bg-[#3D4C43] text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((prod) => {
              const currentPrice = prod.salePrice || prod.price;
              return (
                <div
                  key={prod.id}
                  className="bg-white border border-[#E8E4DC] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#4E6155] transition-all"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-4/5 bg-[#FBF9F5] rounded-xl overflow-hidden">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        onClick={() => onNavigate(`/product/${prod.slug}`)}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => removeFromWishlist(prod.id)}
                        className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-xs rounded-full text-[#828C84] hover:text-[#A33833] transition-colors shadow-xs cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#4E6155] font-semibold">
                        {prod.category}
                      </span>
                      <h3
                        onClick={() => onNavigate(`/product/${prod.slug}`)}
                        className="font-serif text-base font-medium text-[#1C201D] hover:text-[#4E6155] cursor-pointer mt-0.5 line-clamp-1"
                      >
                        {prod.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-base font-bold text-[#1C201D]">
                          {formatPrice(currentPrice, settings.currency)}
                        </span>
                        {prod.salePrice && (
                          <span className="text-xs text-[#828C84] line-through">
                            {formatPrice(prod.price, settings.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EFEAE2] flex gap-2">
                    <button
                      onClick={() => addToCart(prod, 1)}
                      disabled={prod.stock <= 0}
                      className="flex-1 bg-[#4E6155] hover:bg-[#3D4C43] text-white py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{prod.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                    </button>
                    <button
                      onClick={() => onQuickView(prod)}
                      className="px-3 py-2 border border-[#E8E4DC] rounded-xl text-xs font-semibold text-[#1C201D] hover:bg-[#FBF9F5] cursor-pointer transition-colors"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
