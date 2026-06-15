import re

with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the render functions
render_funcs = """
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
                    alt={prod.name[language as 'en'|'ar'] || prod.name.en} 
                    className={`w-full h-full object-cover transition-all duration-700 ${prod.images?.[1] ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-[1.02]'}`}
                  />
                  {prod.images?.[1] && (
                    <img 
                      src={prod.images[1]} 
                      alt={prod.name?.[language as 'en'|'ar'] || 'Alternate View'} 
                      className="w-full h-full object-cover transition-all duration-700 absolute inset-0 opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
                    />
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
                      {prod.name[language as 'en'|'ar'] || prod.name.en}
                    </h3>
                  </div>

                  <div className="space-y-4 mt-auto">
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
"""

target = "  if (isLoadingLayout) {"
content = content.replace(target, render_funcs + "\n" + target)


# 2. Update the switch map logic
switch_target = """              {section.id === 'reviews' && renderReviews()}
              {section.id === 'faq' && renderFaq()}
            </React.Fragment>"""

switch_code = """              {section.id === 'reviews' && renderReviews()}
              {section.id === 'faq' && renderFaq()}
              {section.type === 'custom_full_banner' && renderCustomFullBanner(section)}
              {section.type === 'custom_banner_products' && renderCustomBannerProducts(section)}
            </React.Fragment>"""
            
content = content.replace(switch_target, switch_code)

with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
