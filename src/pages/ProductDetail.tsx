import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { products as mockProducts } from '../data/mockData';
import type { Product } from '../data/mockData';
import { api } from '../lib/api';
import { ShieldCheck, Truck, Star, Calendar, CheckCircle, Heart, Thermometer, Activity, Users, Shield, Award, Droplet, Box, Wind, Zap, Moon, Sun, Flame, Check, ArrowUp, RefreshCw, Layers, Maximize, Palette, CheckCircle2, ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, isRtl } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const IconMap: Record<string, any> = {
    Thermometer, Activity, Users, Shield, Award, Droplet, Box, Wind, Zap, Moon, Sun, Flame, Check, Heart, Star
  };

  const getBadgeColor = (color: string) => {
    switch(color) {
      case 'Gold': return 'bg-[#D4AF37] text-white';
      case 'Red': return 'bg-[#E53E3E] text-white';
      case 'Green': return 'bg-[#38A169] text-white';
      case 'Blue': return 'bg-[#3182CE] text-white';
      case 'Black': return 'bg-[#1A202C] text-white';
      case 'Purple': return 'bg-[#805AD5] text-white';
      default: return 'bg-primary text-white';
    }
  };

  // Find product by slug initially from mockData as fallback
  const [product, setProduct] = useState<Product | null>(() => {
    return mockProducts.find(p => p.slug === slug) || null;
  });
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(!product);

  // Gallery state
  const [activeImage, setActiveImage] = useState<string>(product?.images?.[0] || '');
  
  // Variations state
  const [selectedVariationId, setSelectedVariationId] = useState<string>(product?.variations?.[0]?.id || '');
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  // Fetch product by slug and related products list
  useEffect(() => {
    if (!slug) return;
    let active = true;
    
    const initProd = mockProducts.find(p => p.slug === slug) || null;
    setProduct(initProd);
    setIsLoading(!initProd);

    api.getProduct(slug).then(res => {
      if (active) {
        if (res) {
          setProduct(res);
        }
        setIsLoading(false);
      }
    });

    api.getProducts().then(res => {
      if (active) {
        setProductsList(res);
      }
    });

    return () => {
      active = false;
    };
  }, [slug]);

  // Sync active image when product changes
  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      }
      if (product.variations && product.variations.length > 0) {
        setSelectedVariationId(product.variations[0].id);
      }
      setQuantity(1);
      setIsAddedSuccess(false);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariation) return;
    addToCart(product, selectedVariation.id, quantity);
    setIsAddedSuccess(true);
    setTimeout(() => setIsAddedSuccess(false), 3000);
  };

  const selectedVariation = product?.variations?.find(v => v.id === selectedVariationId) || product?.variations?.[0];
  const currentPrice = selectedVariation ? (selectedVariation.salePrice || selectedVariation.price) : 0;
  const originalPrice = selectedVariation?.salePrice ? selectedVariation.price : undefined;

  // Find related products (same category, different id)
  const relatedProducts = productsList
    .filter(p => product && p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Merge dynamic attributes from DB with hardcoded mock specifications
  const dynamicSpecs: Record<string, string> = {};
  if (product && (product as any).attributes && (product as any).attributes.length > 0) {
    (product as any).attributes.forEach((attr: any) => {
      const groupName = language === 'ar' ? attr.groupNameAr : attr.groupNameEn;
      const value = language === 'ar' ? attr.valueAr : attr.valueEn;
      if (groupName && value) {
        if (dynamicSpecs[groupName]) {
          // Prevent duplicates if backend already returned comma separated
          if (!dynamicSpecs[groupName].includes(value)) {
            dynamicSpecs[groupName] += `, ${value}`;
          }
        } else {
          dynamicSpecs[groupName] = value;
        }
      }
    });
  }

  const mergedSpecs = {
    ...(product?.specifications?.[language] || {}),
    ...dynamicSpecs
  };

  const getIconForSpec = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('firm') || k.includes('صلاب')) return <Shield className="w-5 h-5" />;
    if (k.includes('height') || k.includes('ارتفاع') || k.includes('thick') || k.includes('سمك')) return <ArrowUp className="w-5 h-5" />;
    if (k.includes('warrant') || k.includes('ضمان')) return <Award className="w-5 h-5" />;
    if (k.includes('return') || k.includes('استرجاع')) return <RefreshCw className="w-5 h-5" />;
    if (k.includes('structure') || k.includes('تركيب') || k.includes('layer') || k.includes('طبقة')) return <Layers className="w-5 h-5" />;
    if (k.includes('size') || k.includes('مقاس') || k.includes('dimens') || k.includes('ابعاد')) return <Maximize className="w-5 h-5" />;
    if (k.includes('color') || k.includes('لون')) return <Palette className="w-5 h-5" />;
    if (k.includes('mat') || k.includes('خام')) return <Box className="w-5 h-5" />;
    return <CheckCircle2 className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-gray-400 font-semibold">
          {language === 'ar' ? 'جاري تحميل تفاصيل المنتج...' : 'Loading product details...'}
        </p>
      </div>
    );
  }

  if (!product || !selectedVariation) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-dark">{language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
        <p className="text-xs text-gray-500">{language === 'ar' ? 'عذراً، المنتج الذي تبحث عنه غير متوفر حالياً.' : 'The product you are looking for does not exist.'}</p>
        <Link to="/shop" className="bg-primary text-white text-xs font-bold py-2.5 px-6 rounded-xl inline-block">
          {language === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-gray-400 font-semibold" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
        <span className="mx-2">&bull;</span>
        <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
        <span className="mx-2">&bull;</span>
        <span className="text-dark truncate">{product.name?.[language] || 'Product'}</span>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
        
        {/* Upper Specs & Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN: Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[4/3] bg-white border border-cream">
              {product.badgeLabel && (
                <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} z-10 px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${getBadgeColor(product.badgeColor || '')}`}>
                  {product.badgeLabel}
                </div>
              )}
              <img 
                src={activeImage || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'} 
                alt={product.name?.[language] || 'Product'} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 bg-white flex-shrink-0 shadow-sm transition-premium ${
                      activeImage === img ? 'border-primary' : 'border-cream hover:border-primary/40'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Details & Controls */}
          <div className="space-y-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary">{product.brand}</span>
                <span className="text-xs text-gray-400 font-bold">SKU: MM-{product.slug.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-dark leading-tight">
                {product.name?.[language] || 'Product'}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-dark ml-1">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>

            {/* Short Desc */}
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
              {product.shortDescription?.[language] || ''}
            </p>

            <hr className="border-cream" />

            {/* Price section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-primary">{currentPrice} AED</span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">{originalPrice} AED</span>
                )}
              </div>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t('product.in.stock')}</span>
              </p>
            </div>

            {/* Variation selector */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('product.size')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variations.map(vari => (
                  <button
                    key={vari.id}
                    onClick={() => setSelectedVariationId(vari.id)}
                    className={`border px-3 py-2.5 rounded-xl text-xs font-bold text-center transition-premium ${
                      selectedVariationId === vari.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-cream bg-white text-dark hover:border-primary/30'
                    }`}
                  >
                    {vari.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Comfort meter for Mattresses */}
            {product.category === 'mattresses' && (
              <div className="space-y-3 pt-2">
                <h3 className="font-extrabold text-xs text-dark uppercase tracking-wider">{t('product.firmness')}</h3>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-cream rounded-full relative overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 bg-primary rounded-full"
                      style={{ 
                        left: isRtl ? 'auto' : '0',
                        right: isRtl ? '0' : 'auto',
                        width: product.firmness === 'soft' ? '30%' : product.firmness === 'medium' ? '65%' : '90%' 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>{t('product.firmness.soft')}</span>
                    <span>{t('product.firmness.medium')}</span>
                    <span>{t('product.firmness.firm')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and CTA controls */}
            <div className="space-y-3.5 pt-4">
              <div className="flex items-center gap-4">
                {/* Qty Selector */}
                <div className="flex items-center border border-cream bg-white rounded-xl py-2 px-3">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-2 font-bold text-gray-500 hover:text-primary"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-dark select-none">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-2 font-bold text-gray-500 hover:text-primary"
                  >
                    +
                  </button>
                </div>
                
                {/* Main Action Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-primary hover:bg-primary-dark text-white text-center font-bold py-3.5 px-6 rounded-xl shadow-premium hover:shadow-lg transition-premium text-sm flex items-center justify-center gap-2"
                >
                  <span>{t('product.add.cart')}</span>
                </button>

                {/* Wishlist Toggle button */}
                <button
                  onClick={() => product && toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border border-cream transition-premium flex items-center justify-center ${
                    product && isInWishlist(product.id)
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'bg-white hover:border-primary/30 text-gray-400 hover:text-primary'
                  }`}
                  title={language === 'ar' ? 'أضف للمفضلة' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'fill-primary' : ''}`} />
                </button>
              </div>

              {/* Request quotation / B2B button */}
              <Link
                to={`/quotation?product=${product.id}&variation=${selectedVariation.id}`}
                className="w-full bg-cream hover:bg-cream/80 text-primary border border-primary/10 text-center font-bold py-3.5 px-6 rounded-xl text-sm transition-premium block"
              >
                {t('product.request.quote')}
              </Link>

              {/* Added success bubble */}
              {isAddedSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl p-3 border border-emerald-100 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    {language === 'ar' 
                      ? 'تمت إضافة المنتج إلى السلة بنجاح!' 
                      : 'Product successfully added to your cart!'}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Dynamic Product Attributes (Important Specs Frame) - Full Width Horizontal */}
        {product && (product as any).attributes && (product as any).attributes.length > 0 && (
          <section className="bg-white border border-cream rounded-3xl p-6 md:p-8 shadow-sm" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <h3 className="text-xl font-extrabold text-dark mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              {language === 'ar' ? 'المواصفات الرئيسية' : 'Key Specifications'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(() => {
                const validAttributes = (product as any).attributes.filter((attr: any) => {
                  const gName = language === 'ar' ? attr.groupNameAr : attr.groupNameEn;
                  const v = language === 'ar' ? attr.valueAr : attr.valueEn;
                  return gName && v;
                });
                
                return validAttributes.map((attr: any, idx: number) => {
                  const groupName = language === 'ar' ? attr.groupNameAr : attr.groupNameEn;
                  const value = language === 'ar' ? attr.valueAr : attr.valueEn;
                  
                  return (
                    <div key={idx} className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 transition-colors group h-full border border-transparent hover:border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                          {getIconForSpec(attr.groupNameEn)}
                        </div>
                        <p className="text-[11px] text-gray-500 font-extrabold uppercase tracking-widest leading-tight">{groupName}</p>
                      </div>
                      <div className="flex-1 mt-1">
                        {value.includes(',') ? (
                          <div className="flex flex-wrap gap-1.5">
                            {value.split(',').map((v: string, i: number) => (
                              <span key={i} className="bg-white border border-slate-200 text-[11px] font-bold px-2 py-1 rounded-lg text-dark shadow-sm">
                                {v.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm font-extrabold text-dark break-words">{value}</p>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </section>
        )}

        {/* KEY FEATURES SECTION */}
        {product.keyFeatures && product.keyFeatures.length > 0 && (
          <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <h3 className="text-xl font-extrabold text-dark mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {language === 'ar' ? 'الميزات الأساسية' : 'Key Features'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {product.keyFeatures.map((feat: any, idx: number) => {
                const FeatIcon = IconMap[feat.icon] || Check;
                return (
                  <div key={idx} className="bg-white border border-cream rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-10 h-10 bg-primary/5 group-hover:bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-colors">
                      <FeatIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-dark mb-1">{feat.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{feat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Detailed specifications & description using Shadcn UI Tabs */}
        <section className="bg-white border border-cream rounded-3xl p-8 shadow-premium" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <Tabs defaultValue="desc" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-cream/40 p-1 rounded-xl mb-6">
              <TabsTrigger value="desc" className="py-2.5 text-xs sm:text-sm font-bold rounded-lg cursor-pointer">
                {t('product.description')}
              </TabsTrigger>
              <TabsTrigger value="specs" className="py-2.5 text-xs sm:text-sm font-bold rounded-lg cursor-pointer">
                {t('product.specifications')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="desc" className="space-y-3 focus:outline-none outline-none border-0">
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                {product.description?.[language] || ''}
              </p>
            </TabsContent>
            
            <TabsContent value="specs" className="space-y-4 focus:outline-none outline-none border-0 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(mergedSpecs).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-4 items-start hover:shadow-sm transition-shadow group">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                      {getIconForSpec(key)}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">{key}</h4>
                      {/* If the value has commas, we split it to look like pills */}
                      {(val as string).includes(',') ? (
                        <div className="flex flex-wrap gap-1.5">
                          {(val as string).split(',').map((v, i) => (
                            <span key={i} className="bg-white border border-slate-200 text-[11px] font-bold px-2 py-1 rounded-lg text-dark shadow-sm">{v.trim()}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-dark">{val as string}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-dark tracking-wide">
                {language === 'ar' ? 'منتجات ذات صلة' : 'Related Products'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(prod => {
                const selectedVarId = selectedVariations[prod.id] || prod.variations?.[0]?.id;
                const currentVar = prod.variations?.find(v => v.id === selectedVarId) || prod.variations?.[0];
                const currentPrice = currentVar ? (currentVar.salePrice || currentVar.price) : (prod.salePrice || prod.basePrice);
                const currentBasePrice = currentVar ? currentVar.price : prod.basePrice;
                const hasSale = currentVar ? !!currentVar.salePrice : !!prod.salePrice;

                return (
                <div 
                  key={prod.id} 
                  className="bg-white border border-cream rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-premium group flex flex-col justify-between"
                  style={{ direction: isRtl ? 'rtl' : 'ltr' }}
                >
                  <Link to={`/product/${prod.slug}`} className="relative h-48 overflow-hidden block">
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
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <Link to={`/product/${prod.slug}`}>
                      <h3 className="font-bold text-sm text-dark group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {prod.name?.[language] || 'Product'}
                      </h3>
                    </Link>
                    
                    <div className="space-y-3 mt-auto">
                      {prod.variations && prod.variations.length > 0 && prod.variations[0].size !== 'Standard' && (
                        <div className="relative bg-slate-50 border border-cream rounded-xl shadow-sm overflow-hidden">
                          <select 
                            value={selectedVarId}
                            onChange={(e) => setSelectedVariations(prev => ({ ...prev, [prod.id]: e.target.value }))}
                            className="w-full bg-transparent text-xs font-bold text-dark py-2 px-3 focus:outline-none appearance-none cursor-pointer"
                            style={{ textAlignLast: isRtl ? 'right' : 'left' }}
                          >
                            {prod.variations.map((v: any) => (
                              <option key={v.id} value={v.id}>{v.size}</option>
                            ))}
                          </select>
                          <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${isRtl ? 'left-3' : 'right-3'}`} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-extrabold text-primary">{currentPrice} AED</span>
                        {hasSale && (
                          <span className="text-[10px] text-gray-400 line-through">{currentBasePrice} AED</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
