import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Droplets,
  Wind,
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { formatPrice } from '../utils/formatCurrency';
import { useSettings } from '../context/SettingsContext';

interface AnimatedHeroProps {
  onNavigate: (path: string) => void;
}

interface HeroSlide {
  id: number;
  label: string;
  headline: string;
  headlineWords: string[];
  supportingText: string;
  primaryCta: string;
  primaryCtaPath: string;
  secondaryCta: string;
  secondaryCtaPath: string;
  productName: string;
  productSubtext: string;
  productPrice: number;
  productBadge: string;
  productSlug: string;
  image: string;
  accentNote: string;
  bgAtmosphere: {
    glowColor: string;
    ambientSage: string;
    pedestalStyle: string;
    accentGradient: string;
  };
  clinicalPoints: string[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,
    label: 'PREMIUM SKINCARE & BODY CARE',
    headline: 'Comfort Starts With Your Skin.',
    headlineWords: ['Comfort', 'Starts', 'With', 'Your', 'Skin.'],
    supportingText:
      'Thoughtfully designed body care for skin that deserves everyday comfort.',
    primaryCta: 'Shop Products',
    primaryCtaPath: '/products',
    secondaryCta: 'Explore Collection',
    secondaryCtaPath: '/shop',
    productName: 'ELVARIA Medicated Body Lotion',
    productSubtext: 'Barrier Restoring Formula',
    productPrice: 29,
    productBadge: '250 ml • Daily Comfort Pump',
    productSlug: 'elvaria-medicated-body-lotion',
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=85',
    accentNote: 'Travertine stone pedestal & fresh eucalyptus botanicals',
    bgAtmosphere: {
      glowColor: 'rgba(239, 234, 226, 0.75)',
      ambientSage: 'rgba(78, 97, 85, 0.08)',
      pedestalStyle: 'from-[#EFECE6] to-[#E3DDD3]',
      accentGradient: 'from-[#4E6155]/15 via-[#62756A]/10 to-transparent',
    },
    clinicalPoints: [
      'Clinically inspired barrier hydration',
      'Fragrance-free & hypoallergenic',
      'Formulated with bio-identical ceramides',
    ],
  },
  {
    id: 1,
    label: 'BARRIER RESTORATIVE FORMULA',
    headline: 'Everyday Care, Beautifully Simple.',
    headlineWords: ['Everyday', 'Care,', 'Beautifully', 'Simple.'],
    supportingText:
      'A clean skincare product scene with soft water, restorative ceramides, and natural soothing textures.',
    primaryCta: 'Shop Products',
    primaryCtaPath: '/products',
    secondaryCta: 'Explore Collection',
    secondaryCtaPath: '/shop?category=moisturizers',
    productName: 'ELVARIA Rich Barrier Body Cream',
    productSubtext: 'Triple Ceramide & Panthenol Infusion',
    productPrice: 34,
    productBadge: '200 ml • Intensive Moisture Lock',
    productSlug: 'elvaria-rich-barrier-body-cream',
    image:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1600&q=85',
    accentNote: 'Wet river stone, dewy water ripples & botanical purity',
    bgAtmosphere: {
      glowColor: 'rgba(235, 240, 237, 0.8)',
      ambientSage: 'rgba(98, 117, 106, 0.09)',
      pedestalStyle: 'from-[#E8EAE6] to-[#DCE0D9]',
      accentGradient: 'from-[#62756A]/15 via-[#828C84]/10 to-transparent',
    },
    clinicalPoints: [
      'Locks deep moisture for 48 hours',
      'Silky, non-greasy rapid absorption',
      'Enriched with pro-vitamin B5 and shea',
    ],
  },
  {
    id: 2,
    label: 'INTENTIONAL WELLNESS RITUAL',
    headline: 'Make Comfort Part of Your Routine.',
    headlineWords: ['Make', 'Comfort', 'Part', 'Of', 'Your', 'Routine.'],
    supportingText:
      'A sophisticated lifestyle & body-care scene crafted with warm natural light and soothing botanicals.',
    primaryCta: 'Shop Products',
    primaryCtaPath: '/products',
    secondaryCta: 'Explore Collection',
    secondaryCtaPath: '/tools-accessories',
    productName: 'ELVARIA Targeted Ceramide Balm',
    productSubtext: 'Concentrated Relief For Extra-Dry Zones',
    productPrice: 24,
    productBadge: '100 ml • Targeted Recovery',
    productSlug: 'elvaria-ceramide-comfort-balm',
    image:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1600&q=85',
    accentNote: 'Architectural stone, soft morning linen & gentle shadows',
    bgAtmosphere: {
      glowColor: 'rgba(247, 240, 230, 0.8)',
      ambientSage: 'rgba(78, 97, 85, 0.07)',
      pedestalStyle: 'from-[#EFE7DC] to-[#E3D9CC]',
      accentGradient: 'from-[#8A9A8F]/15 via-[#4E6155]/10 to-transparent',
    },
    clinicalPoints: [
      'Calms tight, flaky and rough areas',
      'Cold-pressed botanical emollients',
      'Ideal companion for dry-brush rituals',
    ],
  },
];

