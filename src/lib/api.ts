import { products as mockProducts, categories as mockCategories, brands as mockBrands } from '../data/mockData';

export interface HomeSection {
  id: string;
  type: string;
  name: { en: string; ar: string };
  visible: boolean;
  order: number;
  content?: {
    imageUrl?: string;
    link?: string;
    title?: { en: string; ar: string };
    subtitle?: { en: string; ar: string };
    filterType?: 'category' | 'brand';
    filterId?: string;
  };
}

export const defaultHomeLayout: HomeSection[] = [
  { id: 'hero', type: 'hero', name: { en: 'Hero Banner', ar: 'البانر الرئيسي' }, visible: true, order: 1 },
  { id: 'categories', type: 'categories', name: { en: 'Shop by Category', ar: 'تسوق حسب القسم' }, visible: true, order: 2 },
  { id: 'brands', type: 'brands', name: { en: 'Shop by Brand', ar: 'تسوق حسب الماركة' }, visible: true, order: 3 },
  { id: 'promo1', type: 'promo1', name: { en: 'Promo Banner', ar: 'لافتة العرض الأول' }, visible: true, order: 4 },
  { id: 'grid_banners', type: 'grid_banners', name: { en: 'Grid Banners', ar: 'شبكة اللافتات' }, visible: true, order: 5 },
  { id: 'best_sellers', type: 'best_sellers', name: { en: 'Best Sellers', ar: 'الأكثر مبيعاً' }, visible: true, order: 6 },
  { id: 'video_promo', type: 'video_promo', name: { en: 'Video Promo', ar: 'فيديو العرض / لافتة ضخمة' }, visible: true, order: 7 },
  { id: 'features', type: 'features', name: { en: 'Features', ar: 'المميزات ولماذا تختارنا' }, visible: true, order: 8 },
  { id: 'reviews', type: 'reviews', name: { en: 'Customer Reviews', ar: 'آراء العملاء' }, visible: true, order: 9 },
  { id: 'faq', type: 'faq', name: { en: 'FAQ', ar: 'الأسئلة الشائعة' }, visible: true, order: 10 },
];

const API_BASE = 'http://127.0.0.1:8001/api/v1';

// Helper to map snake_case backend keys to camelCase frontend keys
const mapProduct = (p: any): any => {
  if (!p) return null;
  return {
    id: String(p.id),
    dbId: p.id,
    slug: p.slug,
    name: { en: p.name_en, ar: p.name_ar },
    category: p.category ? p.category.slug : 'mattresses',
    categoryId: p.category_id,
    brand: p.brand,
    basePrice: Number(p.base_price),
    salePrice: p.sale_price ? Number(p.sale_price) : undefined,
    rating: Number(p.rating),
    reviewCount: p.reviews_count || 12,
    firmness: p.firmness || 'medium',
    warrantyMonths: p.warranty_months,
    attributes: (p.attributes || []).map((attr: any) => {
      if (attr.groupNameEn !== undefined) return attr; // Already frontend formatted
      return {
        id: attr.id,
        groupId: attr.group_id,
        valueEn: attr.value_en,
        valueAr: attr.value_ar,
        groupNameEn: attr.group ? attr.group.name_en : '',
        groupNameAr: attr.group ? attr.group.name_ar : ''
      };
    }),
    badgeLabel: p.badge_label,
    badgeColor: p.badge_color,
    isFeatured: p.is_featured,
    isNewArrival: p.is_new_arrival,
    keyFeatures: typeof p.key_features === 'string' ? JSON.parse(p.key_features || '[]') : (p.key_features || []),
    shortDescription: { en: p.short_description_en, ar: p.short_description_ar },
    description: { en: p.description_en, ar: p.description_ar },
    images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'),
    variations: (p.variations || []).map((v: any) => ({
      id: String(v.id),
      size: v.size,
      price: Number(v.price),
      salePrice: v.sale_price ? Number(v.sale_price) : undefined,
      stock: Number(v.stock),
    })),
    specifications: p.specifications || {
      en: {
        'Thickness': '30 cm',
        'Comfort Layer': 'Cooling Gel Foam',
        'Support Layer': 'Pocket Springs',
        'Firmness Score': p.firmness === 'soft' ? '4.5 / 10' : p.firmness === 'medium' ? '6.5 / 10' : '8.5 / 10',
      },
      ar: {
        'السُمك': '30 سم',
        'طبقة الراحة': 'رغوة الجيل المبردة',
        'طبقة الدعم': 'النوابض الجيبية المغلفة',
        'مقياس الصلابة': p.firmness === 'soft' ? '4.5 / 10' : p.firmness === 'medium' ? '6.5 / 10' : '8.5 / 10',
      }
    }
  };
};

