import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  ChevronDown,
  RotateCcw,
  Check,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product, Ingredient, Review, FAQ } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { formatPrice } from '../utils/formatCurrency';
import { SafeImage } from '../components/SafeImage';
import { DEFAULT_FALLBACK_IMAGE } from '../data/config';

interface ProductPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onOpenReviewModal: (productId: string, productName: string) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ slug, onNavigate, onOpenReviewModal }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedBundleId, setSelectedBundleId] = useState<string>('bundle-single');

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    benefits: true,
    ingredients: false,
    howToUse: false,
    warnings: false,
    shipping: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    setActiveImageIdx(0);
  }, [slug]);

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setLoading(true);
        const res = await api.getProduct(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          // Load ingredients
          const ingRes = await api.getIngredients();
          if (ingRes.success) {
            setIngredients(ingRes.ingredients);
          }
          // Load reviews
          const revRes = await api.getReviews();
          if (revRes.success) {
            setReviews(revRes.reviews.filter((r) => r.productId === res.product.id));
          }
          // Load FAQs
          const faqRes = await api.getFaqs();
          if (faqRes.success) {
            setFaqs(faqRes.faqs.slice(0, 4));
          }
        }
      } catch (e) {
        console.error('Failed to load product details:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProductDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-6 bg-[#EFEAE2] w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 aspect-4/5 bg-[#EFEAE2]" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-[#EFEAE2] w-3/4" />
            <div className="h-6 bg-[#EFEAE2] w-1/3" />
            <div className="h-20 bg-[#EFEAE2]" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-[#202420]">Product Not Found</h2>
        <p className="text-sm text-[#68706B]">
          The product you are looking for may have been moved or is currently unavailable.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="bg-[#62756A] text-[#F7F5F0] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.price;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedBundleId);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedBundleId);
    onNavigate('/checkout');
  };

  const productIngredients = ingredients.filter((i) => product.ingredientIds?.includes(i.id));

  return (
    <div id="product-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#68706B]">
        <button onClick={() => onNavigate('/')} className="hover:text-[#62756A]">
          Home
        </button>
        <span>/</span>
        <button onClick={() => onNavigate('/shop')} className="hover:text-[#62756A]">
          Shop
        </button>
        <span>/</span>
        <span className="text-[#202420] font-medium">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Left (Desktop & Mobile) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/5 bg-[#F7F5F0] border border-[#DCDDD8] overflow-hidden">
            <SafeImage
              key={`${product.id}-${activeImageIdx}`}
              src={product.images[activeImageIdx] || product.images[0]}
              alt={`${product.name} view ${activeImageIdx + 1}`}
              className="w-full h-full object-cover"
              enableRetry={true}
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-[#62756A] text-[#F7F5F0] text-[10px] font-semibold uppercase tracking-widest px-3 py-1 z-10">
                BEST SELLER
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full text-[#202420] hover:text-[#62756A] transition-colors shadow-xs z-10"
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`aspect-square bg-white border overflow-hidden transition-all ${
                    activeImageIdx === i
                      ? 'border-[#62756A] ring-2 ring-[#62756A]/20'
                      : 'border-[#DCDDD8] hover:border-[#68706B]'
                  }`}
                >
                  <SafeImage src={img} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Right */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Brand & Title */}
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
              ELVARIA BEAUTY &bull; {product.category}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202420] mt-1.5">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#202420]">{product.rating}</span>
              <span className="text-xs text-[#68706B]">
                ({reviews.length > 0 ? `${reviews.length} verified reviews` : 'Be the first to review'})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#202420]">
              {formatPrice(currentPrice, settings.currency)}
            </span>
            {product.salePrice && (
              <span className="text-base text-[#68706B] line-through">
                {formatPrice(product.price, settings.currency)}
              </span>
            )}
            <span className="text-xs text-[#68706B] font-mono">
              ({product.size})
            </span>
          </div>

          {/* Short description */}
          <p className="text-sm text-[#68706B] leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Bundles Options */}
          {product.bundles && product.bundles.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#202420] block">
                Select Option:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {product.bundles.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBundleId(b.id)}
                    className={`p-3 text-left border rounded-xl text-xs flex justify-between items-center transition-colors ${
                      selectedBundleId === b.id
                        ? 'border-[#4E6155] bg-[#EFEAE2]'
                        : 'border-[#E8E4DC] bg-[#F7F5F0] hover:border-[#4E6155]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[#202420] block">{b.name}</span>
                      <span className="text-[11px] text-[#68706B]">{b.sizeText}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#202420]">
                        {formatPrice(b.price, settings.currency)}
                      </span>
                      {b.savingsText && (
                        <span className="block text-[10px] text-[#4E6155] font-semibold">
                          {b.savingsText}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E8E4DC] bg-[#F7F5F0] rounded-xl h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-sm text-[#68706B] hover:text-[#202420]"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold text-[#202420]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 text-sm text-[#68706B] hover:text-[#202420]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#4E6155] text-white h-12 px-6 text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#3D4C43] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-[#202420] text-white h-12 px-6 text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#383D39] transition-colors flex items-center justify-center"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery highlights */}
            <div className="bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl p-4 space-y-2 text-xs text-[#68706B]">
              <div className="flex items-center gap-2 text-[#202420] font-medium">
                <Truck className="w-4 h-4 text-[#4E6155]" />
                <span>Complimentary standard shipping on orders over $50.00.</span>
              </div>
              <div className="flex items-center gap-2 text-[#202420] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#4E6155]" />
                <span>30-Day Skin Comfort Guarantee • Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="divide-y divide-[#DCDDD8] border-y border-[#DCDDD8] pt-2">
            {/* Description */}
            <div>
              <button
                onClick={() => toggleAccordion('description')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#202420]"
              >
                <span>Description</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.description ? 'rotate-180 text-[#62756A]' : ''
                  }`}
                />
              </button>
              {openAccordions.description && (
                <div className="pb-4 text-xs text-[#68706B] leading-relaxed space-y-2">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div>
              <button
                onClick={() => toggleAccordion('benefits')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#202420]"
              >
                <span>Benefits</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.benefits ? 'rotate-180 text-[#62756A]' : ''
                  }`}
                />
              </button>
              {openAccordions.benefits && (
                <div className="pb-4 space-y-2.5">
                  {product.benefits.map((b, idx) => (
                    <div key={idx} className="text-xs text-[#68706B]">
                      <strong className="text-[#202420] block">{b.title}</strong>
                      <span>{b.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <button
                onClick={() => toggleAccordion('ingredients')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#202420]"
              >
                <span>Ingredients</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.ingredients ? 'rotate-180 text-[#62756A]' : ''
                  }`}
                />
              </button>
              {openAccordions.ingredients && (
                <div className="pb-4 text-xs text-[#68706B] space-y-2">
                  <p className="leading-relaxed">
                    Featuring skin-identical hydrators including Glycerin, Ceramide Complex, Panthenol (Pro-Vitamin B5), Purified Shea Butter, and Tocopherol (Vitamin E).
                  </p>
                  <button
                    onClick={() => onNavigate('/ingredients')}
                    className="text-[#62756A] font-semibold underline block pt-1"
                  >
                    Explore Full Ingredient Encyclopedia &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* How to Use */}
            <div>
              <button
                onClick={() => toggleAccordion('howToUse')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#202420]"
              >
                <span>How to Use</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.howToUse ? 'rotate-180 text-[#62756A]' : ''
                  }`}
                />
              </button>
              {openAccordions.howToUse && (
                <div className="pb-4 text-xs text-[#68706B] space-y-1.5">
                  {product.howToUse.map((step, idx) => (
                    <p key={idx}>{step}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Warnings & Storage */}
            <div>
              <button
                onClick={() => toggleAccordion('warnings')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#202420]"
              >
                <span>Warnings & Storage</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.warnings ? 'rotate-180 text-[#62756A]' : ''
                  }`}
                />
              </button>
              {openAccordions.warnings && (
                <div className="pb-4 text-xs text-[#68706B] leading-relaxed">
                  <p>{product.warnings}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div>
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full py-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#202420]"
              >
                <span>Shipping & Returns</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.shipping ? 'rotate-180 text-[#62756A]' : ''
                  }`}
                />
              </button>
              {openAccordions.shipping && (
                <div className="pb-4 text-xs text-[#68706B] space-y-2 leading-relaxed">
                  <p>
                    Standard shipping is complimentary on qualifying orders over $50.00. Worldwide express delivery options calculated at checkout.
                  </p>
                  <p>
                    Unopened products in original condition may be returned within 30 days of receipt under our 30-Day Skin Comfort Guarantee.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Ingredient Section on Product Page */}
      <section className="bg-[#EFEAE2] border border-[#DCDDD8] p-8 sm:p-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#62756A]">
              Formula Transparency
            </span>
            <h3 className="font-heading text-2xl font-bold text-[#202420]">
              Key Hydrating Ingredients
            </h3>
          </div>
          <button
            onClick={() => onNavigate('/ingredients')}
            className="text-xs uppercase tracking-widest font-semibold text-[#62756A] hover:underline"
          >
            Read All Ingredient Profiles &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productIngredients.map((ing) => (
            <div key={ing.id} className="bg-[#F7F5F0] border border-[#DCDDD8] p-5 space-y-2">
              <span className="text-[10px] bg-white border border-[#DCDDD8] text-[#62756A] px-2 py-0.5 rounded font-mono font-medium">
                {ing.function}
              </span>
              <h4 className="font-heading text-sm font-bold text-[#202420]">{ing.name}</h4>
              <p className="text-xs text-[#68706B] leading-relaxed">{ing.shortDescription}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section on Product Page */}
      <section className="bg-white border border-[#DCDDD8] p-8 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCDDD8] pb-6">
          <div>
            <h3 className="font-heading text-2xl font-bold text-[#202420]">
              Customer Reviews ({reviews.length})
            </h3>
            <p className="text-xs text-[#68706B] mt-1">
              Genuine feedback from users who tested ELVARIA BEAUTY {product.name}.
            </p>
          </div>
          <button
            onClick={() => onOpenReviewModal(product.id, product.name)}
            className="bg-[#62756A] text-[#F7F5F0] px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-[#202420] transition-colors"
          >
            Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-sm font-semibold text-[#202420]">
              Be among the first to share your ELVARIA BEAUTY experience.
            </p>
            <p className="text-xs text-[#68706B] max-w-md mx-auto">
              We never fabricate customer reviews. If you have purchased and used this product, we invite you to leave an honest review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#F7F5F0] border border-[#DCDDD8] p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-[#DCDDD8]'}`} />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="text-[10px] text-[#62756A] font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <h5 className="font-heading text-sm font-semibold text-[#202420]">{rev.title}</h5>
                <p className="text-xs text-[#68706B] leading-relaxed">{rev.content}</p>
                <div className="pt-2 text-[10px] text-[#68706B] flex justify-between">
                  <span>{rev.authorName}</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E8E4DC] p-3 shadow-lg z-30 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-[#828C84] uppercase tracking-wider block">Total</span>
          <span className="text-base font-bold text-[#1C201D]">
            {formatPrice(currentPrice * quantity, settings.currency)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 bg-[#4E6155] text-white py-3 text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-[#3D4C43] flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}</span>
        </button>
      </div>
    </div>
  );
};