const AUTOPLAY_DURATION = 8000; // 8 seconds per slide

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const prefersReducedMotion = useReducedMotion();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax tracking
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  // Mouse parallax handler for desktop
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({ x, y });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Scroll parallax listener (passive)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 1200) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
    setProgress(0);
  }, []);

  // Autoplay timer with progress bar
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const intervalStep = 50; // update every 50ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalStep / AUTOPLAY_DURATION) * 100;
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  return (
    <section
      id="cinematic-hero-section"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-4 sm:pt-8 pb-16 lg:pt-10 lg:pb-24 select-none"
      aria-label="Featured Skincare Hero Banner"
    >
      {/* ------------------------------------------------------------- */}
      {/* LAYER 1: ATMOSPHERIC LIGHTING & SUBTLE LIGHT SWEEP */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft dynamic ambient glow that adapts to slide tone */}
        <motion.div
          key={`glow-${currentSlide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor: currentSlide.bgAtmosphere.glowColor,
            transform: `translate3d(${mouseOffset.x * -25}px, ${mouseOffset.y * -25 + scrollY * 0.15}px, 0)`,
            transition: 'transform 0.3s ease-out',
          }}
        />

        <div
          className="absolute top-1/3 left-10 w-[450px] h-[450px] rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{
            backgroundColor: currentSlide.bgAtmosphere.ambientSage,
            transform: `translate3d(${mouseOffset.x * 20}px, ${mouseOffset.y * 20}px, 0)`,
          }}
        />

        {/* Soft light sweep beam across warm ivory background */}
        <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none">
          <div
            className="w-1/2 h-full bg-linear-to-r from-transparent via-white/50 to-transparent skew-x-12"
            style={{
              animation: prefersReducedMotion ? 'none' : 'light-sweep 12s ease-in-out infinite',
            }}
          />
        </div>

        {/* Delicate subtle micro-grid / texture lines for tactile editorial feeling */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#4E6155 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LAYER 2: CINEMATIC CONTENT CONTAINER */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[580px] lg:min-h-[660px]">
          
          {/* ========================================================= */}
          {/* LEFT: EDITORIAL COPY & LUXURY TYPOGRAPHY */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 lg:pr-4 z-10 flex flex-col justify-center space-y-6 sm:space-y-7 text-left order-1 lg:order-1">
            
            {/* 1. Small Label / Eyebrow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${currentSlide.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#EFEAE2]/90 border border-[#E8E4DC] rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#4E6155] shadow-xs self-start backdrop-blur-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4E6155] animate-pulse" />
                <span>{currentSlide.label}</span>
              </motion.div>
            </AnimatePresence>

            {/* 2. Main Headline with Staggered Word-by-Word Reveal */}
            <div className="min-h-[110px] sm:min-h-[140px] lg:min-h-[170px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={`headline-${currentSlide.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-display text-[2.75rem] leading-[1.08] sm:text-5xl lg:text-[4rem] text-[#1C201D] tracking-tight font-normal"
                >
                  {currentSlide.headlineWords.map((word, idx) => (
                    <motion.span
                      key={`${currentSlide.id}-word-${idx}`}
                      initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.75,
                        delay: prefersReducedMotion ? 0 : 0.08 + idx * 0.09,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-[0.26em] last:mr-0"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* 3. Supporting Text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${currentSlide.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.7,
                  delay: prefersReducedMotion ? 0 : 0.42,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-base sm:text-lg text-[#555C56] max-w-xl leading-relaxed font-light font-sans"
              >
                {currentSlide.supportingText}
              </motion.p>
            </AnimatePresence>

            {/* 4. Action Buttons (Tactile & Elegant) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${currentSlide.id}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.7,
                  delay: prefersReducedMotion ? 0 : 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4"
              >
                {/* Primary Button */}
                <button
                  id="hero-primary-shop-btn"
                  onClick={() => onNavigate(currentSlide.primaryCtaPath)}
                  className="group relative bg-[#4E6155] hover:bg-[#3D4C43] active:scale-[0.98] text-[#FAF8F5] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md shadow-[#4E6155]/20 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10">{currentSlide.primaryCta}</span>
                  <ArrowRight className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Secondary Button */}
                <button
                  id="hero-secondary-explore-btn"
                  onClick={() => onNavigate(currentSlide.secondaryCtaPath)}
                  className="group border border-[#4E6155] text-[#4E6155] hover:bg-[#EFEAE2] active:scale-[0.98] px-8 py-4 text-xs uppercase tracking-[0.22em] font-semibold rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer bg-white/40 backdrop-blur-xs"
                >
                  <span>{currentSlide.secondaryCta}</span>
                </button>
              </motion.div>
            </AnimatePresence>

            {/* 5. Regulatory & Clinical Proof Points */}
            <div className="pt-3 border-t border-[#E8E4DC]/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#707B73]">
              {currentSlide.clinicalPoints.map((point, pIdx) => (
                <span key={pIdx} className="flex items-center gap-1.5 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#62756A]/70 shrink-0" />
                  {point}
                </span>
              ))}
            </div>

            {/* 6. Slider Navigation Controls & Progress */}
            <div className="pt-4 flex items-center justify-between max-w-md">
              {/* Slide dots / indicators */}
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, sIdx) => {
                  const isActive = sIdx === currentSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      id={`hero-slide-nav-${sIdx}`}
                      onClick={() => goToSlide(sIdx)}
                      className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                        isActive ? 'w-12 bg-[#DDE5DF]' : 'w-2.5 bg-[#E8E4DC] hover:bg-[#D0D6D1]'
                      }`}
                      aria-label={`Go to slide ${sIdx + 1}: ${slide.headline}`}
                    >
                      {isActive && (
                        <div
                          className="absolute inset-y-0 left-0 bg-[#4E6155] rounded-full transition-all duration-75"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Number Counter & Controls */}
              <div className="flex items-center gap-3">
                <span className="font-display text-sm tracking-widest text-[#707B73]">
                  0{currentSlideIndex + 1} <span className="opacity-40">/</span> 0{HERO_SLIDES.length}
                </span>

                {/* Pause / Play Toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full border border-[#E8E4DC] text-[#707B73] hover:text-[#1C201D] hover:bg-white/80 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>

                {/* Prev / Next Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    id="hero-prev-slide-btn"
                    onClick={prevSlide}
                    className="p-2 rounded-full border border-[#E8E4DC] bg-white/70 hover:bg-[#4E6155] hover:text-white hover:border-[#4E6155] text-[#1C201D] transition-all duration-200 cursor-pointer shadow-2xs"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    id="hero-next-slide-btn"
                    onClick={nextSlide}
                    className="p-2 rounded-full border border-[#E8E4DC] bg-white/70 hover:bg-[#4E6155] hover:text-white hover:border-[#4E6155] text-[#1C201D] transition-all duration-200 cursor-pointer shadow-2xs"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: CINEMATIC PRODUCT SCENE & MULTI-LAYER COMPOSITION */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 relative flex justify-center items-center order-2 lg:order-2">
            
            {/* Outer Parallax wrapper responding smoothly to mouse tilt & scroll */}
            <div
              className="relative w-full max-w-[500px] aspect-4/5 sm:aspect-5/6 flex items-center justify-center"
              style={{
                transform: prefersReducedMotion
                  ? 'none'
                  : `translate3d(${mouseOffset.x * 12}px, ${mouseOffset.y * 12 - scrollY * 0.05}px, 0)`,
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >

              {/* --------------------------------------------------- */}
              {/* LAYER 3A: DECORATIVE FLOATING BOTANICALS & PARTICLES */}
              {/* --------------------------------------------------- */}
              
              {/* Top-Left Floating Eucalyptus Leaf (Smooth continuous float) */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [-6, 8, -6],
                        rotate: [-2, 4, -2],
                      }
                }
                transition={{
                  duration: 6.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 z-20 pointer-events-none filter drop-shadow-md"
                style={{
                  transform: prefersReducedMotion
                    ? 'none'
                    : `translate3d(${mouseOffset.x * 24}px, ${mouseOffset.y * 24}px, 0)`,
                }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 opacity-85">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 85C25 60 50 35 85 20C75 45 60 70 30 85C25 87 18 87 15 85Z"
                      fill="#748A7D"
                      fillOpacity="0.75"
                    />
                    <path
                      d="M15 85C38 65 58 45 85 20"
                      stroke="#4E6155"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 65C48 60 55 58 60 57"
                      stroke="#4E6155"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Bottom-Right Floating Soft Olive Branch / Botanical Accent */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [8, -7, 8],
                        rotate: [3, -3, 3],
                      }
                }
                transition={{
                  duration: 7.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 z-20 pointer-events-none filter drop-shadow-sm"
                style={{
                  transform: prefersReducedMotion
                    ? 'none'
                    : `translate3d(${mouseOffset.x * -18}px, ${mouseOffset.y * -18}px, 0)`,
                }}
              >
                <div className="w-18 h-18 sm:w-24 sm:h-24 opacity-80">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20 90C45 75 70 50 85 15C60 30 35 55 20 90Z"
                      fill="#8A9E92"
                      fillOpacity="0.6"
                    />
                    <path
                      d="M20 90C50 60 70 35 85 15"
                      stroke="#62756A"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <ellipse cx="65" cy="38" rx="8" ry="14" transform="rotate(-30 65 38)" fill="#748A7D" fillOpacity="0.5" />
                  </svg>
                </div>
              </motion.div>

              {/* Floating Crystalline Water Droplets */}
              <div className="absolute top-12 right-6 z-20 pointer-events-none">
                <div className="relative w-4 h-4 rounded-full bg-white/70 backdrop-blur-xs border border-white/90 shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white absolute top-0.5 left-0.5 opacity-90" />
                </div>
              </div>
              <div className="absolute bottom-24 left-4 z-20 pointer-events-none">
                <div className="relative w-3 h-3 rounded-full bg-white/60 backdrop-blur-xs border border-white/80 shadow-2xs">
                  <div className="w-0.5 h-0.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                </div>
              </div>

              {/* Floating Trust Badge 1: Ceramides + Lipids */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [-5, 6, -5],
                        x: [-2, 2, -2],
                      }
                }
                transition={{
                  duration: 5.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-8 -left-3 sm:top-12 sm:-left-8 z-30 cursor-pointer"
                onClick={() => onNavigate('/ingredients')}
                title="Explore our Ceramide & Lipid science"
              >
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E4DC] text-[11px] font-medium tracking-wide text-[#2D3830] shadow-sm hover:shadow-md hover:border-[#4E6155] transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap group">
                  <div className="w-4 h-4 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155] group-hover:bg-[#4E6155] group-hover:text-white transition-colors">
                    <Droplets className="w-2.5 h-2.5" />
                  </div>
                  <span>Ceramides + Lipids</span>
                </div>
              </motion.div>

              {/* Floating Trust Badge 2: Fragrance-Free */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [6, -6, 6],
                        x: [2, -2, 2],
                      }
                }
                transition={{
                  duration: 6.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.8,
                }}
                className="absolute top-1/2 -right-3 sm:-right-8 z-30 cursor-pointer hidden xs:block"
                onClick={() => onNavigate('/shop?category=sensitive-skin')}
                title="100% Fragrance-Free Formulas"
              >
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E4DC] text-[11px] font-medium tracking-wide text-[#2D3830] shadow-sm hover:shadow-md hover:border-[#4E6155] transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap group">
                  <div className="w-4 h-4 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155] group-hover:bg-[#4E6155] group-hover:text-white transition-colors">
                    <Wind className="w-2.5 h-2.5" />
                  </div>
                  <span>Fragrance-Free</span>
                </div>
              </motion.div>

              {/* Floating Trust Badge 3: Dermatologist Inspired */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [-4, 5, -4],
                        x: [-1, 2, -1],
                      }
                }
                transition={{
                  duration: 6.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.5,
                }}
                className="absolute bottom-20 -left-2 sm:bottom-24 sm:-left-6 z-30 cursor-pointer"
                onClick={() => onNavigate('/about')}
                title="Dermatologist Inspired Care"
              >
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E4DC] text-[11px] font-medium tracking-wide text-[#2D3830] shadow-sm hover:shadow-md hover:border-[#4E6155] transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap group">
                  <div className="w-4 h-4 rounded-full bg-[#EFEAE2] flex items-center justify-center text-[#4E6155] group-hover:bg-[#4E6155] group-hover:text-white transition-colors">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                  <span>Dermatologist Inspired</span>
                </div>
              </motion.div>

              {/* --------------------------------------------------- */}
              {/* LAYER 3B: TRANSLUCENT WAVE / LIQUID RIBBON AROUND PRODUCT */}
              {/* --------------------------------------------------- */}
              <div
                className="absolute inset-0 pointer-events-none z-10 opacity-70"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'liquid-ribbon 8.5s ease-in-out infinite',
                }}
              >
                <svg
                  className="w-full h-full"
                  viewBox="0 0 500 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M-50 480C100 420 180 520 320 460C420 410 480 470 550 430"
                    stroke="url(#liquid-ribbon-grad)"
                    strokeWidth="38"
                    strokeLinecap="round"
                    className="opacity-25 filter blur-md"
                  />
                  <path
                    d="M-40 475C110 425 190 515 320 455C410 415 470 465 540 435"
                    stroke="url(#liquid-ribbon-grad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-40"
                  />
                  <defs>
                    <linearGradient id="liquid-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#DDE5DF" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#8A9E92" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* --------------------------------------------------- */}
              {/* LAYER 3C: SCULPTED STONE PEDESTAL BASE */}
              {/* --------------------------------------------------- */}
              <div className="absolute -bottom-8 inset-x-8 sm:inset-x-12 h-20 sm:h-24 z-0 pointer-events-none">
                {/* Pedestal Cast Shadow with Ambient Occlusion */}
                <div className="absolute inset-x-2 bottom-0 h-10 bg-[#252E28]/12 rounded-full blur-xl transform scale-y-60" />
                
                {/* Solid Travertine Stone Block Styling */}
                <div
                  className={`w-full h-full rounded-2xl bg-linear-to-b ${currentSlide.bgAtmosphere.pedestalStyle} border border-[#D8D2C6] shadow-md relative overflow-hidden`}
                >
                  {/* Fine stone grain and edge highlight */}
                  <div className="absolute top-0 inset-x-0 h-px bg-white/70" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/5 via-transparent to-black/5" />
                  <div className="absolute bottom-2 right-4 text-[9px] uppercase tracking-[0.2em] text-[#8C8476] font-medium opacity-60">
                    NATURAL STONE PEDESTAL
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------- */}
              {/* LAYER 3D: THE PRODUCT HERO VISUAL (CINEMATIC DISSOLVE) */}
              {/* --------------------------------------------------- */}
              <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                
                {/* Floating Pill Badge (e.g. 250 ml • Daily Comfort Pump) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`badge-${currentSlide.id}`}
                    initial={{ opacity: 0, y: -12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -top-3 sm:top-2 right-2 sm:right-6 z-30 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E8E4DC] text-[11px] font-semibold tracking-wider text-[#4E6155] shadow-sm flex items-center gap-1.5"
                  >
                    <Droplets className="w-3.5 h-3.5 text-[#62756A]" />
                    <span>{currentSlide.productBadge}</span>
                  </motion.div>
                </AnimatePresence>

                {/* Main Product Frame with Continuous Breathing Float & Rising Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`product-container-${currentSlide.id}`}
                    initial={{
                      opacity: 0,
                      y: 35,
                      scale: 0.96,
                      filter: 'blur(8px)',
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={{
                      opacity: 0,
                      y: -25,
                      scale: 0.97,
                      filter: 'blur(6px)',
                    }}
                    transition={{
                      duration: 0.85,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full h-full rounded-3xl overflow-hidden bg-[#F7F5F0] border border-[#E8E4DC] shadow-xl relative group cursor-pointer"
                    onClick={() => onNavigate(`/product/${currentSlide.productSlug}`)}
                  >
                    {/* Breathing Motion inside the frame */}
                    <div
                      className="w-full h-full relative"
                      style={{
                        animation: prefersReducedMotion ? 'none' : 'subtle-float 7s ease-in-out infinite',
                      }}
                    >
                      <SafeImage
                        src={currentSlide.image}
                        alt={`${currentSlide.productName} scene`}
                        className="w-full h-full object-cover object-center transform group-hover:scale-104 transition-transform duration-1000 ease-out"
                        loading="eager"
                      />

                      {/* Gentle glass reflection highlight */}
                      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                      {/* Ambient corner vignette */}
                      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 pointer-events-none" />
                    </div>

                    {/* Overlaid Product Info Pill at Bottom */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.6 }}
                      className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#E8E4DC] flex items-center justify-between shadow-xs z-20"
                    >
                      <div className="pr-2">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#4E6155] block">
                          {currentSlide.productSubtext}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#1C201D] line-clamp-1">
                          {currentSlide.productName} • {formatPrice(currentSlide.productPrice, settings.currency)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/product/${currentSlide.productSlug}`);
                        }}
                        className="shrink-0 px-4 py-2 bg-[#4E6155] hover:bg-[#3D4C43] text-white text-[11px] font-semibold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer shadow-2xs"
                      >
                        Details
                      </button>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
