import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { categories as mockCategories, products as mockProducts, brands as mockBrands, reviews as mockReviews } from '../data/mockData';
import type { Product } from '../data/mockData';
import { api } from '../lib/api';
import type { HomeSection } from '../lib/api';
import { AttributeBadge } from '../components/AttributeBadge';
import { Ticker } from '../components/Ticker';
import { Star, ChevronDown, Award, ArrowRight, ArrowLeft } from 'lucide-react';

export const Home: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // API Data States
  
  const [homeLayout, setHomeLayout] = useState<HomeSection[]>([]);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [categoriesList, setCategoriesList] = useState<any[]>(mockCategories);
  const [customFilters, setCustomFilters] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [brandsList, setBrandsList] = useState<any[]>(mockBrands);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  // Hero Search states
  const [heroCategory, setHeroCategory] = useState('all');
  const [heroFirmness, setHeroFirmness] = useState('all');
  const [heroCustomOptions, setHeroCustomOptions] = useState<Record<number, string>>({});
  const [heroSearch, setHeroSearch] = useState('');

  // Hero Slider State
  const heroImages = [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1600&auto=format&fit=crop'
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Flash Sale Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endStr = localStorage.getItem('mm_flash_sale_end');
    const endTime = endStr ? new Date(endStr).getTime() : new Date().getTime() + 8 * 3600 * 1000;
    if (!endStr) {
      localStorage.setItem('mm_flash_sale_end', new Date(endTime).toISOString());
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor(distance / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Load products, categories and filters from backend or fallback on mount
  useEffect(() => {
    let active = true;
        api.getHomeLayout().then(res => {
      if (active) {
        setHomeLayout(res);
        setIsLoadingLayout(false);
      }
    });
    api.getCategories().then(res => {
      if (active) setCategoriesList(res);
    });
    api.getProducts().then(res => {
      if (active) setProductsList(res);
    });
    api.getFilters().then(res => {
      if (active) setCustomFilters(res);
    });
    api.getBanners().then(res => {
      if (active) setBanners(res);
    });
    api.getBrands().then(res => {
      if (active) setBrandsList(res);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (heroCategory !== 'all') params.set('category', heroCategory);
    if (heroFirmness !== 'all') params.set('firmness', heroFirmness);
    if (heroSearch.trim()) params.set('search', heroSearch.trim());
    
    const optionIds = Object.values(heroCustomOptions).filter(val => val !== 'all');
    if (optionIds.length > 0) {
      params.set('filters', optionIds.join(','));
    }
    
    navigate(`/shop?${params.toString()}`);
  };

  // Mock FAQs
  const faqs = [
    {
      q: {
        en: 'Do you offer a trial period for mattresses?',
        ar: 'هل تقدمون فترة تجريبية للمراتب؟'
      },
      a: {
        en: 'Yes, we offer a 100-night risk-free trial on all our mattresses. If you are not completely satisfied, you can exchange it or get a full refund.',
        ar: 'نعم، نحن نقدم تجربة نوم خالية من المخاطر لمدة 100 ليلة على جميع مراتبنا. إذا لم تكن راضياً تماماً، يمكنك استبدالها أو استرداد كامل المبلغ.'
      }
    },
    {
      q: {
        en: 'How long does delivery take within the UAE?',
        ar: 'كم يستغرق التوصيل داخل دولة الإمارات؟'
      },
      a: {
        en: 'We offer free delivery and professional installation across all Emirates. Deliveries to Dubai, Sharjah, and Abu Dhabi usually take 24-48 hours. Other Emirates take 2-3 working days.',
        ar: 'نوفر التوصيل والتركيب الاحترافي مجاناً لجميع الإمارات. التوصيل إلى دبي، الشارقة، وأبوظبي يستغرق عادةً 24-48 ساعة، وباقي الإمارات من 2 إلى 3 أيام عمل.'
      }
    },
    {
      q: {
        en: 'What warranty is included with the mattresses?',
        ar: 'ما هي فترة الضمان المشمولة مع المراتب؟'
      },
      a: {
        en: 'Our premium mattresses come with an extensive 10 to 15-year warranty covering manufacturing defects, sagging, or spring damage.',
        ar: 'تأتي مراتبنا الفاخرة بضمان شامل يمتد من 10 إلى 15 سنة يغطي العيوب المصنعية، أو هبوط المرتبة، أو تلف النوابض.'
      }
    },
    {
      q: {
        en: 'Do you offer custom mattress sizes?',
        ar: 'هل تتوفر لديكم مقاسات مراتب مخصصة؟'
      },
      a: {
        en: 'Yes! We can manufacture custom mattress dimensions to fit any imported bed frames or custom luxury suites. Please submit a request on our B2B Quotes page or contact us on WhatsApp.',
        ar: 'نعم! يمكننا تصنيع مقاسات مراتب مخصصة لتناسب أي إطار سرير مستورد أو غرف نوم مخصصة. يرجى تقديم طلب في صفحة عروض أسعار B2B أو التواصل معنا عبر واتساب.'
      }
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };


  // Extract Sections
  const renderHero = () => (
    <section className="relative min-h-[95vh] lg:h-[85vh] bg-dark flex items-center overflow-hidden py-12 lg:py-0 w-full">
      {/* Luxury Mattress Background Overlay - Slider with Ken Burns */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img 
              src={img} 
              alt="Luxury Sleep" 
              className={`w-full h-full object-cover opacity-30 object-center mix-blend-screen ${idx === currentHeroIndex ? (idx % 2 === 0 ? 'animate-zoomin' : 'animate-zoomout') : ''}`}
            />
          </div>
        ))}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/45 rounded-full px-4 py-1.5 backdrop-blur-sm text-gold text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed max-w-xl">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/shop" 
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-premium text-sm flex items-center gap-2"
              >
                <span>{t('hero.cta.shop')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
              <Link 
                to="/quotation" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 px-8 rounded-xl backdrop-blur-sm transition-premium text-sm flex items-center gap-2"
              >
                <span>{t('hero.cta.quote')}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Glassmorphic Dynamic Search Widget */}
          <div className="lg:col-span-5 w-full">
            <form 
              onSubmit={handleHeroSearch}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  {language === 'ar' ? 'اعثر على مرتبتك المثالية' : 'Find Your Perfect Bed'}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {language === 'ar' ? 'اختر فلاتر النوم المفضلة لديك وابحث فوراً' : 'Select comfort preferences & search our luxury catalog'}
                </p>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
                    {t('shop.filter.category')}
                  </label>
                  <div className="relative">
                    <select
                      value={heroCategory}
                      onChange={(e) => setHeroCategory(e.target.value)}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 appearance-none font-semibold cursor-pointer"
                    >
                      <option value="all" className="bg-dark text-white">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
                      {categoriesList.map((cat: any) => (
                        <option key={cat.id} value={cat.slug} className="bg-dark text-white">
                          {language === 'ar' ? cat.name_ar : cat.name_en}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none`} />
                  </div>
                </div>

                {/* Firmness select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
                    {t('shop.filter.firmness')}
                  </label>
                  <div className="relative">
                    <select
                      value={heroFirmness}
                      onChange={(e) => setHeroFirmness(e.target.value)}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 appearance-none font-semibold cursor-pointer"
                    >
                      <option value="all" className="bg-dark text-white">{language === 'ar' ? 'جميع الصلابات' : 'All Firmness'}</option>
                      <option value="soft" className="bg-dark text-white">{t('product.firmness.soft')}</option>
                      <option value="medium" className="bg-dark text-white">{t('product.firmness.medium')}</option>
                      <option value="firm" className="bg-dark text-white">{t('product.firmness.firm')}</option>
                    </select>
                    <ChevronDown className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none`} />
                  </div>
                </div>

                {/* Render Custom dynamic filters */}
                {customFilters.slice(0, 2).map((group: any) => (
                  <div key={group.id} className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest truncate block">
                      {language === 'ar' ? group.name_ar : group.name_en}
                    </label>
                    <div className="relative">
                      <select
                        value={heroCustomOptions[group.id] || 'all'}
                        onChange={(e) => setHeroCustomOptions({
                          ...heroCustomOptions,
                          [group.id]: e.target.value
                        })}
                        className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 appearance-none font-semibold cursor-pointer"
                      >
                        <option value="all" className="bg-dark text-white">{language === 'ar' ? 'الكل' : 'All'}</option>
                        {group.options.map((opt: any) => (
                          <option key={opt.id} value={opt.id} className="bg-dark text-white">
                            {language === 'ar' ? opt.value_ar : opt.value_en}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Text search keyword */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
                  {language === 'ar' ? 'كلمة البحث المفتاحية' : 'Search Keyword'}
                </label>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder={t('nav.search')}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 font-semibold"
                />
              </div>

              {/* Search submit button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-premium flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'بحث وتصفح المنتجات' : 'Search Catalog'}</span>
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );

  const renderBrands = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-sm font-extrabold text-dark tracking-widest uppercase">
            {language === 'ar' ? 'تسوق حسب الماركة' : 'SHOP BY BRAND'}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full" />
          <div className="w-8 h-0.5 bg-gold/50 mx-auto rounded-full mt-1" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8">
          {brandsList.map((brand) => (
            <Link 
              key={brand.id}
              to={`/shop?brand=${brand.id}`} 
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-premium flex flex-col items-center justify-center w-28 sm:w-36 h-28 sm:h-36 gap-3 group"
            >
              <div className="flex-1 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="max-h-12 max-w-full object-contain" />
                ) : (
                  <span className="font-black text-xl text-center text-dark/80 group-hover:text-primary transition-colors tracking-tight">
                    {brand.name}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-gold transition-colors truncate w-full text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );

  const renderCategories = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-wide">{t('home.categories.title')}</h2>
          <p className="text-sm text-gray-500 font-medium">{t('home.categories.subtitle')}</p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 pb-4 justify-start xl:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categoriesList.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center gap-3 shrink-0 snap-start w-28 sm:w-36">
              <Link 
                to={`/shop?category=${cat.id}`} 
                className="group relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-card hover:shadow-xl transition-premium block"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name[language]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-500"
                />
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-dark/0 transition-colors" />
              </Link>
              <h3 className="font-bold text-sm sm:text-base text-dark text-center group-hover:text-primary transition-colors">
                {cat.name[language]}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPromo1 = () => (
    localStorage.getItem('mm_flash_sale_active') !== 'false' ? (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <section className="bg-primary text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex items-center gap-4 z-10 w-full md:w-auto">
            <div className="bg-white/20 p-4 rounded-2xl shrink-0">
              <span className="text-2xl sm:text-3xl">⚡</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-wide mb-1">
                {language === 'ar' ? 'عرض الفلاش' : 'FLASH SALE'}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm">
                {language === 'ar' ? 'عرض لفترة محدودة — لا تفوت الفرصة!' : 'Limited time offer — don\'t miss out!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 z-10 w-full md:w-auto justify-center" dir="ltr">
            <div className="bg-white text-primary flex flex-col items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-2xl font-bold shadow-lg">
              <span className="text-xl sm:text-3xl leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] sm:text-xs uppercase mt-1 opacity-70">HRS</span>
            </div>
            <span className="text-xl sm:text-3xl font-bold animate-pulse">:</span>
            <div className="bg-white text-primary flex flex-col items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-2xl font-bold shadow-lg">
              <span className="text-xl sm:text-3xl leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] sm:text-xs uppercase mt-1 opacity-70">MIN</span>
            </div>
            <span className="text-xl sm:text-3xl font-bold animate-pulse">:</span>
            <div className="bg-white text-primary flex flex-col items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-2xl font-bold shadow-lg">
              <span className="text-xl sm:text-3xl leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] sm:text-xs uppercase mt-1 opacity-70">SEC</span>
            </div>
          </div>

          <Link to="/shop" className="bg-gold hover:bg-yellow-500 text-dark font-extrabold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl transition-premium z-10 shadow-lg text-xs sm:text-sm whitespace-nowrap w-full md:w-auto text-center">
            {language === 'ar' ? 'تسوق العرض الآن' : 'Shop Now'}
          </Link>
        </section>
      </div>
    ) : null
  );

  const renderGridBanners = () => (
    banners.length >= 2 ? (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Link to={banners[0].link || '/shop'} className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-premium block aspect-[2/1] sm:aspect-[21/9]">
            <img src={banners[0].image_url} alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <h3 className="text-white text-xl sm:text-3xl font-extrabold mb-2">{language === 'ar' ? banners[0].title_ar : banners[0].title_en}</h3>
            </div>
          </Link>
          <Link to={banners[1].link || '/shop'} className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-premium block aspect-[2/1] sm:aspect-[21/9]">
            <img src={banners[1].image_url} alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <h3 className="text-white text-xl sm:text-3xl font-extrabold mb-2">{language === 'ar' ? banners[1].title_ar : banners[1].title_en}</h3>
            </div>
          </Link>
        </section>
      </div>
    ) : null
  );

  const renderBestSellers = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-wide">{t('home.best.title')}</h2>
          <p className="text-sm text-gray-500 font-medium">{t('home.best.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
          {/* Side Banner */}
          <div className="lg:col-span-1 relative rounded-3xl overflow-hidden shadow-card group hidden lg:block h-full">
            <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop" alt="Side Promo" className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-gold font-bold tracking-widest text-xs uppercase mb-2">New Arrival</span>
              <h3 className="text-3xl font-extrabold leading-tight mb-4">Ultimate<br/>Comfort</h3>
              <Link to="/shop" className="bg-primary hover:bg-primary-dark text-center py-3 rounded-xl font-bold transition-premium text-sm">
                {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
              </Link>
            </div>
          </div>

          {/* Products Carousel */}
          <div className="lg:col-span-3 flex overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0">
            {productsList.filter(p => p.isBestSeller).concat(productsList).slice(0, 8).map((prod, index) => {
              const selectedVarId = selectedVariations[prod.id] || prod.variations?.[0]?.id;
              const currentVar = prod.variations?.find(v => v.id === selectedVarId) || prod.variations?.[0];
              const currentPrice = currentVar ? (currentVar.salePrice || currentVar.price) : (prod.salePrice || prod.basePrice);
              const currentBasePrice = currentVar ? currentVar.price : prod.basePrice;
              const hasSale = currentVar ? !!currentVar.salePrice : !!prod.salePrice;

              return (
              <div key={`${prod.id}-${index}`} className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl border border-cream overflow-hidden shadow-card hover:shadow-xl transition-premium group flex flex-col justify-between">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={prod.images[0]} 
                  alt={prod.name[language]} 
                  className={`w-full h-full object-cover transition-all duration-700 ${prod.images?.[1] ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-[1.02]'}`}
                />
                {prod.images?.[1] && (
                  <img 
                    src={prod.images[1]} 
                    alt={prod.name?.[language] || 'Alternate View'} 
                    className="w-full h-full object-cover transition-all duration-700 absolute inset-0 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
                  />
                )}
                {prod.isBestSeller && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </span>
                )}
                {prod.isNew && (
                  <span className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {language === 'ar' ? 'جديد' : 'New'}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{prod.brand}</span>
                    <div className="flex items-center text-amber-400 gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-dark">{prod.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-dark group-hover:text-primary transition-colors leading-snug">
                    {prod.name[language]}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {prod.shortDescription[language]}
                  </p>
                  {prod.attributes && prod.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {prod.attributes.slice(0, 3).map((attr: any, idx: number) => (
                        <AttributeBadge key={`${prod.id}-attr-${idx}`} attribute={attr} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mt-auto">
                  {prod.variations && prod.variations.length > 0 && prod.variations[0].size !== 'Standard' && (
                    <div className="relative bg-slate-50 border border-cream rounded-xl shadow-sm overflow-hidden">
                      <select 
                        value={selectedVarId}
                        onChange={(e) => setSelectedVariations(prev => ({ ...prev, [prod.id]: e.target.value }))}
                        className="w-full bg-transparent text-xs font-bold text-dark py-2.5 px-3 focus:outline-none appearance-none cursor-pointer"
                        style={{ textAlignLast: isRtl ? 'right' : 'left' }}
                      >
                        {prod.variations.map((v: any) => (
                          <option key={v.id} value={v.id}>{v.size}</option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${isRtl ? 'left-3' : 'right-3'}`} />
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-primary">
                      {currentPrice} AED
                    </span>
                    {hasSale && (
                      <span className="text-xs text-gray-400 line-through">
                        {currentBasePrice} AED
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      to={`/product/${prod.slug}`} 
                      className="bg-primary hover:bg-primary-dark text-white text-center font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm hover:shadow transition-premium"
                    >
                      {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                    </Link>
                    <Link 
                      to="/quotation" 
                      className="bg-cream hover:bg-cream/80 text-primary border border-primary/5 text-center font-bold py-2.5 px-4 rounded-xl text-xs transition-premium"
                    >
                      {t('product.request.quote')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            )})}
          </div>
        </div>
      </section>
    </div>
  );

  const renderVideoPromo = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="relative overflow-hidden rounded-3xl shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop" 
          alt="Wide Promo"
          className="w-full h-full object-cover aspect-[21/9] sm:aspect-[4/1] group-hover:scale-[1.02] transition-premium duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent flex flex-col justify-center p-8 sm:p-16 text-white" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <span className="text-gold font-bold tracking-widest text-sm uppercase mb-2 block">{language === 'ar' ? 'عرض خاص محدود' : 'Limited Special Offer'}</span>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-lg">
            {language === 'ar' ? 'قم بترقية سريرك اليوم.' : 'Upgrade Your Sleep Today.'}
          </h3>
          <Link 
            to="/shop"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl w-max transition-all shadow-lg hover:shadow-xl text-sm"
          >
            {language === 'ar' ? 'تصفح جميع المراتب' : 'Shop All Mattresses'}
          </Link>
        </div>
      </section>
    </div>
  );

  const renderFeatures = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="bg-gradient-to-br from-cream to-white rounded-3xl p-8 md:p-12 border border-primary/5 shadow-premium grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <span className="text-[10px] text-primary uppercase font-bold tracking-widest block">{t('nav.home')} &bull; {t('nav.shop')}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark tracking-wide leading-tight">
            {t('home.collection.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            {t('home.collection.subtitle')}
          </p>
          <div className="pt-2">
            <Link 
              to="/shop?category=beds" 
              className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-premium text-xs inline-flex items-center gap-2"
            >
              <span>{language === 'ar' ? 'تصفح تشكيلة الأسرة' : 'Browse Bed Frames'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-premium h-80">
          <img 
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop" 
            alt="Luxury bedroom set" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );

  const renderReviews = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-wide">{t('home.reviews.title')}</h2>
          <p className="text-sm text-gray-500 font-medium">{t('home.reviews.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockReviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-cream p-6 rounded-2xl shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                {/* Rating Stars */}
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-dark/95 leading-relaxed font-semibold italic">
                  "{rev.comment[language]}"
                </p>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium">
                <span className="font-bold text-dark">{rev.userName}</span>
                <span>📍 {rev.city[language]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderFaq = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-wide">{t('home.faq.title')}</h2>
          <p className="text-sm text-gray-500 font-medium">{t('home.faq.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white border border-cream rounded-2xl overflow-hidden shadow-card transition-all"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left font-bold text-sm sm:text-base text-dark hover:bg-cream/10 transition-colors"
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                >
                  <span className={isRtl ? 'text-right' : 'text-left'}>{faq.q[language]}</span>
                  <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div 
                    className="px-6 pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed font-medium animate-fadeIn"
                    style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                  >
                    {faq.a[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );


  const renderCustomFullBanner = (section: HomeSection) => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <section className="relative overflow-hidden rounded-3xl shadow-2xl group">
        <Link to={section.content?.link || '#'}>
          <img 
            src={section.content?.imageUrl || 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop'} 
            alt={section.name[language as 'en'|'ar'] || section.name.en}
            className="w-full h-full object-cover aspect-[21/9] sm:aspect-[4/1] group-hover:scale-[1.02] transition-premium duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent flex flex-col justify-center p-8 sm:p-16 text-white" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <span className="text-gold font-bold tracking-widest text-sm uppercase mb-2 block">{language === 'ar' ? 'عرض خاص' : 'Special Offer'}</span>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-lg">
              {section.content?.title?.[language as 'en'|'ar'] || section.name[language as 'en'|'ar'] || section.name.en}
            </h3>
            <span className="bg-primary hover:bg-primary-dark text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl w-max transition-all shadow-lg hover:shadow-xl text-sm">
              {language === 'ar' ? 'اكتشف المزيد' : 'Discover More'}
            </span>
          </div>
        </Link>
      </section>
    </div>
  );

  const renderCustomBannerProducts = (section: HomeSection) => {
    // Filter products based on config
    const filteredProducts = productsList.filter(p => {
      if (section.content?.filterType === 'category') {
        return p.category === section.content.filterId;
      } else if (section.content?.filterType === 'brand') {
        return p.brand === section.content.filterId;
      }
      return true;
    }).slice(0, 8);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-wide">
              {section.content?.title?.[language as 'en'|'ar'] || section.name[language as 'en'|'ar'] || section.name.en}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
            {/* Side Banner */}
            <div className="lg:col-span-1 relative rounded-3xl overflow-hidden shadow-card group hidden lg:block h-full">
              <Link to={section.content?.link || '#'}>
                <img src={section.content?.imageUrl || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop'} alt="Promo" className="w-full h-full object-cover group-hover:scale-105 transition-premium duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-extrabold leading-tight mb-4">
                    {section.content?.title?.[language as 'en'|'ar'] || section.name[language as 'en'|'ar'] || section.name.en}
                  </h3>
                  <span className="bg-primary hover:bg-primary-dark text-center py-3 rounded-xl font-bold transition-premium text-sm block">
                    {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Products Carousel */}
            <div className="lg:col-span-3 flex overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0">
              {filteredProducts.length > 0 ? filteredProducts.map((prod, index) => {
                const selectedVarId = selectedVariations[prod.id] || prod.variations?.[0]?.id;
                const currentVar = prod.variations?.find(v => v.id === selectedVarId) || prod.variations?.[0];
                const currentPrice = currentVar ? (currentVar.salePrice || currentVar.price) : (prod.salePrice || prod.basePrice);
                const currentBasePrice = currentVar ? currentVar.price : prod.basePrice;
                const hasSale = currentVar ? !!currentVar.salePrice : !!prod.salePrice;

                return (
                <div key={`${prod.id}-${index}`} className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl border border-cream overflow-hidden shadow-card hover:shadow-xl transition-premium group flex flex-col justify-between">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={prod.images[0]} 
                  alt={prod.name[language]} 
                  className={`w-full h-full object-cover transition-all duration-700 ${prod.images?.[1] ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-[1.02]'}`}
                />
                {prod.images?.[1] && (
                  <img 
                    src={prod.images[1]} 
                    alt={prod.name?.[language] || 'Alternate View'} 
                    className="w-full h-full object-cover transition-all duration-700 absolute inset-0 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
                  />
                )}
                {prod.isBestSeller && (
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </span>
                )}
                {prod.isNew && (
                  <span className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {language === 'ar' ? 'جديد' : 'New'}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{prod.brand}</span>
                    <div className="flex items-center text-amber-400 gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-dark">{prod.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-dark group-hover:text-primary transition-colors leading-snug">
                    {prod.name[language]}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {prod.shortDescription[language]}
                  </p>
                  {prod.attributes && prod.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {prod.attributes.slice(0, 3).map((attr: any, idx: number) => (
                        <AttributeBadge key={`${prod.id}-attr-${idx}`} attribute={attr} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mt-auto">
                  {prod.variations && prod.variations.length > 0 && prod.variations[0].size !== 'Standard' && (
                    <div className="relative bg-slate-50 border border-cream rounded-xl shadow-sm overflow-hidden">
                      <select 
                        value={selectedVarId}
                        onChange={(e) => setSelectedVariations(prev => ({ ...prev, [prod.id]: e.target.value }))}
                        className="w-full bg-transparent text-xs font-bold text-dark py-2.5 px-3 focus:outline-none appearance-none cursor-pointer"
                        style={{ textAlignLast: isRtl ? 'right' : 'left' }}
                      >
                        {prod.variations.map((v: any) => (
                          <option key={v.id} value={v.id}>{v.size}</option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${isRtl ? 'left-3' : 'right-3'}`} />
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-primary">
                      {currentPrice} AED
                    </span>
                    {hasSale && (
                      <span className="text-xs text-gray-400 line-through">
                        {currentBasePrice} AED
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      to={`/product/${prod.slug}`} 
                      className="bg-primary hover:bg-primary-dark text-white text-center font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm hover:shadow transition-premium"
                    >
                      {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                    </Link>
                    <Link 
                      to="/quotation" 
                      className="bg-cream hover:bg-cream/80 text-primary border border-primary/5 text-center font-bold py-2.5 px-4 rounded-xl text-xs transition-premium"
                    >
                      {t('product.request.quote')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
              )}) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold p-12 border-2 border-dashed border-gray-200 rounded-3xl">
                  {language === 'ar' ? 'لا توجد منتجات مطابقة لهذا الفلتر.' : 'No products match this filter.'}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  };

  if (isLoadingLayout) {
    return (
      <div className="bg-light min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pb-20">
      <div className="flex flex-col gap-16 lg:gap-24">
        {homeLayout.filter(s => s.visible).sort((a,b) => a.order - b.order).map((section) => {
          return (
            <React.Fragment key={section.id}>
              {section.id === 'hero' && (
                <>
                  {renderHero()}
                  <Ticker />
                </>
              )}
              {section.id === 'brands' && renderBrands()}
              {section.id === 'categories' && renderCategories()}
              {section.id === 'promo1' && renderPromo1()}
              {section.id === 'grid_banners' && renderGridBanners()}
              {section.id === 'best_sellers' && renderBestSellers()}
              {section.id === 'video_promo' && renderVideoPromo()}
              {section.id === 'features' && renderFeatures()}
              {section.id === 'reviews' && renderReviews()}
              {section.id === 'faq' && renderFaq()}
              {section.type === 'custom_full_banner' && renderCustomFullBanner(section)}
              {section.type === 'custom_banner_products' && renderCustomBannerProducts(section)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
