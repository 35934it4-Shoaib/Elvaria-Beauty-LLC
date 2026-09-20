export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  size: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  ingredientIds: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  howToUse: string[];
  warnings: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  rating: number;
  reviewCount: number;
  bundles?: {
    id: string;
    name: string;
    sizeText: string;
    price: number;
    savingsText?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  inciName?: string;
  shortDescription: string;
  detailedExplanation: string;
  description?: string;
  function: string;
  category: string;
  image?: string;
  isFeatured: boolean;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  content: string;
  comment?: string;
  date: string;
  createdAt?: string;
  isVerifiedPurchase: boolean;
  isVerifiedBuyer?: boolean;
  isApproved: boolean;
  status?: 'approved' | 'rejected' | 'pending';
  isFeatured: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountPercentage?: number;
  discountFixed?: number;
  description?: string;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'usage' | 'ingredients' | 'shipping' | 'medical';
  order: number;
  isPublished: boolean;
}

export interface CartItem {
  id?: string;
  productId?: string;
  product: Product;
  quantity: number;
  selectedBundleId?: string;
  variantName?: string;
  unitPrice: number;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  streetAddress?: string;
  street?: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending_confirmation' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  trackingNumber?: string;
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  wishlistProductIds: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  status: 'active' | 'inactive';
}

export interface SiteSettings {
  brandName: string;
  legalName?: string;
  storeName?: string;
  tagline: string;
  secondaryTagline: string;
  announcementText: string;
  announcementEnabled?: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
  currency: string;
  currencySymbol?: string;
  whatsappPhone: string;
  whatsappDefaultMessage: string;
  contactEmail: string;
  supportEmail?: string;
  contactPhone: string;
  contactAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  medicalDisclaimer: string;
  placeholderClaimsWarning: string;
  stripeEnabled: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}
