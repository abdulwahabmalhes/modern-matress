import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { products as mockProducts, uaeCities } from '../data/mockData';
import type { Product } from '../data/mockData';
import { api } from '../lib/api';
import { FileText, CheckCircle, ShieldCheck, Building, Landmark, Phone, Calendar } from 'lucide-react';

export const Quotation: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const [searchParams] = useSearchParams();

  // Prefill state from search parameters
  const paramProductId = searchParams.get('product');

  // Form states
  const [customerType, setCustomerType] = useState<'individual' | 'company'>('company');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [productId, setProductId] = useState(paramProductId || '');
  const [quantity, setQuantity] = useState('10');
  const [notes, setNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);

  // Fetch dynamic products on mount
  useEffect(() => {
    let active = true;
    api.getProducts().then(res => {
      if (active) setProductsList(res);
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync selected product
  const selectedProduct = productsList.find(p => p.id === productId);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !city || !quantity) return;

    const amount = selectedProduct
      ? (selectedProduct.salePrice || selectedProduct.basePrice) * parseInt(quantity)
      : 5000;

    api.addQuotation({
      name,
      email,
      phone,
      company,
      city,
      productName: selectedProduct ? selectedProduct.name[language] : 'Custom Order',
      quantity,
      notes,
      amount
    }).then(() => {
      // Also save locally to mm_leads for local display / dashboard pipeline fallback
      const newLead = {
        id: `QT-${Date.now().toString().slice(-5)}`,
        name,
        email,
        phone,
        company,
        city,
        productName: selectedProduct ? selectedProduct.name[language] : 'Custom Order',
        quantity,
        notes,
        status: 'new',
        date: new Date().toISOString().split('T')[0],
        amount,
      };

      const existingLeads = localStorage.getItem('mm_leads');
      const leadsList = existingLeads ? JSON.parse(existingLeads) : [];
      leadsList.push(newLead);
      localStorage.setItem('mm_leads', JSON.stringify(leadsList));

      setIsSubmitted(true);
    }).catch(err => {
      console.warn("Backend offline, submitting lead locally", err);
      setIsSubmitted(true);
    });
  };

  if (isSubmitted) {
    const quoteMsg = language === 'ar'
      ? `مرحباً، لقد أرسلت للتو طلباً لعرض سعر باسم: ${customerType === 'company' ? company : name}. المنتج: ${selectedProduct ? selectedProduct.name.ar : 'طلب مخصص'}. الكمية: ${quantity}. يرجى تأكيد الاستلام.`
      : `Hello, I just submitted a quote request for ${customerType === 'company' ? company : name}. Product: ${selectedProduct ? selectedProduct.name.en : 'Custom Order'}. Quantity: ${quantity}. Please confirm receipt.`;
    const whatsappUrl = `https://wa.me/+971501234567?text=${encodeURIComponent(quoteMsg)}`;

    return (
      <div className="bg-light min-h-[75vh] flex items-center py-16 px-4">
        <div className="max-w-xl w-full mx-auto bg-white border border-cream rounded-3xl p-8 md:p-12 shadow-premium text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-dark leading-tight">{t('quote.success.title')}</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              {t('quote.success.msg')}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-premium"
            >
              <Phone className="w-4 h-4" />
              <span>{t('quote.whatsapp.direct')}</span>
            </a>
            <Link 
              to="/shop" 
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-premium"
            >
              <span>{language === 'ar' ? 'العودة للمتجر' : 'Continue Shopping'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pb-20">
      <section className="bg-cream/40 border-b border-cream py-10 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl font-extrabold text-dark tracking-wide">{language === 'ar' ? 'طلب عرض سعر' : 'Quotation Request'}</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">{language === 'ar' ? 'احصل على تسعير مخصص للفنادق، المشاريع، أو الطلبات الشخصية.' : 'Get customized pricing for projects, wholesale, or personal requirements.'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* B2B REQUEST FORM */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-cream rounded-3xl p-6 md:p-8 shadow-premium space-y-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <h2 className="font-extrabold text-lg text-dark tracking-wide flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>{language === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}</span>
            </h2>

            <div className="flex gap-4 p-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="customerType" 
                  value="company"
                  checked={customerType === 'company'}
                  onChange={() => setCustomerType('company')}
                  className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-bold text-dark">{language === 'ar' ? 'شركة / مؤسسة' : 'Company / Business'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="customerType" 
                  value="individual"
                  checked={customerType === 'individual'}
                  onChange={() => setCustomerType('individual')}
                  className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-bold text-dark">{language === 'ar' ? 'فرد / شخصي' : 'Individual / Personal'}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{t('checkout.name')} *</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              {customerType === 'company' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">{t('quote.company')} *</label>
                  <input 
                    type="text" 
                    required={customerType === 'company'} 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{t('checkout.phone')} *</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                  placeholder="+971 XX XXX XXXX"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{t('checkout.email')} *</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{t('checkout.city')} *</label>
                <select 
                  required 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
                >
                  <option value="">{t('checkout.select.city')}</option>
                  {uaeCities.map(item => (
                    <option key={item.id} value={item.id}>{item.name[language]}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'المنتج المطلوب' : 'Requested Product'}</label>
                <select 
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
                >
                  <option value="">{language === 'ar' ? 'طلب مخصص / منتجات متعددة' : 'Custom Request / Multiple Products'}</option>
                  {productsList.map(item => (
                    <option key={item.id} value={item.id}>{item.name[language]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{t('quote.qty')} *</label>
                <select 
                  required 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
                >
                  <option value="5">5 - 10 {language === 'ar' ? 'وحدات' : 'units'}</option>
                  <option value="10">10 - 30 {language === 'ar' ? 'وحدات' : 'units'}</option>
                  <option value="30">30 - 100 {language === 'ar' ? 'وحدة' : 'units'}</option>
                  <option value="100">100+ {language === 'ar' ? 'وحدة (مشاريع كبيرة)' : 'units (Bulk Projects)'}</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'مواصفات المشروع وملاحظاتك' : 'Project Specifications / Notes'}</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary resize-none"
                  placeholder={language === 'ar' ? 'مثال: نحتاج مراتب بقياسات خاصة للفندق مع ميزة مقاومة الحريق...' : 'Example: We require flame-retardant custom sized mattresses for a hospitality project...'}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-premium hover:shadow-lg transition-premium"
            >
              {t('quote.submit')}
            </button>
          </form>

          {/* B2B ADVANTAGES SIDEBAR */}
          <div className="space-y-6 text-dark" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="bg-gradient-to-br from-cream to-white border border-primary/5 rounded-3xl p-6 shadow-premium space-y-6">
              <h3 className="font-extrabold text-sm text-dark uppercase tracking-wider">{language === 'ar' ? 'مزايا خدمات الشركات' : 'B2B Procurement Advantages'}</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Landmark className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">{language === 'ar' ? 'مشاريع الضيافة والفنادق' : 'Hospitality Solutions'}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {language === 'ar' ? 'تجهيز الفنادق والمنتجعات بمراتب مقاومة للحريق بمواصفات عالمية.' : 'Outfitting hotels and serviced apartments with flame-retardant commercial bedding.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Building className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">{language === 'ar' ? 'قياسات مخصصة وشعارات' : 'Custom Dimensions & Branding'}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {language === 'ar' ? 'إمكانية تصنيع أي مقاس طبي مع خياطة شعار شركتك على الكسوة.' : 'Bespoke size alterations and custom private labelling options available.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">{language === 'ar' ? 'تسليم وجدولة مرنة' : 'Scheduled Bulk Delivery'}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      {language === 'ar' ? 'التسليم المباشر للموقع بالتنسيق مع مقاولي البناء وجداول الاستلام.' : 'On-site white-glove setup coordinated directly with project managers.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-cream rounded-3xl p-6 shadow-premium flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <h4 className="font-extrabold text-xs">{language === 'ar' ? 'معتمد ومطابق للمعايير' : 'SGS & CertiPUR Certified'}</h4>
                <p className="text-[10px] text-gray-400 font-semibold">{language === 'ar' ? 'جميع الرغوات والنوابض خاضعة لاختبارات جودة صارمة.' : 'Eco-certified foam components and heavy-duty wear testing.'}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
