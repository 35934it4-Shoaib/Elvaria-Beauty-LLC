import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __dirname = typeof __dirname !== 'undefined' 
  ? __dirname 
  : (typeof __filename !== 'undefined' ? path.dirname(__filename) : process.cwd());
      ? fileURLToPath((import.meta as any).url) 
      : __filename);

const __dirname = typeof __dirname !== 'undefined' 
  ? __dirname 
  : (typeof __filename !== 'undefined' ? path.dirname(__filename) : process.cwd());
import { db } from './server/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ELVARIA BEAUTY E-Commerce Backend',
  });
});

// -------------------------------------------------------------
// SETTINGS & CONTENT
// -------------------------------------------------------------
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/settings', (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const newCategory = db.createCategory(req.body);
    res.json({ success: true, category: newCategory });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, category: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const ok = db.deleteCategory(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------
app.get('/api/products', (req, res) => {
  try {
    const products = db.getProducts();
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/products/:slugOrId', (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product = db.getProductBySlug(slugOrId);
    if (!product) {
      product = db.getProductById(slugOrId);
    }
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const product = db.saveProduct({
      ...req.body,
      id: req.body.id || 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const existing = db.getProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const updated = db.saveProduct({
      ...existing,
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, product: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    db.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// INVENTORY
// -------------------------------------------------------------
app.get('/api/inventory', (req, res) => {
  try {
    const products = db.getProducts().map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      isLowStock: p.stock <= p.lowStockThreshold,
      category: p.category,
      price: p.price,
    }));
    res.json({ success: true, inventory: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/adjust', (req, res) => {
  try {
    const { productId, adjustment, newStock } = req.body;
    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    if (typeof newStock === 'number') {
      product.stock = Math.max(0, newStock);
    } else if (typeof adjustment === 'number') {
      product.stock = Math.max(0, product.stock + adjustment);
    }
    db.saveProduct(product);
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// INGREDIENTS
// -------------------------------------------------------------
app.get('/api/ingredients', (req, res) => {
  try {
    const ingredients = db.getIngredients();
    res.json({ success: true, ingredients });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/ingredients', (req, res) => {
  try {
    const ing = db.saveIngredient({
      ...req.body,
      id: req.body.id || 'ing-' + Date.now(),
    });
    res.json({ success: true, ingredient: ing });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/ingredients/:id', (req, res) => {
  try {
    const ing = db.saveIngredient({
      ...req.body,
      id: req.params.id,
    });
    res.json({ success: true, ingredient: ing });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/ingredients/:id', (req, res) => {
  try {
    db.deleteIngredient(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// FAQS
// -------------------------------------------------------------
app.get('/api/faqs', (req, res) => {
  try {
    const faqs = db.getFaqs();
    res.json({ success: true, faqs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/faqs', (req, res) => {
  try {
    const faq = db.saveFaq({
      ...req.body,
      id: req.body.id || 'faq-' + Date.now(),
    });
    res.json({ success: true, faq });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/faqs/:id', (req, res) => {
  try {
    const faq = db.saveFaq({
      ...req.body,
      id: req.params.id,
    });
    res.json({ success: true, faq });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/faqs/:id', (req, res) => {
  try {
    db.deleteFaq(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------
app.get('/api/reviews', (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const reviews = db.getReviews(showAll);
    res.json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const { authorName, authorEmail, rating, title, content, productId, productName, isVerifiedPurchase } = req.body;
    if (!authorName || !rating || !content) {
      return res.status(400).json({ success: false, error: 'Name, rating, and review content are required.' });
    }

    const review = db.addReview({
      id: 'rev-' + Date.now(),
      productId: productId || 'prod-elvaria-body-lotion',
      productName: productName || 'ELVARIA Medicated Body Lotion',
      authorName,
      authorEmail: authorEmail || '',
      rating: Number(rating) || 5,
      title: title || '',
      content,
      date: new Date().toISOString().split('T')[0],
      isVerifiedPurchase: !!isVerifiedPurchase,
      isApproved: false, // Moderated by default
      isFeatured: false,
    });

    res.json({
      success: true,
      review,
      message: 'Thank you for sharing your experience. Your review has been submitted for moderation.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/reviews/:id', (req, res) => {
  try {
    const updated = db.updateReview(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    res.json({ success: true, review: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/reviews/:id', (req, res) => {
  try {
    db.deleteReview(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// COUPONS
// -------------------------------------------------------------
app.get('/api/coupons', (req, res) => {
  try {
    const coupons = db.getCoupons();
    res.json({ success: true, coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code is required.' });
    }
    const coupon = db.getCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or inactive promotional code.' });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `This code requires a minimum order value of PKR ${coupon.minOrderAmount.toLocaleString()}.`,
      });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, error: 'This promotional code has expired.' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, error: 'This promotional code usage limit has been reached.' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: discount,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coupons', (req, res) => {
  try {
    const coupon = db.saveCoupon({
      ...req.body,
      id: req.body.id || 'coup-' + Date.now(),
      code: req.body.code.toUpperCase(),
      usageCount: 0,
    });
    res.json({ success: true, coupon });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/coupons/:id', (req, res) => {
  try {
    const coupon = db.saveCoupon({
      ...req.body,
      id: req.params.id,
      code: req.body.code ? req.body.code.toUpperCase() : undefined,
    });
    res.json({ success: true, coupon });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/coupons/:id', (req, res) => {
  try {
    db.deleteCoupon(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ORDERS & CHECKOUT
// -------------------------------------------------------------
app.get('/api/orders', (req, res) => {
  try {
    const { customerId } = req.query;
    if (customerId) {
      const orders = db.getOrdersByCustomerId(String(customerId));
      return res.json({ success: true, orders });
    }
    const orders = db.getOrders();
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      couponCode,
      notes,
      customerId,
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required customer and address information.',
      });
    }

    // Verify stock and compute subtotal
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, error: `Product ${item.productName || ''} is unavailable.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const unitPrice = item.unitPrice || product.salePrice || product.price;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      verifiedItems.push({
        productId: product.id,
        productName: product.name,
        productImage: item.productImage || product.images[0] || '',
        size: item.size || product.size,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const settings = db.getSettings();
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;

    let discountAmount = 0;
    if (couponCode) {
      const coupon = db.getCouponByCode(couponCode);
      if (coupon && (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount)) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);
    const orderNumber = 'DV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const initialStatus = paymentMethod === 'cod' ? 'pending_confirmation' : 'processing';
    const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';

    const order = db.createOrder({
      id: 'ord-' + Date.now(),
      orderNumber,
      customerId,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      shippingAddress,
      items: verifiedItems,
      subtotal,
      shippingFee,
      discountAmount,
      couponCode: discountAmount > 0 ? couponCode : undefined,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: initialStatus,
      notes: notes || '',
      timeline: [
        {
          status: 'order_placed',
          timestamp: new Date().toISOString(),
          note:
            paymentMethod === 'cod'
              ? 'Order placed with Cash on Delivery (COD). Pending confirmation.'
              : 'Payment authorized successfully. Order sent for processing.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, note, trackingNumber);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PAYMENTS (Stripe Architecture & Sandbox)
// -------------------------------------------------------------
app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'PKR', orderNumber } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // If real Stripe key is present, instantiate Stripe dynamically
    if (stripeKey && !stripeKey.startsWith('mock')) {
      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(stripeKey);
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // convert to subunits
          currency: currency.toLowerCase(),
          metadata: { orderNumber },
        });
        return res.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
          isLiveStripe: true,
        });
      } catch (stripeErr: any) {
        console.warn('Stripe initialization failed, falling back to simulated sandbox:', stripeErr.message);
      }
    }

    // Modular Sandbox Simulator for local/preview execution
    res.json({
      success: true,
      clientSecret: 'pi_mock_' + Date.now() + '_secret_' + Math.random().toString(36).substring(2, 9),
      isLiveStripe: false,
      message: 'Stripe-ready sandbox intent generated successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// AUTHENTICATION & USERS
// -------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }
    const user = db.createUser(name, email, password, 'customer');
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter your email and password.' });
    }
    const user = db.verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/auth/profile/:id', (req, res) => {
  try {
    const updated = db.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({ success: true, users });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CONTACT MESSAGES
// -------------------------------------------------------------
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, orderNumber, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }
    const saved = db.addContactMessage({ name, email, phone, orderNumber, message });
    res.json({
      success: true,
      message: 'Your message has been sent to our customer care team. We will respond promptly.',
      data: saved,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/contact', (req, res) => {
  try {
    const messages = db.getContactMessages();
    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/contact/:id/read', (req, res) => {
  try {
    const updated = db.markMessageRead(req.params.id);
    res.json({ success: true, message: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// NEWSLETTER
// -------------------------------------------------------------
app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }
    const result = db.addSubscriber(email);
    if (result.status === 'already_subscribed') {
      return res.json({
        success: true,
        message: 'You are already subscribed to ELVARIA BEAUTY skincare updates.',
      });
    }
    res.json({
      success: true,
      message: 'Welcome to ELVARIA BEAUTY. You will now receive thoughtful skincare updates and exclusive offers.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/newsletter', (req, res) => {
  try {
    const subscribers = db.getSubscribers();
    res.json({ success: true, subscribers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ELVARIA BEAUTY] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
