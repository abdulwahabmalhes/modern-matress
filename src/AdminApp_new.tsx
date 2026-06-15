import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { api } from './lib/api';
import { uaeCities } from './data/mockData';
import { 
  Landmark, TrendingUp, Users, FileCheck, Phone, RefreshCw, 
  Trash2, LayoutGrid, ClipboardList, Settings, CheckCircle2, 
  Globe, BarChart3, Eye, Database, Folder, PlusCircle, Tag, X, Printer, Image, Upload
} from 'lucide-react';

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
  dbId?: number;
  slug: string;
  name: { en: string; ar: string };
  image: string;
  parent_id?: number | null;
}

interface FilterGroup {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  options: { id: number; group_id: number; value_en: string; value_ar: string }[];
}

export const AdminApp: React.FC = () => {
  return (
    <LanguageProvider>
      <AdminDashboardLayout />
    </LanguageProvider>
  );
};

const AdminDashboardLayout: React.FC = () => {
  const { setLanguage, t: contextT } = useLanguage();
  const getLanguage = (): 'en' | 'ar' => 'en';
  const language = getLanguage();
  const isRtl = false;
  const t = (key: string) => contextT(key);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'reports' | 'quotes' | 'products' | 'categories' | 'filters' | 'invoices' | 'customers' | 'banners' | 'media'>('reports');

  // DB Sync Status
  const [dbStatus, setDbStatus] = useState<'connected' | 'fallback'>('connected');

  // API Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterGroup[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Media Library state
  const [mediaSuccess, setMediaSuccess] = useState('');
  const [mediaError, setMediaError] = useState('');
  
  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'product' | 'category' | 'banner' | ''>('');


  // Banner Form State
  const [bannerTitleEn, setBannerTitleEn] = useState('');
  const [bannerTitleAr, setBannerTitleAr] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  // Invoice viewing modal states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalStatus, setOrderModalStatus] = useState('');
  const [orderModalPayStatus, setOrderModalPayStatus] = useState('');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState(false);

  // Category Form State
  const [catNameEn, setCatNameEn] = useState('');
  const [catNameAr, setCatNameAr] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catParentId, setCatParentId] = useState<string>('');
  const [catSuccess, setCatSuccess] = useState(false);

  // Filter Group Form State
  const [filterNameEn, setFilterNameEn] = useState('');
  const [filterNameAr, setFilterNameAr] = useState('');
  const [filterSuccess, setFilterSuccess] = useState(false);

  // Filter Option Form State
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [optionValEn, setOptionValEn] = useState('');
  const [optionValAr, setOptionValAr] = useState('');
  const [optionSuccess, setOptionSuccess] = useState(false);

  // Product Form State
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodNameAr, setProdNameAr] = useState('');
  const [prodBrand, setProdBrand] = useState('Modern Mattresses');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodBasePrice, setProdBasePrice] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodFirmness, setProdFirmness] = useState('medium');
  const [prodWarranty, setProdWarranty] = useState('120');
  const [prodShortEn, setProdShortEn] = useState('');
  const [prodShortAr, setProdShortAr] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodDescAr, setProdDescAr] = useState('');
  const [prodImagesUrl, setProdImagesUrl] = useState('');
  
  // Selected Filter Options (check-boxes)
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);

  // Variations list builder state
  const [variationsList, setVariationsList] = useState<{ size: string; price: string; salePrice?: string; stock: string }[]>([
    { size: 'Queen (160x200 cm)', price: '2400', stock: '20' }
  ]);
  const [prodSuccess, setProdSuccess] = useState(false);

  const fetchAllData = async () => {
    setIsRefreshing(true);
    try {
      // Test connectivity
      const testFetch = await fetch('http://127.0.0.1:8000/api/v1/categories').catch(() => null);
      if (testFetch && testFetch.ok) {
        setDbStatus('connected');
      } else {
        setDbStatus('fallback');
      }

      const leadsData = await api.getQuotations();
      const categoriesData = await api.getCategories();
      const filtersData = await api.getFilters();
      const productsData = await api.getProducts();
      const ordersData = await api.getOrders();
      const customersData = await api.getCustomers();
      const bannersData = await api.getBanners();
      const mediaData = await api.getMedia();

      setLeads(leadsData);
      setCategories(categoriesData);
      setFilters(filtersData);
      setProducts(productsData);
      setOrders(ordersData);
      setCustomers(customersData);
      setBanners(bannersData);
      setMediaList(mediaData);

      if (categoriesData.length > 0 && !prodCategoryId) {
        setProdCategoryId(String(categoriesData[0].dbId || categoriesData[0].id));
      }
      if (filtersData.length > 0 && !selectedGroupId) {
        setSelectedGroupId(String(filtersData[0].id));
      }
    } catch (e) {
      console.error('Failed to sync admin dashboard data', e);
      setDbStatus('fallback');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleUpdateStatus = async (id: string, newStatus: Lead['status']) => {
    await api.updateQuotationStatus(id, newStatus);
    fetchAllData();
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      await api.deleteQuotation(id);
      fetchAllData();
    }
  };

  // Add Category Handler (Top-level or sub-category)
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameEn || !catNameAr) return;

    await api.addCategory({
      name_en: catNameEn,
      name_ar: catNameAr,
      image_url: catImage || undefined,
      parent_id: catParentId ? Number(catParentId) : undefined
    });

    setCatNameEn('');
    setCatNameAr('');
    setCatImage('');
    setCatParentId('');
    setCatSuccess(true);
    fetchAllData();
    setTimeout(() => setCatSuccess(false), 3000);
  };

  // Add Custom Filter Group
  const handleAddFilterGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterNameEn || !filterNameAr) return;

    await api.addFilterGroup({
      name_en: filterNameEn,
      name_ar: filterNameAr
    });

    setFilterNameEn('');
    setFilterNameAr('');
    setFilterSuccess(true);
    fetchAllData();
    setTimeout(() => setFilterSuccess(false), 3000);
  };

  // Add Option to Filter Group
  const handleAddFilterOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !optionValEn || !optionValAr) return;

    await api.addFilterOption({
      group_id: Number(selectedGroupId),
      value_en: optionValEn,
      value_ar: optionValAr
    });

    setOptionValEn('');
    setOptionValAr('');
    setOptionSuccess(true);
    fetchAllData();
    setTimeout(() => setOptionSuccess(false), 3000);
  };

  // Add Variation to List
  const addVariationField = () => {
    setVariationsList(prev => [...prev, { size: 'King (180x200 cm)', price: '2800', stock: '20' }]);
  };

  const updateVariationItem = (index: number, key: string, val: string) => {
    setVariationsList(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [key]: val };
      }
      return item;
    }));
  };

  const removeVariationItem = (index: number) => {
    setVariationsList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Toggle custom filter attributes selection for new products
  const handleToggleAttribute = (id: number) => {
    setSelectedAttributeIds(prev => 
      prev.includes(id) ? prev.filter(attrId => attrId !== id) : [...prev, id]
    );
  };

  // Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameEn || !prodNameAr || !prodCategoryId || !prodBasePrice) return;

    const images = prodImagesUrl
      ? prodImagesUrl.split(',').map(img => img.trim())
      : ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop'];

    const newProduct = {
      nameEn: prodNameEn,
      nameAr: prodNameAr,
      categoryId: prodCategoryId,
      brand: prodBrand,
      basePrice: Number(prodBasePrice),
      salePrice: prodSalePrice ? Number(prodSalePrice) : undefined,
      firmness: prodFirmness,
      warrantyMonths: Number(prodWarranty),
      shortDescriptionEn: prodShortEn,
      shortDescriptionAr: prodShortAr,
      descriptionEn: prodDescEn,
      descriptionAr: prodDescAr,
      images: images,
      variations: variationsList.map(v => ({
        size: v.size,
        price: Number(v.price),
        salePrice: v.salePrice ? Number(v.salePrice) : undefined,
        stock: Number(v.stock),
      })),
      attributes: selectedAttributeIds // dynamic filter options database ids
    };

    await api.addProduct(newProduct);

    // Reset Form
    setProdNameEn('');
    setProdNameAr('');
    setProdBasePrice('');
    setProdSalePrice('');
    setProdShortEn('');
    setProdShortAr('');
    setProdDescEn('');
    setProdDescAr('');
    setProdImagesUrl('');
    setSelectedAttributeIds([]);
    setVariationsList([{ size: 'Queen (160x200 cm)', price: '2400', stock: '20' }]);
    setProdSuccess(true);
    fetchAllData();
    setTimeout(() => setProdSuccess(false), 3000);
  };

  // Add Banner Handler
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitleEn || !bannerTitleAr || !bannerImage) return;

    await api.addBanner({
      title_en: bannerTitleEn,
      title_ar: bannerTitleAr,
      image_url: bannerImage,
      link: bannerLink || undefined
    });

    setBannerTitleEn('');
    setBannerTitleAr('');
    setBannerImage('');
    setBannerLink('');
    setBannerSuccess(true);
    fetchAllData();
    setTimeout(() => setBannerSuccess(false), 3000);
  };

  const handleDeleteBanner = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) {
      await api.deleteBanner(id);
      fetchAllData();
    }
  };

  // Media Library Handlers
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to ~2MB for localStorage testing, though 5MB is absolute limit)
    if (file.size > 2 * 1024 * 1024) {
      setMediaError(language === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 2MB)' : 'File too large (Max 2MB)');
      setTimeout(() => setMediaError(''), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        await api.uploadMedia({
          name: file.name,
          type: file.type,
          base64: base64,
          size: file.size
        });
        setMediaSuccess(language === 'ar' ? 'تم رفع الصورة بنجاح!' : 'Media uploaded successfully!');
        fetchAllData();
        setTimeout(() => setMediaSuccess(''), 3000);
      } catch (error: any) {
        setMediaError(error.message || 'Upload failed');
        setTimeout(() => setMediaError(''), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this media?')) {
      await api.deleteMedia(id);
      fetchAllData();
    }
  };

  const handleSelectMedia = (url: string) => {
    if (mediaPickerTarget === 'product') {
      setProdImagesUrl(prev => prev ? `${prev},${url}` : url);
    } else if (mediaPickerTarget === 'category') {
      setCatImage(url);
    } else if (mediaPickerTarget === 'banner') {
      setBannerImage(url);
    }
    setIsMediaPickerOpen(false);
  };

  // Metrics calculations
  const approvedLeads = leads.filter(l => l.status === 'approved');
  const b2bSales = approvedLeads.reduce((sum, l) => sum + l.amount, 0);
  const invoiceSales = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_amount), 0);
  const totalSales = b2bSales + invoiceSales;

  const pendingQuotesCount = leads.filter(l => l.status === 'new' || l.status === 'contacted').length + orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const totalLeadsCount = leads.length + orders.length;
  
  const conversionRate = totalLeadsCount > 0 
    ? (((approvedLeads.length + orders.filter(o => o.payment_status === 'paid').length) / totalLeadsCount) * 100).toFixed(1)
    : '0';

  // Group leads by city for visual reports
  const cityStats = uaeCities.map(city => {
    const cityLeads = leads.filter(l => l.city === city.id);
    const revenue = cityLeads.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.amount, 0);
    return {
      name: city.name[language],
      count: cityLeads.length,
      revenue
    };
  }).sort((a, b) => b.count - a.count);

  // Custom Svg Line Chart Data Generator
  const generateChartPoints = () => {
    const width = 600;
    const height = 180;
    const padding = 30;
    
    // Sort leads by date or use static mock week days if no leads
    const days = [
      { day: language === 'ar' ? 'الأحد' : 'Sun', val: 12000 },
      { day: language === 'ar' ? 'الإثنين' : 'Mon', val: 24000 },
      { day: language === 'ar' ? 'الثلاثاء' : 'Tue', val: 18000 },
      { day: language === 'ar' ? 'الأربعاء' : 'Wed', val: 32000 },
      { day: language === 'ar' ? 'الخميس' : 'Thu', val: 45000 },
      { day: language === 'ar' ? 'الجمعة' : 'Fri', val: 38000 },
      { day: language === 'ar' ? 'السبت' : 'Sat', val: 54000 },
    ];

    // If leads are present, overwrite with actual amounts grouped by city/day dynamically
    if (leads.length > 0) {
      // Map B2B quotation approvals to chart values for premium visual fidelity
      const citySum = cityStats.slice(0, 7);
      const mapped = citySum.map((c, i) => ({
        day: c.name,
        val: c.revenue > 0 ? c.revenue : (i + 1) * 8500
      }));
      if (mapped.length > 0) {
        return mapped.map((d, index) => {
          const maxVal = Math.max(...mapped.map(item => item.val), 1);
          const x = padding + (index * (width - padding * 2)) / (mapped.length - 1);
          const y = height - padding - (d.val * (height - padding * 2)) / maxVal;
          return { x, y, label: d.day, val: d.val };
        });
      }
    }

    return days.map((d, index) => {
      const maxVal = Math.max(...days.map(item => item.val), 1);
      const x = padding + (index * (width - padding * 2)) / (days.length - 1);
      const y = height - padding - (d.val * (height - padding * 2)) / maxVal;
      return { x, y, label: d.day, val: d.val };
    });
  };

  const chartPoints = generateChartPoints();
  const pathD = chartPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} Q ${(p.x + chartPoints[i-1].x)/2} ${chartPoints[i-1].y}, ${p.x} ${p.y}`;
  }, '');
  const areaD = chartPoints.length > 0 
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x} ${150} L ${chartPoints[0].x} ${150} Z`
    : '';

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-primary/30 selection:text-dark"
         style={{ 
           direction: isRtl ? 'rtl' : 'ltr',
           background: '#f4f7fb' 
         }}>
      
      {/* TOP GLOW BAR */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary shadow-lg" />

      {/* DASHBOARD CONTAINER */}
      <div className="flex flex-col lg:flex-row flex-grow">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-72 bg-white backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between p-6 z-20 shrink-0">
          <div className="space-y-8">
            {/* Logo area */}
            <div className="flex items-center gap-3.5 pb-6 border-b border-gray-200">
              <div className="p-2.5 bg-gradient-to-br from-primary to-primary-dark rounded-2xl shadow-lg shadow-primary/20">
                <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 80V25L35 60L55 25V80H43V45L35 58L27 45V80H15Z" fill="#1e293b" />
                  <path d="M45 80V25L65 60L85 25V80H73V45L65 58L57 45V80H45Z" fill="#d4af37" opacity="0.9" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-wide uppercase leading-none bg-gradient-to-r from-white via-slate-100 to-gray-300 bg-clip-text text-transparent">
                  Modern Mattresses
                </h1>
                <span className="text-[10px] text-gray-500 font-bold tracking-widest mt-1 block uppercase">{language === 'ar' ? 'لوحة المبيعات الإدارية' : 'Admin Operations'}</span>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1.5">
              {[
                { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
                { id: 'quotes', label: 'Quotation Pipeline', icon: ClipboardList },
                { id: 'invoices', label: 'Invoices & Orders', icon: Landmark },
                { id: 'customers', label: 'Customers Manager', icon: Users },
                { id: 'media', label: 'Media Library', icon: Image },
                { id: 'banners', label: 'Banners Manager', icon: LayoutGrid },
                { id: 'categories', label: 'Categories Manager', icon: Folder },
                { id: 'filters', label: 'Dynamic Fields', icon: Settings },
                { id: 'products', label: 'Products CRUD', icon: Tag },
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-xs font-extrabold transition-all duration-300 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary/25 to-secondary/10 border-l-4 border-primary text-dark shadow-lg shadow-primary/5' 
                        : 'text-slate-500 hover:text-dark hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Info */}
          <div className="pt-6 border-t border-gray-200 space-y-4 text-xs">
            {/* Database status widget */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{language === 'ar' ? 'قاعدة البيانات' : 'Database Status'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse shadow-emerald-500/50 shadow-md' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-[10px] font-bold uppercase">{dbStatus === 'connected' ? 'MySQL' : 'Fallback'}</span>
              </div>
            </div>

            {/* General Switch */}
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
              <span>{language === 'ar' ? 'اللغة الحالية' : 'Language'}</span>
              <button 
                onClick={toggleLanguage} 
                className="flex items-center gap-1.5 text-primary hover:text-dark transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <section className="flex-grow p-6 lg:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full z-10">
          
          {/* TOP CONTROLS & WELCOME */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white backdrop-blur-xl border border-gray-200 p-6 rounded-3xl shadow-xl">
            <div>
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest block">{t('admin.dashboard')}</span>
              <h2 className="text-xl sm:text-2xl font-black mt-1 bg-gradient-to-r from-white via-slate-200 to-gray-400 bg-clip-text text-transparent">
                {language === 'ar' ? 'مرحباً، المدير العام' : 'Welcome, Administrator'}
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              <a 
                href="/" 
                target="_blank" 
                className="bg-gray-50 hover:bg-white/10 text-dark text-xs font-bold px-5 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'الموقع الرئيسي' : 'Storefront'}</span>
              </a>

              <button 
                onClick={fetchAllData}
                disabled={isRefreshing}
                className="bg-primary hover:bg-primary-dark text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-40"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{language === 'ar' ? 'مزامنة لوحة التحكم' : 'Refresh System'}</span>
              </button>
            </div>
          </div>

          {/* --- TAB: REPORTS & ANALYTICS --- */}
          {activeTab === 'reports' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Premium KPI widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t('admin.metric.sales'), val: `${totalSales.toLocaleString()} AED`, icon: Landmark, color: 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20 text-emerald-400' },
                  { label: t('admin.metric.quotes'), val: pendingQuotesCount, icon: FileCheck, color: 'from-amber-500/10 to-amber-500/0 border-amber-500/20 text-amber-400' },
                  { label: t('admin.metric.leads'), val: totalLeadsCount, icon: Users, color: 'from-blue-500/10 to-blue-500/0 border-blue-500/20 text-blue-400' },
                  { label: t('admin.metric.conversion'), val: `${conversionRate}%`, icon: TrendingUp, color: 'from-primary/10 to-primary/0 border-primary/20 text-primary' }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className={`bg-gradient-to-b ${kpi.color} border backdrop-blur-xl rounded-3xl p-6 shadow-xl flex items-center justify-between transition-all hover:scale-102 duration-300`}>
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{kpi.label}</span>
                        <span className="text-2xl font-black block tracking-tight">{kpi.val}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphical Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SVG Curve Line Chart Card */}
                <div className="lg:col-span-2 bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'مخطط الإيرادات الأسبوعية (B2B)' : 'B2B Weekly Revenue Charts'}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'توليد قيم صفقات الجملة حسب الإيرادات الأسبوعية' : 'Live analytics based on approved quotation amounts'}</p>
                    </div>
                    <span className="text-[9px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      <span>{language === 'ar' ? 'مباشر' : 'Live Graph'}</span>
                    </span>
                  </div>

                  {/* SVG Chart Drawing */}
                  <div className="h-56 w-full flex items-center justify-center pt-4">
                    <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6b0c22" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#6b0c22" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="30" y1="30" x2="570" y2="30" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                      <line x1="30" y1="90" x2="570" y2="90" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                      <line x1="30" y1="150" x2="570" y2="150" stroke="rgba(255,255,255,0.08)" />

                      {/* Area beneath curve */}
                      {areaD && <path d={`${pathD} L 570 150 L 30 150 Z`} fill="url(#chartGlow)" className="animate-pulse" />}

                      {/* Smooth line curve */}
                      {pathD && <path d={pathD} fill="none" stroke="#6b0c22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}

                      {/* Data point indicators */}
                      {chartPoints.map((p, i) => (
                        <g key={i} className="group cursor-pointer">
                          <circle cx={p.x} cy={p.y} r="5" fill="#d4af37" stroke="#070913" strokeWidth="2.5" />
                          <circle cx={p.x} cy={p.y} r="12" fill="#d4af37" opacity="0" className="hover:opacity-20 transition-opacity" />
                          <text x={p.x} y={p.y - 12} fill="#d4af37" fontSize="8" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded">
                            {p.val.toLocaleString()} AED
                          </text>
                        </g>
                      ))}

                      {/* Horizontal Axis labels */}
                      {chartPoints.map((p, i) => (
                        <text key={i} x={p.x} y={170} fill="rgba(255,255,255,0.3)" fontSize="8.5" textAnchor="middle" fontWeight="bold">
                          {p.label}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Cities Distribution and Growth */}
                <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'الطلب حسب الإمارات' : 'Geographical Lead Volume'}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'توزع الصفقات والمكاسب حسب المدن' : 'Distribution statistics of leads across UAE'}</p>
                  </div>

                  <div className="space-y-4 py-2 flex-grow overflow-y-auto">
                    {cityStats.slice(0, 4).map(stat => {
                      const percentage = totalLeadsCount > 0 ? (stat.count / totalLeadsCount) * 100 : 0;
                      return (
                        <div key={stat.name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className="text-slate-700 font-bold">{stat.name}</span>
                            <span className="text-gray-500">{stat.count} {language === 'ar' ? 'طلبات' : 'leads'}</span>
                          </div>
                          <div className="w-full bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-200">
                            <div 
                              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 pt-4 text-center">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{language === 'ar' ? 'متوسط سعر الصفقة الفائزة' : 'Average Won Deal size'}</span>
                    <span className="text-xl font-black text-amber-400 block mt-1">
                      {approvedLeads.length > 0 ? (totalSales / approvedLeads.length).toFixed(0) : '0'} AED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: QUOTATIONS PIPELINE --- */}
          {activeTab === 'quotes' && (
            <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{t('admin.pipeline.title')}</h3>
                <span className="text-xs text-gray-500 font-semibold">{leads.length} {language === 'ar' ? 'طلبات إجمالية بقاعدة البيانات' : 'Total quotation entries'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs text-slate-700">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
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
                  <tbody className="divide-y divide-white/5 font-semibold">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-16 text-center text-gray-500 font-bold">
                          {language === 'ar' ? 'لا يوجد طلبات عروض أسعار حالياً بقاعدة البيانات.' : 'No B2B quotations found in MySQL database.'}
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => {
                        const cityObj = uaeCities.find(c => c.id === lead.city);
                        const whatsappMsg = `Dear ${lead.name}, thank you for your B2B quote request for ${lead.company}. We are happy to help you...`;
                        const whatsappUrl = `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

                        return (
                          <tr key={lead.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="p-4 font-bold text-gray-500">{lead.quoteNumber}</td>
                            <td className="p-4">
                              <div>
                                <div className="font-extrabold text-slate-900">{lead.name}</div>
                                <div className="text-[10px] text-gray-500 mt-0.5">{lead.email} &bull; {cityObj ? cityObj.name[language] : lead.city}</div>
                              </div>
                            </td>
                            <td className="p-4 font-black text-primary">{lead.company}</td>
                            <td className="p-4 truncate max-w-[150px]">{lead.productName}</td>
                            <td className="p-4 text-center font-bold text-slate-900">{lead.quantity}</td>
                            <td className="p-4 text-center">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider focus:outline-none cursor-pointer ${
                                  lead.status === 'new' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                  lead.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                  lead.status === 'quoted' ? 'bg-primary/10 text-primary border border-primary/20' :
                                  lead.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  'bg-gray-50 text-gray-500 border border-gray-200'
                                }`}
                              >
                                <option value="new" className="bg-gray-50 text-amber-500">{t('admin.pipeline.new')}</option>
                                <option value="contacted" className="bg-gray-50 text-blue-400">{t('admin.pipeline.contacted')}</option>
                                <option value="quoted" className="bg-gray-50 text-primary">{t('admin.pipeline.quoted')}</option>
                                <option value="approved" className="bg-gray-50 text-emerald-400">{t('admin.pipeline.approved')}</option>
                                <option value="rejected" className="bg-gray-50 text-gray-500">{t('admin.pipeline.rejected')}</option>
                              </select>
                            </td>
                            <td className="p-4 text-right font-black text-amber-400" style={{ textAlign: isRtl ? 'left' : 'right' }}>
                              {lead.amount.toLocaleString()} AED
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center gap-2">
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-2 rounded-xl transition-all shadow-md shadow-emerald-500/15"
                                  title="WhatsApp Direct"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="text-gray-500 hover:text-primary transition-colors p-2 rounded-xl"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB: INVOICES & ORDERS --- */}
          {activeTab === 'invoices' && (
            <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">Invoices & Storefront Orders</h3>
                <span className="text-xs text-gray-500 font-semibold">{orders.length} Invoices Found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs text-slate-700">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                      <th className="p-4 text-left">Invoice No</th>
                      <th className="p-4 text-left">Customer</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-center">Gateway</th>
                      <th className="p-4 text-center">Payment Status</th>
                      <th className="p-4 text-center">Order Status</th>
                      <th className="p-4 text-right">Total Amount</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-16 text-center text-gray-500 font-bold">
                          No invoices or B2C orders registered yet in the system.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="p-4 font-black text-primary">{order.order_number}</td>
                          <td className="p-4 font-extrabold text-slate-900">{order.customer_name}</td>
                          <td className="p-4 text-gray-500">{order.customer_email}</td>
                          <td className="p-4 text-center uppercase text-secondary font-black">{order.payment_method}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              order.payment_status === 'paid' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {order.payment_status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              order.status === 'shipped' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              order.status === 'processing' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                              order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-black text-amber-400">
                            {Number(order.total_amount).toLocaleString()} AED
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOrderModalStatus(order.status);
                                  setOrderModalPayStatus(order.payment_status);
                                  setIsOrderModalOpen(true);
                                }}
                                className="bg-primary hover:bg-primary-dark text-white font-bold px-3 py-1.5 rounded-xl text-[10px]"
                              >
                                Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB: CUSTOMERS MANAGER --- */}
          {activeTab === 'customers' && (
            <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">Registered Sleep Customers</h3>
                <span className="text-xs text-gray-500 font-semibold">{customers.length} Accounts Found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs text-slate-700">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-center">Phone</th>
                      <th className="p-4 text-left">City</th>
                      <th className="p-4 text-left">Street Address</th>
                      <th className="p-4 text-center">Invoices</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-semibold">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-16 text-center text-gray-500 font-bold">
                          No registered customer accounts found.
                        </td>
                      </tr>
                    ) : (
                      customers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-[10px]">
                                {cust.name.slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-extrabold text-slate-900">{cust.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500">{cust.email}</td>
                          <td className="p-4 text-center text-slate-700">{cust.phone || '-'}</td>
                          <td className="p-4 text-primary font-bold">{cust.city || '-'}</td>
                          <td className="p-4 truncate max-w-[200px] text-gray-500">{cust.address || '-'}</td>
                          <td className="p-4 text-center">
                            <span className="bg-secondary/20 text-secondary border border-secondary/25 px-2 py-0.5 rounded-full font-black">
                              {cust.orders_count || 0}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- TAB: MEDIA LIBRARY --- */}
          {activeTab === 'media' && (
            <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-lg border border-gray-100 p-6 lg:p-8 space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 tracking-wide">{language === 'ar' ? 'معرض الصور (الميديا)' : 'Media Library'}</h3>
                  <p className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'قم برفع وإدارة صور المنتجات والبنرات' : 'Upload and manage images for products and banners'}</p>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    id="media-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleMediaUpload}
                  />
                  <label 
                    htmlFor="media-upload"
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold py-3 px-6 rounded-xl text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{language === 'ar' ? 'رفع صورة جديدة' : 'Upload New Image'}</span>
                  </label>
                </div>
              </div>

              {mediaSuccess && (
                <div className="bg-emerald-500/10 text-emerald-400 text-sm font-bold rounded-xl p-4 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{mediaSuccess}</span>
                </div>
              )}
              {mediaError && (
                <div className="bg-red-500/10 text-red-400 text-sm font-bold rounded-xl p-4 border border-red-500/20 flex items-center gap-2">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{mediaError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaList.length === 0 ? (
                  <div className="col-span-full p-16 text-center text-gray-500 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                    <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'ar' ? 'معرض الصور فارغ. قم برفع صورتك الأولى.' : 'Media library is empty. Upload your first image.'}</p>
                  </div>
                ) : (
                  mediaList.map(media => (
                    <div key={media.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
                      <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => handleDeleteMedia(media.id)}
                            className="bg-red-500 hover:bg-red-600 text-dark p-2 rounded-lg shadow-lg"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="bg-black/80 p-2 rounded-lg backdrop-blur-md">
                          <p className="text-[9px] text-dark font-semibold truncate">{media.name}</p>
                          <p className="text-[8px] text-gray-500 font-bold">{(media.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* --- TAB: BANNERS MANAGER --- */}
          {activeTab === 'banners' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              
              {/* Add Banner Form Card */}
              <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'إضافة بنر إعلاني جديد' : 'Upload New Banner'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'قم برفع بنرات العروض لتظهر في الصفحة الرئيسية للمتجر' : 'Upload promotional banners to display on storefront home'}</p>
                </div>

                {bannerSuccess && (
                  <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{language === 'ar' ? 'تم حفظ البنر بنجاح!' : 'Banner uploaded successfully!'}</span>
                  </div>
                )}

                <form onSubmit={handleAddBanner} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'عنوان البنر بالإنجليزية' : 'Banner Title (EN)'} *</label>
                    <input 
                      type="text" required value={bannerTitleEn} onChange={e => setBannerTitleEn(e.target.value)}
                      placeholder="e.g. Summer Sale"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'عنوان البنر بالعربية' : 'Banner Title (AR)'} *</label>
                    <input 
                      type="text" required value={bannerTitleAr} onChange={e => setBannerTitleAr(e.target.value)}
                      placeholder="مثال: عروض الصيف"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'رابط الصورة' : 'Image URL'} *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" required value={bannerImage} onChange={e => setBannerImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      />
                      <button 
                        type="button"
                        onClick={() => { setMediaPickerTarget('banner'); setIsMediaPickerOpen(true); }}
                        className="bg-white/10 hover:bg-white/20 text-dark px-3 py-2.5 rounded-xl border border-gray-200 transition-colors flex items-center justify-center"
                        title={language === 'ar' ? 'اختر من المعرض' : 'Browse Media'}
                      >
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'رابط التوجيه (اختياري)' : 'Target Link (Optional)'}</label>
                    <input 
                      type="text" value={bannerLink} onChange={e => setBannerLink(e.target.value)}
                      placeholder="/shop?category=luxury"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إضافة البنر' : 'Add Banner'}</span>
                  </button>
                </form>
              </div>

              {/* Active Banners List */}
              <div className="lg:col-span-2 bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'البنرات النشطة حالياً' : 'Active Storefront Banners'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'البنرات التي تظهر للزبائن في المتجر' : 'Banners currently visible to customers'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.length === 0 ? (
                    <div className="col-span-2 p-8 text-center text-gray-500 font-bold italic">
                      {language === 'ar' ? 'لا توجد بنرات نشطة.' : 'No active banners.'}
                    </div>
                  ) : (
                    banners.map(banner => (
                      <div key={banner.id} className="relative group overflow-hidden rounded-2xl border border-gray-200 aspect-[21/9]">
                        <img src={banner.image_url} alt={banner.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent flex flex-col justify-end p-4">
                          <h4 className="font-bold text-dark text-sm">{language === 'ar' ? banner.title_ar : banner.title_en}</h4>
                          {banner.link && <span className="text-[9px] text-gray-300 truncate">{banner.link}</span>}
                        </div>
                        <button 
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-dark p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: CATEGORIES & SUBCATEGORIES --- */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              
              {/* Add Category Form Card */}
              <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'إضافة تصنيف جديد' : 'Create Category / Subcategory'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'تجهيز الأقسام الرئيسية والأقسام الفرعية التابعة لها' : 'Add nested subcategory folders in database'}</p>
                </div>

                {catSuccess && (
                  <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{language === 'ar' ? 'تم الحفظ بقاعدة بيانات MySQL بنجاح!' : 'Category created successfully!'}</span>
                  </div>
                )}

                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اسم القسم بالإنجليزية' : 'Category Name (EN)'} *</label>
                    <input 
                      type="text" required value={catNameEn} onChange={e => setCatNameEn(e.target.value)}
                      placeholder="e.g. Luxury Rugs"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اسم القسم بالعربية' : 'Category Name (AR)'} *</label>
                    <input 
                      type="text" required value={catNameAr} onChange={e => setCatNameAr(e.target.value)}
                      placeholder="مثال: السجاد الفاخر"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  {/* Dynamic subcategory parent association */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'التصنيف الأب (اختياري للأقسام الفرعية)' : 'Parent Department (Subcategory Parent)'}</label>
                    <select 
                      value={catParentId} onChange={e => setCatParentId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold text-dark select-custom"
                      style={{ color: '#ffffff', backgroundColor: '#0f172a' }}
                    >
                      <option value="">{language === 'ar' ? '-- تصنيف رئيسي (أعلى مستوى) --' : '-- Top-Level Folder (No Parent) --'}</option>
                      {categories.filter(c => !c.parent_id).map(cat => (
                        <option key={cat.id} value={cat.dbId} className="bg-gray-50 text-dark">{cat.name[language]}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'رابط الصورة' : 'Cover Image URL'}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" value={catImage} onChange={e => setCatImage(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      />
                      <button 
                        type="button"
                        onClick={() => { setMediaPickerTarget('category'); setIsMediaPickerOpen(true); }}
                        className="bg-white/10 hover:bg-white/20 text-dark px-3 py-2.5 rounded-xl border border-gray-200 transition-colors flex items-center justify-center"
                        title={language === 'ar' ? 'اختر من المعرض' : 'Browse Media'}
                      >
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{language === 'ar' ? 'حفظ القسم الجديد' : 'Save Category'}</span>
                  </button>
                </form>
              </div>

              {/* Hierarchy Tree Viewer */}
              <div className="lg:col-span-2 bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'تصنيف أقسام المتجر' : 'Active Category Hierarchy'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'الربط الهيكلي بين الأقسام الرئيسية والأقسام الفرعية التابعة لها' : 'Category folders and dynamic subcategories'}</p>
                </div>

                <div className="divide-y divide-white/5 space-y-4">
                  {categories.filter(c => !c.parent_id).map(parent => {
                    const childrenList = categories.filter(c => c.parent_id === parent.dbId);
                    return (
                      <div key={parent.id} className="py-4 first:pt-0 space-y-3">
                        <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4.5 rounded-2xl">
                          <div className="flex items-center gap-3.5">
                            <img src={parent.image} alt={parent.name[language]} className="w-11 h-11 rounded-xl object-cover border border-gray-200 shadow-inner" />
                            <div>
                              <span className="font-black text-slate-900 text-sm block">{parent.name[language]}</span>
                              <span className="text-[9px] text-gray-500 font-bold block mt-0.5">SLUG: {parent.slug} &bull; DB ID: {parent.dbId}</span>
                            </div>
                          </div>
                          <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                            {language === 'ar' ? 'قسم رئيسي' : 'Root'}
                          </span>
                        </div>

                        {/* Subcategory folder lists */}
                        {childrenList.length > 0 ? (
                          <div className="pl-6 pr-6 space-y-2 border-l border-dashed border-gray-200">
                            {childrenList.map(child => (
                              <div key={child.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-semibold">
                                <span className="text-gray-300 flex items-center gap-2">
                                  <Folder className="w-4 h-4 text-amber-500" />
                                  <span>{child.name[language]}</span>
                                </span>
                                <span className="text-[9px] text-gray-500">SLUG: {child.slug} &bull; DB ID: {child.dbId}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="pl-6 pr-6 text-[9.5px] text-gray-500 italic font-bold">
                            {language === 'ar' ? 'لا توجد أقسام فرعية مرتبطة' : 'No nested subcategories'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: DYNAMIC FIELDS BUILDER (Filters builder) --- */}
          {activeTab === 'filters' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              
              {/* Field creation forms */}
              <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'إنشاء حقل تصفية جديد' : 'New Filter Field (Group)'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'إنشاء مجموعات الخصائص (مثال: نوع النوابض، نوع القماش)' : 'Create spec headings like Slat Frame or Latex Type'}</p>
                </div>

                {filterSuccess && (
                  <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{language === 'ar' ? 'تم إنشاء حقل التصفية بنجاح!' : 'Filter group added successfully!'}</span>
                  </div>
                )}

                <form onSubmit={handleAddFilterGroup} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اسم الحقل بالإنجليزية' : 'Field Name (EN)'} *</label>
                    <input 
                      type="text" required value={filterNameEn} onChange={e => setFilterNameEn(e.target.value)}
                      placeholder="e.g. Slat Material"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اسم الحقل بالعربية' : 'Field Name (AR)'} *</label>
                    <input 
                      type="text" required value={filterNameAr} onChange={e => setFilterNameAr(e.target.value)}
                      placeholder="مثال: خامة الألواح"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إنشاء حقل التصفية' : 'Create Field'}</span>
                  </button>
                </form>

                {/* Option insertion */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'إضافة قيمة خيار' : 'Add Option Value'}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'أدخل الخيارات المتاحة للخصائص (مثل: خشب الزان، 10 سم)' : 'Insert selectable options like Birch Wood or 30cm'}</p>
                  </div>

                  {optionSuccess && (
                    <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{language === 'ar' ? 'تمت إضافة القيمة بنجاح!' : 'Option value added successfully!'}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddFilterOption} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اختر حقل التصفية' : 'Select Group'} *</label>
                      <select 
                        value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      >
                        <option value="">{language === 'ar' ? 'اختر حقل تصفية...' : 'Select Group...'}</option>
                        {filters.map(g => (
                          <option key={g.id} value={g.id} className="bg-gray-50 text-dark">{g.name_en} / {g.name_ar}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'القيمة بالإنجليزية' : 'Option Value (EN)'} *</label>
                      <input 
                        type="text" required value={optionValEn} onChange={e => setOptionValEn(e.target.value)}
                        placeholder="e.g. Solid Birch"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'القيمة بالعربية' : 'Option Value (AR)'} *</label>
                      <input 
                        type="text" required value={optionValAr} onChange={e => setOptionValAr(e.target.value)}
                        placeholder="مثال: خشب البتولا الصلب"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary-dark text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-secondary/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{language === 'ar' ? 'إضافة القيمة' : 'Add Value'}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Dynamic filters lists */}
              <div className="lg:col-span-2 bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'فيلدز الفلاتر النشطة بالمتجر' : 'Dynamic Filters Overview'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'المرشحات التي تم إنشاؤها وتظهر تلقائياً للزبائن كخيارات تصفية بالكتالوج' : 'These filter options dynamically populate on shop filter bars'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filters.length === 0 ? (
                    <div className="col-span-2 p-12 text-center text-gray-500 font-bold italic">
                      {language === 'ar' ? 'لم يتم إنشاء فلاتر مخصصة بعد.' : 'No custom fields built yet.'}
                    </div>
                  ) : (
                    filters.map(group => (
                      <div key={group.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3 shadow-inner">
                        <div className="pb-2 border-b border-gray-200 flex justify-between items-center">
                          <span className="font-black text-xs text-primary">{language === 'ar' ? group.name_ar : group.name_en}</span>
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">ID: {group.id}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {group.options && group.options.length > 0 ? (
                            group.options.map(opt => (
                              <span key={opt.id} className="bg-gray-50 border border-gray-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                {language === 'ar' ? opt.value_ar : opt.value_en}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9.5px] text-gray-500 font-bold italic">{language === 'ar' ? 'لا توجد قيم بعد' : 'No option values'}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: PRODUCTS CRUD CATALOG --- */}
          {activeTab === 'products' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Product creator card */}
              <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'إضافة منتج جديد وتخصيص الفلاتر له' : 'Create Product Catalog Entry'}</h3>
                  <p className="text-[10px] text-gray-500 mt-1">{language === 'ar' ? 'املأ المواصفات الفنية واربط المنتج بفيلدز الفلاتر المخصصة' : 'Setup dynamic fields, sizing variables, and attributes'}</p>
                </div>

                {prodSuccess && (
                  <div className="bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl p-4 border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{language === 'ar' ? 'تم حفظ المنتج وإدراجه بقاعدة بيانات MySQL بنجاح!' : 'Product saved and indexed in MySQL database successfully!'}</span>
                  </div>
                )}

                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اسم المنتج بالإنجليزية' : 'Product Name (EN)'} *</label>
                    <input 
                      type="text" required value={prodNameEn} onChange={e => setProdNameEn(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'اسم المنتج بالعربية' : 'Product Name (AR)'} *</label>
                    <input 
                      type="text" required value={prodNameAr} onChange={e => setProdNameAr(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'القسم' : 'Category'} *</label>
                    <select 
                      required value={prodCategoryId} onChange={e => setProdCategoryId(e.target.value)}
                      className="w-full bg-[#0f172a] border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    >
                      <option value="">{language === 'ar' ? 'اختر قسماً' : 'Select Category'}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.dbId || cat.id} className="bg-gray-50 text-dark">{cat.name[language]}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'العلامة التجارية' : 'Brand'} *</label>
                    <input 
                      type="text" required value={prodBrand} onChange={e => setProdBrand(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  {/* Pricing info */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'السعر الأساسي (درهم)' : 'Base Price (AED)'} *</label>
                    <input 
                      type="number" required value={prodBasePrice} onChange={e => setProdBasePrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'سعر التخفيض (درهم - اختياري)' : 'Sale Price (AED - Optional)'}</label>
                    <input 
                      type="number" value={prodSalePrice} onChange={e => setProdSalePrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  {/* technical details */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'درجة الصلابة' : 'Firmness Level'} *</label>
                    <select 
                      value={prodFirmness} onChange={e => setProdFirmness(e.target.value)}
                      className="w-full bg-[#0f172a] border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold animate-fadeIn"
                    >
                      <option value="soft" className="bg-gray-50 text-dark">{t('product.firmness.soft')}</option>
                      <option value="medium" className="bg-gray-50 text-dark">{t('product.firmness.medium')}</option>
                      <option value="firm" className="bg-gray-50 text-dark">{t('product.firmness.firm')}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'فترة الضمان بالأشعر' : 'Warranty Months'} *</label>
                    <input 
                      type="number" required value={prodWarranty} onChange={e => setProdWarranty(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  {/* short desc */}
                  <div className="space-y-1.5 font-semibold">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'وصف مختصر بالإنجليزية' : 'Short Description (EN)'} *</label>
                    <textarea 
                      required value={prodShortEn} onChange={e => setProdShortEn(e.target.value)} rows={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5 font-semibold">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'وصف مختصر بالعربية' : 'Short Description (AR)'} *</label>
                    <textarea 
                      required value={prodShortAr} onChange={e => setProdShortAr(e.target.value)} rows={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                  </div>

                  {/* full desc */}
                  <div className="space-y-1.5 font-semibold">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'الوصف الكامل بالإنجليزية' : 'Full Description (EN)'} *</label>
                    <textarea 
                      required value={prodDescEn} onChange={e => setProdDescEn(e.target.value)} rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5 font-semibold">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'الوصف الكامل بالعربية' : 'Full Description (AR)'} *</label>
                    <textarea 
                      required value={prodDescAr} onChange={e => setProdDescAr(e.target.value)} rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all resize-none"
                    />
                  </div>

                  {/* image urls */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{language === 'ar' ? 'روابط الصور (مفصولة بفاصلة)' : 'Images URLs (comma separated)'}</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" value={prodImagesUrl} onChange={e => setProdImagesUrl(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 transition-all font-semibold"
                      />
                      <button 
                        type="button"
                        onClick={() => { setMediaPickerTarget('product'); setIsMediaPickerOpen(true); }}
                        className="bg-white/10 hover:bg-white/20 text-dark px-4 py-2.5 rounded-xl border border-gray-200 transition-colors flex items-center justify-center"
                        title={language === 'ar' ? 'اختر من المعرض' : 'Browse Media'}
                      >
                        <Image className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* DYNAMIC ATTRIBUTES SELECTOR (Dynamic Fields selection) */}
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      {language === 'ar' ? 'خصائص الفلاتر المرتبطة بالمنتج' : 'Product Specifications (Dynamic Fields)'}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      {language === 'ar' ? 'حدد مواصفات الفلاتر لتسهيل عملية التصفية في المتجر لزبائنك' : 'Choose Dynamic Filter Options to assign to this product'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 pt-1.5">
                      {filters.map(group => (
                        <div key={group.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                          <span className="font-black text-[11px] text-primary">{language === 'ar' ? group.name_ar : group.name_en}</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {group.options && group.options.length > 0 ? (
                              group.options.map(opt => {
                                const isChecked = selectedAttributeIds.includes(opt.id);
                                return (
                                  <label key={opt.id} className={`flex items-center gap-2 border px-3 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                                    isChecked ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-transparent border-gray-200 text-gray-500 hover:border-white/25'
                                  }`}>
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked}
                                      onChange={() => handleToggleAttribute(opt.id)}
                                      className="hidden"
                                    />
                                    <span>{language === 'ar' ? opt.value_ar : opt.value_en}</span>
                                  </label>
                                );
                              })
                            ) : (
                              <span className="text-[9px] text-gray-500 font-bold italic">{language === 'ar' ? 'لا توجد قيم بعد' : 'No option values'}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sizing variations builder */}
                  <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">{language === 'ar' ? 'أحجام ومقاسات المنتج المتاحة' : 'Size Variations Pricing'}</h3>
                      <button 
                        type="button" onClick={addVariationField}
                        className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold px-3.5 py-2 rounded-xl transition-all"
                      >
                        + {language === 'ar' ? 'إضافة مقاس جديد' : 'Add Size Variable'}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {variationsList.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-3 bg-gray-50 border border-gray-200 p-3 rounded-2xl items-center shadow-inner">
                          <input 
                            type="text" required value={item.size} onChange={e => updateVariationItem(idx, 'size', e.target.value)}
                            className="col-span-2 bg-transparent border border-gray-200 rounded-xl p-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 font-bold"
                            placeholder="Sizing (e.g. Queen 160x200cm)"
                          />
                          <input 
                            type="number" required value={item.price} onChange={e => updateVariationItem(idx, 'price', e.target.value)}
                            className="bg-transparent border border-gray-200 rounded-xl p-2.5 text-xs text-dark focus:outline-none focus:border-primary/50 font-bold"
                            placeholder="Price"
                          />
                          <button 
                            type="button" onClick={() => removeVariationItem(idx)}
                            disabled={variationsList.length <= 1}
                            className="text-primary hover:bg-gray-50 p-2 rounded-xl transition-colors text-[10px] font-bold disabled:opacity-30"
                          >
                            {language === 'ar' ? 'حذف' : 'Remove'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4.5 h-4.5" />
                      <span>{language === 'ar' ? 'حفظ وإدراج المنتج بقاعدة البيانات' : 'Save and Index Product to MySQL'}</span>
                    </button>
                  </div>

                </form>
              </div>

              {/* Products List Table */}
              <div className="bg-white backdrop-blur-2xl border border-gray-200 rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-extrabold text-sm text-slate-900 tracking-wide">{language === 'ar' ? 'الأصناف المتوفرة بالمتجر' : 'Active Catalog Products'}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs text-slate-700">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                        <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'المنتج' : 'Product'}</th>
                        <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'العلامة التجارية' : 'Brand'}</th>
                        <th className="p-4 text-left" style={{ textAlign: isRtl ? 'right' : 'left' }}>{language === 'ar' ? 'القسم' : 'Category'}</th>
                        <th className="p-4 text-right" style={{ textAlign: isRtl ? 'left' : 'right' }}>{language === 'ar' ? 'السعر الأساسي' : 'Base Price'}</th>
                        <th className="p-4 text-center">{language === 'ar' ? 'الصلابة' : 'Firmness'}</th>
                        <th className="p-4 text-center">{language === 'ar' ? 'المقاسات' : 'Sizes'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-semibold">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500 font-bold">
                            {language === 'ar' ? 'لا توجد منتجات' : 'No products found'}
                          </td>
                        </tr>
                      ) : (
                        products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-gray-50 transition-colors duration-250">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img src={prod.images[0]} alt={prod.name[language]} className="w-11 h-11 rounded-xl object-cover border border-gray-200 shadow-sm" />
                                <div className="font-extrabold text-slate-900">{prod.name[language]}</div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-500 font-bold">{prod.brand}</td>
                            <td className="p-4">
                              <span className="bg-gray-50 text-slate-700 border border-gray-200 px-2.5 py-1 rounded-lg text-[10px] font-bold">{prod.category}</span>
                            </td>
                            <td className="p-4 text-right font-black text-amber-400" style={{ textAlign: isRtl ? 'left' : 'right' }}>
                              {prod.basePrice} AED
                            </td>
                            <td className="p-4 text-center">
                              <span className="text-secondary font-black capitalize text-[10px] bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-md">{prod.firmness}</span>
                            </td>
                            <td className="p-4 text-center font-bold text-gray-500">
                              {prod.variations ? prod.variations.length : 0} {language === 'ar' ? 'خيارات' : 'vars'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </section>
      </div>

      {/* INVOICE MANAGEMENT DIALOG MODAL */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 print:bg-white print:p-0">
          <div className="bg-gray-50 border border-gray-200 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100 space-y-6 overflow-y-auto max-h-[90vh] text-slate-900 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:max-h-full">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 print:hidden">
              <div>
                <h3 className="text-base font-extrabold text-dark tracking-wide">Manage Invoice</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">{selectedOrder.order_number}</p>
              </div>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="text-gray-500 hover:text-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Header */}
            <div className="hidden print:flex justify-between items-start gap-4 text-black pb-4 border-b border-gray-200">
              <div>
                <h1 className="text-lg font-extrabold uppercase">Modern Mattresses</h1>
                <p className="text-[9px] text-gray-500 uppercase mt-0.5">Dubai Marina, United Arab Emirates</p>
                <p className="text-[9px] text-gray-500 font-medium">TRN: 100349811200003</p>
              </div>
              <div className="text-right">
                <h2 className="text-xs font-extrabold text-primary uppercase">Tax Invoice</h2>
                <p className="text-[9px] text-gray-500 font-bold">{selectedOrder.order_number}</p>
                <p className="text-[9px] text-gray-500 font-bold">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Success alert banner */}
            {orderSuccessMsg && (
              <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2 print:hidden">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Invoice status updated successfully!</span>
              </div>
            )}

            {/* Invoice Info Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 print:text-black">
              <div className="space-y-1">
                <span className="text-gray-500 font-bold block uppercase tracking-wider">Customer Details:</span>
                <p className="font-extrabold text-dark print:text-black">{selectedOrder.customer_name}</p>
                <p className="text-gray-500 print:text-gray-600">{selectedOrder.customer_email}</p>
                <p className="text-gray-500 print:text-gray-600">{selectedOrder.customer_phone}</p>
              </div>
              <div className="space-y-1 sm:text-right">
                <span className="text-gray-500 font-bold block uppercase tracking-wider">Delivery Details:</span>
                <p className="text-gray-500 print:text-gray-600">{selectedOrder.shipping_address}</p>
                <p className="font-bold text-primary">{selectedOrder.city}, UAE</p>
              </div>
            </div>

            <hr className="border-gray-200 print:border-gray-200" />

            {/* Items table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 print:text-black">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-widest font-extrabold print:border-gray-200">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items && selectedOrder.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-200 text-slate-700 font-semibold print:border-gray-100 print:text-black">
                      <td className="py-2.5">
                        <p className="font-bold text-dark print:text-black">{item.name}</p>
                        <span className="text-[9px] text-gray-500">{item.size}</span>
                      </td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right">{item.price} AED</td>
                      <td className="py-2.5 text-right font-bold text-primary">{item.price * item.quantity} AED</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-start gap-4">
              {/* Left side: Payment Method */}
              <div className="text-xs space-y-1.5 print:text-black">
                <span className="text-gray-500 font-bold block uppercase tracking-wider">Payment Method:</span>
                <span className="text-secondary font-black uppercase text-xs">{selectedOrder.payment_method}</span>
              </div>
              
              {/* Right side: Invoice totals */}
              <div className="w-64 space-y-1.5 text-xs text-slate-700 print:text-black">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>{selectedOrder.total_amount} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping:</span>
                  <span>Free Setup</span>
                </div>
                <hr className="border-gray-200 print:border-gray-200" />
                <div className="flex justify-between font-extrabold text-primary text-sm">
                  <span>Grand Total:</span>
                  <span>{selectedOrder.total_amount} AED</span>
                </div>
              </div>
            </div>

            {/* Admin status controllers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl print:hidden">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-extrabold uppercase">Order Status</label>
                <select
                  value={orderModalStatus}
                  onChange={(e) => setOrderModalStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:border-primary/50 font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-extrabold uppercase">Payment Status</label>
                <select
                  value={orderModalPayStatus}
                  onChange={(e) => setOrderModalPayStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-dark focus:outline-none focus:border-primary/50 font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 justify-end print:hidden">
              <button
                onClick={async () => {
                  setOrderSuccessMsg(false);
                  await api.updateOrderStatus(selectedOrder.id, {
                    status: orderModalStatus,
                    payment_status: orderModalPayStatus
                  });
                  setOrderSuccessMsg(true);
                  fetchAllData();
                  setTimeout(() => setOrderSuccessMsg(false), 2500);
                }}
                className="bg-primary hover:bg-primary-dark text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Status Changes
              </button>
              
              <button
                onClick={() => window.print()}
                className="bg-gray-50 hover:bg-white/10 text-dark border border-gray-200 px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-gray-500 hover:text-dark border border-gray-200 px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MEDIA PICKER MODAL --- */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsMediaPickerOpen(false)} />
          
          <div className="relative bg-[#0a0f1d] border border-gray-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-extrabold text-dark flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                <span>{language === 'ar' ? 'اختر صورة من المعرض' : 'Select Image from Library'}</span>
              </h2>
              <button 
                onClick={() => setIsMediaPickerOpen(false)}
                className="text-gray-500 hover:text-dark bg-gray-50 hover:bg-white/10 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.length === 0 ? (
                  <div className="col-span-full p-12 text-center text-gray-500 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                    <p>{language === 'ar' ? 'المعرض فارغ. اذهب إلى علامة تبويب معرض الصور لرفع صور أولاً.' : 'Media library is empty. Go to the Media Library tab to upload images.'}</p>
                  </div>
                ) : (
                  mediaList.map(media => (
                    <div 
                      key={media.id} 
                      onClick={() => handleSelectMedia(media.url)}
                      className="relative group rounded-xl overflow-hidden border-2 border-transparent hover:border-primary bg-gray-100 aspect-square cursor-pointer transition-all"
                    >
                      <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-primary text-dark text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
                          {language === 'ar' ? 'اختيار الصورة' : 'Select Image'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
