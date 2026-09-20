import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Droplets,
  Sparkles,
  ArrowRight,
  Star,
  ChevronDown,
  Layers,
  Heart,
  Eye,
  ShoppingBag,
  SlidersHorizontal,
  Check,
  Clock,
  Feather,
} from 'lucide-react';
import { Product, Ingredient, FAQ, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../utils/formatCurrency';
import { HERO_ASSETS, CATEGORY_ASSETS, BRAND_IDENTITY } from '../data/config';
import { SafeImage } from '../components/SafeImage';
import { AnimatedHero } from '../components/AnimatedHero';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenReviewModal: (productId: string, productName: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenReviewModal,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { settings } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, faqRes, revRes] = await Promise.all([
          api.getProducts(),
          api.getFaqs(),
          api.getReviews(),
        ]);

        if (prodRes.success && prodRes.products.length > 0) {
          setProducts(prodRes.products);
          const heroProd =
            prodRes.products.find((p) => p.slug === 'elvaria-medicated-body-lotion') ||
            prodRes.products[0];
          setFeaturedProduct(heroProd);
        }

        if (faqRes.success) {
          setFaqs(faqRes.faqs.slice(0, 5));
        }

        if (revRes.success) {
          setReviews(revRes.reviews.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      }
    }
    loadData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    try {
      await api.subscribeNewsletter(newsletterEmail);
      setNewsletterSent(true);
      setNewsletterEmail('');
    } catch {
      setNewsletterSent(true);
    }
  };

  const categories = [
    {
      id: 'body-care',
      name: 'Body Care',
      desc: 'Daily soothing cleansers and hydrating body rituals.',
      image: CATEGORY_ASSETS['body-care'].image,
      path: '/shop?category=body-care',
    },
    {
      id: 'medicated-care',
      name: 'Medicated Care',
      desc: 'Dermatology-inspired care for very dry, irritated-feeling skin.',
      image: CATEGORY_ASSETS['medicated-care'].image,
      path: '/shop?category=medicated-care',
    },
    {
      id: 'moisturizers',
      name: 'Moisturizers',
      desc: 'Barrier-replenishing ceramides, lightweight lotions, and rich creams.',
      image: CATEGORY_ASSETS['moisturizers'].image,
      path: '/shop?category=moisturizers',
    },
    {
      id: 'sensitive-skin',
      name: 'Sensitive Skin',
      desc: 'Fragrance-free, hypoallergenic comfort essentials.',
      image: CATEGORY_ASSETS['sensitive-skin'].image,
      path: '/shop?category=sensitive-skin',
    },
    {
      id: 'tools-accessories',
      name: 'Tools & Accessories',
      desc: 'Ergonomic applicators, dry body brushes, and travel locks.',
      image: CATEGORY_ASSETS['tools-accessories'].image,
      path: '/tools-accessories',
    },
  ];

  const ingredientPillars = [
    {
      name: 'Glycerin',
      role: 'Pure Hydration Magnet',
      desc: 'Draws moisture deep into the stratum corneum to prevent trans-epidermal water loss and restore plump softness.',
    },
    {
      name: 'Ceramides Complex',
      role: 'Lipid Barrier Support',
      desc: 'Bio-identical lipids (EOP, NP, AP) that replenish the protective intercellular matrix against environmental dryness.',
    },
    {
      name: 'Panthenol (Pro-Vitamin B5)',
      role: 'Soothing Comfort',
      desc: 'Known for its calming restorative properties, relieving tightness and irritation-prone sensations.',
    },
    {
      name: 'Shea Butter',
      role: 'Emollient Conditioning',
      desc: 'Cold-pressed botanical butter providing sustained, velvety nourishment without a heavy or sticky residue.',
    },
    {
      name: 'Vitamin E (Tocopherol)',
      role: 'Antioxidant Defense',
      desc: 'Guards delicate cellular lipids against oxidative stress while enhancing skin smoothness and suppleness.',
    },
  ];

  const featuredItems = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATIC ANIMATED HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <AnimatedHero onNavigate={onNavigate} />

      {/* ------------------------------------------------------------- */}
      {/* 2. TRUST / BRAND INTRO */}
      {/* ------------------------------------------------------------- */}
      <section id="trust-intro-section" className="bg-[#EFEAE2]/60 border-y border-[#E8E4DC] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C201D] mb-3">
              Thoughtful care for everyday skin comfort.
            </h2>
            <p className="text-sm text-[#555C56]">
              Developed to restore calm, balanced hydration to skin that feels compromised, dry, or delicate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] text-center sm:text-left space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-[#1C201D]">Thoughtfully Formulated</h3>
              <p className="text-xs text-[#555C56] leading-relaxed">
                Free of synthetic fragrances, harsh drying alcohols, parabens, and known common irritants.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] text-center sm:text-left space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155]">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-[#1C201D]">Everyday Skin Comfort</h3>
              <p className="text-xs text-[#555C56] leading-relaxed">
                Absorbs cleanly into the skin within seconds, delivering deep barrier replenishment without greasiness.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] text-center sm:text-left space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-[#1C201D]">Premium Body Care</h3>
              <p className="text-xs text-[#555C56] leading-relaxed">
                Elevated textures and amber glass aesthetic bottles that grace your daily vanity ritual.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] text-center sm:text-left space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155]">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base text-[#1C201D]">Simple, Modern Care</h3>
              <p className="text-xs text-[#555C56] leading-relaxed">
                Streamlined regimens designed for consistency, supporting your skin barrier day after day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURED PRODUCTS: "Featured Care" */}
      {/* ------------------------------------------------------------- */}
      <section id="featured-care-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block mb-1">
              DAILY HYDRATION RITUALS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D]">
              Featured Care
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#4E6155] hover:text-[#1C201D] transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SHOP BY CATEGORY */}
      {/* ------------------------------------------------------------- */}
      <section id="shop-by-category-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block mb-1">
            EXPLORE THE ESSENTIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-3">
            Shop by Category
          </h2>
          <p className="text-sm text-[#555C56]">
            Every category is purposefully designed to target skin hydration, comfort, and elevated application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(cat.path)}
              className={`group relative rounded-3xl overflow-hidden bg-white border border-[#E8E4DC] cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 ${
                idx === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="aspect-4/3 overflow-hidden bg-[#F7F5F0]">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-[#1C201D] group-hover:text-[#4E6155] transition-colors mb-1.5 flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowRight className="w-4 h-4 text-[#828C84] group-hover:text-[#4E6155] group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-[#555C56] leading-relaxed mb-4">
                  {cat.desc}
                </p>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#4E6155] inline-flex items-center gap-1">
                  Explore Category
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. WHY ELVARIA BEAUTY: Editorial Split */}
      {/* ------------------------------------------------------------- */}
      <section id="why-elvaria-section" className="bg-[#EFEAE2]/50 border-y border-[#E8E4DC] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden border border-[#E8E4DC] shadow-md">
                <img
                  src={HERO_ASSETS.lifestyle}
                  alt="ELVARIA BEAUTY daily skin comfort application"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E8E4DC] text-xs text-[#1C201D]">
                  <strong className="block text-[#4E6155] uppercase tracking-wider text-[10px]">
                    The ELVARIA BEAUTY Philosophy
                  </strong>
                  Skin deserves care that treats it gently every single day.
                </div>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block">
                WHY ELVARIA BEAUTY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C201D] leading-tight">
                Care Designed Around Your Skin.
              </h2>
              <p className="text-sm sm:text-base text-[#555C56] leading-relaxed font-light">
                Too many body products compromise between clinical effectiveness and sensory pleasure. Thick medical ointments feel greasy, while luxury perfumed creams trigger sensitivity and stinging.
              </p>
              <p className="text-sm sm:text-base text-[#555C56] leading-relaxed font-light">
                ELVARIA BEAUTY was conceived to bridge that gap. We unite dermatologist-researched actives with silky, fast-absorbing textures to give you skin care you will look forward to using every morning and evening.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#4E6155] mt-1 shrink-0" />
                  <p className="text-xs text-[#1C201D]">
                    <strong>Physiological pH (5.5)</strong> to safeguard your natural protective acid mantle.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#4E6155] mt-1 shrink-0" />
                  <p className="text-xs text-[#1C201D]">
                    <strong>Clean Botanical Carriers</strong> that never clog pores or leave sticky residue on clothing.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#4E6155] mt-1 shrink-0" />
                  <p className="text-xs text-[#1C201D]">
                    <strong>Transparent Formulations</strong> backed by ingredient honesty and verifiable testing.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-8 py-3.5 bg-[#1C201D] hover:bg-[#383D39] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors"
                >
                  Read Our Full Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. INGREDIENTS & FORMULATION SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="ingredients-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block mb-1">
            FORMULATION DISCIPLINE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-3">
            Core Restorative Actives
          </h2>
          <p className="text-sm text-[#555C56]">
            Every molecule in ELVARIA BEAUTY formulas serves a precise, functional purpose for skin hydration and barrier integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {ingredientPillars.map((ing) => (
            <div
              key={ing.name}
              className="bg-white p-6 rounded-2xl border border-[#E8E4DC] flex flex-col justify-between hover:border-[#4E6155]/40 transition-colors shadow-xs"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4E6155] block mb-1">
                  {ing.role}
                </span>
                <h3 className="font-serif text-lg text-[#1C201D] mb-2">{ing.name}</h3>
                <p className="text-xs text-[#555C56] leading-relaxed">{ing.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F7F5F0] text-[11px] text-[#828C84]">
                100% Non-Irritating
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('/ingredients')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4E6155] hover:underline"
          >
            <span>Explore Complete Ingredient Glossary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. PRODUCT EXPERIENCE SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="sensory-experience-section" className="bg-[#202420] text-white py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img
            src={HERO_ASSETS.texture}
            alt="Lotion Texture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DDE5DF]">
              THE SENSORY DIFFERENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] leading-tight">
              Velvety Hydration. Never Sticky. Never Heavy.
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
              Unlike typical heavy ointments that coat skin without absorbing, ELVARIA BEAUTY utilizes a micro-emulsion delivery system. The lightweight lotion absorbs within seconds, allowing you to dress immediately while enjoying hours of sustained softness.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center sm:text-left">
              <div>
                <div className="text-2xl font-serif font-bold text-[#DDE5DF]">98%</div>
                <div className="text-[11px] text-white/70 mt-0.5">Reported Instant Relief</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#DDE5DF]">24h</div>
                <div className="text-[11px] text-white/70 mt-0.5">Sustained Moisture Barrier</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-[#DDE5DF]">0%</div>
                <div className="text-[11px] text-white/70 mt-0.5">Synthetic Fragrance</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative aspect-square w-72 sm:w-80 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src={HERO_ASSETS.texture}
                alt="ELVARIA BEAUTY lotion cream droplet texture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. TOOLS & ACCESSORIES SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <section id="tools-showcase-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#EFEAE2] border border-[#E8E4DC] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block">
              NEW ACCESSORIES COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D]">
              Elevate Your Daily Ritual With Tools & Accessories
            </h2>
            <p className="text-sm text-[#555C56] leading-relaxed">
              Experience the complete ELVARIA BEAUTY system. Ergonomic back lotion applicators, natural bristle dry body brushes, plush organic bath wraps, and spill-safe travel accessories designed for skin comfort.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/tools-accessories')}
                className="px-7 py-3.5 bg-[#4E6155] hover:bg-[#3D4C43] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>EXPLORE ALL TOOLS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-96 aspect-4/3 rounded-2xl overflow-hidden shadow-sm border border-[#E8E4DC]">
            <img
              src={CATEGORY_ASSETS['tools-accessories'].image}
              alt="Tools and accessories showcase"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. CUSTOMER REVIEWS (Marked Demo & Moderation Notice) */}
      {/* ------------------------------------------------------------- */}
      <section id="reviews-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block mb-1">
              COMMUNITY EXPERIENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D]">
              Customer Experiences
            </h2>
            <p className="text-xs text-[#828C84] mt-1">
              Sample development reviews submitted by community testers • Reviewed and approved by ELVARIA BEAUTY moderation
            </p>
          </div>
          <button
            onClick={() => onOpenReviewModal('elvaria-medicated-body-lotion', 'Medicated Body Lotion')}
            className="px-5 py-2.5 bg-white border border-[#E8E4DC] hover:border-[#4E6155] text-xs font-semibold uppercase tracking-wider text-[#1C201D] rounded-full transition-colors self-start md:self-auto"
          >
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-[#E8E4DC] flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {(rev.isVerifiedBuyer ?? rev.isVerifiedPurchase) && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2E6B48] bg-[#EAF5EE] px-2 py-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-base text-[#1C201D] font-medium mb-1.5">
                  {rev.title}
                </h4>
                <p className="text-xs text-[#555C56] leading-relaxed italic">
                  &ldquo;{rev.content || rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F7F5F0] flex items-center justify-between text-xs text-[#828C84]">
                <span className="font-medium text-[#1C201D]">{rev.authorName}</span>
                <span>{new Date(rev.date || rev.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. FAQ PREVIEW ACCORDION */}
      {/* ------------------------------------------------------------- */}
      <section id="faq-preview-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block mb-1">
            QUESTIONS & GUIDANCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#555C56]">
            Answers to everyday questions regarding our ingredients, skin compatibility, and shipping.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden divide-y divide-[#EFEAE2] shadow-xs">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="p-5 sm:p-6 transition-colors">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-hidden"
                >
                  <span className="font-serif text-base text-[#1C201D] font-medium">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#828C84] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#4E6155]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-[#555C56] leading-relaxed pt-2 border-t border-[#F7F5F0]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('/faq')}
            className="text-xs font-semibold uppercase tracking-wider text-[#4E6155] hover:underline"
          >
            View Complete Knowledge Base & FAQ →
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 11. NEWSLETTER */}
      {/* ------------------------------------------------------------- */}
      <section id="newsletter-home-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#EFEAE2] border border-[#E8E4DC] text-center max-w-3xl mx-auto shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4E6155] block mb-2">
            STAY IN TOUCH
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C201D] mb-3">
            Stay in the know about better skin care.
          </h2>
          <p className="text-sm text-[#555C56] max-w-md mx-auto mb-8 leading-relaxed">
            Be the first to receive updates on new body formulas, seasonal skin advice, and private subscriber offerings.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3.5 rounded-full bg-white border border-[#E8E4DC] text-xs text-[#1C201D] placeholder:text-[#828C84] focus:outline-hidden focus:ring-1 focus:ring-[#4E6155]"
              required
            />
            <button
              type="submit"
              className="px-7 py-3.5 bg-[#4E6155] hover:bg-[#3D4C43] text-white text-xs uppercase tracking-widest font-semibold rounded-full transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              JOIN THE LIST
            </button>
          </form>

          {newsletterSent && (
            <p className="text-xs text-[#2E6B48] font-medium mt-4">
              ✓ Thank you for subscribing to ELVARIA BEAUTY updates!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
