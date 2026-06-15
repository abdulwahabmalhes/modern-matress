export interface Category {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  image: string;
}

export interface Variation {
  id: string;
  size: string;
  price: number;
  salePrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  category: string;
  brand: string;
  basePrice: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  badgeLabel?: string;
  badgeColor?: string;
  keyFeatures?: { title: string; description: string; icon: string }[];
  firmness: 'soft' | 'medium' | 'firm';
  warrantyMonths: number;
  shortDescription: { en: string; ar: string };
  description: { en: string; ar: string };
  images: string[];
  variations: Variation[];
  specifications: { en: Record<string, string>; ar: Record<string, string> };
  attributes?: any[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: { en: string; ar: string };
  city: { en: string; ar: string };
}

export const categories: Category[] = [
  {
    id: 'mattresses',
    slug: 'mattresses',
    name: { en: 'Mattresses', ar: 'المراتب' },
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'beds',
    slug: 'beds',
    name: { en: 'Beds & Frames', ar: 'الأسرة والإطارات' },
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'furniture',
    slug: 'furniture',
    name: { en: 'Bedroom Furniture', ar: 'أثاث غرفة النوم' },
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'pillows',
    slug: 'pillows',
    name: { en: 'Pillows & Toppers', ar: 'الوسائد واللباد' },
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: { en: 'Accessories', ar: 'إكسسوارات النوم' },
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop',
  },
];

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export const brands: Brand[] = [
  {
    id: 'silentnight',
    name: 'Silentnight',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Silentnight_logo.svg'
  },
  {
    id: 'beautyrest',
    name: 'BeautyRest',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Simmons_Bedding_Company_logo.png'
  },
  {
    id: 'sealy',
    name: 'Sealy',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Simmons_Bedding_Company_logo.png'
  },
  {
    id: 'serta',
    name: 'Serta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Simmons_Bedding_Company_logo.png'
  },
  {
    id: 'kingkoil',
    name: 'King Koil',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Simmons_Bedding_Company_logo.png'
  },
  {
    id: 'slumberland',
    name: 'Slumberland',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Simmons_Bedding_Company_logo.png'
  },
  {
    id: 'hypnos',
    name: 'Hypnos',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Simmons_Bedding_Company_logo.png'
  }
];

export const products: Product[] = [
  {
    id: 'full-preview-1',
    slug: 'ultimate-luxury-preview',
    name: {
      en: 'Ultimate Luxury Mattress (Full Preview)',
      ar: 'المرتبة الملكية الفاخرة (معاينة كاملة)',
    },
    category: 'mattresses',
    brand: 'silentnight',
    basePrice: 5000,
    salePrice: 2499,
    rating: 5.0,
    reviewCount: 342,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    badgeLabel: 'SALE -50%',
    badgeColor: 'Red',
    keyFeatures: [
      { title: 'Temperature Control', description: 'Advanced breathable materials keep you cool throughout the night.', icon: 'Thermometer' },
      { title: 'Pressure Relief', description: 'Contours to your body for ideal pressure distribution on every sleep position.', icon: 'Activity' },
      { title: 'Motion Isolation', description: 'Minimises partner disturbance so you enjoy uninterrupted rest.', icon: 'Users' },
      { title: 'Edge Support', description: 'Reinforced borders maximise usable sleep surface and provide stable seating.', icon: 'Box' }
    ],
    firmness: 'medium',
    warrantyMonths: 120,
    shortDescription: {
      en: 'Experience the ultimate luxury with our flagship mattress. Engineered for perfect sleep with advanced cooling tech and zero motion transfer.',
      ar: 'استمتع بالفخامة المطلقة مع مرتبتنا الرائدة. مصممة لنوم مثالي مع تقنية التبريد المتقدمة وعزل تام للحركة.',
    },
    description: {
      en: 'This is the full preview mattress containing all possible specifications, badges, and key features. It features multiple layers of premium foam, individually pocketed springs, and a cooling ice-silk cover. Every detail has been meticulously designed to provide you with the best sleep of your life.',
      ar: 'هذه مرتبة المعاينة الكاملة التي تحتوي على جميع المواصفات والشارات والميزات الأساسية الممكنة. تتميز بطبقات متعددة من الإسفنج الفاخر، ونوابض جيبية فردية، وغطاء حريري مبرد. تم تصميم كل تفصيل بدقة لتوفير أفضل نوم في حياتك.',
    },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: 'fp-1', size: 'Single (90x190 cm)', price: 3000, salePrice: 1499, stock: 10 },
      { id: 'fp-2', size: 'Double (120x200 cm)', price: 4000, salePrice: 1999, stock: 5 },
      { id: 'fp-3', size: 'King (180x200 cm)', price: 5000, salePrice: 2499, stock: 20 },
    ],
    specifications: {
      en: {
        'Fabric': 'Ice-Silk Cooling Fabric',
        'Spring Count': '1200 Pocket Springs',
      },
      ar: {
        'نوع القماش': 'قماش حريري مبرد',
        'عدد النوابض': '1200 نابض جيبي',
      },
    },
    attributes: [
      { id: 101, groupId: 1, valueEn: 'Medium', valueAr: 'متوسط', groupNameEn: 'Firmness', groupNameAr: 'الصلابة' },
      { id: 102, groupId: 2, valueEn: '30', valueAr: '30', groupNameEn: 'Height (cm)', groupNameAr: 'الارتفاع (سم)' },
      { id: 103, groupId: 3, valueEn: '10 YR WARRANTY', valueAr: 'ضمان 10 سنوات', groupNameEn: 'Warranty', groupNameAr: 'الضمان' },
      { id: 104, groupId: 4, valueEn: '10 Days, 30 Days', valueAr: '10 أيام, 30 يوم', groupNameEn: 'Returns Period', groupNameAr: 'فترة الاسترجاع' },
      { id: 105, groupId: 5, valueEn: 'Pocket Springs, Memory Foam, Natural Latex', valueAr: 'نوابض جيبية, ميموري فوم, لاتكس طبيعي', groupNameEn: 'Structure', groupNameAr: 'التركيب الداخلي' },
      { id: 106, groupId: 6, valueEn: 'Single, Double, King', valueAr: 'مفرد, مزدوج, كينج', groupNameEn: 'Standard Sizes', groupNameAr: 'المقاسات الأساسية' },
      { id: 107, groupId: 7, valueEn: '90x190, 120x200, 180x200', valueAr: '90x190, 120x200, 180x200', groupNameEn: 'Numeric Dimensions', groupNameAr: 'المقاسات الرقمية' },
      { id: 108, groupId: 8, valueEn: '0-3 Months, 3-6 Months', valueAr: '0-3 شهور, 3-6 شهور', groupNameEn: 'Newborn Sub-sizes', groupNameAr: 'مقاسات المواليد' },
      { id: 109, groupId: 9, valueEn: 'White, Beige, Charcoal', valueAr: 'أبيض, بيج, فحمي', groupNameEn: 'Available Colors', groupNameAr: 'الألوان المتاحة' },
    ]
  },
  {
    id: 'test-1',
    slug: 'royal-ortho-hybrid-test',
    name: {
      en: 'Royal Orthopaedic Hybrid (Test Data)',
      ar: 'مرتبة رويال الطبية الهجينة (للتجريب)',
    },
    category: 'mattresses',
    brand: 'sealy',
    basePrice: 3500,
    salePrice: 2899,
    rating: 4.9,
    reviewCount: 85,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: false,
    badgeLabel: 'Premium',
    badgeColor: 'Gold',
    keyFeatures: [
      { title: 'Orthopaedic Support', description: 'Advanced posture tech coils for maximum back support.', icon: 'Activity' },
      { title: 'Cooling Fabric', description: 'Ice-touch fabric technology to regulate body temperature.', icon: 'Wind' }
    ],
    firmness: 'firm',
    warrantyMonths: 120,
    shortDescription: {
      en: 'Premium firm mattress designed specifically for ultimate back support and spinal alignment.',
      ar: 'مرتبة طبية قاسية مصممة خصيصاً لدعم الظهر ومحاذاة العمود الفقري.',
    },
    description: {
      en: 'The Royal Orthopaedic Hybrid is the perfect solution for back pain sufferers. Combining a high-density core with memory foam comfort layers.',
      ar: 'مرتبة رويال الطبية الهجينة هي الحل الأمثل لمن يعانون من آلام الظهر. تجمع بين قلب عالي الكثافة وطبقات راحة من الميموري فوم.',
    },
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: 't1-1', size: 'Queen (160x200 cm)', price: 3500, salePrice: 2899, stock: 12 },
      { id: 't1-2', size: 'King (180x200 cm)', price: 4200, salePrice: 3499, stock: 8 },
    ],
    specifications: {
      en: {
        'Thickness': '32 cm',
        'Comfort Layer': 'High-Density Foam',
      },
      ar: {
        'السُمك': '32 سم',
        'طبقة الراحة': 'إسفنج عالي الكثافة',
      },
    },
    attributes: [
      { id: 10, groupId: 1, valueEn: 'Firm', valueAr: 'قاسي', groupNameEn: 'Firmness', groupNameAr: 'الصلابة' },
      { id: 11, groupId: 2, valueEn: '32', valueAr: '32', groupNameEn: 'Height (cm)', groupNameAr: 'الارتفاع (سم)' },
      { id: 12, groupId: 3, valueEn: '10 YR WARRANTY', valueAr: 'ضمان 10 سنوات', groupNameEn: 'Warranty', groupNameAr: 'الضمان' },
      { id: 13, groupId: 4, valueEn: '30 Days', valueAr: '30 يوم', groupNameEn: 'Returns Period', groupNameAr: 'فترة الاسترجاع' },
      { id: 14, groupId: 5, valueEn: 'Pocket Springs, Memory Foam', valueAr: 'نوابض جيبية، ميموري فوم', groupNameEn: 'Structure', groupNameAr: 'التركيب الداخلي' },
      { id: 15, groupId: 6, valueEn: 'Queen, King', valueAr: 'كوين، كينج', groupNameEn: 'Standard Sizes', groupNameAr: 'المقاسات الأساسية' },
      { id: 16, groupId: 7, valueEn: '160x200, 180x200', valueAr: '160x200, 180x200', groupNameEn: 'Numeric Dimensions', groupNameAr: 'المقاسات الرقمية' },
      { id: 17, groupId: 8, valueEn: 'White, Grey', valueAr: 'أبيض، رمادي', groupNameEn: 'Available Colors', groupNameAr: 'الألوان المتاحة' },
    ]
  },
  {
    id: 'test-2',
    slug: 'cloud-nine-soft-test',
    name: {
      en: 'Cloud Nine Soft Mattress (Test Data)',
      ar: 'مرتبة كلاود ناين الناعمة (للتجريب)',
    },
    category: 'mattresses',
    brand: 'silentnight',
    basePrice: 2000,
    salePrice: 1599,
    rating: 4.6,
    reviewCount: 112,
    isBestSeller: false,
    isFeatured: false,
    isNewArrival: true,
    badgeLabel: 'New Arrival',
    badgeColor: 'Blue',
    keyFeatures: [
      { title: 'Plush Comfort', description: 'Ultra-soft top layer feels like sleeping on a cloud.', icon: 'Moon' }
    ],
    firmness: 'soft',
    warrantyMonths: 60,
    shortDescription: {
      en: 'Experience weightless sleep with our softest memory foam mattress yet.',
      ar: 'جرب نوماً بلا جاذبية مع أنعم مراتب رغوة الذاكرة لدينا.',
    },
    description: {
      en: 'The Cloud Nine mattress is built with 4 layers of plush foam.',
      ar: 'مرتبة كلاود ناين مبنية بـ 4 طبقات من الإسفنج الناعم.',
    },
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: 't2-1', size: 'Single (90x190 cm)', price: 2000, salePrice: 1599, stock: 30 },
    ],
    specifications: {
      en: {},
      ar: {},
    },
    attributes: [
      { id: 20, groupId: 1, valueEn: 'Soft', valueAr: 'ناعم', groupNameEn: 'Firmness', groupNameAr: 'الصلابة' },
      { id: 21, groupId: 2, valueEn: '25', valueAr: '25', groupNameEn: 'Height (cm)', groupNameAr: 'الارتفاع (سم)' },
      { id: 22, groupId: 3, valueEn: '5 Years', valueAr: 'ضمان 5 سنوات', groupNameEn: 'Warranty', groupNameAr: 'الضمان' },
      { id: 23, groupId: 4, valueEn: '10 Days', valueAr: '10 أيام', groupNameEn: 'Returns Period', groupNameAr: 'فترة الاسترجاع' },
      { id: 24, groupId: 5, valueEn: 'Memory Foam', valueAr: 'ميموري فوم', groupNameEn: 'Structure', groupNameAr: 'التركيب الداخلي' },
      { id: 25, groupId: 6, valueEn: 'Single', valueAr: 'مفرد', groupNameEn: 'Standard Sizes', groupNameAr: 'المقاسات الأساسية' },
      { id: 26, groupId: 7, valueEn: '90x190', valueAr: '90x190', groupNameEn: 'Numeric Dimensions', groupNameAr: 'المقاسات الرقمية' },
      { id: 27, groupId: 8, valueEn: 'White', valueAr: 'أبيض', groupNameEn: 'Available Colors', groupNameAr: 'الألوان المتاحة' },
    ]
  },
  {
    id: '1',
    slug: 'dream-cloud-hybrid',
    name: {
      en: 'DreamCloud Hybrid Mattress',
      ar: 'مرتبة دريم كلاود الهجينة',
    },
    category: 'mattresses',
    brand: 'beautyrest',
    basePrice: 2400,
    salePrice: 1899,
    rating: 4.8,
    reviewCount: 142,
    isBestSeller: true,
    isFeatured: true,
    isNewArrival: true,
    badgeLabel: 'Best Seller',
    badgeColor: 'Gold',
    keyFeatures: [
      { title: 'Temperature Control', description: 'Advanced breathable materials keep you cool throughout the night.', icon: 'Thermometer' },
      { title: 'Pressure Relief', description: 'Contours to your body for ideal pressure distribution on every sleep position.', icon: 'Activity' }
    ],
    firmness: 'medium',
    warrantyMonths: 120,
    shortDescription: {
      en: 'Multi-layer hybrid mattress combining cooling gel-memory foam with individually pocketed coils for optimal pressure relief and spinal alignment.',
      ar: 'مرتبة هجينة متعددة الطبقات تجمع بين رغوة الذاكرة الهلامية المبردة والنوابض الجيبية المغلفة بشكل فردي لتخفيف الضغط ومحاذاة العمود الفقري بشكل مثالي.',
    },
    description: {
      en: 'The DreamCloud Hybrid Mattress is engineered from the ground up for ultimate luxury and comfort. Featuring 5 layers of premium materials, it starts with an ultra-breathable cashmere blend cover. Below that, a cooling gel-infused memory foam layer cradles your body and disperses heat. The core consists of hundreds of individually wrapped pocket coils that adapt to your body weight and eliminate motion transfer. Perfect for side, back, and stomach sleepers.',
      ar: 'تم تصميم مرتبة دريم كلاود الهجينة من الصفر لتقديم أقصى درجات الفخامة والراحة. تتميز بـ 5 طبقات من المواد الفاخرة، تبدأ بغطاء من مزيج الكشمير فائق التهوية. أسفل ذلك، هناك طبقة من رغوة الذاكرة الممزوجة بالجل المبرد التي تحتضن جسمك وتشتت الحرارة. يتكون القلب من مئات النوابض الجيبية المغلفة بشكل فردي والتي تتكيف مع وزن جسمك وتمنع انتقال الحركة. مثالية لمن ينامون على الجانب أو الظهر أو البطن.',
    },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: '1-1', size: 'Single (90x190 cm)', price: 1800, salePrice: 1499, stock: 24 },
      { id: '1-2', size: 'Double (120x200 cm)', price: 2100, salePrice: 1699, stock: 18 },
      { id: '1-3', size: 'Queen (160x200 cm)', price: 2400, salePrice: 1899, stock: 35 },
      { id: '1-4', size: 'King (180x200 cm)', price: 2800, salePrice: 2199, stock: 42 },
      { id: '1-5', size: 'Super King (200x200 cm)', price: 3200, salePrice: 2499, stock: 15 },
    ],
    specifications: {
      en: {
        'Thickness': '30 cm',
        'Comfort Layer': 'Cooling Gel Memory Foam',
        'Support Layer': 'Pocket Springs (15cm height)',
        'Cover Material': 'Cashmere-infused Knit Cover',
        'Firmness Score': '6.5 / 10 (Medium-Firm)',
        'Hypoallergenic': 'Yes',
      },
      ar: {
        'السُمك': '30 سم',
        'طبقة الراحة': 'رغوة الذاكرة بالجل المبرد',
        'طبقة الدعم': 'نوابض جيبية مغلفة (ارتفاع 15 سم)',
        'خامة الغطاء': 'غطاء محبوك ممزوج بالكشمير',
        'مقياس الصلابة': '6.5 / 10 (متوسطة الصلابة)',
        'مضاد للحساسية': 'نعم',
      },
    },
    attributes: [
      { id: 1, groupId: 1, valueEn: '30 cm', valueAr: '30 سم', groupNameEn: 'Height', groupNameAr: 'الارتفاع' },
      { id: 2, groupId: 2, valueEn: 'Pocket Springs', valueAr: 'نوابض جيبية', groupNameEn: 'Spring Type', groupNameAr: 'نوع النوابض' },
      { id: 3, groupId: 3, valueEn: 'Cooling Gel', valueAr: 'جل مبرد', groupNameEn: 'Foam Layer', groupNameAr: 'طبقة الرغوة' }
    ]
  },
  {
    id: '2',
    slug: 'royal-pedic-orthopedic',
    name: {
      en: 'Royal-Pedic Orthopedic',
      ar: 'مرتبة رويال بيديك الطبية',
    },
    category: 'mattresses',
    brand: 'sealy',
    basePrice: 3200,
    salePrice: 2850,
    rating: 4.9,
    reviewCount: 89,
    isBestSeller: false,
    isFeatured: true,
    firmness: 'medium',
    warrantyMonths: 120,
    shortDescription: {
      en: 'Multi-layer hybrid mattress combining cooling gel-memory foam with individually pocketed coils for optimal pressure relief and spinal alignment.',
      ar: 'مرتبة هجينة متعددة الطبقات تجمع بين رغوة الذاكرة الهلامية المبردة والنوابض الجيبية المغلفة بشكل فردي لتخفيف الضغط ومحاذاة العمود الفقري بشكل مثالي.',
    },
    description: {
      en: 'The Royal Orthopedic Mattress is recommended by physical therapists across the GCC. It features a triple-zone support core that matches the ergonomic zones of the human body. High-density support foam keeps your hips and shoulders in perfect alignment, while the top pressure-relief layer contours to your curves. Perfect for anyone suffering from chronic back discomfort or seeking maximum orthopedic support.',
      ar: 'يوصي المعالجون الفيزيائيون في الخليج بمرتبة رويال الطبية. تتميز بقلب دعم ثلاثي المناطق يطابق المناطق التشريحية لجسم الإنسان. تحافظ الرغوة الطبية عالية الكثافة على محاذاة الفخذين والكتفين بشكل مثالي، بينما تتكيف الطبقة العلوية لتخفيف الضغط مع منحنيات جسمك. مثالية لمن يعانون من آلام الظهر المزمنة أو يبحثون عن أقصى دعم طبي.',
    },
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: '2-1', size: 'Double (120x200 cm)', price: 2600, salePrice: 2099, stock: 12 },
      { id: '2-2', size: 'Queen (160x200 cm)', price: 3200, salePrice: 2499, stock: 20 },
      { id: '2-3', size: 'King (180x200 cm)', price: 3700, salePrice: 2899, stock: 25 },
      { id: '2-4', size: 'Super King (200x200 cm)', price: 4200, salePrice: 3299, stock: 10 },
    ],
    specifications: {
      en: {
        'Thickness': '28 cm',
        'Core Material': 'High-Density Medical Support Foam',
        'Zoned Support': '3 Ergonomic Zones',
        'Cover Material': 'Bamboo Anti-Bacterial Fabric',
        'Firmness Score': '8.5 / 10 (Firm)',
        'Warranty': '15 Years',
      },
      ar: {
        'السُمك': '28 سم',
        'الخامة الأساسية': 'رغوة دعم طبية عالية الكثافة',
        'دعم المناطق': '3 مناطق مريحة للعمود الفقري',
        'خامة الغطاء': 'نسيج الخيزران المضاد للبكتيريا',
        'مقياس الصلابة': '8.5 / 10 (صلبة)',
        'الضمان': '15 سنة',
      },
    },
    attributes: [
      { id: 4, groupId: 1, valueEn: '28 cm', valueAr: '28 سم', groupNameEn: 'Height', groupNameAr: 'الارتفاع' },
      { id: 5, groupId: 4, valueEn: 'Firm Support', valueAr: 'دعم صلب', groupNameEn: 'Comfort Level', groupNameAr: 'مستوى الراحة' }
    ]
  },
  {
    id: '3',
    slug: 'imperial-latex-luxury',
    name: {
      en: 'Imperial Latex Luxury Mattress',
      ar: 'مرتبة إمبيريال لاتكس الفاخرة',
    },
    category: 'mattresses',
    brand: 'serta',
    basePrice: 4500,
    salePrice: 3899,
    rating: 4.7,
    reviewCount: 45,
    isNew: true,
    firmness: 'soft',
    warrantyMonths: 120,
    shortDescription: {
      en: 'Eco-friendly 100% natural latex mattress offering an incredibly plush feel, instant bounce-back, and natural cooling properties.',
      ar: 'مرتبة صديقة للبيئة من اللاتكس الطبيعي 100٪ توفر ملمساً وثيراً ومخملياً، وارتداداً فورياً، وخصائص تبريد طبيعية.',
    },
    description: {
      en: 'Experience organic luxury. The Imperial Latex Mattress is crafted using natural Dunlop latex harvested from organic rubber tree plantations. Free of harsh synthetic chemicals, it is naturally dust-mite resistant, anti-microbial, and highly breathable. With a soft feel that cushions pressure points instantly without sinking, you will feel like you are floating on a cloud.',
      ar: 'اختبر الفخامة العضوية. تم تصنيع مرتبة إمبيريال لاتفكس باستخدام لاتكس دنلوب الطبيعي 100٪ المحصود من مزارع المطاط العضوية. خالية من المواد الكيميائية الاصطناعية، ومقاومة لعث الغبار ومضادة للميكروبات وتوفر تهوية ممتازة. بملمس ناعم يدعم نقاط الضغط فوراً دون شعور بالهبوط، ستشعر وكأنك تطفو على سحابة.',
    },
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: '3-1', size: 'Queen (160x200 cm)', price: 4500, salePrice: 3899, stock: 8 },
      { id: '3-2', size: 'King (180x200 cm)', price: 5100, salePrice: 4399, stock: 12 },
      { id: '3-3', size: 'Super King (200x200 cm)', price: 5800, salePrice: 4999, stock: 5 },
    ],
    specifications: {
      en: {
        'Thickness': '32 cm',
        'Core Material': '100% Natural Dunlop Latex',
        'Breathability': 'Air-flow pincore ventilation holes',
        'Cover Material': '100% Organic Cotton with Lambswool layer',
        'Firmness Score': '4.5 / 10 (Soft/Plush)',
        'Organic Certified': 'Oeko-Tex Standard 100',
      },
      ar: {
        'السُمك': '32 سم',
        'الخامة الأساسية': 'لاتكس دنلوب طبيعي 100%',
        'التهوية': 'ثقوب تهوية وتدفق الهواء الدقيقة',
        'خامة الغطاء': 'قطن عضوي 100% مع طبقة صوف الحملان',
        'مقياس الصلابة': '4.5 / 10 (لينة/وثيرة)',
        'شهادة عضوية': 'Oeko-Tex Standard 100',
      },
    },
  },
  {
    id: '4',
    slug: 'majestic-velvet-bed-frame',
    name: {
      en: 'Majestic Velvet Bed Frame',
      ar: 'إطار سرير ماجستيك المخملي الفاخر',
    },
    category: 'beds',
    brand: 'kingkoil',
    basePrice: 2800,
    salePrice: 2200,
    rating: 4.9,
    reviewCount: 37,
    isBestSeller: true,
    firmness: 'medium',
    warrantyMonths: 60,
    shortDescription: {
      en: 'Statement upholstered bed frame wrapped in premium stain-resistant velvet fabric, featuring a tall chesterfield tufted headboard.',
      ar: 'إطار سرير أنيق ومبطن مغطى بقماش قطيفة (مخمل) فاخر مقاوم للبقع، ويتميز بلوح رأسي طويل مبطن بنمط تشيسترفيلد.',
    },
    description: {
      en: 'The Majestic Bed Frame creates an instant center of attention in any master suite. Framed with premium kiln-dried solid wood and upholstered in stain-resistant performance velvet, it is as durable as it is beautiful. Heavy-duty wooden slats support your mattress directly without needing a box spring, allowing optimal airflow.',
      ar: 'يخلق إطار سرير ماجستيك انتباهاً فورياً في أي غرفة نوم رئيسية. مصمم بهيكل خشبي متين صلب ومبطن بمخمل فاخر مقاوم للبقع، وهو عملي بقدر ما هو جميل. تدعم الألواح الخشبية المتينة مرتبتك مباشرة دون الحاجة لقاعدة سرير صندوقية، مما يسمح بتدفق الهواء بشكل مثالي.',
    },
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: '4-1', size: 'Queen (160x200 cm)', price: 2800, salePrice: 2200, stock: 15 },
      { id: '4-2', size: 'King (180x200 cm)', price: 3200, salePrice: 2500, stock: 18 },
      { id: '4-3', size: 'Super King (200x200 cm)', price: 3600, salePrice: 2800, stock: 9 },
    ],
    specifications: {
      en: {
        'Frame Material': 'Kiln-Dried Solid Pine Wood',
        'Fabric': 'Stain-Resistant Performance Velvet',
        'Headboard Height': '135 cm',
        'Slat Base': 'Solid Birch Curved Wood Slats',
        'Assembly Required': 'Yes (Free setup included)',
      },
      ar: {
        'خامة الهيكل': 'خشب الصنوبر الصلب المعالج بالفرن',
        'نوع القماش': 'مخمل مقاوم للبقع عالي الأداء',
        'ارتفاع لوح الرأس': '135 سم',
        'قاعدة الألواح': 'ألواح خشب البتولا الصلب المنحنية',
        'يحتاج لتركيب': 'نعم (شامل خدمة التركيب المجانية)',
      },
    },
  },
  {
    id: '5',
    slug: 'floating-oak-platform',
    name: {
      en: 'Floating Wooden Platform Bed',
      ar: 'سرير خشبي معلق ذو منصة',
    },
    category: 'beds',
    brand: 'slumberland',
    basePrice: 3500,
    salePrice: 2900,
    rating: 4.8,
    reviewCount: 22,
    isNew: true,
    firmness: 'firm',
    warrantyMonths: 60,
    shortDescription: {
      en: 'Minimalist platform bed crafted from solid oak wood, featuring a floating design with integrated warm LED accent lights.',
      ar: 'سرير مسطح بسيط مصنوع من خشب البلوط الصلب، ويتميز بتصميم معلق مع إضاءة LED مدمجة دافئة خافتة.',
    },
    description: {
      en: 'The Floating Oak Platform Bed brings contemporary minimalist design to life. Crafted from certified solid oak and veneers, the hidden base creates a striking illusion of the bed floating above the floor. Features built-in warm LED lighting under the frame, controllable via a wireless switch, creating a serene and luxurious bedroom ambiance.',
      ar: 'يجسد السرير الخشبي المعلق البساطة العصرية. مصنوع من خشب البلوط الصلب الحاصل على شهادة الجودة، وتخلق القاعدة المخفية إيحاءً مذهلاً بأن السرير معلق فوق الأرض. يتميز بإضاءة دافئة مدمجة أسفل الإطار، ويمكن التحكم بها عبر مفتاح لاسلكي، مما يضفي أجواءً هادئة وفاخرة.',
    },
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: '5-1', size: 'Queen (160x200 cm)', price: 3500, salePrice: 2900, stock: 5 },
      { id: '5-2', size: 'King (180x200 cm)', price: 4000, salePrice: 3300, stock: 8 },
      { id: '5-3', size: 'Super King (200x200 cm)', price: 4500, salePrice: 3800, stock: 4 },
    ],
    specifications: {
      en: {
        'Material': 'Solid American Oak Wood & Oak Veneers',
        'Finish': 'Matte Eco-Friendly Varnish',
        'LED Lighting': 'Warm 2700K LED strips with smart switch',
        'Load Capacity': 'Up to 400 kg',
      },
      ar: {
        'الخامة': 'خشب البلوط الأمريكي الصلب وقشور البلوط الطبيعية',
        'الطلاء': 'ورنيش مطفي صديق للبيئة',
        'إضاءة الـ LED': 'شرائط LED دافئة 2700 كلفن مع مفتاح ذكي',
        'قدرة التحمل': 'حتى 400 كجم',
      },
    },
  },
  {
    id: '6',
    slug: 'luxury-solid-wood-bed-frame',
    name: {
      en: 'Luxury Solid Wood Bed Frame',
      ar: 'إطار سرير فاخر من الخشب الصلب',
    },
    category: 'beds',
    brand: 'hypnos',
    basePrice: 1500,
    rating: 4.5,
    reviewCount: 78,
    isBestSeller: false,
    isFeatured: false,
    firmness: 'medium',
    warrantyMonths: 60,
    shortDescription: {
      en: 'Statement upholstered bed frame wrapped in premium stain-resistant velvet fabric, featuring a tall chesterfield tufted headboard.',
      ar: 'إطار سرير أنيق ومبطن مغطى بقماش قطيفة (مخمل) فاخر مقاوم للبقع، ويتميز بلوح رأسي طويل مبطن بنمط تشيسترفيلد.',
    },
    description: {
      en: 'Luxury bed frame.',
      ar: 'إطار سرير فاخر.',
    },
    images: [],
    variations: [],
    specifications: {
      en: {
        'Load Capacity': 'Up to 400 kg',
      },
      ar: {
        'قدرة التحمل': 'حتى 400 كجم',
      },
    },
  },
  {
    id: '7',
    slug: 'cooling-gel-memory-foam-pillow',
    name: {
      en: 'Cooling Gel Memory Foam Pillow',
      ar: 'وسادة ميموري فوم مع جل التبريد',
    },
    category: 'pillows',
    brand: 'silentnight',
    basePrice: 250,
    salePrice: 199,
    rating: 4.9,
    reviewCount: 540,
    isBestSeller: true,
    isFeatured: true,
    firmness: 'medium',
    warrantyMonths: 24,
    shortDescription: {
      en: 'Contoured memory foam pillow with a cooling gel layer that supports your neck curves and keeps you cool all night.',
      ar: 'وسادة رغوة الذاكرة المنحنية مع طبقة جل مبردة تدعم انحناءات الرقبة وتبقيك منتعشاً طوال الليل.',
    },
    description: {
      en: 'Designed with help from orthopedics, this pillow features a dual-height contour design that fits your cervical spine perfectly, whether you sleep on your back or your side. The cooling gel pads absorb heat and keep you at the ideal sleep temperature.',
      ar: 'تم تصميم هذه الوسادة بمساعدة أطباء العظام، وتتميز بتصميم منحني ثنائي الارتفاع يناسب العمود الفقري العنقي تماماً، سواء كنت تنام على ظهرك أو جانبك. تمتص وسادات الجل المبردة الحرارة وتبقيك في درجة حرارة النوم المثالية.',
    },
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop',
    ],
    variations: [
      { id: '6-1', size: 'Standard (60x40x12 cm)', price: 250, salePrice: 180, stock: 150 },
    ],
    specifications: {
      en: {
        'Core Material': 'Slow-Rebound Memory Foam',
        'Top Layer': 'Hydrogel Cooling Pad',
        'Cover': 'Washable Micro-tencel Cover',
      },
      ar: {
        'المادة الأساسية': 'رغوة الذاكرة بطيئة الارتداد',
        'الطبقة العلوية': 'وسادة هيدروجيل مبردة',
        'الغطاء': 'غطاء ميكرو-تينسيل قابل للغسل في الغسالة',
      },
    },
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Amira A.',
    rating: 5,
    date: '2026-05-12',
    comment: {
      en: 'This mattress completely changed my sleep. My lower back pain disappeared after a week. Delivery was fast and they set it up in 10 minutes!',
      ar: 'هذه المرتبة غيرت نومي تماماً. اختفت آلام أسفل الظهر لدي بعد أسبوع واحد. كان التوصيل سريعاً وقاموا بتركيبها في 10 دقائق فقط!',
    },
    city: { en: 'Dubai', ar: 'دبي' },
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'James T.',
    rating: 5,
    date: '2026-04-20',
    comment: {
      en: 'Excellent hybrid mattress. Perfectly balanced - not too hard, not too soft. Motion isolation is outstanding; I do not feel my partner moving at all.',
      ar: 'مرتبة هجينة ممتازة. متوازنة تماماً - ليست صلبة جداً وليست لينة جداً. عزل الحركة مذهل، لا أشعر بحركة زوجتي على الإطلاق.',
    },
    city: { en: 'Abu Dhabi', ar: 'أبوظبي' },
  },
  {
    id: 'r3',
    productId: '2',
    userName: 'Mohammed K.',
    rating: 5,
    date: '2026-05-28',
    comment: {
      en: 'I ordered the Royal Medical for my father who suffers from chronic joint pain. He is finally sleeping through the night. The quality is outstanding.',
      ar: 'طلبت مرتبة رويال الطبية لوالدي الذي يعاني من آلام المفاصل المزمنة. أخيراً بات ينام الليل كله دون تقطع. جودتها ممتازة وتستحق كل درهم.',
    },
    city: { en: 'Sharjah', ar: 'الشارقة' },
  },
];

export const uaeCities = [
  { id: 'dubai', name: { en: 'Dubai', ar: 'دبي' } },
  { id: 'abu-dhabi', name: { en: 'Abu Dhabi', ar: 'أبوظبي' } },
  { id: 'sharjah', name: { en: 'Sharjah', ar: 'الشارقة' } },
  { id: 'ajman', name: { en: 'Ajman', ar: 'عجمان' } },
  { id: 'umm-al-quwain', name: { en: 'Umm Al Quwain', ar: 'أم القيوين' } },
  { id: 'ras-al-khaimah', name: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' } },
  { id: 'fujairah', name: { en: 'Fujairah', ar: 'الفجيرة' } },
];
