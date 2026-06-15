import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { AttributeBadge } from '../components/AttributeBadge';
import { products as mockProducts, categories as mockCategories } from '../data/mockData';
import type { Product } from '../data/mockData';
import { api } from '../lib/api';
import { Filter, SlidersHorizontal, Star, X, Check, AlertCircle, Heart, ChevronDown, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Shop: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const { toggleCompare, compareList, clearCompare, toggleWishlist, isInWishlist } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  // API Data States
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [categoriesList, setCategoriesList] = useState<any[]>(mockCategories);
  const [customFilters, setCustomFilters] = useState<any[]>([]);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || 'all');
  const [selectedFirmness, setSelectedFirmness] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [selectedCustomOptions, setSelectedCustomOptions] = useState<number[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [brandsList, setBrandsList] = useState<any[]>([]);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  // Load products, categories and filters from backend or fallback on mount
  useEffect(() => {
    let active = true;
    api.getCategories().then(res => {
      if (active) setCategoriesList(res);
    });
    api.getProducts().then(res => {
      if (active) setProductsList(res);
    });
    api.getFilters().then(res => {
      if (active) setCustomFilters(res);
    });
    api.getBrands().then(res => {
      if (active) setBrandsList(res);
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync URL search parameters
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) setSelectedCategory(category);
    
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);

    const brand = searchParams.get('brand');
    if (brand) setSelectedBrand(brand);

    const firmness = searchParams.get('firmness');
    if (firmness) setSelectedFirmness(firmness);

    const filtersParam = searchParams.get('filters');
    if (filtersParam) {
      const optionIds = filtersParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      setSelectedCustomOptions(optionIds);
    }
  }, [searchParams]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleToggleCustomOption = (optionId: number) => {
    setSelectedCustomOptions(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedFirmness('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
    setSelectedCustomOptions([]);
    setSelectedStatus('all');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = productsList.filter(prod => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    // 2. Brand Filter
    if (selectedBrand !== 'all' && prod.brand !== selectedBrand) {
      // also check if brand matched by name instead of id
      const targetBrandObj = brandsList.find(b => b.id === selectedBrand);
      if (!targetBrandObj || prod.brand !== targetBrandObj.name) {
         if (prod.brand !== selectedBrand) return false;
      }
    }
    // 3. Firmness Filter
    if (selectedFirmness !== 'all' && prod.firmness !== selectedFirmness) return false;
    // 3. Price Filter
    if (selectedPriceRange !== 'all') {
      const price = prod.salePrice || prod.basePrice;
      if (selectedPriceRange === 'under-500' && price >= 500) return false;
      if (selectedPriceRange === '500-1500' && (price < 500 || price > 1500)) return false;
      if (selectedPriceRange === '1500-3000' && (price < 1500 || price > 3000)) return false;
      if (selectedPriceRange === 'over-3000' && price <= 3000) return false;
    }
    // 4. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = (prod.name?.[language] || '').toLowerCase().includes(query);
      const matchBrand = (prod.brand || '').toLowerCase().includes(query);
      const matchDesc = (prod.shortDescription?.[language] || '').toLowerCase().includes(query);
      if (!matchName && !matchBrand && !matchDesc) return false;
    }
    // 5. Dynamic Attribute Filters
    if (selectedCustomOptions.length > 0) {
      const prodAttrIds = (prod.attributes || []).map((attr: any) => attr.id);
      const hasMatch = selectedCustomOptions.some(optId => prodAttrIds.includes(optId));
      if (!hasMatch) return false;
    }
    // 6. Status Filter
    if (selectedStatus === 'featured' && !prod.isFeatured) return false;
    if (selectedStatus === 'new_arrival' && !prod.isNewArrival) return false;
    return true;
  }).sort((a, b) => {
    const priceA = a.salePrice || a.basePrice;
    const priceB = b.salePrice || b.basePrice;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default featured
  });

  return (
    <div className="bg-light min-h-screen">
      {/* Page Header */}
      <section className="bg-cream/40 border-b border-cream py-8 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-wide">{t('shop.title')}</h1>
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest font-bold">
          {searchQuery ? `${t('nav.search')}: "${searchQuery}"` : t('nav.home') + ' / ' + t('nav.shop')}
        </p>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-cream">
              <h2 className="font-bold text-base text-dark flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>{t('shop.filters')}</span>
              </h2>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] text-primary hover:underline font-bold"
              >
                {t('shop.clear.filters')}
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('shop.filter.category')}</h3>
              <div className="space-y-1.5 text-xs text-gray-500 font-semibold">
                <button 
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left py-1 hover:text-primary ${selectedCategory === 'all' ? 'text-primary font-bold' : ''}`}
                  style={{ textAlign: isRtl ? 'right' : 'left' }}
                >
                  {language === 'ar' ? 'الكل' : 'All Categories'}
                </button>
                {categoriesList.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left py-1 hover:text-primary block ${selectedCategory === cat.id ? 'text-primary font-bold' : ''}`}
                    style={{ textAlign: isRtl ? 'right' : 'left' }}
                  >
                    {cat.name[language]}
                  </button>
                ))}
              </div>
            </div>

            {/* Firmness Filter */}
            <div className="space-y-3 pt-4 border-t border-cream">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('shop.filter.firmness')}</h3>
              <div className="space-y-2 text-xs text-gray-500 font-semibold">
                {['all', 'soft', 'medium', 'firm'].map(firm => (
                  <label key={firm} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input 
                      type="radio" 
                      name="firmness" 
                      checked={selectedFirmness === firm}
                      onChange={() => setSelectedFirmness(firm)}
                      className="accent-primary w-3.5 h-3.5"
                    />
                    <span>
                      {firm === 'all' && (language === 'ar' ? 'الكل' : 'All Levels')}
                      {firm === 'soft' && t('product.firmness.soft')}
                      {firm === 'medium' && t('product.firmness.medium')}
                      {firm === 'firm' && t('product.firmness.firm')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-6 border-t border-cream">
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Award className="w-3.5 h-3.5" />
                {language === 'ar' ? 'الماركة' : 'Brand'}
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="brand" 
                    className="text-primary focus:ring-primary w-4 h-4"
                    checked={selectedBrand === 'all'}
                    onChange={() => {
                      setSelectedBrand('all');
                      searchParams.delete('brand');
                      setSearchParams(searchParams);
                    }}
                  />
                  <span className={`text-sm font-semibold transition-colors ${selectedBrand === 'all' ? 'text-primary' : 'text-gray-600 group-hover:text-dark'}`}>
                    {language === 'ar' ? 'جميع الماركات' : 'All Brands'}
                  </span>
                </label>
                {brandsList.map(brand => (
                  <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="brand" 
                      className="text-primary focus:ring-primary w-4 h-4"
                      checked={selectedBrand === brand.id}
                      onChange={() => {
                        setSelectedBrand(brand.id);
                        searchParams.set('brand', brand.id);
                        setSearchParams(searchParams);
                      }}
                    />
                    <span className={`text-sm font-semibold transition-colors ${selectedBrand === brand.id ? 'text-primary' : 'text-gray-600 group-hover:text-dark'}`}>
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-cream">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('shop.filter.price')}</h3>
              <div className="space-y-2 text-xs text-gray-500 font-semibold">
                {[
                  { id: 'all', en: 'All Prices', ar: 'الكل' },
                  { id: 'under-500', en: 'Under 500 AED', ar: 'أقل من 500 درهم' },
                  { id: '500-1500', en: '500 - 1,500 AED', ar: '500 - 1500 درهم' },
                  { id: '1500-3000', en: '1,500 - 3,000 AED', ar: '1500 - 3000 درهم' },
                  { id: 'over-3000', en: 'Over 3,000 AED', ar: 'أكثر من 3000 درهم' },
                ].map(range => (
                  <label key={range.id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      checked={selectedPriceRange === range.id}
                      onChange={() => setSelectedPriceRange(range.id)}
                      className="accent-primary w-3.5 h-3.5"
                    />
                    <span>{range[language as 'en' | 'ar']}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Product Status Filter */}
            <div className="space-y-3 pt-4 border-t border-cream">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{language === 'ar' ? 'حالة المنتج' : 'Product Status'}</h3>
              <div className="space-y-2 text-xs text-gray-500 font-semibold">
                {[
                  { id: 'all', en: 'All Statuses', ar: 'الكل' },
                  { id: 'featured', en: 'Featured', ar: 'مميز' },
                  { id: 'new_arrival', en: 'New Arrival', ar: 'وصل حديثاً' }
                ].map(status => (
                  <label key={status.id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={selectedStatus === status.id}
                      onChange={() => setSelectedStatus(status.id)}
                      className="accent-primary w-3.5 h-3.5"
                    />
                    <span>{status[language as 'en' | 'ar']}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dynamic Custom Filters */}
            {customFilters.map(group => (
              <div key={group.id} className="space-y-3 pt-4 border-t border-cream animate-fadeIn">
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">
                  {language === 'ar' ? group.name_ar : group.name_en}
                </h3>
                <div className="space-y-2 text-xs text-gray-500 font-semibold">
                  {group.options && group.options.map((opt: any) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomOptions.includes(opt.id)}
                        onChange={() => handleToggleCustomOption(opt.id)}
                        className="accent-primary w-3.5 h-3.5"
                      />
                      <span>{language === 'ar' ? opt.value_ar : opt.value_en}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* MAIN PRODUCT CATALOG */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center pb-4 border-b border-cream bg-white p-4 rounded-2xl shadow-premium">
              <div className="text-xs text-gray-500 font-semibold">
                {t('shop.showing').replace('{count}', filteredProducts.length.toString())}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1 text-xs font-bold text-dark border border-cream rounded-xl px-3 py-1.5 hover:bg-cream"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{t('shop.filters')}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 font-bold hidden sm:inline">{t('shop.sort.title')}:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-cream/40 border border-cream rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-primary text-dark"
                  >
                    <option value="featured">{t('shop.sort.featured')}</option>
                    <option value="price-low">{t('shop.sort.price.low')}</option>
                    <option value="price-high">{t('shop.sort.price.high')}</option>
                    <option value="rating">{t('shop.sort.rating')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-cream rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto shadow-premium">
                <AlertCircle className="w-12 h-12 text-primary/20 mx-auto" />
                <h3 className="font-bold text-base text-dark">{t('shop.no.products')}</h3>
                <p className="text-xs text-gray-400 font-medium">{language === 'ar' ? 'جرب تغيير فلاتر البحث أو تصفح الأقسام الأخرى.' : 'Try clearing your active filters or explore other categories.'}</p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm transition-premium"
                >
                  {t('shop.clear.filters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(prod => {
                  const isCompared = compareList.some(c => c.id === prod.id);
                  const selectedVarId = selectedVariations[prod.id] || prod.variations?.[0]?.id;
                  const currentVar = prod.variations?.find(v => v.id === selectedVarId) || prod.variations?.[0];
                  const currentPrice = currentVar ? (currentVar.salePrice || currentVar.price) : (prod.salePrice || prod.basePrice);
                  const currentBasePrice = currentVar ? currentVar.price : prod.basePrice;
                  const hasSale = currentVar ? !!currentVar.salePrice : !!prod.salePrice;
                  
                  return (
                    <div key={prod.id} className="bg-white border border-cream rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-premium group flex flex-col justify-between">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'} 
                          alt={prod.name?.[language] || 'Product'} 
                          className={`w-full h-full object-cover transition-all duration-700 ${prod.images?.[1] ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-105'}`}
                        />
                        {prod.images?.[1] && (
                          <img 
                            src={prod.images[1]} 
                            alt={prod.name?.[language] || 'Alternate View'} 
                            className="w-full h-full object-cover transition-all duration-700 absolute inset-0 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
                          />
                        )}
                        <button
                          onClick={() => toggleCompare(prod)}
                          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
                            isCompared ? 'bg-primary text-white' : 'bg-white/90 text-dark hover:bg-white'
                          }`}
                          title={t('shop.compare.add')}
                        >
                          <Check className={`w-3.5 h-3.5 transition-transform ${isCompared ? 'scale-110' : 'scale-0 absolute'}`} />
                          <span className={`text-[9px] font-bold ${isCompared ? 'pl-4 pr-1 text-white block' : 'block text-dark'}`}>
                            {isCompared ? t('shop.compare') : t('shop.compare.add')}
                          </span>
                        </button>

                        {/* Wishlist toggle heart button on card */}
                        <button
                          onClick={() => toggleWishlist(prod)}
                          className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
                            isInWishlist(prod.id) ? 'bg-primary text-white' : 'bg-white/90 text-dark hover:bg-white'
                          }`}
                          title={language === 'ar' ? 'أضف للمفضلة' : 'Add to Wishlist'}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(prod.id) ? 'fill-white text-white' : 'text-gray-500 hover:text-primary'}`} />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex gap-1 items-center">
                              <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-wide border-primary/25 text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                                {prod.brand}
                              </Badge>
                              {prod.category === 'mattresses' && (
                                <Badge variant="secondary" className="text-[9px] font-bold capitalize bg-cream text-dark border border-cream px-2 py-0.5 rounded-full">
                                  {prod.firmness}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-amber-400 gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="text-xs font-bold text-dark">{prod.rating}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-base text-dark group-hover:text-primary transition-colors leading-snug">
                            {prod.name?.[language] || 'Product'}
                          </h3>
                          {prod.attributes && prod.attributes.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {prod.attributes.slice(0, 3).map((attr: any, idx: number) => (
                                <AttributeBadge key={`${prod.id}-attr-${idx}`} attribute={attr} />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-3.5 mt-auto">
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
                            <span className="text-lg font-extrabold text-primary">
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
                              className="bg-primary hover:bg-primary-dark text-white text-center font-bold py-2 rounded-xl text-[11px] shadow-sm transition-premium"
                            >
                              {language === 'ar' ? 'عرض التفاصيل' : 'Details'}
                            </Link>
                            <Link 
                              to="/quotation" 
                              className="bg-cream hover:bg-cream/80 text-primary border border-primary/5 text-center font-bold py-2 rounded-xl text-[11px] transition-premium"
                            >
                              {t('product.request.quote')}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER SIDEBAR DRAWER */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="relative w-80 bg-light h-full shadow-premium flex flex-col z-10 animate-slideLeft p-6 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-cream">
              <h2 className="font-bold text-base text-dark flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>{t('shop.filters')}</span>
              </h2>
              <button 
                onClick={() => { clearAllFilters(); setIsMobileFiltersOpen(false); }}
                className="text-xs text-primary hover:underline font-bold"
              >
                {t('shop.clear.filters')}
              </button>
            </div>

            {/* Mobile Category */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('shop.filter.category')}</h3>
              <div className="space-y-2 text-xs text-gray-500 font-semibold">
                <button 
                  onClick={() => { handleCategorySelect('all'); setIsMobileFiltersOpen(false); }}
                  className={`w-full text-left py-1 hover:text-primary ${selectedCategory === 'all' ? 'text-primary font-bold' : ''}`}
                >
                  {language === 'ar' ? 'الكل' : 'All Categories'}
                </button>
                {categoriesList.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { handleCategorySelect(cat.id); setIsMobileFiltersOpen(false); }}
                    className={`w-full text-left py-1 hover:text-primary block ${selectedCategory === cat.id ? 'text-primary font-bold' : ''}`}
                  >
                    {cat.name[language]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Firmness */}
            <div className="space-y-3 pt-4 border-t border-cream">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('shop.filter.firmness')}</h3>
              <div className="space-y-3 text-xs text-gray-500 font-semibold">
                {['all', 'soft', 'medium', 'firm'].map(firm => (
                  <label key={firm} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobile-firmness" 
                      checked={selectedFirmness === firm}
                      onChange={() => { setSelectedFirmness(firm); setIsMobileFiltersOpen(false); }}
                      className="accent-primary w-4 h-4"
                    />
                    <span>
                      {firm === 'all' && (language === 'ar' ? 'الكل' : 'All Levels')}
                      {firm === 'soft' && t('product.firmness.soft')}
                      {firm === 'medium' && t('product.firmness.medium')}
                      {firm === 'firm' && t('product.firmness.firm')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="space-y-3 pt-4 border-t border-cream">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('shop.filter.price')}</h3>
              <div className="space-y-3 text-xs text-gray-500 font-semibold">
                {[
                  { id: 'all', en: 'All Prices', ar: 'الكل' },
                  { id: 'under-500', en: 'Under 500 AED', ar: 'أقل من 500 درهم' },
                  { id: '500-1500', en: '500 - 1,500 AED', ar: '500 - 1500 درهم' },
                  { id: '1500-3000', en: '1,500 - 3,000 AED', ar: '1500 - 3000 درهم' },
                  { id: 'over-3000', en: 'Over 3,000 AED', ar: 'أكثر من 3000 درهم' },
                ].map(range => (
                  <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobile-priceRange" 
                      checked={selectedPriceRange === range.id}
                      onChange={() => { setSelectedPriceRange(range.id); setIsMobileFiltersOpen(false); }}
                      className="accent-primary w-4 h-4"
                    />
                    <span>{range[language as 'en' | 'ar']}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Product Status */}
            <div className="space-y-3 pt-4 border-t border-cream">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{language === 'ar' ? 'حالة المنتج' : 'Product Status'}</h3>
              <div className="space-y-3 text-xs text-gray-500 font-semibold">
                {[
                  { id: 'all', en: 'All Statuses', ar: 'الكل' },
                  { id: 'featured', en: 'Featured', ar: 'مميز' },
                  { id: 'new_arrival', en: 'New Arrival', ar: 'وصل حديثاً' }
                ].map(status => (
                  <label key={status.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobile-status" 
                      checked={selectedStatus === status.id}
                      onChange={() => { setSelectedStatus(status.id); setIsMobileFiltersOpen(false); }}
                      className="accent-primary w-4 h-4"
                    />
                    <span>{status[language as 'en' | 'ar']}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Dynamic Custom Filters */}
            {customFilters.map(group => (
              <div key={group.id} className="space-y-3 pt-4 border-t border-cream">
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">
                  {language === 'ar' ? group.name_ar : group.name_en}
                </h3>
                <div className="space-y-3 text-xs text-gray-500 font-semibold">
                  {group.options && group.options.map((opt: any) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomOptions.includes(opt.id)}
                        onChange={() => handleToggleCustomOption(opt.id)}
                        className="accent-primary w-4 h-4"
                      />
                      <span>{language === 'ar' ? opt.value_ar : opt.value_en}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl text-xs mt-4"
            >
              {language === 'ar' ? 'تطبيق الفلاتر' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}

      {/* FLOATING COMPARE BAR */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-35 bg-dark text-white shadow-2xl py-4 border-t border-primary/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gold uppercase tracking-wider">{t('shop.compare')}:</span>
              <div className="flex gap-2">
                {compareList.map(item => (
                  <span key={item.id} className="bg-white/10 text-[10px] font-bold rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-white/5">
                    <span>{item.name?.[language] || 'Product'}</span>
                    <button onClick={() => toggleCompare(item)} className="hover:text-primary transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={clearCompare}
                className="text-[10px] text-gray-400 hover:text-white transition-colors underline font-medium"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-5 rounded-xl text-xs shadow-md transition-premium"
              >
                {language === 'ar' ? 'مقارنة الآن' : 'Compare Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT COMPARISON MODAL */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCompareModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden border border-cream z-10 flex flex-col h-[80vh] animate-slideUp">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-cream bg-cream/20 flex justify-between items-center">
              <h2 className="font-extrabold text-lg text-dark flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <span>{t('shop.compare')}</span>
              </h2>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-gray-400 hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Table */}
            <div className="flex-1 overflow-x-auto p-6">
              <table className="w-full border-collapse text-xs text-dark" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                <thead>
                  <tr className="border-b border-cream">
                    <th className="p-3 text-left font-bold text-gray-400 w-1/4" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      {language === 'ar' ? 'الخصائص' : 'Features'}
                    </th>
                    {compareList.map(item => (
                      <th key={item.id} className="p-3 text-center w-1/4">
                        <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'} alt={item.name?.[language] || 'Product'} className="w-20 h-20 object-cover rounded-lg mx-auto border border-cream" />
                        <h4 className="font-bold text-sm text-dark mt-2 leading-snug">{item.name?.[language] || 'Product'}</h4>
                        <span className="text-xs text-primary font-bold block mt-1">{item.salePrice || item.basePrice} AED</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream">
                  {/* Brand */}
                  <tr>
                    <td className="p-3 font-bold text-gray-400">{t('shop.filter.brand')}</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center font-semibold">{item.brand}</td>
                    ))}
                  </tr>
                  {/* Firmness */}
                  <tr>
                    <td className="p-3 font-bold text-gray-400">{t('product.firmness')}</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center font-semibold">
                        {item.firmness === 'soft' && t('product.firmness.soft')}
                        {item.firmness === 'medium' && t('product.firmness.medium')}
                        {item.firmness === 'firm' && t('product.firmness.firm')}
                      </td>
                    ))}
                  </tr>
                  {/* Warranty */}
                  <tr>
                    <td className="p-3 font-bold text-gray-400">{language === 'ar' ? 'فترة الضمان' : 'Warranty'}</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center font-semibold">
                        {t('product.warranty').replace('{months}', (item.warrantyMonths || 0).toString())}
                      </td>
                    ))}
                  </tr>
                  {/* Description */}
                  <tr>
                    <td className="p-3 font-bold text-gray-400">{t('product.description')}</td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center text-gray-500 leading-relaxed max-w-[200px]">
                        {item.shortDescription?.[language] || ''}
                      </td>
                    ))}
                  </tr>
                  {/* Action */}
                  <tr>
                    <td className="p-3 font-bold text-gray-400"></td>
                    {compareList.map(item => (
                      <td key={item.id} className="p-3 text-center">
                        <Link 
                          to={`/product/${item.slug}`}
                          onClick={() => setIsCompareModalOpen(false)}
                          className="bg-primary hover:bg-primary-dark text-white font-bold py-1.5 px-4 rounded-lg text-[10px] shadow-sm inline-block"
                        >
                          {language === 'ar' ? 'عرض تفاصيل المنتج' : 'View Product'}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-cream bg-cream/20 flex justify-end gap-3">
              <button 
                onClick={() => { clearCompare(); setIsCompareModalOpen(false); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                {language === 'ar' ? 'مسح المقارنة' : 'Clear Comparison'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
