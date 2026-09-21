import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Product,
  Category,
  Ingredient,
  Review,
  Coupon,
  FAQ,
  Order,
  User,
  SiteSettings,
  ContactMessage,
  NewsletterSubscriber,
} from '../src/types/index';
import {
  BRAND_IDENTITY,
  HERO_ASSETS,
  PRODUCT_ASSETS,
  CATEGORY_ASSETS,
} from '../src/data/config';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  ingredients: Ingredient[];
  reviews: Review[];
  coupons: Coupon[];
  faqs: FAQ[];
  orders: Order[];
  users: (User & { passwordHash: string })[];
  settings: SiteSettings;
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: BRAND_IDENTITY.name,
  storeName: BRAND_IDENTITY.name,
  tagline: BRAND_IDENTITY.tagline,
  secondaryTagline: BRAND_IDENTITY.subtagline,
  announcementText: 'Complimentary standard shipping on all international orders over $50.',
  announcementEnabled: true,
  freeShippingThreshold: 50,
  standardShippingFee: 5,
  currency: 'USD',
  currencySymbol: '$',
  whatsappPhone: BRAND_IDENTITY.whatsappNumber,
  whatsappDefaultMessage: BRAND_IDENTITY.whatsappDefaultMsg,
  contactEmail: BRAND_IDENTITY.contactEmail,
  supportEmail: BRAND_IDENTITY.contactEmail,
  contactPhone: BRAND_IDENTITY.contactPhone,
  contactAddress: BRAND_IDENTITY.address,
  instagramUrl: 'https://instagram.com/elvariabeauty',
  facebookUrl: 'https://facebook.com/elvariabeauty',
  tiktokUrl: 'https://tiktok.com/@elvariabeauty',
  medicalDisclaimer:
    'Placeholder disclaimer: ELVARIA BEAUTY products are formulated for cosmetic moisturization and daily skincare comfort. Statements on this website have not been evaluated by regulatory health authorities (such as the US FDA). ELVARIA BEAUTY does not claim to diagnose, treat, cure, or prevent any disease, eczema, psoriasis, or infection. Always follow label directions and consult a licensed physician or dermatologist for medical skin conditions.',
  placeholderClaimsWarning:
    'Notice: Product details and ingredient listings currently displayed are development placeholders and must be verified against actual approved packaging before commercial release.',
  stripeEnabled: true,
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-body-care',
    name: 'Body Care',
    slug: 'body-care',
    description: CATEGORY_ASSETS['body-care'].description,
    image: CATEGORY_ASSETS['body-care'].image,
    order: 1,
    status: 'active',
  },
  {
    id: 'cat-medicated-care',
    name: 'Medicated Care',
    slug: 'medicated-care',
    description: CATEGORY_ASSETS['medicated-care'].description,
    image: CATEGORY_ASSETS['medicated-care'].image,
    order: 2,
    status: 'active',
  },
  {
    id: 'cat-moisturizers',
    name: 'Moisturizers',
    slug: 'moisturizers',
    description: CATEGORY_ASSETS['moisturizers'].description,
    image: CATEGORY_ASSETS['moisturizers'].image,
    order: 3,
    status: 'active',
  },
  {
    id: 'cat-sensitive-skin',
    name: 'Sensitive Skin',
    slug: 'sensitive-skin',
    description: CATEGORY_ASSETS['sensitive-skin'].description,
    image: CATEGORY_ASSETS['sensitive-skin'].image,
    order: 4,
    status: 'active',
  },
  {
    id: 'cat-tools-accessories',
    name: 'Tools & Accessories',
    slug: 'tools-accessories',
    description: CATEGORY_ASSETS['tools-accessories'].description,
    image: CATEGORY_ASSETS['tools-accessories'].image,
    order: 5,
    status: 'active',
  },
];

