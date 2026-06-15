# مودرن ماترسز — منصة التجارة الإلكترونية المؤسسية
## وثيقة متطلبات المنتج (PRD) — الإصدار 1.0
### إعداد: مكتب المدير التقني (CTO)
### التاريخ: يونيو 2026
### الحالة: ما قبل التطوير | معتمدة للفريق الهندسي

---

> **هذه الوثيقة هي المرجع الوحيد والأساسي لمنصة مودرن ماترسز.**
> جميع القرارات الهندسية والتصميمية والتقنية والتجارية يجب أن تكون مرتبطة بهذه الوثيقة.
> لا يبدأ أي تطوير قبل مراجعة هذه الوثيقة واعتمادها من كبير المهندسين المعماريين.

---

## جدول المحتويات

1. [الملخص التنفيذي](#1-الملخص-التنفيذي)
2. [التحليل التجاري](#2-التحليل-التجاري)
3. [شخصيات المستخدمين](#3-شخصيات-المستخدمين)
4. [خرائط رحلة المستخدم](#4-خرائط-رحلة-المستخدم)
5. [هيكل المعلومات](#5-هيكل-المعلومات)
6. [تصميم قاعدة البيانات](#6-تصميم-قاعدة-البيانات)
7. [هيكل ERD](#7-هيكل-erd)
8. [هيكل API](#8-هيكل-api)
9. [هيكل الخلفية (Backend)](#9-هيكل-الخلفية)
10. [هيكل الواجهة الأمامية (Frontend)](#10-هيكل-الواجهة-الأمامية)
11. [هيكل نظام إدارة المحتوى (CMS)](#11-هيكل-نظام-إدارة-المحتوى)
12. [محرك المنتجات](#12-محرك-المنتجات)
13. [محرك الخصائص](#13-محرك-الخصائص)
14. [محرك المتغيرات](#14-محرك-المتغيرات)
15. [محرك الفلاتر](#15-محرك-الفلاتر)
16. [محرك عروض الأسعار](#16-محرك-عروض-الأسعار)
17. [هيكل الذكاء الاصطناعي](#17-هيكل-الذكاء-الاصطناعي)
18. [هيكل واتساب](#18-هيكل-واتساب)
19. [هيكل لوحة التحكم](#19-هيكل-لوحة-التحكم)
20. [هيكل SEO](#20-هيكل-seo)
21. [هيكل الأمان](#21-هيكل-الأمان)
22. [هيكل الأداء](#22-هيكل-الأداء)
23. [هيكل تجربة المستخدم (UI/UX)](#23-هيكل-تجربة-المستخدم)
24. [مراحل التطوير](#24-مراحل-التطوير)
25. [نطاق النسخة الأولى (MVP)](#25-نطاق-النسخة-الأولى)
26. [خارطة طريق التوسع المستقبلي](#26-خارطة-طريق-التوسع-المستقبلي)

---

## 1. الملخص التنفيذي

### 1.1 نظرة عامة على المشروع

مودرن ماترسز هي منصة تجارة إلكترونية مؤسسية متكاملة، مبنية من الصفر وخصيصاً لقطاع النوم والأثاث في الإمارات ومنطقة الخليج العربي. المنصة مصممة بمبادئ هندسية خالصة — لا تعتمد على WordPress أو WooCommerce أو Shopify أو أي نظام CMS جاهز — لتقديم تجربة تجارة رقمية متميزة وسريعة وكاملة الدعم للغة العربية.

المنصة ليست متجراً إلكترونياً عادياً. إنها منظومة تجارية متكاملة من ستة وظائف:

| الوظيفة | الوصف |
|---|---|
| متجر إلكتروني | كتالوج منتجات كامل، سلة، دفع، مدفوعات |
| كتالوج منتجات | مستودع منتجات غني قابل للفلترة والبحث |
| نظام عروض الأسعار | سير عمل طلب السعر للعملاء B2B والطلبات الكبيرة |
| نظام توليد العملاء المحتملين | التقاط منظم للعملاء عبر جميع نقاط الاتصال |
| مساعد مبيعات بالذكاء الاصطناعي | روبوت محادثة ذكي وقابل للتدريب للمبيعات والدعم |
| منصة مبيعات واتساب | تحويل سلس للمحادثات عبر واتساب |

### 1.2 الرؤية الاستراتيجية

المنصة مبنية وفق استراتيجية ثنائية المحاور:

- **المحور الأول (MVP):** متجر إلكتروني فاخر بعلامة تجارية واحدة لمودرن ماترسز
- **المحور الثاني (التوسع):** منظومة تجارة إلكترونية متعددة العلامات والبائعين — سوق إلكتروني إقليمي للنوم ونمط الحياة

كل قرار معماري في هذه الوثيقة يجب أن يحترم هذا القيد الثنائي. لا شيء في المحور الأول يجب أن يعيق المحور الثاني.

### 1.3 المتطلبات التقنية

| الطبقة | التقنية |
|---|---|
| إطار الخلفية | Laravel 12 |
| لغة البرمجة | PHP 8.4 |
| قاعدة البيانات | MySQL 8.x |
| التخزين المؤقت / قوائم الانتظار | Redis |
| نمط API | RESTful JSON API |
| إطار الواجهة الأمامية | React 18+ مع TypeScript |
| إطار CSS | TailwindCSS v4 |
| مكتبة المكونات | Shadcn UI |
| البنية التحتية | VPS (Ubuntu 24 LTS) |
| الحافة / DNS | Cloudflare |
| تسليم الوسائط | CDN + Object Storage |

### 1.4 مؤشرات النجاح الرئيسية

| المؤشر | الهدف |
|---|---|
| نقاط Lighthouse للأداء | 90+ |
| وقت أول بايت (TTFB) | أقل من 200 ميلي ثانية |
| أكبر رسم محتوى (LCP) | أقل من 2.5 ثانية |
| وقت استجابة API (P95) | أقل من 300 ميلي ثانية |
| تحويل عروض الأسعار | أكثر من 15% |
| دعم حركة الجوال | 70%+ من الجلسات |
| اللغات | العربية، الإنجليزية |
| اتفاقية مستوى الخدمة | 99.9% |

---

## 2. التحليل التجاري

### 2.1 السياق السوقي

سوق النوم والأثاث في منطقة الخليج قطاع فاخر وعالي النية الشرائية. يجري العملاء بحثاً مكثفاً قبل الشراء. متوسط قيمة الطلب (AOV) أعلى بكثير من التجزئة العامة — تتراوح أسعار المراتب بين 500 و15,000 درهم وما فوق. هذا السلوك الشرائي يتطلب:

- **إشارات الثقة** في كل نقطة تواصل
- **معلومات غنية عن المنتج** (مواد، تقنيات، شهادات)
- **قنوات تواصل متعددة** (واتساب، هاتف، بريد إلكتروني، نموذج عرض سعر)
- **تجربة مستخدم عربية أولاً** لشريحة كبيرة من الجمهور المستهدف
- **سير عمل عروض الأسعار B2B** للفنادق والمطورين العقاريين والمشترين بالجملة

### 2.2 المشهد التنافسي

| نوع المنافس | نقطة الضعف | ميزتنا |
|---|---|---|
| متاجر WooCommerce العامة | بطيئة، تجربة جوال ضعيفة، لا عربية | مبنية خصيصاً، سريعة، RTL كامل |
| متاجر Shopify | خصائص منتج محدودة، لا نظام عروض أسعار | محرك خصائص كامل، نظام عروض أسعار |
| مواقع كتالوج إقليمية | لا تجارة إلكترونية، لا ذكاء اصطناعي | تجارة كاملة + مساعد ذكاء اصطناعي |
| العلامات الدولية | غير محلية | عربية أولاً، أسعار بالدرهم، لوجستيات إماراتية |

### 2.3 مصادر الإيرادات

1. **مبيعات المنتجات المباشرة** — الإيراد الأساسي عبر سلة الشراء
2. **تحويل عروض الأسعار** — صفقات B2B والضيافة والجملة المُغلقة عبر سير العمل
3. **مبيعات واتساب** — عملاء محتملون عاليو النية يتم تحويلهم عبر محادثة واتساب
4. **مستقبلاً: عمولات البائعين** — رسوم سوق متعدد البائعين (المحور الثاني)
5. **مستقبلاً: القوائم المميزة** — مواضع ترويج العلامات التجارية (المحور الثاني)

### 2.4 القيود التجارية

- يجب أن تمتثل المنصة لقوانين حماية المستهلك في الإمارات
- يجب أن يكون المحتوى العربي مساوياً في الجودة للإنجليزي
- يجب تخزين جميع بيانات العملاء في بنية تحتية متوافقة
- يجب أن تدعم معالجة الدفع بوابات منطقة الإمارات (Telr، PayTabs، Stripe UAE)
- تكامل WhatsApp Business API متطلب تجاري وليس اختيارياً

### 2.5 نطاق كتالوج المنتجات

| الفئة | الأمثلة |
|---|---|
| المراتب | رغوة الذاكرة، ربيع الجيب، هجينة، طبية |
| الأسرّة والإطارات | مبطنة، خشبية، تخزين، منصة |
| أثاث غرفة النوم | خزائن، أدراج، طاولات جانبية، مرايا |
| إكسسوارات النوم | واقيات، طبقات إضافية، مفارش |
| الوسائد | رغوة الذاكرة، ريش، عنقية، أطفال |
| مجموعات غرفة النوم | مجموعات منسقة حسب الستايل/اللون/المادة |

### 2.6 خريطة أصحاب المصلحة

| صاحب المصلحة | الدور | الاحتياجات الرئيسية |
|---|---|---|
| صاحب العمل | متخذ القرار | لوحة المبيعات، مسار العملاء، أداء الذكاء الاصطناعي |
| فريق المبيعات | إدارة عروض الأسعار | حالة العملاء، تكامل واتساب، الملاحظات |
| فريق المحتوى | إدارة الكتالوج والمحتوى | محرر منتجات/محتوى سهل |
| العملاء (B2C) | متسوقون | تجربة تسوق سريعة وموثوقة |
| العملاء (B2B) | مشترون بالجملة / ضيافة | نظام عروض أسعار، إدارة علاقات |
| البائعون المستقبليون | بائعو السوق (المحور الثاني) | بوابة البائع، هيكل العمولات |

---

## 3. شخصيات المستخدمين

### الشخصية الأولى — أميرة الراشدي (المتسوقة B2C الرئيسية)

| الحقل | التفاصيل |
|---|---|
| العمر | 32 |
| الموقع | دبي، الإمارات |
| اللغة | العربية (أساسية)، الإنجليزية (ثانوية) |
| الجهاز | iPhone، تتصفح Instagram قبل الموقع |
| المهنة | مدير تسويق |
| الهدف | تأثيث غرفة نوم شقة جديدة، تريد جودة فاخرة |
| نقاط الألم | مربكة بالخيارات، غير متأكدة من الأحجام، تخشى اختيار درجة صلابة خاطئة |
| السلوكيات | تقرأ التقييمات، تقارن المنتجات جنباً إلى جنب، تسأل على واتساب قبل الشراء |
| محرك القرار | الضمان، ثقة العلامة التجارية، جودة المواد، مدة التسليم |

**التأثير على المنصة:**
- واجهة المستخدم العربية غير قابلة للتفاوض
- ميزة مقارنة المنتجات ذات أولوية عالية
- زر واتساب يجب أن يكون مرئياً في جميع الأوقات
- أدلة الصلابة والراحة مطلوبة في صفحات المنتج
- أيقونات الضمان وسياسة الإرجاع الواضحة على بطاقات المنتج

---

### الشخصية الثانية — جيمس ثورنتون (المتسوق الوافد B2C)

| الحقل | التفاصيل |
|---|---|
| العمر | 41 |
| الموقع | أبوظبي، الإمارات |
| اللغة | الإنجليزية |
| الجهاز | MacBook Pro، بحث على سطح المكتب |
| المهنة | مدير مالي |
| الهدف | شراء سرير وفرشة كينج فاخرة كمجموعة |
| نقاط الألم | لا يريد زيارة المعرض، يريد الشراء بثقة عبر الإنترنت |
| السلوكيات | يقرأ المواصفات التقنية، يتحقق من الشهادات، يقارن المواد |
| محرك القرار | عمق تفاصيل المنتج، شفافية الأسعار، خيارات التسليم |

---

### الشخصية الثالثة — محمد الكتبي (مشتري الضيافة B2B)

| الحقل | التفاصيل |
|---|---|
| العمر | 47 |
| الموقع | دبي، الإمارات |
| اللغة | العربية |
| المهنة | مدير مشتريات، مجموعة فنادق |
| الهدف | تجهيز 120 غرفة فندقية بمراتب ووسائد |
| نقاط الألم | يحتاج تسعيراً مخصصاً، توصيل بالجملة، وثيقة عرض سعر رسمية |
| السلوكيات | لا يستخدم السلة أبداً — يطلب دائماً عرض سعر |
| محرك القرار | سرعة الاستجابة، وثيقة عرض سعر احترافية، علاقة مدير الحساب |

---

### الشخصية الرابعة — سارة خالد (الباحثة الاندفاعية عبر الجوال)

| الحقل | التفاصيل |
|---|---|
| العمر | 26 |
| الموقع | الشارقة، الإمارات |
| اللغة | العربية |
| الجهاز | أندرويد، صبر منخفض على الصفحات البطيئة |
| الهدف | إيجاد وسادة أو إكسسوار نوم بأقل من 200 درهم |
| نقاط الألم | مواقع بطيئة، تنقل مربك، أسعار مخفية |
| السلوكيات | تفلتر حسب السعر، تتحقق من صور المنتج، تشتري بسرعة إذا كان السعر مناسباً |
| محرك القرار | وضوح السعر، دفع سريع، حد التوصيل المجاني |

---

### الشخصية الخامسة — فاطمة سعيد (مديرة المتجر — المستخدم الإداري)

| الحقل | التفاصيل |
|---|---|
| العمر | 35 |
| الموقع | دبي، الإمارات |
| اللغة | العربية |
| الهدف | إدارة الكتالوج، تحديث الأسعار، الرد على العملاء |
| نقاط الألم | الأدوات الحالية معقدة، تحتاج مطوراً للتغييرات البسيطة |
| السلوكيات | تحدّث المنتجات أسبوعياً، تراقب مسار عروض الأسعار يومياً |
| محرك القرار | واجهة إدارة سهلة بدعم عربي، منشئ صفحة رئيسية بدون كود |

---

## 4. خرائط رحلة المستخدم

### 4.1 رحلة الشراء B2C — المتسوقة العربية (أميرة)

```
الوعي
│
├── إعلان إنستغرام ← صفحة هبوط المنتج (عربية)
│   └── صورة بطولية → عرض سريع → إضافة للسلة
│
المقارنة
│
├── الصفحة الرئيسية → صفحة الفئة (المراتب)
│   ├── فلاتر: الصلابة = متوسطة، الحجم = 180x200، نطاق السعر
│   └── قائمة المنتجات → صفحة تفاصيل المنتج
│       ├── معرض الصور
│       ├── محدد الحجم (سعر المتغير يتحدث)
│       ├── دليل الصلابة
│       ├── قسم التقييمات
│       ├── زر المقارنة
│       └── زر واتساب (عند التردد)
│
القرار
│
├── إضافة للسلة
│   ├── انزلاق السلة الجانبية
│   └── الانتقال للدفع
│       ├── زيارة أو تسجيل دخول للحساب
│       ├── عنوان التوصيل (محدد الإمارات)
│       ├── تقدير موعد التسليم
│       ├── الدفع (بطاقة / عند التسليم / BNPL)
│       └── تأكيد الطلب + إشعار واتساب
│
ما بعد الشراء
│
└── تأكيد البريد الإلكتروني → تتبع التوصيل → طلب التقييم
```

---

### 4.2 رحلة عرض السعر B2B — مشتري الضيافة (محمد)

```
الاكتشاف
│
└── بحث جوجل "مورد مراتب فنادق دبي" → صفحة هبوط SEO
    └── الصفحة الرئيسية → المنتجات → فئة المراتب
        └── صفحة المنتج → زر "طلب عرض سعر"
│
طلب عرض السعر
│
└── نموذج عرض السعر:
    ├── الاسم، الشركة، الهاتف، واتساب، البريد الإلكتروني
    ├── المنتج + المتغير محدد تلقائياً
    ├── الكمية، مدينة التوصيل، الملاحظات
    └── إرسال النموذج → إشعار الإدارة → رسالة واتساب تلقائية
│
متابعة المبيعات
│
└── لوحة الإدارة → مسار عروض الأسعار
    ├── الحالة: جديد → تم التواصل
    ├── تعيين مندوب مبيعات
    ├── بدء محادثة واتساب
    └── إعداد عرض السعر المخصص وإرساله
│
التحويل
│
└── الحالة: تم التسعير → موافق عليه
    └── إصدار أمر شراء أو رابط دفع
```

---

### 4.3 رحلة روبوت الذكاء الاصطناعي

```
المستخدم يفتح نافذة الدردشة
│
├── الذكاء الاصطناعي يرحب باللغة المكتشفة (عربي/إنجليزي)
│
├── تحديد النية:
│   ├── توصية منتج → يسأل عن تفضيل الراحة، الحجم، الميزانية
│   │   └── يعيد أفضل 3 منتجات مطابقة مع صور وروابط
│   ├── الأسئلة الشائعة → يجيب من قاعدة المعرفة المدربة
│   ├── استفسار التوصيل → يعيد السياسة من CMS
│   └── تحويل بشري → يوجه لمندوب مبيعات واتساب
│
└── التقاط العميل المحتمل:
    ├── جمع الاسم + واتساب
    └── تخزينه كعميل محتمل في لوحة الإدارة
```

---

## 5. هيكل المعلومات

### 5.1 خريطة الموقع — الواجهة العامة

```
/
├── / (الصفحة الرئيسية)
│   ├── قسم البطل
│   ├── شبكة الفئات
│   ├── المنتجات المميزة
│   ├── عرض المجموعات
│   ├── الأكثر مبيعاً
│   ├── شعارات العلامات
│   ├── تقييمات العملاء
│   ├── أكورديون الأسئلة الشائعة
│   └── بانر CTA
│
├── /shop (جميع المنتجات)
│
├── /category/:slug
│   ├── /mattresses (المراتب)
│   ├── /beds (الأسرّة)
│   ├── /bedroom-furniture (أثاث غرفة النوم)
│   ├── /sleep-accessories (إكسسوارات النوم)
│   ├── /pillows (الوسائد)
│   └── /collections (المجموعات)
│
├── /product/:slug
├── /brand/:slug
├── /collection/:slug
├── /cart
├── /checkout
├── /quotation
│
├── /account
│   ├── /account/orders
│   ├── /account/quotations
│   └── /account/profile
│
├── /blog
│   └── /blog/:slug
│
├── /page/:slug
│   ├── /about
│   ├── /contact
│   ├── /delivery
│   ├── /returns
│   ├── /warranty
│   └── /privacy-policy
│
└── /search?q=
```

**النسخة العربية (RTL):**
جميع المسارات تدعم بادئة `/ar/` أو الاكتشاف التلقائي للغة:
```
/ar/ → الصفحة الرئيسية العربية
/ar/category/المراتب
/ar/product/:arabic-slug
```

---

### 5.2 خريطة لوحة الإدارة

```
/admin
│
├── /admin/dashboard (نظرة عامة)
├── /admin/products (المنتجات)
│   ├── /admin/products/create
│   ├── /admin/products/:id/edit
│   └── /admin/products/import
├── /admin/categories (الفئات)
├── /admin/brands (العلامات التجارية)
├── /admin/collections (المجموعات)
├── /admin/attributes (الخصائص)
│   ├── /admin/attributes/groups
│   └── /admin/attributes/options
├── /admin/variations (المتغيرات)
├── /admin/orders (الطلبات)
├── /admin/quotations (عروض الأسعار)
├── /admin/customers (العملاء)
├── /admin/reviews (التقييمات)
├── /admin/content (المحتوى)
│   ├── /admin/content/pages
│   ├── /admin/content/blog
│   ├── /admin/content/faqs
│   └── /admin/content/policies
├── /admin/homepage-builder (منشئ الصفحة الرئيسية)
├── /admin/seo (تحسين محركات البحث)
├── /admin/ai-settings (إعدادات الذكاء الاصطناعي)
├── /admin/whatsapp-settings (إعدادات واتساب)
├── /admin/users (المستخدمون)
│   └── /admin/roles (الأدوار)
└── /admin/settings (الإعدادات)
```

---

## 6. تصميم قاعدة البيانات

### 6.1 مبادئ التصميم

- جميع القيم النقدية تُخزَّن كـ `DECIMAL(12,2)` — لا أرقام عشرية أبداً
- جميع الطوابع الزمنية كـ `TIMESTAMP` بتوقيت UTC وتُعرض بالتوقيت المحلي
- الحذف الناعم `deleted_at` على جميع الكيانات الرئيسية
- مفاتيح UUID للكيانات التي تواجه العملاء لأسباب أمنية
- مفاتيح أساسية بزيادة تلقائية للكيانات العلاقية الداخلية
- جميع النصوص لها أعمدة مزدوجة `_en` و `_ar` للحقول ثنائية اللغة
- تُخزَّن المسارات (Slugs) بشكل منفصل لكل لغة لأغراض SEO

---

### 6.2 الجداول الأساسية

#### جدول `tenants` — المستأجرون *(أساس متعدد البائعين — جاهز للمحور الثاني)*

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف الأساسي |
| uuid | CHAR(36) UNIQUE | معرف فريد للواجهة |
| name_en | VARCHAR(255) | الاسم بالإنجليزية |
| name_ar | VARCHAR(255) | الاسم بالعربية |
| slug | VARCHAR(255) UNIQUE | المسار |
| domain | VARCHAR(255) NULLABLE | النطاق المخصص |
| status | ENUM | active / suspended / pending |
| plan | ENUM | standard / premium / enterprise |
| settings | JSON | الإعدادات المخصصة |

---

#### جدول `users` — المستخدمون

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف الأساسي |
| uuid | CHAR(36) UNIQUE | معرف فريد |
| tenant_id | FK → tenants | ربط المستأجر |
| name | VARCHAR(255) | الاسم الكامل |
| email | VARCHAR(255) UNIQUE | البريد الإلكتروني |
| phone | VARCHAR(50) | الهاتف |
| whatsapp | VARCHAR(50) | رقم واتساب |
| password | VARCHAR(255) | كلمة المرور مشفرة |
| role | ENUM | superadmin / admin / manager / sales / customer |
| locale | ENUM | en / ar |
| status | ENUM | active / inactive / banned |

---

#### جدول `categories` — الفئات

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| parent_id | FK → categories | الفئة الأم (شجرة) |
| name_en / name_ar | VARCHAR(255) | الاسم ثنائي اللغة |
| slug_en / slug_ar | VARCHAR(255) UNIQUE | المسار لكل لغة |
| description_en / description_ar | TEXT | الوصف ثنائي اللغة |
| image_url | VARCHAR(500) | صورة الفئة |
| meta_title / meta_description | VARCHAR | حقول SEO لكل لغة |
| sort_order | INT | ترتيب العرض |
| is_active / is_featured | TINYINT(1) | الحالة والتمييز |

---

#### جدول `brands` — العلامات التجارية

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| name_en / name_ar | VARCHAR(255) | الاسم ثنائي اللغة |
| slug_en / slug_ar | VARCHAR(255) UNIQUE | المسار لكل لغة |
| description_en / description_ar | TEXT | الوصف |
| logo_url / banner_url | VARCHAR(500) | الشعار والبانر |
| website_url | VARCHAR(500) | موقع العلامة |
| is_active / is_featured | TINYINT(1) | الحالة والتمييز |

---

#### جدول `products` — المنتجات *(الجدول الأهم في النظام)*

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| uuid | CHAR(36) UNIQUE | معرف فريد للواجهة |
| tenant_id | FK → tenants | المستأجر |
| brand_id | FK → brands | العلامة التجارية |
| name_en / name_ar | VARCHAR(500) | الاسم ثنائي اللغة |
| slug_en / slug_ar | VARCHAR(500) UNIQUE | المسار SEO |
| short_description_en/ar | TEXT | وصف مختصر |
| description_en/ar | LONGTEXT | الوصف الكامل |
| base_price | DECIMAL(12,2) | السعر الأساسي |
| sale_price | DECIMAL(12,2) NULLABLE | سعر التخفيض |
| cost_price | DECIMAL(12,2) NULLABLE | التكلفة الداخلية |
| sku | VARCHAR(100) UNIQUE | رقم المخزون |
| type | ENUM | simple / variable |
| status | ENUM | active / draft / archived |
| is_featured / is_new / is_best_seller | TINYINT(1) | أعلام التمييز |
| has_quotation / has_cart | TINYINT(1) | تفعيل الأزرار |
| weight | DECIMAL(8,2) | الوزن |
| dimensions | JSON | {length, width, height, unit} |
| warranty_months | INT | مدة الضمان بالأشهر |
| meta_title/description_en/ar | VARCHAR | حقول SEO |
| schema_data | JSON | بيانات Schema.org |
| views_count / sales_count | INT | إحصاءات |

**الفهارس:**
- `INDEX(status, is_featured, is_best_seller, sort_order)`
- `FULLTEXT(name_en, name_ar, description_en, description_ar)`

---

#### جدول `attribute_groups` — مجموعات الخصائص

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| name_en / name_ar | VARCHAR(255) | الاسم ثنائي اللغة |
| slug | VARCHAR(255) UNIQUE | المسار |
| type | ENUM | select/multiselect/color/size/boolean/text |
| is_filterable | TINYINT(1) | يظهر في الفلاتر |
| is_comparable | TINYINT(1) | يظهر في المقارنة |
| is_required | TINYINT(1) | إلزامي عند إنشاء منتج |
| sort_order | INT | ترتيب العرض |

---

#### جدول `attribute_options` — خيارات الخصائص

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| group_id | FK → attribute_groups | المجموعة الأم |
| value_en / value_ar | VARCHAR(255) | القيمة ثنائية اللغة |
| slug | VARCHAR(255) | المسار |
| color_hex | VARCHAR(10) NULLABLE | كود اللون للعينات |
| sort_order | INT | الترتيب |

---

#### جدول `product_variations` — متغيرات المنتج

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| uuid | CHAR(36) UNIQUE | معرف فريد |
| product_id | FK → products | المنتج الأب |
| sku | VARCHAR(100) UNIQUE | رقم المخزون |
| price | DECIMAL(12,2) | سعر هذا المتغير |
| sale_price | DECIMAL(12,2) NULLABLE | سعر تخفيض |
| stock_quantity | INT | الكمية المتاحة |
| stock_status | ENUM | in_stock/out_of_stock/backorder |
| weight / dimensions | DECIMAL / JSON | أبعاد المتغير |
| is_active | TINYINT(1) | الحالة |

---

#### جدول `quotations` — عروض الأسعار

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| uuid | CHAR(36) UNIQUE | معرف فريد |
| quote_number | VARCHAR(50) UNIQUE | رقم العرض QT-2026-00001 |
| customer_id | FK → customers NULLABLE | العميل المسجل |
| assigned_to | FK → users NULLABLE | مندوب المبيعات |
| first_name / last_name | VARCHAR(255) | اسم العميل |
| email / phone / whatsapp | VARCHAR | بيانات التواصل |
| company | VARCHAR(255) NULLABLE | اسم الشركة |
| country / city | VARCHAR | الموقع |
| product_id / variation_id | FK NULLABLE | المنتج والمتغير |
| quantity | INT | الكمية |
| notes / admin_notes | TEXT | ملاحظات |
| status | ENUM | new/contacted/quoted/approved/rejected |
| source | ENUM | web_form/whatsapp/ai_chat/phone/admin |
| quoted_amount | DECIMAL(12,2) NULLABLE | المبلغ المقتَرح |

---

#### جدول `orders` — الطلبات

| العمود | النوع | الوصف |
|---|---|---|
| id | BIGINT UNSIGNED PK | المعرف |
| uuid | CHAR(36) UNIQUE | معرف فريد |
| order_number | VARCHAR(50) UNIQUE | رقم الطلب MM-2026-00001 |
| customer_id | FK NULLABLE | العميل |
| guest_email / guest_name | VARCHAR NULLABLE | بيانات الزائر |
| status | ENUM | pending/processing/confirmed/shipped/delivered/cancelled/refunded |
| payment_status | ENUM | pending/paid/failed/refunded |
| subtotal / discount / shipping / total | DECIMAL(12,2) | حسابات الطلب |
| currency | CHAR(3) DEFAULT 'AED' | العملة |
| shipping_address | JSON | عنوان التوصيل |
| notes / admin_notes | TEXT | ملاحظات |

---

#### جداول إضافية

| الجدول | الغرض |
|---|---|
| `product_categories` | ربط pivot بين المنتجات والفئات |
| `product_collections` | ربط pivot بين المنتجات والمجموعات |
| `product_images` | صور المنتج ومتغيراته |
| `product_attributes` | ربط المنتج بخيارات الخصائص |
| `variation_attributes` | ربط المتغير بخيارات الخصائص |
| `order_items` | عناصر كل طلب |
| `quotation_items` | عناصر كل عرض سعر |
| `addresses` | عناوين العملاء |
| `customers` | ملفات تعريف العملاء |
| `reviews` | تقييمات المنتجات |
| `cms_pages` | صفحات CMS الثابتة |
| `blog_posts` | مقالات المدونة |
| `faqs` | الأسئلة الشائعة |
| `homepage_sections` | إعدادات أقسام الصفحة الرئيسية |
| `media` | مكتبة الوسائط المركزية |
| `ai_conversations` | محادثات روبوت الدردشة |
| `ai_training_documents` | وثائق تدريب الذكاء الاصطناعي |
| `whatsapp_messages` | سجل رسائل واتساب |
| `activity_logs` | سجل النشاطات الإدارية |

---

## 7. هيكل ERD

### 7.1 نظرة عامة على العلاقات

```
المستأجرون (المحور الثاني)
    │
    ├──< المستخدمون (أدوار متعددة)
    ├──< العلامات التجارية
    ├──< الفئات (شجرة هرمية ذاتية)
    ├──< المجموعات
    └──< المنتجات
              │
              ├──< pivot: product_categories
              ├──< pivot: product_collections
              ├──< صور المنتج
              ├──< خصائص المنتج → خيارات الخصائص → مجموعات الخصائص
              └──< متغيرات المنتج
                        ├──< خصائص المتغير → خيارات الخصائص
                        └──< صور المتغير

العملاء
    ├──< العناوين
    ├──< الطلبات → عناصر الطلب → منتجات/متغيرات
    ├──< عروض الأسعار → عناصر عروض الأسعار
    ├──< التقييمات → المنتجات
    └──< محادثات الذكاء الاصطناعي

الإدارة
    ├──< صفحات CMS / مدونة / أسئلة شائعة
    ├──< أقسام الصفحة الرئيسية
    ├──< مكتبة الوسائط
    ├──< وثائق تدريب الذكاء الاصطناعي
    ├──< رسائل واتساب
    └──< سجلات النشاط
```

### 7.2 ملخص العلاقات الرئيسية

| من | إلى | النوع | الملاحظات |
|---|---|---|---|
| المنتجات | الفئات | متعدد لمتعدد | عبر product_categories |
| المنتجات | العلامات التجارية | متعدد لواحد | FK مباشر |
| المنتجات | المجموعات | متعدد لمتعدد | عبر product_collections |
| المنتجات | خيارات الخصائص | متعدد لمتعدد | عبر product_attributes |
| متغيرات المنتج | خيارات الخصائص | متعدد لمتعدد | عبر variation_attributes |
| الفئات | الفئات | ذاتية المرجع | شجرة أب/ابن بلا حد |
| الطلبات | العملاء | متعدد لواحد | FK + دعم الزوار |
| عروض الأسعار | المنتجات | متعدد لواحد | اختياري مع نص حر |
| المستأجرون | الجداول الرئيسية | واحد لمتعدد | نطاق متعدد المستأجرين |

---

## 8. هيكل API

### 8.1 مبادئ التصميم

- **RESTful** مسارات قائمة على الموارد مع استجابات JSON
- **إصدار محمي:** جميع المسارات تحت `/api/v1/`
- **بلا حالة (Stateless):** JWT للعملاء، Sanctum لـ SPA الإدارة
- **غلاف استجابة موحد:**

```json
{
  "success": true,
  "data": { "..." },
  "meta": {
    "pagination": { "current_page": 1, "total": 120, "per_page": 24 }
  },
  "message": null
}
```

- **تنسيق الخطأ:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "البيانات المُدخلة غير صحيحة.",
    "fields": { "email": ["حقل البريد الإلكتروني مطلوب."] }
  }
}
```

---

### 8.2 مسارات API العامة

```
GET    /api/v1/products
GET    /api/v1/products/{slug}
GET    /api/v1/products/{slug}/variations
GET    /api/v1/products/{slug}/reviews
POST   /api/v1/products/{slug}/reviews

GET    /api/v1/categories
GET    /api/v1/categories/{slug}
GET    /api/v1/categories/{slug}/products

GET    /api/v1/brands
GET    /api/v1/brands/{slug}
GET    /api/v1/brands/{slug}/products

GET    /api/v1/collections
GET    /api/v1/collections/{slug}/products

GET    /api/v1/search?q=&locale=ar
GET    /api/v1/filters?category={slug}
GET    /api/v1/compare?ids=1,2,3

GET    /api/v1/homepage
GET    /api/v1/pages/{slug}
GET    /api/v1/blog
GET    /api/v1/blog/{slug}
GET    /api/v1/faqs

POST   /api/v1/quotations
POST   /api/v1/leads

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/account/orders           [auth]
GET    /api/v1/account/orders/{uuid}    [auth]
GET    /api/v1/account/quotations       [auth]
GET    /api/v1/account/profile          [auth]
PUT    /api/v1/account/profile          [auth]

GET    /api/v1/cart                     [session]
POST   /api/v1/cart/items               [session]
PUT    /api/v1/cart/items/{id}          [session]
DELETE /api/v1/cart/items/{id}          [session]

POST   /api/v1/checkout/initiate
POST   /api/v1/checkout/confirm
GET    /api/v1/checkout/verify/{ref}

POST   /api/v1/ai/chat
GET    /api/v1/ai/session/{uuid}
```

---

### 8.3 مسارات API الإدارة

```
جميع المسارات بالبادئة: /api/v1/admin/
جميعها محمية: [auth:sanctum] + [role:admin|manager]

--- المنتجات ---
GET/POST       /products
GET/PUT/DELETE /products/{id}
POST           /products/{id}/images
POST           /products/import

--- المتغيرات ---
GET/POST       /products/{id}/variations
PUT/DELETE     /products/{id}/variations/{varId}

--- الخصائص ---
GET/POST/PUT/DELETE  /attributes/groups
GET/POST             /attributes/groups/{id}/options
PUT/DELETE           /attributes/options/{id}

--- الفئات / العلامات / المجموعات ---
CRUD لكل مورد

--- الطلبات ---
GET            /orders
GET            /orders/{uuid}
PUT            /orders/{uuid}/status
POST           /orders/{uuid}/notes

--- عروض الأسعار ---
GET            /quotations
GET/PUT        /quotations/{uuid}
POST           /quotations/{uuid}/notes
POST           /quotations/{uuid}/assign
POST           /quotations/{uuid}/whatsapp

--- العملاء ---
GET            /customers
GET/PUT        /customers/{uuid}
GET            /customers/{uuid}/orders
GET            /customers/{uuid}/quotations

--- المحتوى CMS ---
CRUD /pages / /blog / /faqs

--- منشئ الصفحة الرئيسية ---
GET            /homepage/sections
PUT            /homepage/sections/reorder
PUT            /homepage/sections/{key}

--- الذكاء الاصطناعي ---
CRUD           /ai/training-documents
POST           /ai/sync-vectors
GET            /ai/conversations

--- الإحصاءات ---
GET            /analytics/overview
GET            /analytics/products
GET            /analytics/quotations

--- النظام ---
GET/PUT        /settings
CRUD           /users
CRUD           /roles
PUT            /roles/{id}/permissions
```

---

### 8.4 طبقة Middleware للـ API

```
تدفق الطلب:
طلب HTTP
    → Cloudflare (DDoS، WAF، حد معدل الطلبات)
    → Nginx (إنهاء TLS، وكيل عكسي)
    → Laravel Router
        → ThrottleRequests (لكل IP / لكل مستخدم)
        → SetLocale (Accept-Language أو ?locale=)
        → CORS (قائمة بيضاء صارمة لنطاق الواجهة)
        → Authenticate (JWT أو Sanctum)
        → Authorize (أدوار وصلاحيات Spatie)
        → ValidateRequest (فئة Form Request)
        → Controller
        → ResponseTransformer (API Resource)
    → استجابة JSON
```

---

## 9. هيكل الخلفية (Backend)

### 9.1 هيكل المجلدات

```
app/
├── Console/Commands/
│   ├── GenerateSitemap.php
│   ├── SyncAIVectors.php
│   └── ProcessWhatsAppQueue.php
│
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── Auth/
│   │   ├── Public/
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── SearchController.php
│   │   │   ├── FilterController.php
│   │   │   ├── QuotationController.php
│   │   │   ├── CartController.php
│   │   │   ├── CheckoutController.php
│   │   │   ├── HomepageController.php
│   │   │   └── AiChatController.php
│   │   └── Admin/
│   │       ├── ProductController.php
│   │       ├── VariationController.php
│   │       ├── AttributeController.php
│   │       ├── OrderController.php
│   │       ├── QuotationController.php
│   │       ├── CustomerController.php
│   │       ├── CmsController.php
│   │       ├── HomepageBuilderController.php
│   │       ├── AnalyticsController.php
│   │       └── AiSettingsController.php
│   │
│   ├── Middleware/
│   │   ├── SetLocale.php
│   │   ├── EnsureAdminRole.php
│   │   └── TrackProductView.php
│   │
│   └── Requests/
│       ├── StoreProductRequest.php
│       └── StoreQuotationRequest.php
│
├── Models/
│   ├── Tenant.php       ├── User.php
│   ├── Product.php      ├── ProductVariation.php
│   ├── AttributeGroup.php ├── AttributeOption.php
│   ├── Category.php     ├── Brand.php
│   ├── Collection.php   ├── Order.php
│   ├── OrderItem.php    ├── Quotation.php
│   ├── Customer.php     ├── Review.php
│   ├── CmsPage.php      ├── BlogPost.php
│   ├── Faq.php          ├── HomepageSection.php
│   ├── Media.php        ├── AiConversation.php
│   └── WhatsappMessage.php
│
├── Services/
│   ├── ProductService.php
│   ├── VariationService.php
│   ├── FilterService.php
│   ├── SearchService.php
│   ├── CartService.php
│   ├── CheckoutService.php
│   ├── QuotationService.php
│   ├── PaymentService.php
│   ├── AiChatService.php
│   ├── WhatsAppService.php
│   ├── MediaService.php
│   ├── SeoService.php
│   └── ImageOptimizationService.php
│
├── Repositories/
│   ├── ProductRepository.php
│   ├── OrderRepository.php
│   ├── QuotationRepository.php
│   └── CustomerRepository.php
│
├── Resources/  (API Transformers)
│   ├── ProductResource.php
│   ├── ProductDetailResource.php
│   ├── VariationResource.php
│   ├── CategoryResource.php
│   ├── OrderResource.php
│   └── QuotationResource.php
│
├── Events/
│   ├── QuotationCreated.php
│   ├── OrderPlaced.php
│   └── LeadCaptured.php
│
├── Listeners/
│   ├── SendQuotationNotification.php
│   ├── SendOrderConfirmation.php
│   └── NotifyWhatsApp.php
│
└── Jobs/
    ├── SendWhatsAppMessage.php
    ├── ProcessImageOptimization.php
    ├── GenerateSitemap.php
    └── SyncAiVector.php
```

---

### 9.2 استراتيجية التخزين المؤقت (Redis Cache)

| المورد | مدة التخزين | مفتاح الإلغاء |
|---|---|---|
| أقسام الصفحة الرئيسية | ساعة | تحديث HomepageSection |
| شجرة الفئات | 6 ساعات | إنشاء/تعديل/حذف فئة |
| تفاصيل المنتج | 30 دقيقة | تحديث المنتج |
| قوائم المنتجات | 15 دقيقة | تحديث منتج أو مخزون |
| خيارات الفلاتر | ساعة | تغيير خيار خاصية |
| مقالات المدونة | ساعتان | نشر/تحديث مقال |
| الأسئلة الشائعة | 12 ساعة | إنشاء/تحديث سؤال |
| خريطة الموقع | 24 ساعة | مهمة ليلية مجدولة |

**اصطلاح مفاتيح التخزين المؤقت:**
```
products:listing:{category}:{page}:{filters_hash}:{locale}
products:detail:{slug}:{locale}
categories:tree:{locale}
filters:{category_slug}:{locale}
homepage:sections:{locale}
```

---

### 9.3 إعداد قوائم الانتظار (Queues)

| القائمة | العمال | المهام |
|---|---|---|
| `default` | 2 عمال | إشعارات البريد، توليد PDF |
| `whatsapp` | عامل واحد | طلبات WhatsApp API |
| `media` | عامل واحد | تحسين الصور، رفع CDN |
| `ai` | عامل واحد | مزامنة المتجهات، تسجيل المحادثات |
| `high` | عامل واحد | webhooks الدفع، تنبيهات حرجة |

---

### 9.4 الحزم الرئيسية للـ Laravel

| الحزمة | الغرض |
|---|---|
| `spatie/laravel-permission` | نظام الأدوار والصلاحيات |
| `spatie/laravel-medialibrary` | إدارة الوسائط مع التحويلات |
| `spatie/laravel-translatable` | خصائص النموذج متعددة اللغات |
| `spatie/laravel-sluggable` | توليد المسارات التلقائي |
| `spatie/laravel-query-builder` | فلترة وترتيب API |
| `spatie/laravel-activitylog` | سجل المراجعة |
| `spatie/laravel-sitemap` | توليد خريطة XML للموقع |
| `laravel/sanctum` | مصادقة SPA الإدارة |
| `tymon/jwt-auth` | JWT للعملاء |
| `barryvdh/laravel-dompdf` | توليد PDF لعروض الأسعار |
| `league/flysystem-aws-s3-v3` | تخزين الكائنات (S3) |
| `intervention/image` | معالجة الصور |
| `openai-php/laravel` | تكامل OpenAI API |

---

## 10. هيكل الواجهة الأمامية (Frontend)

### 10.1 هيكل المشروع

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx          (هيكل الصفحة مع اللغة)
│       ├── page.tsx            (الصفحة الرئيسية)
│       ├── shop/page.tsx
│       ├── category/[slug]/page.tsx
│       ├── product/[slug]/page.tsx
│       ├── brand/[slug]/page.tsx
│       ├── collection/[slug]/page.tsx
│       ├── cart/page.tsx
│       ├── checkout/page.tsx
│       ├── quotation/page.tsx
│       ├── account/
│       │   ├── orders/page.tsx
│       │   └── profile/page.tsx
│       ├── blog/[slug]/page.tsx
│       └── search/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MobileNav.tsx
│   │   ├── Footer.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── LocaleSwitcher.tsx
│   │
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariationSelector.tsx
│   │   ├── AttributeDisplay.tsx
│   │   ├── ProductReviews.tsx
│   │   ├── RelatedProducts.tsx
│   │   ├── ProductComparison.tsx
│   │   └── QuickView.tsx
│   │
│   ├── shop/
│   │   ├── FilterSidebar.tsx
│   │   ├── FilterPanel.tsx     (درج سفلي للجوال)
│   │   ├── ActiveFilters.tsx
│   │   ├── SortDropdown.tsx
│   │   └── Pagination.tsx
│   │
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   │
│   ├── quotation/
│   │   ├── QuotationForm.tsx
│   │   └── QuotationSuccess.tsx
│   │
│   ├── homepage/
│   │   ├── HeroSection.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── CollectionsShowcase.tsx
│   │   ├── BestSellers.tsx
│   │   ├── ReviewsCarousel.tsx
│   │   ├── FaqAccordion.tsx
│   │   └── CtaBanner.tsx
│   │
│   ├── ai/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatBubble.tsx
│   │   └── ChatInput.tsx
│   │
│   └── shared/
│       ├── WhatsAppButton.tsx
│       ├── PriceDisplay.tsx
│       ├── StarRating.tsx
│       ├── ImageWithFallback.tsx
│       └── LocalizedLink.tsx
│
├── hooks/
│   ├── useCart.ts
│   ├── useFilters.ts
│   ├── useProducts.ts
│   ├── useLocale.ts
│   ├── useAuth.ts
│   └── useWhatsApp.ts
│
├── store/
│   ├── cartStore.ts       (Zustand)
│   ├── filterStore.ts
│   ├── authStore.ts
│   └── uiStore.ts
│
├── lib/
│   ├── api.ts             (Axios instance)
│   ├── queryClient.ts     (React Query)
│   ├── i18n.ts
│   ├── utils.ts
│   └── seo.ts
│
├── types/
│   ├── product.types.ts
│   ├── order.types.ts
│   ├── quotation.types.ts
│   ├── filter.types.ts
│   └── api.types.ts
│
└── messages/
    ├── en.json
    └── ar.json
```

---

### 10.2 استراتيجية إدارة الحالة

| نوع الحالة | الحل | السبب |
|---|---|---|
| حالة الخادم (منتجات، فئات) | React Query (TanStack) | تخزين مؤقت، إعادة جلب، تجنب التكرار |
| حالة السلة | Zustand + localStorage | مستمرة وخفيفة |
| حالة الفلاتر | Zustand + URL params | روابط قابلة للمشاركة |
| حالة المصادقة | Zustand + cookies آمنة | استمرار الجلسة |
| حالة واجهة المستخدم | Zustand | تجنب تمرير Props |

---

### 10.3 هيكل التعريب (i18n)

- **المكتبة:** `next-intl`
- **التوجيه:** مسارات ببادئة اللغة (`/en/`، `/ar/`)
- **الاتجاه:** `dir="rtl"` يُطبَّق على مستوى `<html>` للعربية
- **TailwindCSS RTL:** إضافة `tailwindcss-rtl` للخصائص المنطقية
- **الخطوط:**
  - الإنجليزية: Inter / Geist Sans
  - العربية: Cairo أو Noto Sans Arabic
- **تنسيق التواريخ والأرقام:** `Intl.DateTimeFormat` و `Intl.NumberFormat` مع locale `ar-AE` / `en-AE`

---

### 10.4 استراتيجية الأداء

| الإطار | Next.js 15 (App Router) مع React Server Components |
|---|---|
| الصفحة الرئيسية | ISR (revalidate: 3600) |
| صفحات الفئات/العلامات | ISR (revalidate: 1800) |
| صفحات المنتجات | ISR (revalidate: 600) + إعادة تحقق فورية عند التحديث |
| سلة/دفع/حساب | Client-side فقط (لا SSR) |
| الصور | `next/image` مع WebP، نطاق CDN مُعدَّل |
| تقسيم الحزمة | تلقائي حسب المسار |
| الجلب المسبق | `Link prefetch` للروابط المرئية |

---

## 11. هيكل نظام إدارة المحتوى (CMS)

### 11.1 نظرة عامة

نظام CMS خفيف الوزن وبلا رأس (Headless)، مدمج في لوحة إدارة Laravel. لا يعتمد على أي منصة CMS خارجية. كل المحتوى مخزَّن في MySQL ويُقدَّم عبر API.

### 11.2 أنواع المحتوى

| النوع | الجدول | الغرض |
|---|---|---|
| الصفحات | `cms_pages` | صفحات ثابتة (من نحن، اتصل بنا، التوصيل...) |
| مقالات المدونة | `blog_posts` | مقالات SEO وأدلة النوم |
| الأسئلة الشائعة | `faqs` | أقسام الأسئلة الأكورديون |
| السياسات | `cms_pages` (type=policy) | الخصوصية، الإرجاع، الضمان |
| أقسام الصفحة الرئيسية | `homepage_sections` | منشئ الصفحة بالسحب والإفلات |

### 11.3 متطلبات المحرر

- **محرر النصوص الغني:** Tiptap (React، قابل للتوسعة، مخرجات HTML نظيفة)
- **المحتوى العربي:** وضع محرر RTL كامل
- **إدراج الصور:** منتقي وسائط من Object Storage
- **حقول SEO:** عنوان meta، وصف، صورة OG لكل عنصر محتوى
- **معاينة:** يمكن للمسؤول معاينة المحتوى باللغة العربية أو الإنجليزية قبل النشر

### 11.4 منشئ الصفحة الرئيسية

واجهة إدارة الأقسام — وليس منشئ صفحات بالكامل. يتحكم المسؤولون في:

| الإجراء | الإمكانية |
|---|---|
| تفعيل/تعطيل قسم | تبديل الرؤية |
| إعادة ترتيب الأقسام | سحب وإفلات |
| تهيئة القسم | إعدادات خاصة لكل قسم |

**سجل الأقسام:**

| المفتاح | الإعدادات |
|---|---|
| `hero` | عنوان EN/AR، نص فرعي، صورة، رابط CTA |
| `categories` | عنوان، حد العناصر، فئات مختارة |
| `featured` | عنوان، معرفات المنتجات المميزة |
| `collections` | عنوان، معرفات المجموعات |
| `best_sellers` | عنوان، الحد الأقصى للعناصر |
| `brands` | عنوان، معرفات العلامات |
| `reviews` | عنوان، الحد، إظهار التقييم |
| `faq` | عنوان، معرفات الأسئلة |
| `cta_banner` | عنوان، نص، لون الخلفية، صورة، رابط |
| `blog` | عنوان، الحد |

---

## 12. محرك المنتجات

### 12.1 أنواع المنتجات

| النوع | الوصف |
|---|---|
| `simple` | SKU واحد، بلا متغيرات — مثل وسادة بحجم واحد |
| `variable` | متغيرات متعددة بناءً على الخصائص — مثل فرشة بخيارات حجم/صلابة |

### 12.2 دورة حياة المنتج

```
مسودة → نشط → مؤرشف
  │
  └─ نشر مجدول (مستقبلي)
```

### 12.3 منطق عرض المنتج

1. **عرض السعر:** يُظهر السعر الأساسي. عند اختيار متغير، يُظهر سعر المتغير. إذا كان sale_price محدداً، يُظهر السعر المشطوب + سعر التخفيض.
2. **عرض المخزون:** يُحسب لكل متغير. "متاح" / "غير متاح" / "كمية محدودة" (أقل من 5).
3. **عرض الصور:** الصور الأساسية للمنتج تظهر افتراضياً. الصور الخاصة بالمتغير تحل محل المعرض عند اختياره.
4. **إضافة للسلة مقابل عرض السعر:** كلاهما متاح افتراضياً. يمكن للمسؤول تعطيل أيٍّ منهما لكل منتج.

### 12.4 بحث المنتجات

- **المحرك:** فهرس MySQL FULLTEXT على `name_en, name_ar, description_en, description_ar`
- **تحسين (المرحلة الثانية):** Algolia أو Meilisearch للملاءمة المتقدمة
- **الإكمال التلقائي:** استدعاء API متأخر يعيد أسماء المنتجات والفئات
- **صفحة نتائج البحث:** نفس واجهة الفلترة والترتيب لصفحة الفئة

### 12.5 مقارنة المنتجات

- الحد الأقصى: 4 منتجات للمقارنة في وقت واحد
- جدول المقارنة مبني ديناميكياً من مجموعات الخصائص المشتركة
- مخزَّن في localStorage المتصفح (لا يحتاج مصادقة)
- زر "مقارنة" مباشر على بطاقات المنتج وصفحاته

---

## 13. محرك الخصائص

### 13.1 نظرة معمارية

محرك الخصائص نظام ديناميكي كامل بدون كود، يمكّن المسؤول من تعريف مواصفات المنتج دون تدخل المطور.

### 13.2 أنواع مجموعات الخصائص

| النوع | عنصر التحكم في واجهة المستخدم | المثال |
|---|---|---|
| `select` | أزرار راديو / قائمة منسدلة | الصلابة: ناعم، متوسط، صلب |
| `multiselect` | مربعات اختيار | التقنيات: رغوة ذاكرة + جل تبريد |
| `color` | عينات ألوان | اللون: بيج، أبيض، رمادي |
| `size` | أزرار الحجم | الحجم: 90×200، 120×200، 180×200 |
| `boolean` | تبديل نعم/لا | غطاء قابل للغسيل: نعم |
| `text` | نص حر | تسمية أبعاد مخصصة |

### 13.3 خصائص مجموعة الخصائص

كل مجموعة لها:
- `is_filterable` ← تظهر في شريط فلاتر المتجر
- `is_comparable` ← تظهر في جدول مقارنة المنتجات
- `is_required` ← يجب تحديد الخاصية عند إنشاء المنتج
- `sort_order` ← يتحكم في ترتيب العرض على صفحة المنتج

### 13.4 تدفق تعيين الخصائص

**عند إنشاء منتج في الإدارة:**
1. تحديد مجموعات الخصائص المنطبقة على فئة المنتج
2. لكل مجموعة: تحديد الخيارات المنطبقة (أو إنشاء خيارات جديدة مباشرة)
3. للمنتجات المتغيرة: تحديد المجموعات التي تُعرِّف المتغيرات
4. النظام يُولِّد تلقائياً تركيبات المتغيرات (أو يُنشئها المسؤول يدوياً)

### 13.5 وراثة الخصائص

عند تحديد مجموعات خصائص افتراضية لفئة، تُحدَّد تلك المجموعات مسبقاً عند إنشاء منتج في تلك الفئة. يمكن للمسؤول إضافة أو إزالة مجموعات بحرية.

---

## 14. محرك المتغيرات

### 14.1 مصفوفة المتغيرات

لفرشة بخاصيتين تُعرِّفان المتغيرات (الحجم × الصلابة)، يبني النظام مصفوفة:

```
الحجم \ الصلابة  | ناعم     | متوسط    | صلب
-----------------|----------|----------|----------
90×200           | SKU-001  | SKU-002  | SKU-003
120×200          | SKU-004  | SKU-005  | SKU-006
180×200          | SKU-007  | SKU-008  | SKU-009
```

كل خلية هي سجل `product_variation` منفصل.

### 14.2 حقول كل SKU

| الحقل | مطلوب | الملاحظات |
|---|---|---|
| SKU | اختياري | يُولَّد تلقائياً إن كان فارغاً |
| السعر | مطلوب | يتجاوز السعر الأساسي للمنتج |
| سعر التخفيض | اختياري | |
| الكمية المتاحة | مطلوب | تتبع لكل متغير |
| حالة المخزون | تلقائي | تُحسب من الكمية |
| الصور | اختياري | معرض خاص بالمتغير |
| الوزن | اختياري | لحسابات الشحن |
| الأبعاد | اختياري | JSON: {L, W, H, unit} |

### 14.3 تجربة اختيار المتغير

على صفحة المنتج:
1. تُعرَض عناصر التحكم لمجموعات الخصائص (أزرار الحجم، عينات الألوان...)
2. عند تغيير الاختيار → النظام يُحلِّل المتغير المطابق من خريطة JSON المحمَّلة مسبقاً
3. يتحدث السعر وحالة المخزون والصور ورقم SKU فورياً
4. تعكس أزرار "إضافة للسلة" / "طلب عرض سعر" المتغير المختار

**تحسين الأداء:** تُحمَّل جميع المتغيرات مسبقاً كخريطة JSON عند تحميل صفحة المنتج (للمنتجات ذات ≤ 50 متغيراً). للمنتجات ذات أكثر من 50 متغيراً، تحميل كسول عند تغيير الخاصية.

---

## 15. محرك الفلاتر

### 15.1 المعمارية

محرك الفلاتر مدفوع بالكامل بنظام الخصائص. لا توجد فلاتر مُشفَّرة.

### 15.2 عملية توليد الفلاتر

```
1. المسؤول يُحدِّد مجموعة خاصية كـ is_filterable = true
2. FilterService يستعلم عن جميع الخيارات النشطة لتلك المجموعة
   التي تحتوي على منتج نشط واحد على الأقل في الفئة الحالية
3. يُعيد تعريف فلتر مُهيكَل:
   {
     group_id: 3,
     group_name_ar: "الصلابة",
     group_name_en: "Firmness",
     type: "select",
     options: [
       { id: 12, value_ar: "ناعم", count: 24 },
       { id: 13, value_ar: "متوسط", count: 41 },
       { id: 14, value_ar: "صلب", count: 18 }
     ]
   }
```

### 15.3 مجموعات الفلاتر المعيارية

| الفلتر | المصدر | النوع |
|---|---|---|
| نطاق السعر | base_price للمنتج | شريط تمرير |
| الفئة | جدول categories | شجرة checkbox |
| العلامة التجارية | جدول brands | checkbox |
| المجموعة | جدول collections | checkbox |
| الحجم | مجموعة خاصية "الحجم" | شبكة أزرار |
| المادة | مجموعة خاصية "المادة" | checkbox |
| الصلابة | مجموعة خاصية "الصلابة" | radio/checkbox |
| مستوى الراحة | مجموعة خاصية "الراحة" | checkbox |
| التقنية | مجموعة خاصية "التقنية" | checkbox |
| اللون | مجموعة خاصية "اللون" | عينات ألوان |
| الضمان | مجموعة خاصية "الضمان" | checkbox |

### 15.4 حالة URL

تنعكس الفلاتر في معاملات استعلام URL لقابلية المشاركة وـ SEO:

```
/ar/category/المراتب?firmness=medium&size=180x200&price_min=500&price_max=3000&brand=dormeo&sort=price_asc&page=2
```

### 15.5 أداء الفلاتر

- تُحسَب أعداد الفلاتر في استعلام تجميع واحد لكل مجموعة فلاتر
- النتائج مخزَّنة في Redis لمدة 15 دقيقة لكل `{category_slug}:{locale}`
- تُلغى ذاكرة التخزين المؤقت عند إنشاء/تحديث/حذف منتج في تلك الفئة
- خيارات الفلاتر الفارغة تُخفى تلقائياً من واجهة المستخدم

---

## 16. محرك عروض الأسعار

### 16.1 مصادر العروض

| المصدر | المحفِّز |
|---|---|
| `web_form` | العميل يملأ نموذج العرض في صفحة المنتج |
| `whatsapp` | رسالة واتساب تُحلَّل وتُخزَّن كعميل محتمل |
| `ai_chat` | روبوت الذكاء الاصطناعي يلتقط العميل ويُنشئ العرض |
| `phone` | المسؤول يُنشئ يدوياً لاستفسار هاتفي |
| `admin` | المسؤول يُنشئ عرضاً مباشرة لعميل B2B |

### 16.2 سير عمل عرض السعر

```
آلة الحالة:
جديد → تم التواصل → تم التسعير → موافق عليه
              ↓
           مرفوض
```

| الحالة | من يُغيِّرها | المُحفِّزات |
|---|---|---|
| `new` (جديد) | النظام (تلقائي) | بريد إلكتروني للمسؤول، واتساب لفريق المبيعات |
| `contacted` (تم التواصل) | مندوب المبيعات | ملاحظة داخلية مطلوبة |
| `quoted` (تم التسعير) | مندوب المبيعات | إدخال مبلغ العرض، توليد PDF |
| `approved` (موافق عليه) | مندوب المبيعات | خيار تحويل لطلب متاح |
| `rejected` (مرفوض) | مندوب المبيعات | ملاحظة سبب الرفض مُحفظة |

### 16.3 مسار العروض في لوحة الإدارة

لوحة بأسلوب Kanban في لوحة التحكم الإدارية:

```
[ جديد ] [ تم التواصل ] [ تم التسعير ] [ موافق ] [ مرفوض ]
   │
   └── البطاقة تُظهر: اسم العميل، المنتج، التاريخ، زر واتساب
```

### 16.4 حقول نموذج طلب عرض السعر

**مطلوب:**
- الاسم الأول، اسم العائلة
- رقم الهاتف
- البريد الإلكتروني
- الدولة (الإمارات افتراضياً)، المدينة/الإمارة

**مُعبَّأ مسبقاً من صفحة المنتج:**
- اسم المنتج + المتغير

**اختياري:**
- اسم الشركة
- الكمية
- الملاحظات / المتطلبات الخاصة

**مخفي (يملأه النظام):**
- المصدر، اللغة، IP، product_id، variation_id

### 16.5 توليد PDF لعرض السعر

يمكن للمسؤول توليد وثيقة PDF تحتوي على:
- شعار الشركة وبيانات الاتصال
- رقم العرض والتاريخ
- بيانات العميل
- بنود الأسعار مع المجاميع
- تاريخ صلاحية العرض
- الشروط والأحكام
- نسخة عربية أو إنجليزية حسب لغة العميل

---

## 17. هيكل الذكاء الاصطناعي

### 17.1 نظرة معمارية عامة

نظام الذكاء الاصطناعي مبني كطبقة خدمة معيارية مستقلة عن المزود. التكامل الأولي يستهدف OpenAI GPT-4o. تتيح المعمارية تغيير المزودين أو إضافة نماذج محلية دون تغيير الواجهة الأمامية.

### 17.2 المكونات

```
┌─────────────────────────────────────────────┐
│         أداة الدردشة في React               │
│  - عرض سلسلة الرسائل                       │
│  - إرسال رسائل المستخدم لـ /api/v1/ai/chat │
│  - عرض مؤشر الكتابة                        │
│  - معالجة إجراء التحويل لواتساب            │
└───────────────────┬─────────────────────────┘
                    │ HTTP
┌───────────────────▼─────────────────────────┐
│       AiChatController (Laravel)            │
│  - تحديد معدل الطلبات (10 رسائل/دقيقة)    │
│  - إدارة الجلسات                           │
│  - التوجيه لـ AiChatService                │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│           AiChatService                     │
│                                             │
│  1. بناء السياق:                           │
│     - تاريخ المحادثة                       │
│     - موجّه النظام (الشركة + اللغة)        │
│     - سياق RAG المسترجع                    │
│                                             │
│  2. تحديد النية:                           │
│     - توصية_منتج                           │
│     - إجابة_سؤال_شائع                     │
│     - التقاط_عميل                          │
│     - استفسار_توصيل                        │
│     - تحويل_بشري                           │
│                                             │
│  3. استدعاء OpenAI API                     │
│                                             │
│  4. معالجة الاستجابة:                      │
│     - استخراج توصيات المنتجات              │
│     - استخراج بيانات العميل الملتقطة       │
│     - تحديد ما إذا كان التحويل مطلوباً     │
│                                             │
│  5. تخزين الرسالة في ai_conversations      │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│        قاعدة المعرفة (طبقة RAG)            │
│                                             │
│  المصادر:                                  │
│  - ai_training_documents                   │
│    (منتجات، أسئلة شائعة، سياسات،          │
│     معلومات الشركة، أدلة المبيعات)         │
│                                             │
│  تخزين المتجهات: pgvector أو Pinecone      │
│  نموذج التضمين: text-embedding-3-small     │
│  الاسترجاع: أفضل 5 تطابقات دلالية         │
└─────────────────────────────────────────────┘
```

### 17.3 استراتيجية موجّه النظام

يُحمَّل موجّه النظام ديناميكياً من إعدادات الإدارة ويتضمن:
- هوية الشركة ونبرة الصوت
- تعليمات اللغة (عربي/إنجليزي حسب اللغة المكتشفة)
- ملخص كتالوج المنتجات
- قواعد توجيه المبيعات
- قواعد التصعيد (متى يُحوَّل للإنسان)
- نص التقاط العميل

### 17.4 أنواع وثائق التدريب

| النوع | المحتوى | تكرار التحديث |
|---|---|---|
| `product` | أسماء المنتجات، الميزات، الأسعار، المواصفات | عند تحديث المنتج |
| `faq` | الأسئلة والأجوبة الشائعة | عند تحديث السؤال |
| `policy` | سياسات التوصيل، الإرجاع، الضمان | يدوي |
| `company` | قصة العلامة، مميزات البيع الفريدة | يدوي |
| `sales_guide` | منتجات موصى بها حسب الشخصية/الحاجة | يدوي |

### 17.5 تدفق التقاط العميل

عند اكتشاف الذكاء الاصطناعي لنية الشراء:
1. يطلب الذكاء الاصطناعي الاسم ورقم واتساب بشكل طبيعي في المحادثة
2. عند الالتقاط، ينشئ النظام سجل `quotation` (المصدر: `ai_chat`)
3. يُشعَر المسؤول عبر البريد الإلكتروني وشارة لوحة التحكم
4. تعرض الدردشة: "هل تريد أن نتواصل معك عبر واتساب؟"
5. عند الموافقة → رابط واتساب العميق يُفتح برسالة معبأة مسبقاً

### 17.6 التعامل مع اللغة العربية

- GPT-4o لديه دعم عربي قوي — لا حاجة لنموذج منفصل
- يُرشِد موجّه النظام الذكاء الاصطناعي للرد بالعربية إذا كتب المستخدم بالعربية
- احتياطي: إذا كانت ترويسة locale هي `ar`، إجبار الردود العربية بغض النظر عن لغة الإدخال

---

## 18. هيكل واتساب

### 18.1 استراتيجية التكامل

| القناة | الغرض |
|---|---|
| روابط واتساب العميقة | فوري: روابط `wa.me` قابلة للنقر برسائل معبأة مسبقاً |
| WhatsApp Business API | المرحلة الثانية: رسائل برمجية، قوالب، إشعارات |

### 18.2 المرحلة الأولى — روابط واتساب العميقة

كل صفحة منتج ونموذج عرض سعر تتضمن:

```
https://wa.me/{رقم_الأعمال}?text=مرحباً، أود الاستفسار عن {اسم_المنتج} ({المتغير})...
```

نص الرابط العميق معبأ مسبقاً بلغة العميل (عربي/إنجليزي).

### 18.3 المرحلة الثانية — WhatsApp Business API

**المزود:** Twilio أو 360dialog (شريك Meta Business API)

**الرسائل التلقائية:**

| المُحفِّز | القالب | المستقبل |
|---|---|---|
| عرض سعر جديد | "استلمنا طلبك للـ {منتج}" | العميل |
| عرض سعر جديد (إدارة) | "عميل جديد: {الاسم} — {المنتج}" | فريق المبيعات |
| تأكيد الطلب | "طلبك رقم {رقم} مؤكد" | العميل |
| شحن الطلب | "طلبك في الطريق — تتبع: {رابط}" | العميل |
| عميل محتمل من الذكاء الاصطناعي | "عميل من AI: {الاسم} — {الهاتف}" | فريق المبيعات |

**قوالب الرسائل:** جميع القوالب تُقدَّم لـ Meta للموافقة قبل الاستخدام.

### 18.4 إعدادات واتساب (الإدارة)

يُهيِّئ المسؤول في `/admin/whatsapp-settings`:
- رقم هاتف الأعمال
- بيانات اعتماد API
- معرفات القوالب لكل محفِّز
- رقم هاتف مندوب المبيعات الافتراضي للتوجيه
- تفعيل/تعطيل كل نوع رسالة تلقائية

---

## 19. هيكل لوحة التحكم

### 19.1 مقاييس النظرة العامة

صفحة هبوط لوحة الإدارة تُظهر:

```
┌──────────────────────────────────────────────────────────┐
│  النظرة العامة (اليوم / هذا الأسبوع / هذا الشهر)       │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ الإيرادات│ │ الطلبات  │ │  العروض  │ │ العملاء  │   │
│  │ 24k درهم │ │    18    │ │    7     │ │    23    │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  [ رسم بياني للإيرادات — خط 30 يوماً ]                 │
│                                                          │
│  [ مسار عروض الأسعار ]    [ آخر الطلبات ]              │
│  جديد:5  تواصل:3           طلب #1001 — 2400 درهم       │
│  تسعير:2  موافق:1          طلب #1002 — 870 درهم        │
│                                                          │
│  [ أفضل المنتجات ]        [ إحصاءات الذكاء الاصطناعي ] │
│  1. فرشة فاخرة 180          الجلسات: 42               │
│  2. وسادة ميموري برو         عملاء ملتقطون: 8           │
│  3. سرير أوك كينج            تحويلات: 3                │
└──────────────────────────────────────────────────────────┘
```

### 19.2 وصف الوحدات الإدارية

#### وحدة المنتجات
- قائمة المنتجات مع بحث، فلتر حسب الفئة/الحالة
- مؤشر مستوى المخزون المضمّن
- إجراءات سريعة: تعديل، تبديل التنشيط، حذف
- استيراد جماعي عبر قالب CSV
- محرر مصفوفة متغيرات المنتج
- رفع صور بالسحب والإفلات، رفع تلقائي على CDN

#### مدير الخصائص
- إنشاء/تعديل مجموعات الخصائص (اسم EN/AR، النوع، قابلية الفلتر، قابلية المقارنة)
- إدارة الخيارات لكل مجموعة (إضافة، تعديل، إعادة ترتيب، حذف)
- معاينة كيفية ظهور الخصائص على صفحة المنتج

#### مسار عروض الأسعار
- عرض Kanban حسب الحالة
- عرض تفصيلي: كل معلومات العميل، المنتج، الملاحظات، سجل النشاط
- فتح واتساب للعميل بنقرة واحدة
- توليد عرض سعر PDF بشعار الشركة
- تعيين لعضو فريق المبيعات

#### مدير الطلبات
- قائمة الطلبات مع فلاتر الحالة
- تفاصيل الطلب: المنتجات، العميل، العنوان، الدفع، الجدول الزمني
- تحديث الحالة يدوياً مع ملاحظة
- تسجيل الاسترداد

#### مدير العملاء
- ملفات تعريف العملاء مع تاريخ الطلبات والعروض الكامل
- إجمالي الإنفاق، القيمة الإجمالية للعمر
- علامات وملاحظات
- تصدير CSV

#### منشئ الصفحة الرئيسية
- قائمة الأقسام مع تبديل وسحب لإعادة الترتيب
- النقر على القسم → درج الإعدادات ينزلق
- رابط معاينة مباشرة يفتح الواجهة في نافذة جديدة

#### إعدادات الذكاء الاصطناعي
- CRUD لوثائق التدريب
- محرر موجّه النظام (EN + AR)
- زر مزامنة المتجهات
- عارض سجل المحادثات مع حالة العميل

#### المستخدمون والأدوار
- إدارة مستخدمي الإدارة
- إنشاء الأدوار مع تعيين صلاحيات دقيق
- تتبع آخر تسجيل دخول
- فرض المصادقة الثنائية لكل دور

---

## 20. هيكل SEO

### 20.1 هيكل URL

```
الإنجليزية:
/en/                               → الصفحة الرئيسية
/en/shop/                          → جميع المنتجات
/en/category/mattresses/           → صفحة الفئة
/en/product/luxury-king-mattress/  → صفحة المنتج
/en/brand/dormeo/                  → صفحة العلامة
/en/collection/cloud-sleep/        → صفحة المجموعة
/en/blog/how-to-choose-mattress/   → مقال المدونة

العربية:
/ar/                               → الصفحة الرئيسية
/ar/category/مراتب/                → فئة المراتب
/ar/product/مرتبة-فاخرة-كينج/     → صفحة المنتج
```

### 20.2 وسوم Meta — لكل نوع صفحة

| نوع الصفحة | نمط العنوان | نمط الوصف |
|---|---|---|
| الصفحة الرئيسية | `{اسم_الموقع} — مراتب فاخرة في الإمارات` | على مستوى الموقع |
| الفئة | `{اسم_الفئة} — شراء عبر الإنترنت في الإمارات` | وصف الفئة |
| المنتج | `{اسم_المنتج} — {العلامة} — {اسم_الموقع}` | الوصف المختصر للمنتج |
| العلامة | `مراتب {اسم_العلامة} — {اسم_الموقع}` | وصف العلامة |
| المدونة | `{عنوان_المقال} — مدونة {اسم_الموقع}` | مقتطف المقال |

جميع قوالب العنوان/الوصف قابلة للتهيئة من إعدادات SEO.

### 20.3 بيانات Schema.org المنظمة

| الصفحة | أنواع Schema |
|---|---|
| الصفحة الرئيسية | `Organization`، `WebSite`، `SearchAction` |
| المنتج | `Product`، `Offer`، `AggregateRating`، `Review` |
| الفئة | `BreadcrumbList`، `ItemList` |
| العلامة | `Brand`، `BreadcrumbList` |
| المدونة | `Article`، `BreadcrumbList` |
| الأسئلة الشائعة | `FAQPage` |
| الاتصال | `LocalBusiness` |

### 20.4 وسوم Canonical

- الصفحات المقسَّمة: `?page=2` → canonical يشير للصفحة الأولى
- URLs الفلاتر: canonical يشير لـ URL الفئة غير المفلترة
- الصفحات العربية/الإنجليزية: بدائل `hreflang` مُعلَنة

```html
<link rel="alternate" hreflang="en-AE" href="https://domain.com/en/product/luxury-mattress" />
<link rel="alternate" hreflang="ar-AE" href="https://domain.com/ar/product/مرتبة-فاخرة" />
<link rel="alternate" hreflang="x-default" href="https://domain.com/en/product/luxury-mattress" />
```

### 20.5 هيكل خريطة الموقع

```
/sitemap.xml → خريطة فهرس
  ├── /sitemap-homepage.xml
  ├── /sitemap-categories.xml
  ├── /sitemap-products.xml
  ├── /sitemap-brands.xml
  ├── /sitemap-collections.xml
  └── /sitemap-blog.xml
```

- تُولَّد ليلاً عبر أمر Laravel Artisan
- تُقدَّم لـ Google Search Console عبر نقطة ping
- URLs العربية والإنجليزية في نفس خريطة الموقع مع `hreflang`

### 20.6 قائمة تحقق SEO التقني

- جميع الصفحات تُعيد HTTP 200 (أو 301/404 المناسب)
- مدير إعادة التوجيه 301 في الإدارة للـ URLs القديمة
- `robots.txt` يحجب: `/admin/`، `/api/`، `/checkout/`
- `X-Robots-Tag: noindex` على الفلاتر المقسَّمة بعد الصفحة 3
- وسوم Open Graph على جميع الصفحات العامة
- وسوم Twitter Card على مقالات المدونة والمنتجات

---

## 21. هيكل الأمان

### 21.1 المصادقة والتفويض

| الطبقة | الآلية |
|---|---|
| SPA الإدارة | Laravel Sanctum (جلسة قائمة على الكوكيز) |
| API العملاء | JWT (tymon/jwt-auth)، انتهاء صلاحية 30 يوماً |
| مفاتيح API (B2B مستقبلي) | مفتاح API مُجزَّأ في جدول `api_keys` |
| تجزئة كلمة المرور | Bcrypt (Laravel الافتراضي، عامل التكلفة 12) |
| المصادقة الثنائية | TOTP (Google Authenticator) — مستخدمو الإدارة |
| نظام الأدوار | Spatie Laravel Permission — `superadmin`، `admin`، `manager`، `sales` |

### 21.2 قواعد التفويض

| المورد | صلاحية الوصول |
|---|---|
| جميع مسارات الإدارة | دور `admin` كحد أدنى |
| حذف المنتجات/الفئات | `superadmin` فقط |
| إدارة المستخدمين | `superadmin` فقط |
| تعيين عروض الأسعار | `admin`، `manager`، `sales` |
| التقارير المالية | `admin`، `superadmin` |
| إعدادات النظام | `superadmin` فقط |

### 21.3 أمان API

| الحماية | التطبيق |
|---|---|
| تحديد المعدل | 60 طلب/دقيقة (عام)، 300 طلب/دقيقة (مُصادق)، عبر Redis |
| CORS | قائمة بيضاء صارمة للنطاق — نطاق الواجهة فقط |
| CSRF | رمز CSRF على جميع طلبات تغيير الحالة |
| حقن SQL | Eloquent ORM فقط (استعلامات مُعلَّمة) |
| XSS | كل محتوى المستخدم يُعقَّم بـ `HTMLPurifier` قبل التخزين |
| التعيين الجماعي | `$fillable` مُعرَّف على جميع النماذج |
| البيانات الحساسة | PII مشفَّرة في حالة الراحة باستخدام `encrypted:` cast |

### 21.4 أمان البنية التحتية

| الطبقة | التحكم |
|---|---|
| Cloudflare WAF | مجموعة قواعد OWASP الأساسية مُفعَّلة |
| Cloudflare Bot Fight Mode | مُفعَّل |
| حماية DDoS | تخفيف تلقائي من Cloudflare |
| TLS | TLS 1.3 فقط، رأس HSTS مع preload |
| وصول SSH | مفتاح فقط، المصادقة بكلمة المرور مُعطَّلة، منفذ غير قياسي |
| جدار الحماية | UFW — المنافذ 22، 80، 443 فقط مفتوحة |
| قاعدة البيانات | غير مكشوفة للإنترنت — شبكة داخلية فقط |
| Redis | محمية بكلمة مرور، مُرتبطة بـ localhost |
| أسرار البيئة | `.env` ليست في التحكم بالإصدار |
| النسخ الاحتياطية | تفريغات MySQL يومية لـ Object Storage (مشفَّرة)، احتفاظ 30 يوماً |

### 21.5 حماية البيانات

- كلمات مرور العملاء: مُجزَّأة بـ bcrypt، لا تُخزَّن نصاً عادياً
- بيانات الدفع: لا تُخزَّن — رمزية من بوابة الدفع
- أرقام واتساب: تُعامَل كـ PII، الوصول مُسجَّل
- نشاط الإدارة: سجل تدقيق كامل عبر جدول `activity_logs`
- الامتثال GDPR/UAE PDPL: دعم طلب حذف بيانات العميل في الإدارة

---

## 22. هيكل الأداء

### 22.1 تفصيل هدف Lighthouse

| المقياس | الهدف | الاستراتيجية |
|---|---|---|
| الأداء | 90+ | ISR، تحسين الصور، تقسيم الكود |
| إمكانية الوصول | 95+ | HTML دلالي، ARIA، تباين الألوان |
| أفضل الممارسات | 95+ | HTTPS، لا محتوى مختلط |
| SEO | 100 | جميع وسوم Meta، البيانات المنظمة، canonical |

### 22.2 خط أنابيب تحسين الصور

```
تدفق الرفع:
المسؤول يرفع صورة
    → MediaService تستقبل الملف
    → intervention/image تُولِّد:
       - الأصلية (أقصى 2400px عرض)
       - كبيرة (1200px، WebP)
       - متوسطة (800px، WebP)
       - مصغَّرة (400px، WebP)
       - عنصر نائب (16px blur hash)
    → جميع الصيغ تُرفع لـ Object Storage
    → URLs CDN تُخزَّن في جدول media
    → مهمة: ProcessImageOptimization
```

**الواجهة الأمامية:**
- مكوّن `next/image` يعالج `srcset` المتجاوب
- `blurDataURL` من العنصر النائب للتحميل التدريجي
- تحميل كسول افتراضياً على بطاقات المنتج
- تحميل ذو أولوية للصور البطولية والثلاث صور الأولى للمنتج

### 22.3 تحسين استجابة API

| التقنية | التطبيق |
|---|---|
| التحميل الجشع (Eager Loading) | مُعرَّف لكل فئة Resource — لا استعلامات N+1 |
| الحقول المختارة | API Resources تُعيد الحقول اللازمة للواجهة فقط |
| التقسيم إلى صفحات | جميع نقاط النهاية افتراضياً 24 عنصراً، أقصى 96 |
| تخزين Redis المؤقت | جميع نقاط النهاية كثيفة القراءة مُخزَّنة (§9.2) |
| فهارس قاعدة البيانات | جميع أعمدة FK، الـ slug، الحالة مُفهرَسة |

### 22.4 هيكل Redis

```
استخدام Redis:
├── مخزن التخزين المؤقت (DB 0)
│   └── جميع استجابات API المُخزَّنة
├── مخزن الجلسة (DB 1)
│   └── جلسات SPA الإدارة
├── مخزن قائمة الانتظار (DB 2)
│   └── جميع قوائم المهام
└── محدد المعدل (DB 3)
    └── عدادات تقييد API
```

### 22.5 تهيئة CDN

- **المزود:** Cloudflare CDN
- **الأصول الثابتة:** JS، CSS، خطوط مُخزَّنة على الحافة — `public, max-age=31536000, immutable`
- **صور المنتجات:** تُقدَّم من Object Storage عبر URL CDN — `public, max-age=604800`
- **استجابات API:** لا تُخزَّن على CDN — كلها ديناميكية
- **استراتيجية الإلغاء:** عند تحديث المنتج، تُلغى ذاكرة CDN عبر Cloudflare API

---

## 23. هيكل تجربة المستخدم (UI/UX)

### 23.1 نظام التصميم

| العنصر | المواصفات |
|---|---|
| اللون الأساسي | كحلي غامق أو فحمي دافئ (وفق هوية العلامة التجارية) |
| لون التمييز | ذهبي دافئ أو أخضر مريمي |
| الألوان المحايدة | أبيض دافئ، رمادي فاتح |
| الطباعة (إنجليزي) | Inter أو Geist Sans — وزن 400، 500، 600، 700 |
| الطباعة (عربي) | Cairo — وزن 400، 600، 700 |
| نصف قطر الحدود | 8px (البطاقات)، 4px (الإدخال)، 999px (الشارات) |
| مقياس التباعد | TailwindCSS الافتراضي (قاعدة 4px) |
| نظام الظل | ظلال ارتفاع خفيفة — لا ظلال قاسية |
| الحركة | Framer Motion — تفاعلات مصغرة فقط |

---

### 23.2 تخطيط الصفحة الرئيسية

**تسلسل الأقسام (الترتيب الافتراضي، قابل لإعادة الترتيب):**

```
┌─────────────────────────────────────────────┐
│  HEADER: شعار | تنقل | لغة | سلة | CTA     │
├─────────────────────────────────────────────┤
│  البطل: بانر بعرض كامل                     │
│  عنوان + نص فرعي + زرا CTA                 │
│  خلفية: تصوير أسلوب الحياة                │
├─────────────────────────────────────────────┤
│  شبكة الفئات: 6 فئات                       │
│  أيقونة + اسم الفئة (AR/EN)               │
├─────────────────────────────────────────────┤
│  المنتجات المميزة                          │
│  عنوان + تمرير أفقي على الجوال            │
│  4 أعمدة سطح مكتب، 2 تابلت، 1.5 جوال      │
├─────────────────────────────────────────────┤
│  عرض المجموعات                             │
│  صورة تحريرية كبيرة + اسم المجموعة        │
│  شبكة عمودين                              │
├─────────────────────────────────────────────┤
│  الأكثر مبيعاً                            │
│  نفس شبكة المميزة                         │
├─────────────────────────────────────────────┤
│  شعارات العلامات: شريط أفقي              │
├─────────────────────────────────────────────┤
│  شارات الثقة: ضمان / توصيل / إرجاع       │
├─────────────────────────────────────────────┤
│  تقييمات العملاء                          │
│  تجميع التقييم + كاروسيل التقييمات        │
├─────────────────────────────────────────────┤
│  أكورديون الأسئلة الشائعة                 │
├─────────────────────────────────────────────┤
│  بانر CTA: "احصل على عرض سعر مخصص"        │
├─────────────────────────────────────────────┤
│  FOOTER: روابط كاملة + اتصال + تواصل اجتماعي│
└─────────────────────────────────────────────┘
```

---

### 23.3 تخطيط صفحة المتجر / الفئة

```
┌─────────────────────────────────────────────┐
│  مسار التنقل: الرئيسية > المراتب           │
│  رأس الفئة: الاسم + الوصف                 │
├────────────┬────────────────────────────────┤
│  الفلاتر   │  شبكة المنتجات                │
│  (شريط جانبي)│                             │
│            │  الترتيب: [الأكثر شيوعاً ▼]   │
│  نطاق السعر│  24 منتج موجود               │
│  ─────     │                               │
│  العلامة  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│  ─────     │  │ م1 │ │ م2 │ │ م3 │ │ م4 │  │
│  الصلابة  │  └────┘ └────┘ └────┘ └────┘  │
│  ─────     │                               │
│  الحجم    │  [ تحميل المزيد ] / تقسيم     │
│  ─────     │                               │
│  المادة   │                               │
│  ─────     │                               │
│  اللون    │                               │
└────────────┴────────────────────────────────┘

الجوال: الفلاتر كدرج سفلي
```

---

### 23.4 تخطيط صفحة تفاصيل المنتج

```
┌─────────────────────────────────────────────┐
│  مسار التنقل                               │
├───────────────────┬─────────────────────────┤
│  معرض الصور      │  معلومات المنتج          │
│                   │                         │
│  الصورة الرئيسية │  اسم العلامة (رابط)     │
│  [كبيرة]          │  اسم المنتج H1          │
│                   │  الوصف المختصر          │
│  صف المصغَّرات   │  ─────────────────────  │
│                   │  التقييم: ★★★★☆ (42)    │
│                   │  ─────────────────────  │
│                   │  محددات المتغيرات:      │
│                   │  الحجم: [90] [120] [180]│
│                   │  الصلابة: ○ن ●م ○ص     │
│                   │  ─────────────────────  │
│                   │  السعر: 1,850 درهم      │
│                   │  ~~2,200 درهم~~ (تخفيض)│
│                   │  ─────────────────────  │
│                   │  [ أضف للسلة ]          │
│                   │  [ طلب عرض سعر ]        │
│                   │  [ استفسار واتساب ]     │
│                   │  ─────────────────────  │
│                   │  ✓ توصيل مجاني > 500   │
│                   │  ✓ ضمان 10 سنوات       │
│                   │  ✓ إرجاع 30 يوماً      │
├───────────────────┴─────────────────────────┤
│  تبويبات: الوصف | المواصفات | التقييمات    │
├─────────────────────────────────────────────┤
│  جدول خصائص المنتج                         │
│  المادة: رغوة ذاكرة + ربيع الجيب          │
│  الارتفاع: 30سم                            │
│  الشهادات: CertiPUR-US                     │
├─────────────────────────────────────────────┤
│  تقييمات العملاء                           │
│  التجميع + بطاقات التقييمات الفردية        │
│  نموذج كتابة تقييم                        │
├─────────────────────────────────────────────┤
│  منتجات ذات صلة (نفس الفئة/المجموعة)      │
└─────────────────────────────────────────────┘
```

---

### 23.5 تخطيط السلة

```
┌──────────────────────────────────────┐
│  درج السلة (ينزلق من اليسار في AR)  │
│  ────────────────────────────────    │
│  [صورة] اسم المنتج                  │
│  المتغير: 180x200 / متوسط           │
│  الكمية: [−] 1 [+]    1,850 درهم   │
│  [إزالة]                            │
│  ────────────────────────────────    │
│  المجموع الفرعي: 1,850 درهم         │
│  التوصيل: مجاني                     │
│  ────────────────────────────────    │
│  الإجمالي: 1,850 درهم               │
│  [ المتابعة للدفع ]                  │
│  [ طلب عرض سعر بدلاً من ذلك ]       │
└──────────────────────────────────────┘
```

---

### 23.6 تخطيط الدفع

```
الخطوة 1: بيانات التواصل
الخطوة 2: عنوان التوصيل (محدد الإمارة)
الخطوة 3: طريقة التوصيل
الخطوة 4: طريقة الدفع
الخطوة 5: ملخص الطلب + التأكيد
```

- صفحة واحدة أو خطوات — قابل للتهيئة
- دعم الدفع كضيف
- التحقق من صحة رقم الهاتف الإماراتي
- قائمة منسدلة للإمارات (أبوظبي، دبي، الشارقة...)

---

### 23.7 تخطيط صفحة عرض السعر

```
┌─────────────────────────────────────────────┐
│  طلب عرض سعر                               │
│  لـ: {اسم المنتج + المتغير} (قابل للتعديل)│
│                                             │
│  الاسم الأول*      اسم العائلة*            │
│  البريد الإلكتروني* الهاتف*               │
│  واتساب            الشركة                  │
│  الدولة            المدينة/الإمارة          │
│  الكمية                                    │
│  ملاحظات (مساحة نص)                        │
│                                             │
│  [ إرسال الطلب ]                           │
│                                             │
│  "نرد خلال ساعتين على واتساب"              │
└─────────────────────────────────────────────┘
```

---

### 23.8 هيكل الرأس (Header)

```
سطح المكتب (RTL للعربية):
[سلة(3)] [🔍] [AR|EN] [النوم والأكسسوارات] [الأثاث] [الأسرة] [المراتب] [الشعار]

الجوال:
[سلة(3)] [🔍] [الشعار] [قائمة ≡]

قائمة الجوال (درج):
- روابط الفئات
- دليل العلامات
- المجموعات
- اتصل بنا / واتساب
- تبديل اللغة
```

---

### 23.9 هيكل التذييل (Footer)

```
العمود 1: الشعار + شعار النص + أيقونات التواصل
العمود 2: المنتجات (روابط الفئات)
العمود 3: معلومات (من نحن، مدونة، أسئلة شائعة، اتصال)
العمود 4: خدمة العملاء (توصيل، إرجاع، ضمان)

الشريط السفلي:
أيقونات الدفع | © 2026 مودرن ماترسز | الخصوصية | الشروط
```

---

## 24. مراحل التطوير

### المرحلة الأولى — الأساس (الأسابيع 1–4)

**الخلفية:**
- إعداد مشروع Laravel، تهيئة البيئة
- هجرات قاعدة البيانات لجميع الجداول الأساسية
- نظام المصادقة (Sanctum + JWT)
- إعداد نظام الأدوار والصلاحيات
- النماذج الأساسية مع العلاقات والنطاقات
- هيكل API Resource الأساسي
- خدمة رفع الوسائط + تكامل Object Storage
- تهيئة قوائم الانتظار وـ Redis

**الواجهة الأمامية:**
- إعداد مشروع Next.js مع TypeScript، TailwindCSS، Shadcn UI
- إعداد i18n (next-intl)، توجيه AR/EN
- نظام تخطيط RTL/LTR
- نظام التصميم الأساسي (طباعة، ألوان، تباعد)
- إعداد عميل API (Axios + React Query)
- إعداد إدارة الحالة (Zustand)
- مكونات الرأس والتذييل والتنقل

**المُسلَّم:** هيكل منصة مُهيَّأ بالكامل، جميع متغيرات البيئة موثَّقة

---

### المرحلة الثانية — محرك المنتجات (الأسابيع 5–8)

**الخلفية:**
- API CRUD للمنتجات (بسيطة ومتغيرة)
- API CRUD للفئات/العلامات/المجموعات
- محرك الخصائص — API المجموعات والخيارات
- محرك المتغيرات — منشئ المصفوفة، CRUD المتغيرات
- ربط خصائص المنتج
- إدارة الصور مع CDN
- APIs إدارة المنتجات الكاملة
- تخزين Redis المؤقت لنقاط نهاية المنتجات

**الواجهة الأمامية:**
- مكوّن بطاقة المنتج
- شبكة المنتجات مع التقسيم
- صفحة تفاصيل المنتج
- محدد المتغيرات (مدفوع بالخصائص)
- معرض الصور مع التكبير
- صفحات الفئات والعلامات
- حالات تحميل الهيكل (Skeleton)

**المُسلَّم:** كتالوج منتجات يعمل بالكامل

---

### المرحلة الثالثة — الفلاتر والبحث والتجارة (الأسابيع 9–12)

**الخلفية:**
- محرك الفلاتر الديناميكي
- نقطة نهاية البحث النصي الكامل
- خدمة السلة (سلة جلسة مبنية على Redis)
- تدفق الدفع (ضيف + مُصادق)
- تكامل بوابة الدفع (Telr/Stripe)
- إنشاء وإدارة الطلبات
- محرك عروض الأسعار (إرسال النموذج → مسار الإدارة)
- إشعارات البريد الإلكتروني للطلبات/العروض
- توليد PDF لعرض السعر

**الواجهة الأمامية:**
- الشريط الجانبي للفلاتر + الدرج السفلي للجوال
- رقائق الفلاتر النشطة
- قائمة منسدلة للترتيب
- صفحة البحث مع الإكمال التلقائي
- درج السلة
- تدفق الدفع (متعدد الخطوات)
- نموذج عرض السعر
- صفحة تأكيد الطلب
- الحساب: صفحات الطلبات والعروض

**المُسلَّم:** تدفق تجاري كامل من التصفح للفلترة للبحث للسلة للدفع للطلب

---

### المرحلة الرابعة — لوحة الإدارة (الأسابيع 13–16)

**الخلفية:**
- API إدارة كامل لجميع الوحدات
- استعلامات تجميع الإحصاءات
- API منشئ الصفحة الرئيسية
- APIs CMS (صفحات، مدونة، أسئلة شائعة)
- APIs إدارة SEO
- APIs إدارة المستخدمين والأدوار
- تسجيل النشاطات

**الواجهة الأمامية (SPA الإدارة):**
- تخطيط الإدارة مع التنقل الجانبي
- صفحة نظرة عامة على لوحة التحكم
- مدير المنتجات (CRUD، رفع صور، مصفوفة المتغيرات)
- مديرو الفئات/العلامات/المجموعات
- مدير مجموعات وخيارات الخصائص
- مدير الطلبات مع تحديثات الحالة
- مسار عروض الأسعار (Kanban)
- مدير العملاء
- منشئ الصفحة الرئيسية (سحب/إفلات)
- محررات CMS (صفحات، مدونة، أسئلة شائعة)
- مدير المستخدمين والأدوار
- إعدادات النظام

**المُسلَّم:** لوحة إدارة تعمل بالكامل — الأعمال تُدير الكتالوج والطلبات والعملاء المحتملين والمحتوى باستقلالية

---

### المرحلة الخامسة — SEO والأداء والذكاء الاصطناعي (الأسابيع 17–20)

**الخلفية:**
- توليد البيانات المنظمة لكل نوع صفحة
- أمر وتوليد خريطة الموقع
- APIs إدارة حقول SEO
- خدمة دردشة الذكاء الاصطناعي (تكامل OpenAI)
- مدير وثائق التدريب
- تخزين المحادثات واستخراج العملاء المحتملين
- تهيئة روابط واتساب العميقة
- مراجعة وضبط تحديد المعدل
- مراجعة وتحسين التخزين المؤقت

**الواجهة الأمامية:**
- تطبيق وسوم Meta الكامل لكل نوع صفحة
- حقن JSON-LD للبيانات المنظمة
- وسوم hreflang البديلة
- وسوم Open Graph
- أداة الدردشة بالذكاء الاصطناعي (عائمة، قابلة للطي)
- زر واتساب العائم
- مراجعة وتحسين Lighthouse
- مراجعة تحسين تحميل الصور

**المُسلَّم:** منصة جاهزة لـ SEO بنتائج Lighthouse 90+، روبوت دردشة ذكاء اصطناعي يعمل

---

### المرحلة السادسة — ضمان الجودة والأمان والإطلاق (الأسابيع 21–24)

- مراجعة أمان كاملة (قائمة تحقق OWASP)
- اختبار الاختراق على نقاط نهاية API
- اختبار الحمل (k6 أو Artillery — هدف 500 مستخدم متزامن)
- اختبار المتصفحات والأجهزة المتقاطع
- ضمان جودة المحتوى العربي (مراجعة تخطيط RTL، مراجعة الترجمة)
- مراجعة إمكانية الوصول (WCAG 2.1 AA)
- اختبارات دخان بيئة التدريج
- إعداد البنية التحتية للإنتاج (Nginx، PHP-FPM، Supervisor، Redis)
- تهيئة Cloudflare (WAF، CDN، DNS)
- تهيئة SSL
- التحقق من نظام النسخ الاحتياطي
- إعداد المراقبة (UptimeRobot + Laravel Telescope + تتبع الأخطاء)
- إطلاق ناعم (حركة مرور محدودة)
- الإطلاق الكامل

---

## 25. نطاق النسخة الأولى (MVP)

### 25.1 ما يشمله MVP (يجب توفره عند الإطلاق)

| الوحدة | النطاق |
|---|---|
| كتالوج المنتجات | كامل — جميع الفئات، الخصائص، المتغيرات |
| صفحات الفئات | كاملة مع الفلاتر |
| صفحات العلامات | كاملة |
| صفحات المجموعات | كاملة |
| صفحة تفاصيل المنتج | كاملة |
| السلة | كاملة |
| الدفع | ضيف + حساب، توصيل الإمارات |
| الدفع | بوابة واحدة كحد أدنى (Telr أو Stripe) |
| نظام عروض الأسعار | كامل — نموذج، مسار إدارة، رابط واتساب |
| لوحة الإدارة | كاملة — منتجات، طلبات، عروض، عملاء |
| CMS | صفحات + أسئلة شائعة (المدونة اختيارية لـ MVP) |
| منشئ الصفحة الرئيسية | كامل |
| عربي + إنجليزي | ثنائي اللغة الكامل |
| تخطيط RTL | كامل |
| SEO | وسوم Meta، بيانات منظمة، خريطة الموقع |
| روبوت الذكاء الاصطناعي | نسخة أساسية — أسئلة شائعة + توصية منتجات + التقاط عميل |
| روابط واتساب العميقة | كاملة |
| إدارة الوسائط | كاملة |
| حسابات المستخدمين | تسجيل، تسجيل دخول، عرض الطلبات |
| الأداء | هدف Lighthouse 90+ |
| الأمان | هيكل الأمان الكامل |

---

### 25.2 ما لا يشمله MVP (خارطة الطريق بعد الإطلاق)

| الميزة | سبب التأجيل |
|---|---|
| WhatsApp Business API | يتطلب التحقق التجاري من Meta (4-6 أسابيع) |
| الذكاء الاصطناعي المتقدم RAG | يتطلب جمع بيانات التدريب بعد الإطلاق |
| محتوى المدونة/التحريري | تأثير منخفض على الإيرادات في MVP |
| مقارنة المنتجات | جيد التوفر — المرحلة الثانية |
| قائمة الأمنيات | جيد التوفر — المرحلة الثانية |
| برنامج الولاء | المرحلة الثانية |
| بوابة عملاء B2B | المرحلة الثانية |
| متعدد البائعين | المحور الثاني |
| تطبيق الجوال | المحور الثاني |
| استرداد السلة المهجورة | المرحلة الثانية |
| نظام الكوبونات/الخصومات | المرحلة الثانية |

---

## 26. خارطة طريق التوسع المستقبلي

### المحور الثاني-أ — نمو المنصة (الأشهر 7–12)

| الميزة | الوصف |
|---|---|
| WhatsApp Business API | رسائل تلقائية كاملة، بث القوالب |
| الذكاء الاصطناعي المتقدم | RAG مع تضمينات المنتجات، البحث في الطلبات، مطالبات الضمان |
| مقارنة المنتجات | جدول مقارنة كامل عبر الخصائص |
| قائمة الأمنيات | حفظ المنتجات، مشاركة قوائم الأمنيات |
| مكافآت الولاء | نظام نقاط لكل عملية شراء |
| نظام الكوبونات | نسبة مئوية، ثابت، شحن مجاني، طلب أول |
| استرداد السلة المهجورة | تذكيرات عبر البريد وواتساب |
| تحسين التقييمات | تقييمات بالصور، شارة الشراء المُتحقَّق |
| تصعيد الدردشة المباشرة | تحويل AI → إنسان عبر أداة دردشة حية |
| بوابة B2B | طبقات تسعير مخصصة، لوحة طلبات جماعية |
| متعدد العملات | USD، SAR، KWD إلى جانب AED |
| تحليلات متقدمة | تحليل القمع، تكامل خرائط الحرارة |
| مدونة ومحتوى | مدونة تحريرية كاملة لمحتوى SEO للنوم |

---

### المحور الثاني-ب — متعدد العلامات (الأشهر 12–18)

| الميزة | الوصف |
|---|---|
| تفعيل نظام المستأجرين | دعم متعدد العلامات الكامل تحت نفس المنصة |
| بوابات العلامات | كل علامة تُدير كتالوجها عبر إدارة ذات نطاق |
| الصفحة الرئيسية المتقاطعة | صفحة رئيسية على مستوى المنصة تعرض علامات متعددة |
| نطاقات خاصة بالعلامة | كل علامة يمكنها امتلاك نطاق فرعي خاص |
| بحث موحد | بحث عبر جميع العلامات |
| تحليلات العلامة | كل علامة ترى بياناتها فقط |
| تتبع العمولات | رسوم المنصة لكل علامة |

---

### المحور الثاني-ج — سوق متعدد البائعين (الأشهر 18–30)

| الميزة | الوصف |
|---|---|
| تسجيل البائعين | إعداد ذاتي للبائعين مع سير عمل الموافقة |
| بوابة البائع | إدارة كتالوج كاملة، إدارة الطلبات، المدفوعات |
| محرك العمولات | نسبة % قابلة للتهيئة لكل فئة/بائع |
| نظام المدفوعات | تقارير مدفوعات البائع التلقائية |
| تدقيق المنتجات | موافقة المسؤول على منتجات البائعين الجدد |
| تقييمات البائعين | نظام تقييم بائع منفصل |
| إدارة النزاعات | سير عمل نزاع الطلب |
| تحليلات البائع | لوحات الإيرادات، معدلات التحويل والإرجاع |

---

### المحور الثالث — الجوال والنظام البيئي (الأشهر 24+)

| الميزة | الوصف |
|---|---|
| تطبيق React Native | تطبيق iOS + Android يستخدم نفس API |
| الإشعارات الفورية | تحديثات الطلبات، العروض، العودة للمخزون |
| الواقع المعزز | وضع الأسرة/الأثاث افتراضياً في الغرفة |
| تخصيص الذكاء الاصطناعي | توصيات منتجات مخصصة لكل جلسة |
| اختبار النوم | أداة تفاعلية لتوصية المنتجات |
| خدمة الاشتراك | استبدال منتظم للوسائد/المفارش |
| سوق API | API مفتوح لتكاملات الشركاء |
| التوسع الإقليمي | متاجر المملكة العربية السعودية والكويت وقطر |

---

## الملحق أ — إصدارات التقنيات

| التقنية | الإصدار |
|---|---|
| PHP | 8.4.x |
| Laravel | 12.x |
| MySQL | 8.0.x |
| Redis | 7.x |
| Node.js | 22 LTS |
| React | 18.x |
| Next.js | 15.x |
| TypeScript | 5.x |
| TailwindCSS | v4.x |
| Shadcn UI | الأحدث |

---

## الملحق ب — مواصفات البنية التحتية

| المكوّن | المواصفات |
|---|---|
| VPS (الأساسي) | 8 vCPU، 16GB RAM، 200GB NVMe SSD |
| VPS (التدريج) | 4 vCPU، 8GB RAM |
| نظام التشغيل | Ubuntu 24.04 LTS |
| خادم الويب | Nginx 1.26 |
| مدير عمليات PHP | PHP-FPM |
| SSL | Let's Encrypt عبر Cloudflare |
| Object Storage | Cloudflare R2 أو DigitalOcean Spaces |
| CDN | Cloudflare |
| تسليم البريد الإلكتروني | Resend أو Mailgun |
| إدارة العمليات | Supervisor (عمال قوائم الانتظار، المُجدوِل) |
| المراقبة | UptimeRobot + Laravel Pulse |
| إدارة السجلات | Laravel Telescope (التدريج/التطوير)، Sentry (أخطاء الإنتاج) |

---

## الملحق ج — اصطلاحات التسمية

| العنصر | الاصطلاح | المثال |
|---|---|---|
| فئات PHP | PascalCase | `ProductVariationService` |
| طرق PHP | camelCase | `getActiveProducts()` |
| جداول قاعدة البيانات | snake_case جمع | `product_variations` |
| أعمدة قاعدة البيانات | snake_case | `base_price`، `slug_ar` |
| مسارات API | kebab-case | `/api/v1/product-variations` |
| مكونات React | PascalCase | `VariationSelector.tsx` |
| Hooks | camelCase بـ `use` | `useVariationPrice` |
| مخازن Zustand | camelCase + `Store` | `cartStore` |
| فروع Git | `feature/`، `fix/`، `hotfix/` | `feature/variation-engine` |
| متغيرات البيئة | SCREAMING_SNAKE_CASE | `REDIS_HOST`، `OPENAI_API_KEY` |

---

## الملحق د — تعريف "مكتمل" (Definition of Done)

الميزة تُعتبَر **مكتملة** عندما:

- [ ] نقطة نهاية API تُعيد البيانات الصحيحة مع رموز HTTP الصحيحة
- [ ] نقطة نهاية API مُغطَّاة باختبار Feature (Laravel)
- [ ] جميع استعلامات قاعدة البيانات تستخدم الفهارس (مُتحقَّق عبر EXPLAIN)
- [ ] لا استعلامات N+1 (مُتحقَّق عبر Laravel Debugbar)
- [ ] تخزين Redis المؤقت مُطبَّق ومُختبَر
- [ ] مكوّن React يُعرض بالإنجليزية (LTR) والعربية (RTL)
- [ ] متجاوب مع الجوال (مُختبَر على 375px، 768px، 1280px)
- [ ] نتيجة Lighthouse لا تنخفض عن 90 بعد التطبيق
- [ ] لا أخطاء TypeScript (`tsc --noEmit` يُعطي نتيجة ناجحة)
- [ ] لا SQL خام، لا إدخال مستخدم غير مُهرَّب، لا أسرار مكشوفة
- [ ] الميزات الإدارية محمية بصلاحيات الأدوار
- [ ] مُراجَعة ومُعتمَدة من كبير المهندسين المعماريين

---

*إصدار الوثيقة: 1.0*
*أُعدَّت لـ: فريق هندسة منصة مودرن ماترسز*
*تاريخ المراجعة القادم: قبل بدء المرحلة الثانية*
*المالك: المدير التقني (CTO) / كبير المهندسين المعماريين*
