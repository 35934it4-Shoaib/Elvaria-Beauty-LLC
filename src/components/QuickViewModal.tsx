import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';
import { SafeImage } from './SafeImage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onNavigate }) => {
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedBundleId, setSelectedBundleId] = useState<string | undefined>(undefined);

  useEffect(() => {
    setSelectedImageIdx(0);
  }, [product?.id]);

  if (!product) return null;

  const currentPrice = product.salePrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedBundleId);
    onClose();
  };

  const handleViewFullPage = () => {
    onClose();
    onNavigate(`/product/${product.slug}`);
  };

  return (
    <div id="quickview-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#FBF9F5] border border-[#E8E4DC] rounded-3xl max-w-3xl w-full p-6 sm:p-8 z-10 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#828C84] hover:text-[#1C201D] rounded-full hover:bg-[#EFEAE2] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-4/5 bg-white rounded-2xl overflow-hidden border border-[#E8E4DC]">
              <SafeImage
                key={`${product.id}-${selectedImageIdx}`}
                src={product.images[selectedImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                enableRetry={true}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border cursor-pointer ${
                      selectedImageIdx === idx ? 'border-[#4E6155] ring-2 ring-[#4E6155]/20' : 'border-[#E8E4DC]'
                    }`}
                  >
                    <SafeImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#4E6155]">
                {product.category}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#1C201D] mt-1">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#1C201D]">{product.rating || '4.9'}</span>
                <span className="text-xs text-[#828C84]">({product.size})</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1C201D]">
                {formatPrice(currentPrice, settings.currency)}
              </span>
              {product.salePrice && (
                <span className="text-sm text-[#828C84] line-through">
                  {formatPrice(product.price, settings.currency)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#555C56] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Bundles Options if any */}
            {product.bundles && product.bundles.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1C201D] block">
                  Select Pack / Size Option:
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {product.bundles.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBundleId(b.id)}
                      className={`p-3 rounded-xl border text-xs flex justify-between items-center cursor-pointer transition-colors ${
                        (selectedBundleId || 'bundle-single') === b.id
                          ? 'border-[#4E6155] bg-[#EFEAE2]'
                          : 'border-[#E8E4DC] bg-white hover:border-[#828C84]'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-[#1C201D] block">{b.name}</span>
                        <span className="text-[11px] text-[#828C84]">{b.sizeText}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#1C201D]">
                          {formatPrice(b.price, settings.currency)}
                        </span>
                        {b.savingsText && (
                          <span className="block text-[10px] text-[#4E6155] font-semibold">
                            {b.savingsText}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center border border-[#E8E4DC] rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-sm text-[#555C56] hover:text-[#1C201D]"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-[#1C201D]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-2.5 text-sm text-[#555C56] hover:text-[#1C201D]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#4E6155] hover:bg-[#3D4C43] text-white py-3 px-4 text-xs uppercase tracking-widest font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Full page link */}
            <button
              onClick={handleViewFullPage}
              className="w-full text-center text-xs font-semibold text-[#4E6155] hover:underline pt-2 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Product Specifications & Ingredients</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
