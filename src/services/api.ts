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
} from '../types';

export const api = {
  // Categories
  async getCategories(): Promise<{ success: boolean; categories: Category[] }> {
    const res = await fetch('/api/categories');
    return res.json();
  },

  async createCategory(cat: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    return res.json();
  },

  async updateCategory(id: string, cat: Partial<Category>): Promise<{ success: boolean; category: Category }> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat),
    });
    return res.json();
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; settings: SiteSettings }> {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.json();
  },

  // Products
  async getProducts(): Promise<{ success: boolean; products: Product[] }> {
    const res = await fetch('/api/products');
    return res.json();
  },

  async getProduct(slugOrId: string): Promise<{ success: boolean; product: Product }> {
    const res = await fetch(`/api/products/${slugOrId}`);
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; product: Product }> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Inventory
  async getInventory(): Promise<{ success: boolean; inventory: any[] }> {
    const res = await fetch('/api/inventory');
    return res.json();
  },

  async adjustInventory(productId: string, adjustment?: number, newStock?: number): Promise<{ success: boolean }> {
    const res = await fetch('/api/inventory/adjust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, adjustment, newStock }),
    });
    return res.json();
  },

  // Ingredients
  async getIngredients(): Promise<{ success: boolean; ingredients: Ingredient[] }> {
    const res = await fetch('/api/ingredients');
    return res.json();
  },

  async createIngredient(ingredient: Partial<Ingredient>): Promise<{ success: boolean; ingredient: Ingredient }> {
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    });
    return res.json();
  },

  async updateIngredient(id: string, ingredient: Partial<Ingredient>): Promise<{ success: boolean; ingredient: Ingredient }> {
    const res = await fetch(`/api/ingredients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingredient),
    });
    return res.json();
  },

  async deleteIngredient(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/ingredients/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // FAQs
  async getFaqs(): Promise<{ success: boolean; faqs: FAQ[] }> {
    const res = await fetch('/api/faqs');
    return res.json();
  },

  async createFaq(faq: Partial<FAQ>): Promise<{ success: boolean; faq: FAQ }> {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
    return res.json();
  },

  async updateFaq(id: string, faq: Partial<FAQ>): Promise<{ success: boolean; faq: FAQ }> {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq),
    });
    return res.json();
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Reviews
  async getReviews(all = false): Promise<{ success: boolean; reviews: Review[] }> {
    const res = await fetch(`/api/reviews${all ? '?all=true' : ''}`);
    return res.json();
  },

  async submitReview(review: Partial<Review>): Promise<{ success: boolean; message: string; review: Review }> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return res.json();
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async moderateReview(id: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; review?: Review }> {
    return this.updateReview(id, { isApproved: status === 'approved', status });
  },

  // Coupons
  async getCoupons(): Promise<{ success: boolean; coupons: Coupon[] }> {
    const res = await fetch('/api/coupons');
    return res.json();
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ success: boolean; coupon?: any; error?: string; message?: string }> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return res.json();
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<{ success: boolean; coupon: Coupon }> {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    });
    return res.json();
  },

  async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<{ success: boolean; coupon: Coupon }> {
    const res = await fetch(`/api/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon),
    });
    return res.json();
  },

  async deleteCoupon(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Orders
  async getOrders(customerId?: string): Promise<{ success: boolean; orders: Order[] }> {
    const url = customerId ? `/api/orders?customerId=${customerId}` : '/api/orders';
    const res = await fetch(url);
    return res.json();
  },

  async getOrder(id: string): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`/api/orders/${id}`);
    return res.json();
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order; error?: string; message?: string }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  async updateOrderStatus(
    id: string,
    status: Order['orderStatus'],
    note?: string,
    trackingNumber?: string
  ): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, trackingNumber }),
    });
    return res.json();
  },

  // Payments
  async createPaymentIntent(amount: number, orderNumber: string): Promise<{ success: boolean; clientSecret: string; isLiveStripe: boolean }> {
    const res = await fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, orderNumber }),
    });
    return res.json();
  },

  // Auth
  async register(name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`/api/auth/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async getUsers(): Promise<{ success: boolean; users: User[] }> {
    const res = await fetch('/api/users');
    return res.json();
  },

  // Contact
  async sendContactMessage(data: { name: string; email: string; phone?: string; orderNumber?: string; message: string }): Promise<{ success: boolean; message: string; error?: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async submitContact(data: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<{ success: boolean; message?: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getContactMessages(): Promise<{ success: boolean; messages: ContactMessage[] }> {
    const res = await fetch('/api/contact');
    return res.json();
  },

  async markContactMessageRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/contact/${id}/read`, { method: 'PUT' });
    return res.json();
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string; error?: string }> {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async getNewsletterSubscribers(): Promise<{ success: boolean; subscribers: NewsletterSubscriber[] }> {
    const res = await fetch('/api/newsletter');
    return res.json();
  },
};
