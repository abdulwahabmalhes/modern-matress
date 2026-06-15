import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.quotations': 'B2B Quotes',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.admin': 'Admin Portal',
    'nav.search': 'Search mattresses, beds...',
    'nav.contact': 'Contact Us',

    // Hero
    'hero.title': 'The Ultimate Sleep Experience',
    'hero.subtitle': 'Handcrafted premium mattresses and luxury bed frames made for the finest homes in the UAE.',
    'hero.cta.shop': 'Explore Collections',
    'hero.cta.quote': 'Get B2B Pricing',
    'hero.badge': '100-Night Sleep Trial',

    // Home Sections
    'home.categories.title': 'Shop by Category',
    'home.categories.subtitle': 'Find the perfect match for your bedroom',
    'home.best.title': 'Our Best Sellers',
    'home.best.subtitle': 'Customer favorites engineered for perfect alignment and pressure relief',
    'home.collection.title': 'The Bedroom Collections',
    'home.collection.subtitle': 'Complete coordinated sleep sets designed for ultimate luxury',
    'home.reviews.title': 'What Our Customers Say',
    'home.reviews.subtitle': 'Thousands of sleepers across the Emirates trust Modern Mattresses',
    'home.faq.title': 'Frequently Asked Questions',
    'home.faq.subtitle': 'Everything you need to know about our trial, delivery, and warranty',

    // Categories
    'category.mattresses': 'Mattresses',
    'category.beds': 'Beds & Frames',
    'category.furniture': 'Bedroom Furniture',
    'category.pillows': 'Pillows & Toppers',
    'category.accessories': 'Accessories',

    // Shop
    'shop.title': 'Our Catalog',
    'shop.showing': 'Showing {count} products',
    'shop.filters': 'Filters',
    'shop.filter.category': 'Category',
    'shop.filter.firmness': 'Firmness Level',
    'shop.filter.price': 'Price Range (AED)',
    'shop.filter.size': 'Dimensions / Size',
    'shop.filter.brand': 'Brand',
    'shop.sort.title': 'Sort By',
    'shop.sort.featured': 'Featured',
    'shop.sort.price.low': 'Price: Low to High',
    'shop.sort.price.high': 'Price: High to Low',
    'shop.sort.rating': 'Customer Rating',
    'shop.no.products': 'No products found matching your filters.',
    'shop.clear.filters': 'Clear Filters',
    'shop.compare': 'Compare',
    'shop.compare.add': 'Add to Compare',
    'shop.compare.limit': 'You can compare up to 3 products.',

    // Product Detail
    'product.add.cart': 'Add to Cart',
    'product.request.quote': 'Request Quotation',
    'product.out.stock': 'Out of Stock',
    'product.in.stock': 'In Stock - Ready to Ship',
    'product.firmness': 'Firmness',
    'product.firmness.soft': 'Soft (Plush)',
    'product.firmness.medium': 'Medium-Firm (Balanced)',
    'product.firmness.firm': 'Firm (Orthopedic)',
    'product.size': 'Select Size',
    'product.warranty': '{months}-Month Warranty',
    'product.trial': '100-Night Risk-Free Trial',
    'product.delivery': 'Free Home Delivery & Setup',
    'product.description': 'Description',
    'product.specifications': 'Technical Specifications',
    'product.reviews': 'Reviews ({count})',
    'product.compare.section': 'Compare with similar items',

    // Cart & Checkout
    'cart.title': 'Your Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Proceed to Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.shipping.free': 'Free Delivery',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    'checkout.title': 'Secure Checkout',
    'checkout.billing': 'Billing & Delivery Details',
    'checkout.name': 'Full Name',
    'checkout.email': 'Email Address',
    'checkout.phone': 'Phone Number',
    'checkout.address': 'Street Address / Apartment',
    'checkout.city': 'Emirate / City',
    'checkout.select.city': 'Select your Emirate',
    'checkout.notes': 'Order Notes (Optional)',
    'checkout.payment': 'Payment Method',
    'checkout.payment.card': 'Credit / Debit Card',
    'checkout.payment.cod': 'Cash on Delivery (COD)',
    'checkout.payment.tabby': 'Tabby (4 Interest-Free Payments)',
    'checkout.place': 'Place Order',
    'checkout.success': 'Thank you! Your order has been placed successfully.',
    'checkout.order.number': 'Order Number',
    'checkout.estimate': 'Estimated Delivery: 2-3 working days',

    // Quotation
    'quote.title': 'B2B & Bulk Quotation Request',
    'quote.subtitle': 'Get customized pricing for hotels, projects, real estate developments, or bulk wholesale orders.',
    'quote.company': 'Company Name',
    'quote.qty': 'Estimated Quantity',
    'quote.submit': 'Submit Quote Request',
    'quote.success.title': 'Request Submitted Successfully!',
    'quote.success.msg': 'Our sales representatives will contact you on WhatsApp/Phone within 2 hours with an official quote PDF.',
    'quote.whatsapp.direct': 'Chat directly on WhatsApp',

    // AI Sleep Assistant
    'ai.chat.title': 'Sleep Assistant',
    'ai.chat.welcome': 'Hello! I am your Sleep Assistant. I can recommend the perfect mattress, answer delivery questions, or help you request a B2B quote. How can I help you today?',
    'ai.chat.placeholder': 'Ask me about mattress sizes, comfort, or prices...',
    'ai.chat.suggest.1': 'Recommend a mattress for back pain',
    'ai.chat.suggest.2': 'Do you offer free delivery in Dubai?',
    'ai.chat.suggest.3': 'I want a wholesale quote',

    // Admin Dashboard
    'admin.dashboard': 'CTO Sales & Lead Control Panel',
    'admin.metric.sales': 'Total Sales',
    'admin.metric.quotes': 'Pending B2B Quotes',
    'admin.metric.leads': 'Total B2B Leads',
    'admin.metric.conversion': 'Conversion Rate',
    'admin.pipeline.title': 'Quotation pipeline',
    'admin.pipeline.new': 'New Leads',
    'admin.pipeline.contacted': 'Contacted',
    'admin.pipeline.quoted': 'Quoted Sent',
    'admin.pipeline.approved': 'Approved',
    'admin.pipeline.rejected': 'Rejected',
    'admin.customer.name': 'Customer',
    'admin.customer.phone': 'WhatsApp/Phone',
    'admin.customer.qty': 'Qty',
    'admin.customer.amount': 'Quoted Amount',
    'admin.customer.actions': 'Actions',
    'admin.action.send': 'Send Quote PDF',
    'admin.action.whatsapp': 'WhatsApp chat',
  },
  ar: {
    // Nav
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.quotations': 'عروض أسعار B2B',
    'nav.cart': 'السلة',
    'nav.account': 'حسابي',
    'nav.admin': 'بوابة المدير',
    'nav.search': 'ابحث عن المراتب، الأسرة...',
    'nav.contact': 'اتصل بنا',

    // Hero
    'hero.title': 'تجربة النوم الفاخرة المثالية',
    'hero.subtitle': 'مراتب فاخرة مصنوعة يدوياً وإطارات أسرة راقية صُممت لأرقى المنازل في الإمارات.',
    'hero.cta.shop': 'تصفح التشكيلة',
    'hero.cta.quote': 'طلب سعر الجملة B2B',
    'hero.badge': 'تجربة نوم لمدة 100 ليلة',

    // Home Sections
    'home.categories.title': 'تسوق حسب الفئة',
    'home.categories.subtitle': 'اعثر على الشريك المثالي لغرفة نومك',
    'home.best.title': 'المنتجات الأكثر مبيعاً',
    'home.best.subtitle': 'المفضلة لدى عملائنا، مصممة للمحاذاة المثالية وتخفيف الضغط',
    'home.collection.title': 'مجموعات غرف النوم',
    'home.collection.subtitle': 'مجموعات نوم متناسقة مصممة للفخامة المطلقة',
    'home.reviews.title': 'ماذا يقول عملائنا',
    'home.reviews.subtitle': 'آلاف النائمين في الإمارات يثقون في مودرن ماترسز',
    'home.faq.title': 'الأسئلة الشائعة',
    'home.faq.subtitle': 'كل ما تريد معرفته عن التجربة، التوصيل، والضمان',

    // Categories
    'category.mattresses': 'المراتب',
    'category.beds': 'الأسرة والإطارات',
    'category.furniture': 'أثاث غرفة النوم',
    'category.pillows': 'الوسائد واللباد',
    'category.accessories': 'إكسسوارات النوم',

    // Shop
    'shop.title': 'كتالوج المنتجات',
    'shop.showing': 'عرض {count} منتج',
    'shop.filters': 'الفلاتر',
    'shop.filter.category': 'الفئة',
    'shop.filter.firmness': 'درجة الصلابة',
    'shop.filter.price': 'نطاق السعر (درهم)',
    'shop.filter.size': 'الأبعاد / المقاس',
    'shop.filter.brand': 'العلامة التجارية',
    'shop.sort.title': 'ترتيب حسب',
    'shop.sort.featured': 'المميز',
    'shop.sort.price.low': 'السعر: من الأقل للأعلى',
    'shop.sort.price.high': 'السعر: من الأعلى للأقل',
    'shop.sort.rating': 'تقييم العملاء',
    'shop.no.products': 'لم يتم العثور على منتجات تطابق الفلاتر المحددة.',
    'shop.clear.filters': 'مسح الفلاتر',
    'shop.compare': 'مقارنة',
    'shop.compare.add': 'إضافة للمقارنة',
    'shop.compare.limit': 'يمكنك مقارنة حتى 3 منتجات فقط.',

    // Product Detail
    'product.add.cart': 'إضافة إلى السلة',
    'product.request.quote': 'طلب عرض سعر',
    'product.out.stock': 'نفذت الكمية',
    'product.in.stock': 'متوفر في المخزن - جاهز للشحن',
    'product.firmness': 'الصلابة',
    'product.firmness.soft': 'لين (بلش)',
    'product.firmness.medium': 'متوسط الصلابة (متوازن)',
    'product.firmness.firm': 'صلب (طبي)',
    'product.size': 'اختر المقاس',
    'product.warranty': 'ضمان لمدة {months} شهراً',
    'product.trial': 'تجربة خالية من المخاطر لمدة 100 ليلة',
    'product.delivery': 'توصيل وتركيب مجاني للمنزل',
    'product.description': 'الوصف',
    'product.specifications': 'المواصفات التقنية',
    'product.reviews': 'التقييمات ({count})',
    'product.compare.section': 'قارن مع منتجات مماثلة',

    // Cart & Checkout
    'cart.title': 'سلة التسوق الخاصة بك',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.checkout': 'متابعة الدفع',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'الشحن',
    'cart.shipping.free': 'توصيل مجاني',
    'cart.total': 'الإجمالي',
    'cart.remove': 'إزالة',
    'checkout.title': 'الدفع الآمن',
    'checkout.billing': 'تفاصيل الفاتورة والتوصيل',
    'checkout.name': 'الاسم الكامل',
    'checkout.email': 'البريد الإلكتروني',
    'checkout.phone': 'رقم الهاتف',
    'checkout.address': 'عنوان الشارع / الشقة',
    'checkout.city': 'الإمارة / المدينة',
    'checkout.select.city': 'اختر إمارتك',
    'checkout.notes': 'ملاحظات الطلب (اختياري)',
    'checkout.payment': 'طريقة الدفع',
    'checkout.payment.card': 'بطاقة ائتمان / مدى',
    'checkout.payment.cod': 'الدفع عند الاستلام (COD)',
    'checkout.payment.tabby': 'تابي (4 دفعات بدون فوائد)',
    'checkout.place': 'إتمام الطلب',
    'checkout.success': 'شكراً لك! تم تقديم طلبك بنجاح.',
    'checkout.order.number': 'رقم الطلب',
    'checkout.estimate': 'التوصيل المتوقع: خلال 2-3 أيام عمل',

    // Quotation
    'quote.title': 'طلب عرض أسعار للشركات والجملة B2B',
    'quote.subtitle': 'احصل على تسعير مخصص للفنادق، المشاريع السكنية، التطوير العقاري، أو طلبيات الجملة الضخمة.',
    'quote.company': 'اسم الشركة',
    'quote.qty': 'الكمية التقديرية',
    'quote.submit': 'إرسال طلب عرض السعر',
    'quote.success.title': 'تم إرسال الطلب بنجاح!',
    'quote.success.msg': 'سيتواصل معك مندوب المبيعات لدينا عبر واتساب أو الهاتف خلال ساعتين مع ملف PDF رسمي لعرض السعر.',
    'quote.whatsapp.direct': 'تحدث مباشرة عبر واتساب',

    // AI Sleep Assistant
    'ai.chat.title': 'مساعد النوم الذكي',
    'ai.chat.welcome': 'مرحباً! أنا مساعد النوم الذكي الخاص بك. يمكنني مساعدتك في اختيار المرتبة المناسبة، أو الإجابة على استفسارات التوصيل، أو تقديم طلب سعر B2B. كيف يمكنني مساعدتك اليوم؟',
    'ai.chat.placeholder': 'اسألني عن مقاسات المراتب، الراحة، أو الأسعار...',
    'ai.chat.suggest.1': 'انصحني بمرتبة لآلام الظهر',
    'ai.chat.suggest.2': 'هل التوصيل مجاني في دبي؟',
    'ai.chat.suggest.3': 'أريد عرض سعر لطلبية جملة',

    // Admin Dashboard
    'admin.dashboard': 'لوحة تحكم المبيعات والعملاء المحتملين للـ CTO',
    'admin.metric.sales': 'إجمالي المبيعات',
    'admin.metric.quotes': 'عروض أسعار B2B معلقة',
    'admin.metric.leads': 'إجمالي العملاء المحتملين',
    'admin.metric.conversion': 'معدل التحويل',
    'admin.pipeline.title': 'مسار عروض الأسعار',
    'admin.pipeline.new': 'عملاء جدد',
    'admin.pipeline.contacted': 'تم التواصل',
    'admin.pipeline.quoted': 'تم إرسال السعر',
    'admin.pipeline.approved': 'تمت الموافقة',
    'admin.pipeline.rejected': 'مرفوض',
    'admin.customer.name': 'العميل',
    'admin.customer.phone': 'واتساب / الهاتف',
    'admin.customer.qty': 'الكمية',
    'admin.customer.amount': 'المبلغ المعروض',
    'admin.customer.actions': 'الإجراءات',
    'admin.action.send': 'إرسال PDF عرض السعر',
    'admin.action.whatsapp': 'محادثة واتساب',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mm_language');
    return (saved === 'ar' || saved === 'en') ? saved : 'en'; // Default to English
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mm_language', lang);
  };

  useEffect(() => {
    // Set direction and lang attributes on the html element
    const html = document.documentElement;
    html.setAttribute('lang', language);
    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const t = (key: string): string => {
    const translationMap = translations[language];
    let translation = translationMap[key] || translations['en'][key] || key;
    return translation;
  };

  const isRtl = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
