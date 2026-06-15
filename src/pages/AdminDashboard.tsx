import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { uaeCities } from '../data/mockData';
import { api } from '../lib/api';
import { Landmark, TrendingUp, Users, FileCheck, Phone, Check, RefreshCw, Send, Trash2, Plus, LayoutGrid, ClipboardList, CheckCircle2, Settings } from 'lucide-react';
import { AddProductForm } from '../components/AddProductForm';

interface Lead {
  id: string;
  quoteNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  productName: string;
  quantity: string;
  notes: string;
  status: 'new' | 'contacted' | 'quoted' | 'approved' | 'rejected';
  date: string;
  amount: number;
}

interface Category {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  image: string;
}

interface Brand {
  id: string;
  name: string;
  logo: string;
}

export const AdminDashboard: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'quotes' | 'products' | 'categories' | 'offers' | 'brands'>('quotes');

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductData, setEditingProductData] = useState<any>(null);

  // Category Form State
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameAr, setCatNameAr] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSuccess, setCatSuccess] = useState(false);

  // Brand Form State
  const [brandName, setBrandName] = useState('');
  const [brandSlug, setBrandSlug] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandSuccess, setBrandSuccess] = useState(false);

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    const leadsData = await api.getQuotations();
    const categoriesData = await api.getCategories();
    const productsData = await api.getProducts();
    const brandsData = await api.getBrands();
    setLeads(leadsData);
    setCategories(categoriesData);
    setProductsList(productsData);
    setBrands(brandsData);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Lead['status']) => {
    await api.updateQuotationStatus(id, newStatus);
    fetchDashboardData();
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      await api.deleteQuotation(id);
      fetchDashboardData();
    }
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn || !catNameAr) return;

    await api.addCategory({
      name_en: catNameEn,
      name_ar: catNameAr,
      image_url: catImage || undefined
    });

    setCatNameEn('');
    setCatNameAr('');
    setCatImage('');
    setCatSuccess(true);
    fetchDashboardData();
    setTimeout(() => setCatSuccess(false), 3000);
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !brandSlug) return;

    await api.addBrand({
      name: brandName,
      id: brandSlug,
      logo: brandLogo || 'https://via.placeholder.com/150?text=Brand'
    });

    setBrandName('');
    setBrandSlug('');
    setBrandLogo('');
    setBrandSuccess(true);
    fetchDashboardData();
    setTimeout(() => setBrandSuccess(false), 3000);
  };

  const handleDeleteBrand = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف الماركة؟' : 'Are you sure you want to delete this brand?')) {
      await api.deleteBrand(id);
      fetchDashboardData();
    }
  };

  // Calculate Metrics
  const totalSales = leads
    .filter(l => l.status === 'approved')
    .reduce((sum, l) => sum + l.amount, 142500);

  const pendingQuotesCount = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
  const totalLeadsCount = leads.length;
  const conversionRate = totalLeadsCount > 0 
    ? ((leads.filter(l => l.status === 'approved').length / totalLeadsCount) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Dashboard Top Banner */}
      <section className="bg-white border-b border-cream py-10 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide font-sans text-dark">{t('admin.dashboard')}</h1>
            <p className="text-xs text-primary font-bold uppercase tracking-widest">
              {language === 'ar' ? 'نظام الباك اند وإدارة المنتجات' : 'Administration Portal'}
            </p>
          </div>
          <button 
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{language === 'ar' ? 'تحديث البيانات' : 'Sync Databases'}</span>
          </button>
        </div>
      </section>

      {/* Main Content Containers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        
        {/* TAB CONTROLLERS */}
        <div className="flex border-b border-cream bg-white p-2 rounded-2xl shadow-premium gap-2 w-full max-w-lg">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quotes'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-400 hover:text-dark hover:bg-cream/40'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>{language === 'ar' ? 'عروض الأسعار' : 'Quotation Pipeline'}</span>
          </button>
          <button
            onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-400 hover:text-dark hover:bg-cream/40'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{language === 'ar' ? 'المنتجات' : 'Products'}</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-400 hover:text-dark hover:bg-cream/40'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'الأقسام' : 'Categories'}</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'offers'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-400 hover:text-dark hover:bg-cream/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'العروض' : 'Offers'}</span>
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'brands'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-400 hover:text-dark hover:bg-cream/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'الشركات' : 'Brands'}</span>
          </button>
        </div>

        {/* Tab 1: Quotes Pipeline */}
        {activeTab === 'quotes' && (
          <div className="space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-cream rounded-2xl p-5 shadow-card flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('admin.metric.sales')}</span>
                  <p className="text-lg font-extrabold text-primary">{totalSales.toLocaleString()} AED</p>
                </div>
                <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary border border-primary/5">
                  <Landmark className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-white border border-cream rounded-2xl p-5 shadow-card flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('admin.metric.quotes')}</span>
                  <p className="text-lg font-extrabold text-dark">{pendingQuotesCount}</p>
                </div>
                <div className="w-10 h-10 bg-amber-500/5 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/5">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-white border border-cream rounded-2xl p-5 shadow-card flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('admin.metric.leads')}</span>
                  <p className="text-lg font-extrabold text-dark">{totalLeadsCount}</p>
                </div>
                <div className="w-10 h-10 bg-secondary/5 rounded-lg flex items-center justify-center text-secondary border border-secondary/5">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="bg-white border border-cream rounded-2xl p-5 shadow-card flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('admin.metric.conversion')}</span>
                  <p className="text-lg font-extrabold text-emerald-600">{conversionRate}%</p>
                </div>
                <div className="w-10 h-10 bg-emerald-500/5 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-500/5">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quotations List */}
            <div className="bg-white border border-cream rounded-3xl shadow-premium overflow-hidden">
              <div className="px-6 py-4 border-b border-cream bg-cream/10">
                <h2 className="font-extrabold text-sm text-dark tracking-wide">{t('admin.pipeline.title')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs text-dark">
                  <thead>
                    <tr className="bg-cream/20 text-gray-400 font-bold border-b border-cream">
                      <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>ID</th>
                      <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('admin.customer.name')}</th>
                      <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{t('quote.company')}</th>
                      <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'المنتج' : 'Product'}</th>
                      <th className="p-4 text-center">{t('admin.customer.qty')}</th>
                      <th className="p-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="p-4 text-right" style={{ textAlign: isRtl ? 'left' : 'right' }}>{t('admin.customer.amount')}</th>
                      <th className="p-4 text-center">{t('admin.customer.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream font-medium">
                    {leads.map((lead) => {
                      const cityObj = uaeCities.find(c => c.id === lead.city);
                      const whatsappMsg = `Dear ${lead.name}, thank you for your B2B quote request for ${lead.company}. We are happy to help you...`;
                      const whatsappUrl = `https://wa.me/${lead.phone}?text=${encodeURIComponent(whatsappMsg)}`;

                      return (
                        <tr key={lead.id} className="hover:bg-cream/10 transition-colors">
                          <td className="p-4 font-bold text-gray-400">{lead.quoteNumber}</td>
                          <td className="p-4">
                            <div>
                              <div className="font-bold text-dark">{lead.name}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5">{lead.email} &bull; {cityObj ? cityObj.name[language] : lead.city}</div>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-secondary">{lead.company}</td>
                          <td className="p-4 truncate max-w-[150px]">{lead.productName}</td>
                          <td className="p-4 text-center font-bold text-dark">{lead.quantity}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider inline-block ${
                              lead.status === 'new' ? 'bg-amber-500/10 text-amber-600' :
                              lead.status === 'contacted' ? 'bg-blue-500/10 text-blue-600' :
                              lead.status === 'quoted' ? 'bg-primary/10 text-primary' :
                              lead.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                              'bg-gray-500/10 text-gray-600'
                            }`}>
                              {lead.status === 'new' && t('admin.pipeline.new')}
                              {lead.status === 'contacted' && t('admin.pipeline.contacted')}
                              {lead.status === 'quoted' && t('admin.pipeline.quoted')}
                              {lead.status === 'approved' && t('admin.pipeline.approved')}
                              {lead.status === 'rejected' && t('admin.pipeline.rejected')}
                            </span>
                          </td>
                          <td className="p-4 text-right font-extrabold text-primary" style={{ textAlign: isRtl ? 'left' : 'right' }}>
                            {lead.amount.toLocaleString()} AED
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              {lead.status === 'new' && (
                                <button
                                  onClick={() => handleUpdateStatus(lead.id, 'contacted')}
                                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-1.5 rounded-lg transition-colors"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {(lead.status === 'new' || lead.status === 'contacted') && (
                                <button
                                  onClick={() => handleUpdateStatus(lead.id, 'quoted')}
                                  className="bg-primary hover:bg-primary-dark text-white font-bold p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] px-2"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>{t('admin.action.send')}</span>
                                </button>
                              )}
                              {lead.status === 'quoted' && (
                                <button
                                  onClick={() => handleUpdateStatus(lead.id, 'approved')}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] px-2"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{language === 'ar' ? 'موافقة' : 'Approve'}</span>
                                </button>
                              )}
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1.5 rounded-lg transition-colors flex items-center justify-center"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-gray-300 hover:text-primary transition-colors p-1.5 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {isEditingProduct ? (
              <div className="space-y-4">
                <button 
                  onClick={() => { setIsEditingProduct(false); setEditingProductData(null); }}
                  className="text-xs font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                >
                  &larr; {language === 'ar' ? 'العودة لقائمة المنتجات' : 'Back to Products'}
                </button>
                <AddProductForm 
                  categories={categories} 
                  initialData={editingProductData}
                  onSuccess={() => {
                    fetchDashboardData();
                    setIsEditingProduct(false);
                    setEditingProductData(null);
                  }} 
                  onCancel={() => {
                    setIsEditingProduct(false);
                    setEditingProductData(null);
                  }} 
                />
              </div>
            ) : (
              <div className="bg-white border border-cream rounded-3xl shadow-premium overflow-hidden animate-fadeIn">
                <div className="px-6 py-5 border-b border-cream bg-cream/10 flex justify-between items-center">
                  <h2 className="font-extrabold text-sm text-dark tracking-wide">{language === 'ar' ? 'إدارة المنتجات' : 'Manage Products'}</h2>
                  <button 
                    onClick={() => { setEditingProductData(null); setIsEditingProduct(true); }}
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-dark">
                    <thead>
                      <tr className="bg-cream/20 text-gray-400 font-bold border-b border-cream">
                        <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'المنتج' : 'Product'}</th>
                        <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'القسم' : 'Category'}</th>
                        <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'السعر' : 'Price'}</th>
                        <th className="p-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream font-medium">
                      {productsList.map((prod) => (
                        <tr key={prod.id} className="hover:bg-cream/10 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'} alt="" className="w-12 h-12 rounded-xl object-cover border border-cream shadow-sm" />
                              <span className="font-bold text-dark text-sm">{prod.name?.[language] || 'Product'}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500 font-bold uppercase tracking-wider">{prod.category}</td>
                          <td className="p-4 font-extrabold text-primary text-sm">{prod.salePrice || prod.basePrice} AED</td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => { setEditingProductData(prod); setIsEditingProduct(true); }}
                                className="text-blue-600 hover:text-white bg-blue-500/10 hover:bg-blue-600 p-2 rounded-lg transition-colors font-bold px-4"
                              >
                                {language === 'ar' ? 'تعديل' : 'Edit'}
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this product?')) {
                                    await api.deleteProduct(prod.id);
                                    fetchDashboardData();
                                  }
                                }}
                                className="text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 p-2.5 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {productsList.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-400 font-bold">
                            {language === 'ar' ? 'لا توجد منتجات حالياً.' : 'No products found.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Add Category Form */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-cream rounded-3xl p-6 md:p-8 shadow-premium max-w-xl mx-auto space-y-6">
            <div>
              <h2 className="font-extrabold text-lg text-dark tracking-wide">{language === 'ar' ? 'إضافة قسم جديد لقاعدة البيانات' : 'Add New Category to MySQL DB'}</h2>
              <p className="text-xs text-gray-400 mt-1">{language === 'ar' ? 'سيظهر القسم المضاف في القائمة والكتالوج مباشرة.' : 'New categories instantly update shop navigation lists.'}</p>
            </div>

            {catSuccess && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl p-4 border border-emerald-100 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{language === 'ar' ? 'تم حفظ القسم بنجاح!' : 'Category saved in XAMPP MySQL database successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'اسم القسم بالإنجليزية' : 'Category Name (EN)'} *</label>
                <input 
                  type="text" required value={catNameEn} onChange={e => setCatNameEn(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Luxury Carpets"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'اسم القسم بالعربية' : 'Category Name (AR)'} *</label>
                <input 
                  type="text" required value={catNameAr} onChange={e => setCatNameAr(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                  placeholder="مثال: السجاد الفاخر"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'رابط صورة الغلاف' : 'Cover Image URL'}</label>
                <input 
                  type="text" value={catImage} onChange={e => setCatImage(e.target.value)}
                  className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs shadow-premium hover:shadow-lg transition-premium"
              >
                {language === 'ar' ? 'حفظ القسم الجديد' : 'Save Category'}
              </button>
            </form>
          </div>
        )}

        {/* OFFERS TAB */}
        {activeTab === 'offers' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-premium border border-cream animate-fadeIn space-y-8">
            <div className="border-b border-cream pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-dark">{language === 'ar' ? 'إدارة العروض والتايمر' : 'Offers & Timer Management'}</h2>
                <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'التحكم في تايمر الخصومات (Flash Sale) بالصفحة الرئيسية' : 'Control the flash sale countdown on the home page'}</p>
              </div>
            </div>

            <div className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{language === 'ar' ? 'حالة التايمر' : 'Timer Status'}</label>
                <div className="flex items-center gap-6 bg-cream/30 p-4 rounded-xl border border-cream">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="timer_status" 
                      checked={localStorage.getItem('mm_flash_sale_active') !== 'false'}
                      onChange={() => localStorage.setItem('mm_flash_sale_active', 'true')}
                      className="text-primary w-4 h-4 focus:ring-primary"
                    />
                    <span className="text-sm font-semibold">{language === 'ar' ? 'مفعل (Active)' : 'Active'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="timer_status" 
                      checked={localStorage.getItem('mm_flash_sale_active') === 'false'}
                      onChange={() => localStorage.setItem('mm_flash_sale_active', 'false')}
                      className="text-primary w-4 h-4 focus:ring-primary"
                    />
                    <span className="text-sm font-semibold">{language === 'ar' ? 'معطل (Hidden)' : 'Hidden'}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{language === 'ar' ? 'تاريخ ووقت انتهاء العرض' : 'Offer End Date & Time'}</label>
                <input 
                  type="datetime-local" 
                  defaultValue={localStorage.getItem('mm_flash_sale_end') ? new Date(localStorage.getItem('mm_flash_sale_end')!).toISOString().slice(0,16) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      localStorage.setItem('mm_flash_sale_end', new Date(e.target.value).toISOString());
                    }
                  }}
                  className="w-full bg-cream border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all font-semibold"
                />
              </div>

              <button 
                onClick={() => {
                  alert(language === 'ar' ? 'تم الحفظ بنجاح! انتقل للصفحة الرئيسية لرؤية التغييرات' : 'Saved successfully!');
                }}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-premium text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Settings className="w-4 h-4" />
                {language === 'ar' ? 'حفظ إعدادات العرض' : 'Save Offer Settings'}
              </button>
            </div>
          </div>
        )}

        {/* BRANDS TAB */}
        {activeTab === 'brands' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-cream rounded-3xl shadow-premium overflow-hidden">
                <div className="px-6 py-4 border-b border-cream bg-cream/10">
                  <h2 className="font-extrabold text-sm text-dark tracking-wide">{language === 'ar' ? 'الشركات الحالية' : 'Current Brands'}</h2>
                </div>
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {brands.map(brand => (
                    <div key={brand.id} className="border border-cream rounded-xl p-4 flex flex-col items-center justify-center gap-3 relative group">
                      <button 
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-contain" />
                      <span className="text-xs font-bold text-dark text-center">{brand.name}</span>
                    </div>
                  ))}
                  {brands.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-400 text-sm font-semibold">
                      {language === 'ar' ? 'لا يوجد ماركات حالياً' : 'No brands found'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-cream rounded-3xl p-6 shadow-premium sticky top-24">
                <h3 className="font-extrabold text-dark mb-6 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'إضافة شركة جديدة' : 'Add New Brand'}
                </h3>

                {brandSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-bold">{language === 'ar' ? 'تمت إضافة الشركة بنجاح!' : 'Brand added successfully!'}</span>
                  </div>
                )}

                <form onSubmit={handleAddBrand} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'اسم الشركة' : 'Brand Name'} *</label>
                    <input 
                      type="text" required value={brandName} onChange={e => {
                        setBrandName(e.target.value);
                        setBrandSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                      }}
                      className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                      placeholder="e.g. Silentnight"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'المعرف (Slug)' : 'Brand Slug'} *</label>
                    <input 
                      type="text" required value={brandSlug} onChange={e => setBrandSlug(e.target.value)}
                      className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                      placeholder="e.g. silentnight"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400">{language === 'ar' ? 'رابط صورة اللوجو' : 'Logo URL'}</label>
                    <input 
                      type="text" value={brandLogo} onChange={e => setBrandLogo(e.target.value)}
                      className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs shadow-premium hover:shadow-lg transition-premium"
                  >
                    {language === 'ar' ? 'حفظ الشركة الجديدة' : 'Save Brand'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