const mapCategory = (c: any): any => {
  return {
    id: c.slug,
    dbId: c.id,
    slug: c.slug,
    name: { en: c.name_en, ar: c.name_ar },
    image: c.image_url,
    parent_id: c.parent_id
  };
};

export const api = {
  // Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.map(mapCategory);
    } catch (e) {
      console.warn('Backend offline, falling back to mock categories', e);
      return mockCategories;
    }
  },

  async addCategory(cat: { name_en: string; name_ar: string; image_url?: string; parent_id?: number }) {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      });
      const data = await res.json();
      return mapCategory(data);
    } catch (e) {
      console.error('Failed to add category to backend', e);
      // Fallback local storage mock addition
      const mockNewCat = {
        id: cat.name_en.toLowerCase().replace(/ /g, '-'),
        slug: cat.name_en.toLowerCase().replace(/ /g, '-'),
        name: { en: cat.name_en, ar: cat.name_ar },
        image: cat.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
        parent_id: cat.parent_id
      };
      return mockNewCat;
    }
  },

  // Brands
  async getBrands() {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('Backend offline, falling back to mock brands', e);
      const storedStr = localStorage.getItem('mm_offline_brands');
      if (storedStr) return JSON.parse(storedStr);
      localStorage.setItem('mm_offline_brands', JSON.stringify(mockBrands));
      return mockBrands;
    }
  },

  async addBrand(brand: any) {
    try {
      const res = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand)
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to add brand', e);
      const newBrand = { ...brand, id: brand.id || brand.name.toLowerCase().replace(/ /g, '-') };
      const storedStr = localStorage.getItem('mm_offline_brands');
      const baseBrands = storedStr ? JSON.parse(storedStr) : [...mockBrands];
      baseBrands.push(newBrand);
      localStorage.setItem('mm_offline_brands', JSON.stringify(baseBrands));
      return newBrand;
    }
  },

  async updateBrand(id: string, brand: any) {
    try {
      const res = await fetch(`${API_BASE}/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand)
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to update brand', e);
      const storedStr = localStorage.getItem('mm_offline_brands');
      const baseBrands = storedStr ? JSON.parse(storedStr) : [...mockBrands];
      const index = baseBrands.findIndex((b: any) => b.id === id);
      if (index >= 0) {
        baseBrands[index] = { ...baseBrands[index], ...brand };
        localStorage.setItem('mm_offline_brands', JSON.stringify(baseBrands));
        return baseBrands[index];
      }
      return null;
    }
  },

  async deleteBrand(id: string) {
    try {
      const res = await fetch(`${API_BASE}/brands/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (e) {
      console.error('Failed to delete brand', e);
      const storedStr = localStorage.getItem('mm_offline_brands');
      const baseBrands = storedStr ? JSON.parse(storedStr) : [...mockBrands];
      const filtered = baseBrands.filter((b: any) => b.id !== id);
      localStorage.setItem('mm_offline_brands', JSON.stringify(filtered));
      return { success: true };
    }
  },

  // Products
  async getProducts(params: { category?: string; firmness?: string; priceRange?: string; search?: string; brand?: string } = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category) query.set('category', params.category);
      if (params.firmness) query.set('firmness', params.firmness);
      if (params.priceRange) query.set('priceRange', params.priceRange);
      if (params.search) query.set('search', params.search);
      if (params.brand) query.set('brand', params.brand);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.map(mapProduct);
    } catch (e) {
      console.warn('Backend offline, falling back to mock products', e);
      const storedStr = localStorage.getItem('mm_offline_products');
      let baseProducts = storedStr ? JSON.parse(storedStr) : [...mockProducts];
      if (!storedStr) localStorage.setItem('mm_offline_products', JSON.stringify(baseProducts));

      let filtered = [...baseProducts];
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      if (params.brand && params.brand !== 'all') {
        filtered = filtered.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
      }
      if (params.firmness && params.firmness !== 'all') {
        filtered = filtered.filter(p => p.firmness === params.firmness);
      }
      return filtered;
    }
  },

  async getProduct(slug: string) {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return mapProduct(data);
    } catch (e) {
      console.warn(`Backend offline, falling back to mock product ${slug}`, e);
      const storedStr = localStorage.getItem('mm_offline_products');
      const baseProducts = storedStr ? JSON.parse(storedStr) : [...mockProducts];
      return baseProducts.find((p: any) => p.slug === slug) || null;
    }
  },

  async addProduct(product: any) {
    try {
      // Map frontend keys to backend snake_case
      const backendPayload = {
        name_en: product.nameEn,
        name_ar: product.nameAr,
        category_id: Number(product.categoryId),
        brand: product.brand,
        base_price: Number(product.basePrice),
        sale_price: product.salePrice ? Number(product.salePrice) : null,
        firmness: product.firmness,
        warranty_months: Number(product.warrantyMonths || 120),
        badge_label: product.badgeLabel,
        badge_color: product.badgeColor,
        is_featured: product.isFeatured || false,
        is_new_arrival: product.isNewArrival || false,
        key_features: product.keyFeatures || [],
        short_description_en: product.shortDescriptionEn,
        short_description_ar: product.shortDescriptionAr,
        description_en: product.descriptionEn,
        description_ar: product.descriptionAr,
        images: product.images || [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'
        ],
        variations: product.variations.map((v: any) => ({
          size: v.size,
          price: Number(v.price),
          sale_price: v.salePrice ? Number(v.salePrice) : null,
          stock: Number(v.stock || 10),
        })),
        attributes: product.attributes || []
      };

      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload)
      });
      const data = await res.json();
      return mapProduct(data);
    } catch (e) {
      console.error('Failed to add product to backend', e);
      // Fallback
      const newProduct = mapProduct({
        id: Date.now(),
        slug: product.nameEn.toLowerCase().replace(/ /g, '-'),
        name_en: product.nameEn,
        name_ar: product.nameAr,
        category_id: product.categoryId,
        brand: product.brand,
        base_price: product.basePrice,
        sale_price: product.salePrice,
        firmness: product.firmness,
        warranty_months: product.warrantyMonths,
        badge_label: product.badgeLabel,
        badge_color: product.badgeColor,
        is_featured: product.isFeatured || false,
        is_new_arrival: product.isNewArrival || false,
        key_features: product.keyFeatures || [],
        short_description_en: product.shortDescriptionEn,
        short_description_ar: product.shortDescriptionAr,
        description_en: product.descriptionEn,
        description_ar: product.descriptionAr,
        images: product.images,
        variations: product.variations.map((v: any) => ({ ...v, sale_price: v.salePrice })),
        attributes: product.attributes || [],
        specifications: product.specifications
      });
      
      const storedStr = localStorage.getItem('mm_offline_products');
      const baseProducts = storedStr ? JSON.parse(storedStr) : [...mockProducts];
      baseProducts.unshift(newProduct);
      localStorage.setItem('mm_offline_products', JSON.stringify(baseProducts));
      
      return newProduct;
    }
  },

  async deleteProduct(id: string) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('API error');
      return true;
    } catch (e) {
      console.warn('Backend offline, mock delete', e);
      const storedStr = localStorage.getItem('mm_offline_products');
      const baseProducts = storedStr ? JSON.parse(storedStr) : [...mockProducts];
      const filtered = baseProducts.filter((p: any) => p.id !== String(id) && p.id !== Number(id));
      localStorage.setItem('mm_offline_products', JSON.stringify(filtered));
      return true;
    }
  },

  async updateProduct(id: string, product: any) {
    try {
      const backendPayload = {
        name_en: product.nameEn,
        name_ar: product.nameAr,
        category_id: Number(product.categoryId),
        brand: product.brand,
        base_price: Number(product.basePrice),
        sale_price: product.salePrice ? Number(product.salePrice) : null,
        firmness: product.firmness,
        warranty_months: Number(product.warrantyMonths || 120),
        badge_label: product.badgeLabel,
        badge_color: product.badgeColor,
        is_featured: product.isFeatured || false,
        is_new_arrival: product.isNewArrival || false,
        key_features: product.keyFeatures || [],
        short_description_en: product.shortDescriptionEn,
        short_description_ar: product.shortDescriptionAr,
        description_en: product.descriptionEn,
        description_ar: product.descriptionAr,
        images: product.images || [],
        variations: product.variations.map((v: any) => ({
          size: v.size,
          price: Number(v.price),
          sale_price: v.salePrice ? Number(v.salePrice) : null,
          stock: Number(v.stock || 10),
        })),
        attributes: product.attributes || []
      };

      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload)
      });
      const data = await res.json();
      return mapProduct(data);
    } catch (e) {
      console.error('Failed to update product', e);
      const storedStr = localStorage.getItem('mm_offline_products');
      let baseProducts = storedStr ? JSON.parse(storedStr) : [...mockProducts];
      
      const index = baseProducts.findIndex((p: any) => p.id === String(id) || p.id === Number(id));
      if (index >= 0) {
        // Simple merge for offline update
        baseProducts[index] = { ...baseProducts[index], ...product };
        if (product.variations) {
          baseProducts[index].variations = product.variations.map((v: any) => ({ ...v, sale_price: v.salePrice }));
        }
        // Ensure mapping structure is somewhat preserved
        if (product.nameEn) baseProducts[index].name = { en: product.nameEn, ar: product.nameAr };
        if (product.shortDescriptionEn) baseProducts[index].shortDescription = { en: product.shortDescriptionEn, ar: product.shortDescriptionAr };
        if (product.descriptionEn) baseProducts[index].description = { en: product.descriptionEn, ar: product.descriptionAr };
        if (product.specifications) baseProducts[index].specifications = product.specifications;
        
        localStorage.setItem('mm_offline_products', JSON.stringify(baseProducts));
        return baseProducts[index];
      }
      return null;
    }
  },

  // B2B Quotations (Leads)
  async getQuotations() {
    try {
      const res = await fetch(`${API_BASE}/quotations`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      return data.map((q: any) => ({
        id: String(q.id),
        quoteNumber: q.quote_number,
        name: q.name,
        email: q.email,
        phone: q.phone,
        company: q.company,
        city: q.city,
        productName: q.product_name,
        quantity: q.quantity,
        notes: q.notes,
        status: q.status,
        amount: Number(q.amount),
        date: q.created_at ? q.created_at.split('T')[0] : '2026-06-03'
      }));
    } catch (e) {
      console.warn('Backend offline, falling back to mock leads', e);
      const saved = localStorage.getItem('mm_leads');
      return saved ? JSON.parse(saved) : [];
    }
  },

  async addQuotation(quote: any) {
    try {
      const backendPayload = {
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
        company: quote.company,
        city: quote.city,
        product_name: quote.productName,
        quantity: String(quote.quantity),
        notes: quote.notes,
        amount: Number(quote.amount || 0)
      };

      const res = await fetch(`${API_BASE}/quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendPayload)
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Failed to submit quote to backend', e);
      return quote;
    }
  },

  async updateQuotationStatus(id: string, status: string) {
    try {
      const res = await fetch(`${API_BASE}/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Failed to update quote status on backend', e);
      return { id, status };
    }
  },

  async deleteQuotation(id: string) {
    try {
      const res = await fetch(`${API_BASE}/quotations/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to delete quotation from backend', e);
      return { success: false };
    }
  },

  // Dynamic Filters
  async getFilters() {
    try {
      const res = await fetch(`${API_BASE}/filters`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!data || data.length === 0) throw new Error('Empty backend data, falling back');
      return data;
    } catch (e) {
      console.warn('Backend offline, falling back to mock filters', e);
      const offlineFiltersStr = localStorage.getItem('mm_offline_filters');
      if (offlineFiltersStr) {
        return JSON.parse(offlineFiltersStr);
      }
      return [
        {
          id: 1,
          name_en: 'Height',
          name_ar: 'الارتفاع',
          options: [
            { id: 4, group_id: 1, value_en: '28 cm', value_ar: '28 سم' },
            { id: 1, group_id: 1, value_en: '30 cm', value_ar: '30 سم' }
          ]
        },
        {
          id: 4,
          name_en: 'Comfort Level',
          name_ar: 'مستوى الراحة',
          options: [
            { id: 5, group_id: 4, value_en: 'Firm Support', value_ar: 'دعم صلب' },
            { id: 6, group_id: 4, value_en: 'Soft Plush', value_ar: 'ناعم جداً' }
          ]
        }
      ];
    }
  },

  async addFilterGroup(group: { name_en: string; name_ar: string }) {
    try {
      const res = await fetch(`${API_BASE}/filters/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to add filter group to backend', e);
      return { id: Date.now(), name_en: group.name_en, name_ar: group.name_ar, options: [] };
    }
  },

  async addFilterOption(option: { group_id: number; value_en: string; value_ar: string }) {
    try {
      const res = await fetch(`${API_BASE}/filters/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(option)
      });
      return await res.json();
    } catch (e) {
      console.error('Failed to add filter option to backend', e);
      return { id: Date.now(), group_id: option.group_id, value_en: option.value_en, value_ar: option.value_ar };
    }
  },

  // Customer Auth
  async register(user: any) {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('Registration backend issue, saving to offline database', e);
      const usersStr = localStorage.getItem('mm_offline_users') || '[]';
      const users = JSON.parse(usersStr);
      if (users.some((u: any) => u.email === user.email)) {
        throw new Error('Email already registered');
      }
      const newUser = { id: Date.now(), ...user };
      users.push(newUser);
      localStorage.setItem('mm_offline_users', JSON.stringify(users));
      return newUser;
    }
  },

  async login(credentials: any) {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('Login backend issue, checking offline database', e);
      const usersStr = localStorage.getItem('mm_offline_users') || '[]';
      const users = JSON.parse(usersStr);
      const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      return user;
    }
  },

  // Orders / Invoices
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, loading offline orders', e);
      const ordersStr = localStorage.getItem('mm_offline_orders') || '[]';
      return JSON.parse(ordersStr);
    }
  },

  async createOrder(order: any) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, saving order to local memory', e);
      const ordersStr = localStorage.getItem('mm_offline_orders') || '[]';
      const orders = JSON.parse(ordersStr);
      const newOrder = {
        id: Date.now(),
        order_number: 'INV-2026-' + Math.floor(10000 + Math.random() * 90000),
        status: 'pending',
        created_at: new Date().toISOString(),
        ...order
      };
      orders.push(newOrder);
      localStorage.setItem('mm_offline_orders', JSON.stringify(orders));
      return newOrder;
    }
  },

  async getCustomerOrders(email: string) {
    try {
      const res = await fetch(`${API_BASE}/orders/customer/${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, loading offline orders for user', e);
      const ordersStr = localStorage.getItem('mm_offline_orders') || '[]';
      const orders = JSON.parse(ordersStr);
      return orders.filter((o: any) => o.customer_email === email);
    }
  },

  async updateOrderStatus(id: number, data: { status?: string, payment_status?: string }) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, updating local order status', e);
      const ordersStr = localStorage.getItem('mm_offline_orders') || '[]';
      const orders = JSON.parse(ordersStr);
      const updatedOrders = orders.map((o: any) => {
        if (o.id === id) {
          return { ...o, ...data };
        }
        return o;
      });
      localStorage.setItem('mm_offline_orders', JSON.stringify(updatedOrders));
      return { success: true };
    }
  },

  async getCustomers() {
    try {
      const res = await fetch(`${API_BASE}/customers`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, listing offline users', e);
      const usersStr = localStorage.getItem('mm_offline_users') || '[]';
      const users = JSON.parse(usersStr);
      const ordersStr = localStorage.getItem('mm_offline_orders') || '[]';
      const orders = JSON.parse(ordersStr);
      
      return users.map((u: any) => ({
        ...u,
        orders_count: orders.filter((o: any) => o.customer_email === u.email).length
      }));
    }
  },

  // Banners
  async getBanners() {
    try {
      const res = await fetch(`${API_BASE}/banners`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!data || data.length === 0) throw new Error('Empty backend data, falling back');
      return data;
    } catch (e) {
      console.warn('Backend offline, loading offline banners', e);
      const bannersStr = localStorage.getItem('mm_offline_banners');
      if (bannersStr) {
        const parsed = JSON.parse(bannersStr);
        if (parsed.length > 0) return parsed;
      }
      // Default banners
      return [
        { id: 1, title_en: 'Summer Sale', title_ar: 'عروض الصيف', image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop', link: '/shop' },
        { id: 2, title_en: 'Premium Collection', title_ar: 'المجموعة الفاخرة', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop', link: '/shop?category=luxury' }
      ];
    }
  },

  async addBanner(banner: { title_en: string; title_ar: string; image_url: string; link?: string }) {
    try {
      const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, adding offline banner', e);
      const banners = await this.getBanners();
      const newBanner = { id: Date.now(), ...banner };
      banners.push(newBanner);
      localStorage.setItem('mm_offline_banners', JSON.stringify(banners));
      return newBanner;
    }
  },

  async deleteBanner(id: number) {
    try {
      const res = await fetch(`${API_BASE}/banners/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, deleting offline banner', e);
      const banners = await this.getBanners();
      const filtered = banners.filter((b: any) => b.id !== id);
      localStorage.setItem('mm_offline_banners', JSON.stringify(filtered));
      return { success: true };
    }
  },

  // Media Library
  async getMedia() {
    try {
      const res = await fetch(`${API_BASE}/media`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, loading offline media', e);
      const mediaStr = localStorage.getItem('mm_offline_media');
      if (mediaStr) {
        return JSON.parse(mediaStr);
      }
      return [];
    }
  },

  async uploadMedia(file: File) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, adding offline media', e);
      const mediaList = await this.getMedia();
      
      // Convert to base64 for offline storage
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const newMedia = { 
        id: Date.now(), 
        name: file.name,
        type: 'image',
        url: base64,
        created_at: new Date().toISOString()
      };
      
      mediaList.unshift(newMedia);
      try {
        localStorage.setItem('mm_offline_media', JSON.stringify(mediaList));
        return newMedia;
      } catch {
        throw new Error('Local storage quota exceeded.');
      }
    }
  },

  async deleteMedia(id: number) {
    try {
      const res = await fetch(`${API_BASE}/media/${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, deleting offline media', e);
      const mediaList = await this.getMedia();
      const filtered = mediaList.filter((m: any) => m.id !== id);
      localStorage.setItem('mm_offline_media', JSON.stringify(filtered));
      return { success: true };
    }
  },

  // Home Layout
  async getHomeLayout(): Promise<HomeSection[]> {
    try {
      const res = await fetch(`${API_BASE}/home-layout`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      const stored = localStorage.getItem('mm_home_layout');
      if (stored) return JSON.parse(stored);
      return defaultHomeLayout;
    }
  },

  async saveHomeLayout(layout: HomeSection[]) {
    try {
      const res = await fetch(`${API_BASE}/home-layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: layout })
      });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (e) {
      localStorage.setItem('mm_home_layout', JSON.stringify(layout));
      return layout;
    }
  }
};