const DEFAULT_INGREDIENTS: Ingredient[] = [
  {
    id: 'ing-glycerin',
    name: 'Glycerin',
    inciName: 'Glycerin',
    shortDescription: 'Essential skin-identical humectant that attracts and locks in water.',
    detailedExplanation:
      'A time-tested humectant naturally present in healthy skin. Glycerin draws moisture from the atmosphere into the epidermis, helping maintain hydration and a comfortable skin feel throughout the day.',
    function: 'Humectant / Moisture Magnet',
    category: 'Hydration',
    isFeatured: true,
    order: 1,
  },
  {
    id: 'ing-ceramides',
    name: 'Ceramide Complex',
    inciName: 'Ceramide NP, Ceramide AP, Ceramide EOP',
    shortDescription: 'Lipid building blocks to help support the skin’s natural moisture barrier.',
    detailedExplanation:
      'Ceramides constitute a major portion of the intercellular lipid matrix. Designed to replenish depleted barrier components, assisting in reducing transepidermal water loss in dry-feeling skin.',
    function: 'Barrier Support / Lipid Replenishment',
    category: 'Barrier Care',
    isFeatured: true,
    order: 2,
  },
  {
    id: 'ing-panthenol',
    name: 'Panthenol (Pro-Vitamin B5)',
    inciName: 'Panthenol',
    shortDescription: 'Skin-soothing conditioner that calms and relieves dry, tight skin feelings.',
    detailedExplanation:
      'Pro-Vitamin B5 penetrates the outer skin layers to deliver comforting hydration, helping ease feelings of skin tightness, roughness, and seasonal environmental irritation.',
    function: 'Soothing / Conditioning',
    category: 'Comfort',
    isFeatured: true,
    order: 3,
  },
  {
    id: 'ing-shea-butter',
    name: 'Purified Shea Butter',
    inciName: 'Butyrospermum Parkii (Shea) Butter',
    shortDescription: 'Gentle, rich emollient that softens rough patches with a non-greasy finish.',
    detailedExplanation:
      'Rich in fatty acids and vitamins A and E, purified shea butter melts smoothly at skin temperature to create a protective, cushiony layer without suffocating the skin or feeling heavy.',
    function: 'Emollient / Softening',
    category: 'Nourishment',
    isFeatured: true,
    order: 4,
  },
  {
    id: 'ing-vitamin-e',
    name: 'Vitamin E',
    inciName: 'Tocopheryl Acetate',
    shortDescription: 'Antioxidant skin protector that enhances overall smoothness.',
    detailedExplanation:
      'A staple antioxidant in dermatological skincare that helps protect formula integrity and provides gentle conditioning for skin exposed to dry indoor air and urban elements.',
    function: 'Antioxidant / Conditioning',
    category: 'Protection',
    isFeatured: true,
    order: 5,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-elvaria-body-lotion',
    name: 'ELVARIA Medicated Body Lotion',
    slug: 'elvaria-medicated-body-lotion',
    sku: 'ELV-MBL-250',
    shortDescription: 'Daily moisture and comfort for skin that feels dry, rough or sensitive.',
    description:
      'ELVARIA Medicated Body Lotion is designed to become an essential part of your daily body-care routine. Its moisturizing approach is formulated to leave dry-feeling skin feeling softer, smoother, and deeply comforted without a sticky or heavy residue.',
    price: 29.00,
    salePrice: 26.00,
    size: '250 ml / 8.4 fl oz',
    category: 'Medicated Care',
    stock: 120,
    lowStockThreshold: 15,
    images: PRODUCT_ASSETS['elvaria-medicated-body-lotion'],
    ingredientIds: ['ing-glycerin', 'ing-ceramides', 'ing-panthenol', 'ing-shea-butter', 'ing-vitamin-e'],
    benefits: [
      {
        title: 'Deep Moisture Lock',
        description: 'Helps replenish moisture for dry-feeling skin with prolonged, all-day hydration.',
      },
      {
        title: 'Velvety Skin Comfort',
        description: 'Designed for a soft, silky, and comfortable skin feel that absorbs smoothly.',
      },
      {
        title: 'Barrier Support',
        description: 'Formulated with Ceramides to help reinforce the natural skin moisture barrier.',
      },
      {
        title: 'Everyday Ease',
        description: 'Lightweight, non-greasy absorption suitable for morning and evening routines.',
      },
    ],
    howToUse: [
      '01. Cleanse — Start with clean, gently patted-dry skin after a shower or bath.',
      '02. Moisturize — Dispense 1 to 2 pumps into your palms and massage evenly over arms, legs, and body.',
      '03. Focus — Apply extra attention to dry-prone zones like elbows, knees, and ankles.',
      'Always follow label directions and store at room temperature.',
    ],
    warnings:
      'For external body use only. Avoid contact with eyes; if contact occurs, rinse thoroughly with clean water. Discontinue use if irritation develops. Keep out of reach of children. Store in a cool, dry place away from direct sunlight.',
    seoTitle: 'ELVARIA Medicated Body Lotion — Daily Skin Comfort & Hydration',
    seoDescription:
      'Shop ELVARIA Medicated Body Lotion ($29.00). Thoughtful dermatology-inspired daily body care for dry and sensitive-feeling skin. Fast international delivery.',
    isFeatured: true,
    status: 'published',
    rating: 4.9,
    reviewCount: 48,
    bundles: [
      {
        id: 'bundle-single',
        name: 'Single Bottle (250 ml)',
        sizeText: '1 × 250 ml pump bottle',
        price: 29.00,
      },
      {
        id: 'bundle-duo',
        name: 'Daily Duo (2-Pack)',
        sizeText: '2 × 250 ml bottles',
        price: 52.00,
        savingsText: 'Save $6.00',
      },
      {
        id: 'bundle-trio',
        name: 'Family Trio (3-Pack)',
        sizeText: '3 × 250 ml bottles',
        price: 74.00,
        savingsText: 'Save $13.00 + Free Shipping',
      },
      {
        id: 'bundle-routine',
        name: 'Skin Comfort Routine Bundle',
        sizeText: '2 × Lotion + Dry Body Brush',
        price: 64.00,
        savingsText: 'Best Value Bundle',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-rich-barrier-cream',
    name: 'ELVARIA Rich Barrier Body Cream',
    slug: 'elvaria-rich-barrier-body-cream',
    sku: 'ELV-RBC-200',
    shortDescription: 'Intensive restorative barrier cream for severely dry or moisture-depleted skin.',
    description:
      'A cushiony, lipid-dense cream designed for skin requiring an extra layer of protection. Formulated with triple ceramides, shea butter, and soothing panthenol to lock in deep hydration.',
    price: 34.00,
    salePrice: 30.00,
    size: '200 ml / 6.7 fl oz',
    category: 'Moisturizers',
    stock: 85,
    lowStockThreshold: 10,
    images: PRODUCT_ASSETS['elvaria-rich-barrier-body-cream'],
    ingredientIds: ['ing-ceramides', 'ing-shea-butter', 'ing-glycerin', 'ing-vitamin-e'],
    benefits: [
      {
        title: 'Intensive Barrier Defense',
        description: 'Creates a breathable moisture shield against environmental dryness.',
      },
      {
        title: 'Ultra-Rich Texture',
        description: 'Melts on contact to cushion dry skin without suffocating pores.',
      },
    ],
    howToUse: [
      '01. Scoop a nickel-sized amount with clean hands.',
      '02. Gently warm between palms and press into skin.',
      '03. Reapply as needed throughout the day or night.',
    ],
    warnings: 'For external body use only. Keep out of reach of children.',
    seoTitle: 'ELVARIA Rich Barrier Body Cream — Deep Moisture Protection',
    seoDescription: 'Rich restorative body cream with essential ceramides and shea butter.',
    isFeatured: true,
    status: 'published',
    rating: 4.8,
    reviewCount: 32,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-hydrating-body-wash',
    name: 'ELVARIA Daily Hydrating Body Wash',
    slug: 'elvaria-daily-hydrating-body-wash',
    sku: 'ELV-HBW-300',
    shortDescription: 'Gentle, sulfate-free conditioning wash that cleanses without stripping natural oils.',
    description:
      'A low-lather, pH-balanced cleanser formulated for daily shower rituals. Cleanses away impurities while preserving the delicate skin moisture barrier with glycerin and panthenol.',
    price: 24.00,
    size: '300 ml / 10.1 fl oz',
    category: 'Body Care',
    stock: 140,
    lowStockThreshold: 20,
    images: PRODUCT_ASSETS['elvaria-daily-hydrating-body-wash'],
    ingredientIds: ['ing-glycerin', 'ing-panthenol'],
    benefits: [
      {
        title: 'Sulfate-Free Cleansing',
        description: 'Respects skin balance with no tight, squeaky after-feel.',
      },
      {
        title: 'Hydrating Rinse',
        description: 'Leaves skin feeling soft and comfortably prepared for lotion.',
      },
    ],
    howToUse: [
      '01. Dispense onto damp palms, washcloth, or body scrubber.',
      '02. Gently massage over body into a silky foam.',
      '03. Rinse thoroughly with lukewarm water.',
    ],
    warnings: 'Avoid contact with eyes. In case of contact, rinse thoroughly with water.',
    seoTitle: 'ELVARIA Daily Hydrating Body Wash — Gentle Sulfate-Free Care',
    seoDescription: 'Dermatology-inspired daily hydrating body cleanser for dry skin.',
    isFeatured: true,
    status: 'published',
    rating: 4.9,
    reviewCount: 29,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-ceramide-comfort-balm',
    name: 'ELVARIA Targeted Ceramide Balm',
    slug: 'elvaria-ceramide-comfort-balm',
    sku: 'ELV-CCB-100',
    shortDescription: 'Targeted soothing ointment for rough elbows, knees, heels, and hands.',
    description:
      'Concentrated rescue balm crafted to soothe dry, distressed localized skin patches. Packed with pure lipids and skin-replenishing conditioners.',
    price: 22.00,
    size: '100 ml / 3.4 fl oz',
    category: 'Sensitive Skin',
    stock: 90,
    lowStockThreshold: 12,
    images: PRODUCT_ASSETS['elvaria-ceramide-comfort-balm'],
    ingredientIds: ['ing-ceramides', 'ing-shea-butter', 'ing-panthenol'],
    benefits: [
      {
        title: 'Targeted Comfort',
        description: 'Instantly softens persistent dry roughness on high-friction zones.',
      },
      {
        title: 'Pocket-Friendly Relief',
        description: 'Compact tube convenient for bedside or travel application.',
      },
    ],
    howToUse: [
      'Apply directly to clean dry spots, elbows, cuticles, or cracked heels as needed.',
    ],
    warnings: 'For external use only. Discontinue if redness occurs.',
    seoTitle: 'ELVARIA Targeted Ceramide Balm — Localized Skin Relief',
    seoDescription: 'High-potency soothing balm for parched patches, hands, and heels.',
    isFeatured: true,
    status: 'published',
    rating: 5.0,
    reviewCount: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-dry-body-brush',
    name: 'ELVARIA Natural Ionic Dry Body Brush',
    slug: 'elvaria-dry-body-brush',
    sku: 'ELV-DBB-001',
    shortDescription: 'Ergonomic natural bristle brush to gently buff, smooth, and prep skin.',
    description:
      'Crafted from sustainably sourced FSC beechwood and soft natural bristles. Enhances skin smoothness, buffs away surface dead cells, and primes the skin for deeper lotion absorption.',
    price: 18.00,
    size: '1 Brush / FSC Beechwood',
    category: 'Tools & Accessories',
    stock: 65,
    lowStockThreshold: 10,
    images: PRODUCT_ASSETS['elvaria-dry-body-brush'],
    ingredientIds: [],
    benefits: [
      {
        title: 'Gentle Exfoliation',
        description: 'Natural bristles buff away flaky surface skin effortlessly.',
      },
      {
        title: 'Ergonomic Cotton Strap',
        description: 'Comfortable hand grip for easy, controlled circular strokes.',
      },
    ],
    howToUse: [
      '01. Use dry on dry skin before stepping into the shower.',
      '02. Brush with light, upward strokes toward the heart starting from feet.',
      '03. Follow with warm shower and ELVARIA Medicated Body Lotion.',
    ],
    warnings: 'Do not use on broken, irritated, sunburned, or eczema-prone lesions.',
    seoTitle: 'ELVARIA Natural Ionic Dry Body Brush — Body Care Accessories',
    seoDescription: 'Premium dry body brush for radiant, smoother skin texture.',
    isFeatured: true,
    status: 'published',
    rating: 4.8,
    reviewCount: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-back-applicator',
    name: 'ELVARIA Ergonomic Lotion Back Applicator',
    slug: 'elvaria-back-applicator',
    sku: 'ELV-EBA-002',
    shortDescription: 'Folding long-reach applicator to effortlessly apply lotion across the back.',
    description:
      'Never struggle to moisturize your back again. Features an ergonomic folding handle and dense, non-absorbent grooved silicone pads that apply body lotion evenly and smoothly.',
    price: 16.00,
    size: 'Folding 17-inch Reach',
    category: 'Tools & Accessories',
    stock: 50,
    lowStockThreshold: 8,
    images: PRODUCT_ASSETS['elvaria-back-applicator'],
    ingredientIds: [],
    benefits: [
      {
        title: 'Complete Body Coverage',
        description: 'Reaches middle and lower back with minimal arm strain.',
      },
      {
        title: 'Hygienic & Washable',
        description: 'Rinses clean with water; does not harbor bacteria.',
      },
    ],
    howToUse: [
      '01. Unfold handle until locked.',
      '02. Dispense 1-2 pumps of lotion directly onto applicator pad.',
      '03. Glide gently across back and shoulders. Wipe clean after use.',
    ],
    warnings: 'Keep out of reach of children.',
    seoTitle: 'ELVARIA Ergonomic Lotion Back Applicator — Easy Reaching',
    seoDescription: 'Lotion back applicator tool for easy, seamless all-over application.',
    isFeatured: false,
    status: 'published',
    rating: 4.9,
    reviewCount: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-microfiber-body-wrap',
    name: 'ELVARIA Cloud-Soft Microfiber Body Wrap',
    slug: 'elvaria-microfiber-body-wrap',
    sku: 'ELV-MBW-003',
    shortDescription: 'Frictionless waffle microfiber towel wrap that comforts sensitive skin.',
    description:
      'Standard cotton towels can cause friction and tug on fragile skin. Our cloud-soft microfiber towel wrap absorbs moisture instantaneously without rubbing, featuring an adjustable snap enclosure.',
    price: 28.00,
    size: 'One Size / Adjustable Snap',
    category: 'Tools & Accessories',
    stock: 45,
    lowStockThreshold: 5,
    images: PRODUCT_ASSETS['elvaria-microfiber-body-wrap'],
    ingredientIds: [],
    benefits: [
      {
        title: 'Anti-Friction Fabric',
        description: 'Gentle on sensitized or easily irritated post-shower skin.',
      },
      {
        title: 'Secure Hands-Free Fit',
        description: 'Snap buttons keep wrap securely in place while you moisturize.',
      },
    ],
    howToUse: [
      'Wrap around chest after shower and secure snaps. Gently pat skin dry.',
    ],
    warnings: 'Machine wash warm with similar colors. Do not bleach.',
    seoTitle: 'ELVARIA Cloud-Soft Microfiber Body Wrap — Bath Essentials',
    seoDescription: 'Ultra-soft microfiber bath wrap for sensitive post-shower skin.',
    isFeatured: false,
    status: 'published',
    rating: 4.9,
    reviewCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-silicone-body-scrubber',
    name: 'ELVARIA Hygienic Silicone Body Scrubber',
    slug: 'elvaria-silicone-scrubber',
    sku: 'ELV-SCS-004',
    shortDescription: 'Antimicrobial silicone scrubber replacing bacteria-harboring loofahs.',
    description:
      'Ditch outdated loofahs that trap moisture and germs. Made from 100% food-grade silicone with ultra-fine flexible bristles that lather easily and rinse completely clean.',
    price: 14.00,
    size: 'Ergonomic Palm Fit',
    category: 'Tools & Accessories',
    stock: 110,
    lowStockThreshold: 15,
    images: PRODUCT_ASSETS['elvaria-silicone-scrubber'],
    ingredientIds: [],
    benefits: [
      {
        title: '100% Hygienic',
        description: 'Quick-drying and resistant to mold and odor.',
      },
      {
        title: 'Gentle Micro-Lather',
        description: 'Creates a rich lather while gently buffing surface impurities.',
      },
    ],
    howToUse: [
      'Apply ELVARIA Daily Hydrating Body Wash to bristles and gently lather over wet body.',
    ],
    warnings: 'Rinse with warm water and hang to dry.',
    seoTitle: 'ELVARIA Silicone Body Scrubber — Hygienic Bath Care',
    seoDescription: 'Antimicrobial silicone scrubber for clean, refreshing daily lather.',
    isFeatured: false,
    status: 'published',
    rating: 4.8,
    reviewCount: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-travel-pouch-locks',
    name: 'ELVARIA Travel Protection Pouch & Pump Locks',
    slug: 'elvaria-travel-pouch-locks',
    sku: 'ELV-TPP-005',
    shortDescription: 'Water-resistant travel pouch with custom clip-locks to prevent pump spills.',
    description:
      'Pack your skincare bottles with total peace of mind. Includes 2 universal pump-neck locks that prevent accidental depression, housed in a spill-resistant vegan leather travel bag.',
    price: 12.00,
    size: 'Pouch + 2 Clip Locks',
    category: 'Tools & Accessories',
    stock: 75,
    lowStockThreshold: 10,
    images: PRODUCT_ASSETS['elvaria-travel-pouch-locks'],
    ingredientIds: [],
    benefits: [
      {
        title: 'Zero Leakage Guarantee',
        description: 'Snap locks securely immobilize pump nozzles in luggage.',
      },
      {
        title: 'Wipe-Clean Lining',
        description: 'Internal TPU barrier protects clothing from accidental spills.',
      },
    ],
    howToUse: [
      'Snap clip lock firmly around the pump neck below the nozzle. Slip bottle into travel pouch.',
    ],
    warnings: 'Keep away from sharp objects.',
    seoTitle: 'ELVARIA Travel Protection Pouch & Pump Locks — On-The-Go',
    seoDescription: 'Travel leak-prevention pump clips and water-resistant pouch.',
    isFeatured: false,
    status: 'published',
    rating: 4.7,
    reviewCount: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-daily',
    question: 'Can I use ELVARIA BEAUTY every day?',
    answer:
      'Yes. ELVARIA Medicated Body Lotion is thoughtfully formulated for everyday use. We recommend applying it once or twice daily, particularly after bathing when skin absorbs moisture most effectively.',
    category: 'usage',
    order: 1,
    isPublished: true,
  },
  {
    id: 'faq-when-apply',
    question: 'When should I apply body lotion?',
    answer:
      'The ideal time to apply ELVARIA BEAUTY is within three minutes of exiting the shower or bath while your skin is still slightly damp. This helps seal in ambient surface hydration and leaves skin feeling supple.',
    category: 'usage',
    order: 2,
    isPublished: true,
  },
  {
    id: 'faq-sensitive',
    question: 'Is it suitable for sensitive-feeling skin?',
    answer:
      'ELVARIA BEAUTY is formulated with gentle, non-irritating, dermatologist-inspired ingredients specifically designed to comfort skin that feels easily dry, tight, or sensitive. However, we always recommend conducting a patch test on a small area of your inner arm prior to widespread use.',
    category: 'ingredients',
    order: 3,
    isPublished: true,
  },
  {
    id: 'faq-children',
    question: 'Can children use it?',
    answer:
      'ELVARIA BEAUTY is intended primarily for adults and teens. While the ingredients are gentle, for infants and young children under 3 years old, we advise consulting your pediatrician before introducing new body care products.',
    category: 'general',
    order: 4,
    isPublished: true,
  },
  {
    id: 'faq-face',
    question: 'Can I use it on my face?',
    answer:
      'ELVARIA BEAUTY was specifically formulated as a rich body lotion. While its ingredients are skin-friendly, facial skin possesses higher sebum gland density and different pore characteristics. We recommend keeping this product for body care and using a dedicated facial moisturizer for the face.',
    category: 'usage',
    order: 5,
    isPublished: true,
  },
  {
    id: 'faq-how-much',
    question: 'How much should I apply?',
    answer:
      'Start with 1 to 2 pumps per limb. ELVARIA BEAUTY spreads smoothly and absorbs with a comfortable, non-greasy finish. You can apply more to areas prone to dryness such as elbows, knees, and ankles.',
    category: 'usage',
    order: 6,
    isPublished: true,
  },
  {
    id: 'faq-storage',
    question: 'How should I store the product?',
    answer:
      'Store your bottle upright in a cool, dry place away from direct sunlight, ideally between 15°C and 28°C (59°F–82°F). Keep the pump mechanism clean and twist-locked when traveling.',
    category: 'general',
    order: 7,
    isPublished: true,
  },
  {
    id: 'faq-eczema',
    question: 'Does ELVARIA BEAUTY treat eczema or psoriasis?',
    answer:
      'No. ELVARIA Medicated Body Lotion is designed for cosmetic moisturization and comforting dry, sensitive-feeling skin. It is not formulated to diagnose, cure, mitigate, treat, or prevent medical skin diseases such as eczema, psoriasis, or bacterial/fungal infections. If you suspect you have a clinical skin condition, please seek guidance from a licensed dermatologist or medical doctor.',
    category: 'medical',
    order: 8,
    isPublished: true,
  },
  {
    id: 'faq-shipping-intl',
    question: 'What are the international shipping options and timeframes?',
    answer:
      'We offer complimentary standard shipping on all orders over $50.00. Standard delivery typically takes 3–5 business days within the United States and Canada, and 6–10 business days for international destinations. Expedited shipping is available at checkout.',
    category: 'shipping',
    order: 9,
    isPublished: true,
  },
  {
    id: 'faq-returns',
    question: 'What is your return and refund policy?',
    answer:
      'We offer a 30-day satisfaction guarantee. If ELVARIA BEAUTY does not meet your skin comfort expectations, contact care@elvariabeauty.com with your order number for an easy, hassle-free return or full product refund.',
    category: 'general',
    order: 10,
    isPublished: true,
  },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    discountPercentage: 10,
    minOrderAmount: 30,
    maxDiscountAmount: 20,
    usageLimit: 1000,
    usageCount: 18,
    description: '10% off your first ELVARIA BEAUTY order over $30',
    isActive: true,
  },
  {
    id: 'coup-comfort15',
    code: 'COMFORT15',
    discountType: 'percentage',
    discountValue: 15,
    discountPercentage: 15,
    minOrderAmount: 50,
    maxDiscountAmount: 30,
    usageLimit: 500,
    usageCount: 24,
    description: '15% off skin comfort routine orders over $50',
    isActive: true,
  },
  {
    id: 'coup-derma5',
    code: 'DERMA5',
    discountType: 'fixed',
    discountValue: 5,
    discountFixed: 5,
    minOrderAmount: 25,
    usageLimit: 500,
    usageCount: 14,
    description: '$5.00 off any order over $25',
    isActive: true,
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-sample-1',
    productId: 'prod-elvaria-body-lotion',
    productName: 'ELVARIA Medicated Body Lotion',
    authorName: 'Sarah M., Verified Customer',
    authorEmail: 'sarah.m@example.com',
    rating: 5,
    title: 'Remarkable comfort for dry winter skin',
    content:
      'Sample Review: The texture is rich yet absorbs almost immediately. My legs and elbows felt soothed without that sticky coating that ruins pajama silk.',
    date: '2026-03-12',
    isVerifiedPurchase: true,
    isApproved: true,
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 'rev-sample-2',
    productId: 'prod-elvaria-body-lotion',
    productName: 'ELVARIA Medicated Body Lotion',
    authorName: 'Elena R., Verified Buyer',
    authorEmail: 'elena.r@example.com',
    rating: 5,
    title: 'Finally something that calms tightness',
    content:
      'Sample Review: I have very dry, sensitive-feeling skin especially after showering. ELVARIA BEAUTY has become my holy grail post-bath step.',
    date: '2026-03-04',
    isVerifiedPurchase: true,
    isApproved: true,
    status: 'approved',
    isFeatured: true,
  },
  {
    id: 'rev-sample-3',
    productId: 'prod-rich-barrier-cream',
    productName: 'ELVARIA Rich Barrier Body Cream',
    authorName: 'Marcus T., Verified Customer',
    authorEmail: 'marcus.t@example.com',
    rating: 5,
    title: 'Deep hydration without any artificial fragrance',
    content:
      'Sample Review: Truly fragrance-free and deeply hydrating. It rescued my dry cracked hands after cold weather exposure.',
    date: '2026-02-28',
    isVerifiedPurchase: true,
    isApproved: true,
    status: 'approved',
    isFeatured: true,
  },
];

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_elvaria_salt_2026').digest('hex');
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        
      const cleanImageUrl = (url: string) => {
  return url; // Seedha aapka diya hua raw link hi return karega
};
          if (url.includes('1512290900672')) {
            return 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=1200&q=85';
          }
          return url;
        };

        const cleanedCategories = (parsed.categories || DEFAULT_CATEGORIES).map((c: Category) => ({
          ...c,
          image: cleanImageUrl(c.image),
        }));

        const cleanedProducts = (parsed.products || DEFAULT_PRODUCTS).map((p: Product) => ({
          ...p,
          images: (p.images || []).map(cleanImageUrl),
        }));

        return {
          categories: cleanedCategories,
          products: cleanedProducts,
          ingredients: parsed.ingredients || DEFAULT_INGREDIENTS,
          reviews: parsed.reviews || DEFAULT_REVIEWS,
          coupons: parsed.coupons || DEFAULT_COUPONS,
          faqs: parsed.faqs || DEFAULT_FAQS,
          orders: parsed.orders || [],
          users: parsed.users || this.getDefaultUsers(),
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          contactMessages: parsed.contactMessages || [],
          newsletterSubscribers: parsed.newsletterSubscribers || [],
        };
      }
    } catch (err) {
      console.error('Failed to load database file, creating fresh seed:', err);
    }
    const fresh: DatabaseSchema = {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      ingredients: DEFAULT_INGREDIENTS,
      reviews: DEFAULT_REVIEWS,
      coupons: DEFAULT_COUPONS,
      faqs: DEFAULT_FAQS,
      orders: [],
      users: this.getDefaultUsers(),
      settings: DEFAULT_SETTINGS,
      contactMessages: [],
      newsletterSubscribers: [],
    };
    this.saveData(fresh);
    return fresh;
  }

  private getDefaultUsers() {
    return [
      {
        id: 'usr-admin',
        name: 'ELVARIA BEAUTY Administrator',
        email: 'admin@elvariabeauty.com',
        phone: '+18005553376',
        role: 'admin' as const,
        addresses: [],
        wishlistProductIds: ['prod-elvaria-body-lotion'],
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword('admin123'),
      },
      {
        id: 'usr-demo-customer',
        name: 'Jane Doe',
        email: 'customer@elvariabeauty.com',
        phone: '+18005553376',
        role: 'customer' as const,
        addresses: [
          {
            id: 'addr-demo-1',
            fullName: 'Jane Doe',
            phone: '+1 (555) 234-5678',
            streetAddress: '742 Evergreen Terrace',
            city: 'Springfield',
            province: 'OR',
            postalCode: '97477',
            isDefault: true,
          },
        ],
        wishlistProductIds: ['prod-elvaria-body-lotion', 'prod-dry-body-brush'],
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword('customer123'),
      },
    ];
  }

  private saveData(newData?: DatabaseSchema) {
    if (newData) {
      this.data = newData;
    }
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories.sort((a, b) => a.order - b.order);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find((c) => c.slug === slug);
  }

  createCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + crypto.randomBytes(4).toString('hex'),
    };
    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.saveData();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== prevLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: 'prod-' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.products[idx];
  }

  deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== prevLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Ingredients
  getIngredients(): Ingredient[] {
    return this.data.ingredients.sort((a, b) => a.order - b.order);
  }

  getIngredientById(id: string): Ingredient | undefined {
    return this.data.ingredients.find((i) => i.id === id);
  }

  // Reviews
  getReviews(productIdOrShowAll?: string | boolean): Review[] {
    if (typeof productIdOrShowAll === 'boolean') {
      return productIdOrShowAll ? this.data.reviews : this.getApprovedReviews();
    }
    if (productIdOrShowAll) {
      return this.data.reviews.filter((r) => r.productId === productIdOrShowAll);
    }
    return this.data.reviews;
  }

  getApprovedReviews(productId?: string): Review[] {
    const list = this.data.reviews.filter((r) => r.isApproved || r.status === 'approved');
    if (productId) {
      return list.filter((r) => r.productId === productId);
    }
    return list;
  }

  createReview(reviewData: Omit<Review, 'id' | 'date' | 'isApproved' | 'status'>): Review {
    const newRev: Review = {
      ...reviewData,
      id: 'rev-' + crypto.randomBytes(4).toString('hex'),
      date: new Date().toISOString().split('T')[0],
      isApproved: false, // Requires moderation before public display
      status: 'pending',
      isFeatured: false,
    };
    this.data.reviews.unshift(newRev);
    this.saveData();
    return newRev;
  }

  updateReview(id: string, updates: Partial<Review>): Review | null {
    const idx = this.data.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.saveData();
    return this.data.reviews[idx];
  }

  deleteReview(id: string): boolean {
    const prev = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter((r) => r.id !== id);
    if (this.data.reviews.length !== prev) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Coupons
  getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  getCouponByCode(code: string): Coupon | undefined {
    return this.data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  }

  createCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: 'coup-' + crypto.randomBytes(4).toString('hex'),
      usageCount: 0,
    };
    this.data.coupons.push(newCoupon);
    this.saveData();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.data.coupons.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
    this.saveData();
    return this.data.coupons[idx];
  }

  deleteCoupon(id: string): boolean {
    const prev = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter((c) => c.id !== id);
    if (this.data.coupons.length !== prev) {
      this.saveData();
      return true;
    }
    return false;
  }

  // FAQs
  getFAQs(): FAQ[] {
    return this.data.faqs.filter((f) => f.isPublished).sort((a, b) => a.order - b.order);
  }

  getAllFAQsAdmin(): FAQ[] {
    return this.data.faqs.sort((a, b) => a.order - b.order);
  }

  // Orders
  getOrders(customerId?: string): Order[] {
    if (customerId) {
      return this.data.orders.filter((o) => o.customerId === customerId);
    }
    return this.data.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: any): Order {
    const orderNum = orderData.orderNumber || ('DMV-' + Math.floor(100000 + Math.random() * 900000));
    const newOrder: Order = {
      ...orderData,
      id: orderData.id || ('ord-' + crypto.randomBytes(5).toString('hex')),
      orderNumber: orderNum,
      timeline: orderData.timeline || [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          note: `Order ${orderNum} received and registered in system.`,
        },
      ],
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If coupon used, increment count
    if (orderData.couponCode) {
      const coup = this.getCouponByCode(orderData.couponCode);
      if (coup) {
        this.updateCoupon(coup.id, { usageCount: coup.usageCount + 1 });
      }
    }

    // Decrement inventory
    for (const item of orderData.items) {
      const prod = this.getProductById(item.productId);
      if (prod) {
        this.updateProduct(prod.id, { stock: Math.max(0, prod.stock - item.quantity) });
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }

  updateOrderStatus(
    id: string,
    status: Order['orderStatus'],
    note?: string,
    trackingNumber?: string
  ): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const order = this.data.orders[idx];
    order.orderStatus = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    order.timeline.push({
      status: `Status updated to ${status.replace('_', ' ').toUpperCase()}`,
      timestamp: new Date().toISOString(),
      note: note || `Order transitioned to ${status}`,
    });
    order.updatedAt = new Date().toISOString();
    this.data.orders[idx] = order;
    this.saveData();
    return order;
  }

  // Users & Auth
  findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    const normalized = email.toLowerCase().trim();
    return this.data.users.find((u) => {
      const uEmail = u.email.toLowerCase().trim();
      if (uEmail === normalized) return true;
      if (normalized === 'admin@dermavea.com' && uEmail === 'admin@elvariabeauty.com') return true;
      if (normalized === 'customer@dermavea.com' && uEmail === 'customer@elvariabeauty.com') return true;
      if (normalized === 'admin@elvariabeauty.com' && uEmail === 'admin@dermavea.com') return true;
      if (normalized === 'customer@elvariabeauty.com' && uEmail === 'customer@dermavea.com') return true;
      return false;
    });
  }

  findUserById(id: string): User | undefined {
    const found = this.data.users.find((u) => u.id === id);
    if (!found) return undefined;
    const { passwordHash, ...user } = found;
    return user;
  }

  createUser(name: string, email: string, passwordPlain: string, phone?: string): User {
    const newUser = {
      id: 'usr-' + crypto.randomBytes(4).toString('hex'),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      role: 'customer' as const,
      addresses: [],
      wishlistProductIds: [],
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword(passwordPlain),
    };
    this.data.users.push(newUser);
    this.saveData();
    const { passwordHash, ...userWithoutPass } = newUser;
    return userWithoutPass;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.saveData();
    const { passwordHash, ...safeUser } = this.data.users[idx];
    return safeUser;
  }

  verifyPassword(user: User & { passwordHash: string }, plainPassword: string): boolean {
    const primaryHash = hashPassword(plainPassword);
    const legacyHash = crypto.createHash('sha256').update(plainPassword + '_dermavea_salt_2026').digest('hex');
    return user.passwordHash === primaryHash || user.passwordHash === legacyHash;
  }

  // Settings
  getSettings(): SiteSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
    return this.data.settings;
  }

  // Contact Messages
  createContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + crypto.randomBytes(4).toString('hex'),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.data.contactMessages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }

  getContactMessages(): ContactMessage[] {
    return this.data.contactMessages;
  }

  markContactMessageRead(id: string): boolean {
    const msg = this.data.contactMessages.find((m) => m.id === id);
    if (msg) {
      msg.isRead = true;
      this.saveData();
      return true;
    }
    return false;
  }

  // Newsletter
  subscribeNewsletter(email: string): { success: boolean; message: string; status: string } {
    const existing = this.data.newsletterSubscribers.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return {
        success: true,
        message: 'You are already subscribed to the ELVARIA BEAUTY skin list.',
        status: 'already_subscribed',
      };
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + crypto.randomBytes(4).toString('hex'),
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };
    this.data.newsletterSubscribers.unshift(newSub);
    this.saveData();
    return {
      success: true,
      message: 'Thank you for joining ELVARIA BEAUTY. Check your inbox for updates.',
      status: 'subscribed',
    };
  }

  getNewsletterSubscribers(): NewsletterSubscriber[] {
    return this.data.newsletterSubscribers;
  }

  addSubscriber(email: string) {
    return this.subscribeNewsletter(email);
  }

  getSubscribers(): NewsletterSubscriber[] {
    return this.getNewsletterSubscribers();
  }

  // Compatibility helpers for server.ts
  saveProduct(prod: any): Product {
    const idx = this.data.products.findIndex((p) => p.id === prod.id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...prod };
      this.saveData();
      return this.data.products[idx];
    } else {
      this.data.products.push(prod);
      this.saveData();
      return prod;
    }
  }

  saveIngredient(ing: any): Ingredient {
    const idx = this.data.ingredients.findIndex((i) => i.id === ing.id);
    if (idx !== -1) {
      this.data.ingredients[idx] = { ...this.data.ingredients[idx], ...ing };
      this.saveData();
      return this.data.ingredients[idx];
    } else {
      this.data.ingredients.push(ing);
      this.saveData();
      return ing;
    }
  }

  deleteIngredient(id: string): boolean {
    const prev = this.data.ingredients.length;
    this.data.ingredients = this.data.ingredients.filter((i) => i.id !== id);
    if (this.data.ingredients.length !== prev) {
      this.saveData();
      return true;
    }
    return false;
  }

  getFaqs(): FAQ[] {
    return this.getFAQs();
  }

  saveFaq(faq: any): FAQ {
    const idx = this.data.faqs.findIndex((f) => f.id === faq.id);
    if (idx !== -1) {
      this.data.faqs[idx] = { ...this.data.faqs[idx], ...faq };
      this.saveData();
      return this.data.faqs[idx];
    } else {
      this.data.faqs.push(faq);
      this.saveData();
      return faq;
    }
  }

  deleteFaq(id: string): boolean {
    const prev = this.data.faqs.length;
    this.data.faqs = this.data.faqs.filter((f) => f.id !== id);
    if (this.data.faqs.length !== prev) {
      this.saveData();
      return true;
    }
    return false;
  }

  addReview(review: any): Review {
    return this.createReview(review);
  }

  saveCoupon(coupon: any): Coupon {
    const idx = this.data.coupons.findIndex((c) => c.id === coupon.id);
    if (idx !== -1) {
      this.data.coupons[idx] = { ...this.data.coupons[idx], ...coupon };
      this.saveData();
      return this.data.coupons[idx];
    } else {
      this.data.coupons.push(coupon);
      this.saveData();
      return coupon;
    }
  }

  getOrdersByCustomerId(customerId: string): Order[] {
    return this.getOrders(customerId);
  }

  verifyCredentials(email: string, passwordPlain: string): User | null {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    if (this.verifyPassword(user, passwordPlain)) {
      const { passwordHash, ...safe } = user;
      return safe;
    }
    return null;
  }

  getUsers(): User[] {
    return this.data.users.map(({ passwordHash, ...u }) => u);
  }

  addContactMessage(msg: any): ContactMessage {
    return this.createContactMessage(msg);
  }

  markMessageRead(id: string): boolean {
    return this.markContactMessageRead(id);
  }

  // Force seed refresh helper
  resetToDefaultSeed() {
    const fresh: DatabaseSchema = {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      ingredients: DEFAULT_INGREDIENTS,
      reviews: DEFAULT_REVIEWS,
      coupons: DEFAULT_COUPONS,
      faqs: DEFAULT_FAQS,
      orders: [],
      users: this.getDefaultUsers(),
      settings: DEFAULT_SETTINGS,
      contactMessages: [],
      newsletterSubscribers: [],
    };
    this.saveData(fresh);
    return fresh;
  }
}

export const db = new Database();
