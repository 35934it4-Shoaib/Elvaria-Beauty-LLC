/**
 * ============================================================================
 * ELVARIA BEAUTY LLC — Centralized Image & Brand Asset Configuration
 * ============================================================================
 * 
 * HOW TO REPLACE IMAGES WITH YOUR OWN PRODUCT PHOTOGRAPHY:
 * 1. Upload your product photos to your media server, CDN, or Firebase Storage.
 * 2. Update the corresponding URLs in the objects below (e.g. HERO_ASSETS,
 *    PRODUCT_ASSETS, CATEGORY_ASSETS).
 * 3. All components, galleries, hero banners, and previews throughout the entire
 *    website automatically pull from this centralized source of truth.
 * ============================================================================
 */

export const BRAND_IDENTITY = {
  name: 'ELVARIA BEAUTY',
  legalName: 'ELVARIA BEAUTY LLC',
  pronunciation: 'El-va-ri-a Beauty',
  tagline: 'Comfort Starts With Your Skin.',
  subtagline: 'Thoughtfully designed body care for skin that deserves everyday comfort.',
  mission:
    'Balancing dermatology-inspired formulation with modern everyday ease. Developed for sensitive-feeling, dry, and moisture-compromised skin.',
  contactEmail: 'care@elvariabeauty.com',
  contactPhone: '+1 (800) 555-ELVARIA',
  hours: 'Monday – Friday: 9:00 AM – 6:00 PM EST',
  address: 'ELVARIA BEAUTY LLC, 450 Lexington Ave, New York, NY 10017',
  whatsappNumber: '+18005553376',
  whatsappDefaultMsg: 'Hello ELVARIA BEAUTY Team, I would like assistance with my order.',
};

/**
 * Hero & Storytelling Visual Assets
 * High-resolution aesthetic skincare imagery matching warm ivory / soft cream palette.
 */
export const HERO_ASSETS = {
  main:
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85',
  primaryProductVisual:
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85',
  texture:
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=85',
  lotionTexture:
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=85',
  lifestyle:
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1400&q=85',
  lifestyleBathroom:
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1400&q=85',
  editorialCare:
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1400&q=85',
  ingredientsVisual:
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=85',
};

/**
 * Product Catalog Asset Registry
 * Replace these placeholder URLs with your high-res e-commerce product photos.
 */
const BASE_PRODUCT_ASSETS: Record<string, string[]> = {
  // ELVARIA Medicated Body Lotion (250 ml)
  'elvaria-medicated-body-lotion': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Rich Barrier Body Cream (200 ml)
  'elvaria-rich-barrier-body-cream': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Daily Hydrating Body Wash (300 ml)
  'elvaria-daily-hydrating-body-wash': [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Targeted Ceramide Comfort Balm (100 ml)
  'elvaria-ceramide-comfort-balm': [
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Natural Ionic Dry Body Brush
  'elvaria-dry-body-brush': [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Ergonomic Lotion Back Applicator
  'elvaria-back-applicator': [
    'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Cloud-Soft Microfiber Body Wrap
  'elvaria-microfiber-body-wrap': [
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=1200&q=85',
  ],

  // ELVARIA Hygienic Silicone Body Scrubber
  'elvaria-silicone-scrubber': [
    'https://raw.githubusercontent.com/35934it4-Shoaib/Elvaria-Beauty-LLC/main/images/Skincare_products_in_botanical_e…_2K_20260921122139.jpeg',
  ],

  // ELVARIA Travel Protection Pouch & Pump Locks
  'elvaria-travel-pouch-locks': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
  ],
};

export const PRODUCT_ASSETS: Record<string, string[]> = {
  ...BASE_PRODUCT_ASSETS,
  // Backward compatibility aliases
  'dermavea-medicated-body-lotion': BASE_PRODUCT_ASSETS['elvaria-medicated-body-lotion'],
  'dermavea-rich-barrier-body-cream': BASE_PRODUCT_ASSETS['elvaria-rich-barrier-body-cream'],
  'dermavea-rich-barrier-cream': BASE_PRODUCT_ASSETS['elvaria-rich-barrier-body-cream'],
  'dermavea-daily-hydrating-body-wash': BASE_PRODUCT_ASSETS['elvaria-daily-hydrating-body-wash'],
  'dermavea-ceramide-comfort-balm': BASE_PRODUCT_ASSETS['elvaria-ceramide-comfort-balm'],
  'dermavea-dry-body-brush': BASE_PRODUCT_ASSETS['elvaria-dry-body-brush'],
  'dermavea-back-applicator': BASE_PRODUCT_ASSETS['elvaria-back-applicator'],
  'dermavea-microfiber-body-wrap': BASE_PRODUCT_ASSETS['elvaria-microfiber-body-wrap'],
  'dermavea-silicone-scrubber': BASE_PRODUCT_ASSETS['elvaria-silicone-scrubber'],
  'dermavea-travel-pouch-locks': BASE_PRODUCT_ASSETS['elvaria-travel-pouch-locks'],
};

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85';

/**
 * Category Visual Registry
 */
export const CATEGORY_ASSETS = {
  'body-care': {
    title: 'Body Care',
    description: 'Gentle everyday washes, conditioners, and nourishing rituals.',
    image:'https://raw.githubusercontent.com/35934it4-Shoaib/Elvaria-Beauty-LLC/main/images/Skincare_products_banner_design_2K_20260921120939.jpeg',
  },
  'medicated-care': {
    title: 'Medicated Care',
    description: 'Targeted hydration formulas to relieve roughness and tightness.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85',
  },
  'moisturizers': {
    title: 'Moisturizers',
    description: 'Cushiony creams and lightweight daily hydrators.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=85',
  },
  'sensitive-skin': {
    title: 'Sensitive Skin',
    description: 'Fragrance-free, dermatologist-inspired comforting essentials.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=85',
  },
  'tools-accessories': {
    title: 'Tools & Accessories',
    description: 'Application tools, dry brushes, and travel essentials.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=85',
  },
};
