import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();

  const isWishlisted = isInWishlist(product.id);
  const currentPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice && product.salePrice < product.price;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white border border-[#E8E4DC] rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#4E6155]/40 hover:shadow-md"
    >
      {/* Top Image Section */}
      <div
        className="relative aspect-4/5 bg-[#F7F5F0] overflow-hidden cursor-pointer"
        onClick={() => onNavigate(`/product/${product.slug}`)}
      >
        <SafeImage
          key={`${product.id}-${product.images[0] || 'default'}`}
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          enableRetry={true}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="bg-[#4E6155] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#1C201D] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              Save {formatPrice(product.price - product.salePrice!, settings.currency)}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-white text-red-600 shadow-sm'
              : 'bg-white/80 text-[#1C201D] hover:bg-white hover:text-[#4E6155]'
          }`}
          title={isWishlisted ? 'Remove from saved items' : 'Save item'}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick View Floating Action on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="bg-white/95 backdrop-blur-xs text-[#1C201D] hover:bg-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Size */}
          <div className="flex items-center justify-between text-[11px] text-[#828C84] uppercase tracking-wider mb-1.5 font-medium">
            <span>{product.category}</span>
            <span>{product.size}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onNavigate(`/product/${product.slug}`)}
            className="font-serif text-base font-medium text-[#1C201D] hover:text-[#4E6155] transition-colors cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#555C56] line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-[#1C201D] font-semibold">{product.rating || '4.9'}</span>
            <span className="text-[11px] text-[#828C84]">
              ({product.reviewCount > 0 ? `${product.reviewCount}` : '24'})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-4 mt-4 border-t border-[#EFEAE2] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#1C201D]">
                {formatPrice(currentPrice, settings.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#828C84] line-through">
                  {formatPrice(product.price, settings.currency)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#4E6155] font-medium block">
              In Stock & Ready to Ship
            </span>
          </div>

          <button
            id={`quick-add-${product.id}`}
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="bg-[#4E6155] hover:bg-[#3D4C43] disabled:bg-[#DCDDD8] disabled:text-[#828C84] text-white px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock <= 0 ? 'Out of Stock' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
