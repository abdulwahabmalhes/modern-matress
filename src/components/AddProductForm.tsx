import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { 
  X, Image, Info, Tag, Star, List, UploadCloud, 
  CheckCircle2, Plus, Trash2, RefreshCw, PlusCircle,
  Thermometer, Activity, Users, Shield, Award, Droplet, Box, 
  Wind, Zap, Moon, Sun, Heart, Flame,
  Bed, Check, LayoutGrid, Home, ShoppingBag
} from 'lucide-react';

interface AddProductFormProps {
  categories: any[];
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({ categories, initialData, onSuccess, onCancel }) => {
  const { language, isRtl } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'specs' | 'badge' | 'features'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form State
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodNameAr, setProdNameAr] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [prodBasePrice, setProdBasePrice] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodDescAr, setProdDescAr] = useState('');
  
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState('');
  
  const [badgeLabel, setBadgeLabel] = useState('');
  const [badgeColor, setBadgeColor] = useState('Gold');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Default key features to populate
  const defaultFeatures = [
    { title: 'Temperature Control', description: 'Advanced breathable materials keep you cool throughout the night.', icon: 'Thermometer' },
    { title: 'Pressure Relief', description: 'Contours to your body for ideal pressure distribution on every sleep position.', icon: 'Activity' },
    { title: 'Motion Isolation', description: 'Minimises partner disturbance so you enjoy uninterrupted rest.', icon: 'Users' },
    { title: 'Edge Support', description: 'Reinforced borders maximise usable sleep surface and provide stable seating.', icon: 'Box' }
  ];

  const [keyFeatures, setKeyFeatures] = useState<{title: string; description: string; icon: string}[]>(defaultFeatures);

  // Dedicated Specs State
  const [specFirmness, setSpecFirmness] = useState('Medium');
  const [specHeight, setSpecHeight] = useState('30');
  const [specWarranty, setSpecWarranty] = useState('10 Years');
  const [specWarrantyCustom, setSpecWarrantyCustom] = useState('');
  const [specReturns, setSpecReturns] = useState('10 Days');
  const [specReturnsCustom, setSpecReturnsCustom] = useState('');
  const [specStructure, setSpecStructure] = useState<string[]>([]);
  const [customSpecs, setCustomSpecs] = useState<{nameEn: string; nameAr: string; valueEn: string; valueAr: string}[]>([]);
  const [specNewborn, setSpecNewborn] = useState('');
  const [specDimensions, setSpecDimensions] = useState<string[]>([]);
  const [specColors, setSpecColors] = useState('');

  const [variationsData, setVariationsData] = useState<Record<string, { price: string, salePrice: string, stock: string }>>({});

  const structureOptions = ['Bonnel Springs', 'Pocket Springs', 'No Springs', 'Memory Foam', 'Natural Latex', 'Foam', 'Gel Foam', 'Pillow Top', 'Medical', 'Orthopaedic', 'Hybrid Mattress'];

  const [dimOptions, setDimOptions] = useState(['90x190', '90x200', '100x200', '120x190', '140x190', '140x200', '150x190', '150x200', '155x205']);
  const [newDimInput, setNewDimInput] = useState('');

  const icons = [
    { name: 'Thermometer', component: Thermometer },
    { name: 'Activity', component: Activity },
    { name: 'Users', component: Users },
    { name: 'Shield', component: Shield },
    { name: 'Award', component: Award },
    { name: 'Droplet', component: Droplet },
    { name: 'Box', component: Box },
    { name: 'Wind', component: Wind },
    { name: 'Zap', component: Zap },
    { name: 'Moon', component: Moon },
    { name: 'Sun', component: Sun },
    { name: 'Heart', component: Heart },
    { name: 'Flame', component: Flame },
    { name: 'Check', component: Check }
  ];



  const handleAddFeature = () => {
    setKeyFeatures([...keyFeatures, { title: '', description: '', icon: 'Check' }]);
  };

  const updateFeature = (index: number, key: string, val: string) => {
    const updated = [...keyFeatures];
    updated[index] = { ...updated[index], [key]: val };
    setKeyFeatures(updated);
  };

  const removeFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  const loadDefaultFeatures = () => {
    setKeyFeatures(defaultFeatures);
  };

  React.useEffect(() => {
    if (initialData) {
      setProdNameEn(initialData.name?.en || '');
      setProdNameAr(initialData.name?.ar || '');
      setProdCategoryId(initialData.category_id || initialData.categoryId || '');
      
      // We will set the brand later after brands fetch
      
      setProdBasePrice(initialData.basePrice || initialData.base_price || '');
      setProdSalePrice(initialData.salePrice || initialData.sale_price || '');
      setProdDescEn(initialData.description?.en || '');
      setProdDescAr(initialData.description?.ar || '');
      
      if (initialData.images && initialData.images.length > 0) {
        setMainImage(initialData.images[0]);
        if (initialData.images.length > 1) {
          setGalleryImages(initialData.images.slice(1).join(', '));
        }
      }
      
      setBadgeLabel(initialData.badgeLabel || '');
      setBadgeColor(initialData.badgeColor || 'Gold');
      setIsFeatured(initialData.isFeatured || false);
      setIsNewArrival(initialData.isNewArrival || false);
      
      if (initialData.keyFeatures && initialData.keyFeatures.length > 0) {
        setKeyFeatures(initialData.keyFeatures);
      }

      if (initialData.attributes && initialData.attributes.length > 0) {
        const customList: typeof customSpecs = [];
        initialData.attributes.forEach((attr: any) => {
          const val = attr.valueEn || '';
          switch (attr.groupNameEn) {
            case 'Firmness': setSpecFirmness(val); break;
            case 'Height (cm)': setSpecHeight(val); break;
            case 'Warranty':
              if (['1 Year', '2 Years', '5 Years', '10 Years', '10 YR WARRANTY'].includes(val)) {
                setSpecWarranty(val === '10 YR WARRANTY' ? '10 Years' : val);
                setSpecWarrantyCustom('');
              } else {
                setSpecWarrantyCustom(val);
              }
              break;
            case 'Returns Period':
              if (['7 Days', '10 Days', '30 Days', 'No Returns'].includes(val)) {
                setSpecReturns(val);
                setSpecReturnsCustom('');
              } else {
                setSpecReturnsCustom(val.replace(' days', '').trim());
              }
              break;
            case 'Structure':
              setSpecStructure(val.split(',').map((s: string) => s.trim()).filter(Boolean));
              break;
            case 'Newborn Sub-sizes':
              setSpecNewborn(val);
              break;
            case 'Numeric Dimensions': {
              const dims = val.split(',').map((s: string) => s.trim()).filter(Boolean);
              setDimOptions(prev => {
                const updated = [...prev];
                dims.forEach((d: string) => { if (!updated.includes(d)) updated.push(d); });
                return updated;
              });
              setSpecDimensions(dims);
              break;
            }
            case 'Available Colors':
              setSpecColors(val);
              break;
            default:
              customList.push({
                nameEn: attr.groupNameEn || '',
                nameAr: attr.groupNameAr || '',
                valueEn: attr.valueEn || '',
                valueAr: attr.valueAr || ''
              });
              break;
          }
        });
        setCustomSpecs(customList);
      }

      if (initialData.variations && initialData.variations.length > 0) {
        const vd: Record<string, { price: string, salePrice: string, stock: string }> = {};
        initialData.variations.forEach((v: any) => {
          vd[v.size] = {
            price: v.price ? v.price.toString() : '',
            salePrice: v.salePrice ? v.salePrice.toString() : '',
            stock: v.stock ? v.stock.toString() : '10'
          };
        });
        setVariationsData(vd);
      }
    }
    
    api.getBrands().then(fetchedBrands => {
      setBrandsList(fetchedBrands);
      if (initialData && initialData.brand) {
        // Try to find the brand ID by matching the name
        const b = fetchedBrands.find((br: any) => br.name.toLowerCase() === initialData.brand.toLowerCase() || br.id === initialData.brand);
        if (b) setProdBrandId(b.id);
      } else if (fetchedBrands.length > 0 && !prodBrandId) {
        setProdBrandId(fetchedBrands[0].id);
      }
    });

  }, [initialData]);

  // Refs for file uploads
  const mainFileRef = React.useRef<HTMLInputElement>(null);
  const galleryFileRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (isMain) {
          setMainImage(base64);
        } else {
          setGalleryImages(prev => prev ? `${prev}, ${base64}` : base64);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const images = [];
    if (mainImage) images.push(mainImage);
    if (galleryImages) {
      galleryImages.split(',').forEach(img => {
        if (img.trim()) images.push(img.trim());
      });
    }

    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop');
    }

    const finalAttributes: any[] = [];
    const specsEn: Record<string, string> = {};
    const specsAr: Record<string, string> = {};
    let attrId = 1;

    const addAttr = (groupEn: string, groupAr: string, valEn: string, valAr: string) => {
      finalAttributes.push({
        id: attrId++,
        groupId: attrId,
        valueEn: valEn,
        valueAr: valAr,
        groupNameEn: groupEn,
        groupNameAr: groupAr
      });
      specsEn[groupEn] = valEn;
      specsAr[groupEn] = valAr;
    };

    if (specFirmness) addAttr('Firmness', 'مستوى الصلابة', specFirmness, specFirmness);
    if (specHeight) addAttr('Height (cm)', 'الارتفاع (سم)', specHeight, specHeight);
    const warrantyVal = specWarrantyCustom ? specWarrantyCustom : specWarranty;
    if (warrantyVal) addAttr('Warranty', 'الضمان', warrantyVal, warrantyVal);
    
    const returnsVal = specReturnsCustom ? `${specReturnsCustom} days` : specReturns;
    if (returnsVal) addAttr('Returns Period', 'فترة الاسترجاع', returnsVal, returnsVal);
    
    if (specStructure.length) addAttr('Structure', 'التركيب', specStructure.join(', '), specStructure.join(', '));
    customSpecs.forEach(spec => {
      if (spec.nameEn && spec.valueEn) {
        addAttr(spec.nameEn, spec.nameAr || spec.nameEn, spec.valueEn, spec.valueAr || spec.valueEn);
      }
    });
    if (specNewborn) addAttr('Newborn Sub-sizes', 'مقاسات المواليد', specNewborn, specNewborn);
    
    const dims = [...specDimensions];
    if (dims.length) addAttr('Numeric Dimensions', 'الأبعاد الرقمية', dims.join(', '), dims.join(', '));
    
    if (specColors) addAttr('Available Colors', 'الألوان المتاحة', specColors, specColors);

    const finalVariations = dims.map((dim, idx) => {
      const vd = variationsData[dim] || {};
      return {
        id: initialData?.variations?.find((v:any) => v.size === dim)?.id || `var_${idx}_${Date.now()}`,
        size: dim,
        price: Number(vd.price) || Number(prodBasePrice) || 0,
        salePrice: vd.salePrice ? Number(vd.salePrice) : undefined,
        stock: Number(vd.stock) || 10
      };
    });
    
    // If no dimensions selected, fallback to Standard variation
    if (finalVariations.length === 0) {
       finalVariations.push({ id: initialData?.variations?.[0]?.id || `var_std`, size: 'Standard', price: Number(prodBasePrice) || 0, salePrice: prodSalePrice ? Number(prodSalePrice) : undefined, stock: 10 });
    }

    const payload = {
      nameEn: prodNameEn || 'New Product',
      nameAr: prodNameAr || 'منتج جديد',
      categoryId: prodCategoryId || categories[0]?.id,
      brand: brandsList.find(b => b.id === prodBrandId)?.name || 'Modern Mattresses',
      basePrice: finalVariations[0].price,
      salePrice: finalVariations[0].salePrice,
      firmness: specFirmness ? specFirmness.toLowerCase() : 'medium',
      warrantyMonths: parseInt(warrantyVal) || 120,
      shortDescriptionEn: prodDescEn.substring(0, 100),
      shortDescriptionAr: prodDescAr.substring(0, 100),
      descriptionEn: prodDescEn,
      descriptionAr: prodDescAr,
      images: images,
      variations: finalVariations,
      badgeLabel,
      badgeColor,
      isFeatured,
      isNewArrival,
      keyFeatures,
      attributes: finalAttributes,
      specifications: { en: specsEn, ar: specsAr }
    };

    if (initialData) {
      await api.updateProduct(initialData.id, payload);
    } else {
      await api.addProduct(payload);
    }
    
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onSuccess();
    }, 2000);
  };

  const discountPercentage = (prodBasePrice && prodSalePrice && Number(prodBasePrice) > Number(prodSalePrice))
    ? Math.round(((Number(prodBasePrice) - Number(prodSalePrice)) / Number(prodBasePrice)) * 100)
    : 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-start p-0 md:p-8 bg-black/40 backdrop-blur-sm overflow-y-auto" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div className="bg-white w-full max-w-5xl md:rounded-3xl shadow-2xl flex flex-col min-h-screen md:min-h-0 animate-slideUp border border-cream">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream flex justify-between items-center bg-white sticky top-0 z-10 md:rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
              <Box className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-xl text-dark">{initialData ? (language === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}</h2>
          </div>
          <button onClick={onCancel} className="w-8 h-8 bg-cream hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="p-6">
            
            {/* Tabs */}
            <div className="flex bg-cream/30 p-1.5 rounded-2xl mb-8 overflow-x-auto hide-scrollbar border border-cream">
              {[
                { id: 'basic', icon: Info, label: 'Basic Info' },
                { id: 'images', icon: Image, label: 'Images' },
                { id: 'specs', icon: List, label: 'Specs & Sizes' },
                { id: 'badge', icon: Tag, label: 'Badge & Status' },
                { id: 'features', icon: Star, label: 'Key Features' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
                    activeTab === tab.id 
                      ? 'bg-white text-dark shadow-sm border border-cream/50' 
                      : 'text-gray-500 hover:text-dark hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[400px]">
              
              {/* BASIC INFO TAB */}
              {activeTab === 'basic' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">PRODUCT NAME *</label>
                    <input 
                      type="text" required value={prodNameEn} onChange={e => { setProdNameEn(e.target.value); setProdNameAr(e.target.value); }}
                      className="w-full bg-white border border-cream rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      placeholder="e.g. Luna Pocket Spring Mattress"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">PRICE (AED) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-400 font-bold text-sm">AED</span>
                        <input 
                          type="number" required value={prodBasePrice} onChange={e => setProdBasePrice(e.target.value)}
                          className="w-full bg-amber-50/30 border border-amber-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-dark focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">DISCOUNT PRICE (AED) <span className="font-normal text-gray-400 lowercase">optional</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-400 font-bold text-sm">AED</span>
                        <input 
                          type="number" value={prodSalePrice} onChange={e => setProdSalePrice(e.target.value)}
                          className="w-full bg-amber-50/30 border border-amber-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-dark focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
                          placeholder="Leave empty for no discount"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex justify-between">
                        <span>نسبة الخصم (%)</span>
                        <span className="font-normal lowercase">اختياري</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-400 font-bold text-sm">%</span>
                        <input 
                          type="text" readOnly value={discountPercentage}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
                      <span>القسم الرئيسي *</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {categories.filter(c => !c.parent_id).map(cat => {
                        const Icon = cat.icon ? ({ Box, Bed, Star, Award, Wind, Home, ShoppingBag, Tag } as any)[cat.icon] || Box : Box;
                        const isSelected = prodCategoryId === String(cat.id);
                        return (
                          <label key={cat.id} className="cursor-pointer">
                            <input 
                              type="radio" name="category" className="peer sr-only"
                              checked={isSelected}
                              onChange={() => setProdCategoryId(cat.id)}
                            />
                            <div className="border border-cream rounded-xl p-4 text-center hover:border-primary hover:bg-primary/5 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-sm">
                              <Icon className={`w-8 h-8 mx-auto mb-2 ${prodCategoryId === cat.id ? 'text-primary' : 'text-gray-400'}`} />
                              <span className={`text-[11px] font-bold block ${prodCategoryId === cat.id ? 'text-primary' : 'text-dark'}`}>{cat.name.en}</span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-primary" />
                      <span>{language === 'ar' ? 'الشركة / الماركة *' : 'Brand *'}</span>
                    </label>
                    <select
                      value={prodBrandId}
                      onChange={e => setProdBrandId(e.target.value)}
                      className="w-full bg-white border border-cream rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    >
                      <option value="" disabled>{language === 'ar' ? 'اختر الماركة' : 'Select a brand'}</option>
                      {brandsList.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">DESCRIPTION</label>
                    <textarea 
                      value={prodDescEn} onChange={e => { setProdDescEn(e.target.value); setProdDescAr(e.target.value); }}
                      className="w-full bg-white border border-cream rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                      rows={4} placeholder="Describe the product features, materials, benefits..."
                    />
                  </div>
                </div>
              )}

              {/* IMAGES TAB */}
              {activeTab === 'images' && (
                <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">MAIN PRODUCT IMAGE</label>
                    <div 
                      onClick={() => mainFileRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 hover:border-primary transition-colors cursor-pointer group"
                    >
                      <input type="file" ref={mainFileRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, true)} />
                      {mainImage && mainImage.startsWith('data:image') ? (
                        <div className="mb-4">
                          <img src={mainImage} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto border border-gray-200" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                        </div>
                      )}
                      <p className="text-sm text-gray-500 font-medium">Click to upload main image</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase">JPG, PNG, WebP — max 5MB</p>
                      <input type="text" className="mt-4 w-full text-xs p-2 border border-cream rounded-lg" placeholder="Or paste image URL here" value={mainImage} onClick={e => e.stopPropagation()} onChange={e=>setMainImage(e.target.value)}/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">GALLERY IMAGES</label>
                    <div 
                      onClick={() => galleryFileRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 hover:border-primary transition-colors cursor-pointer group"
                    >
                      <input type="file" ref={galleryFileRef} className="hidden" accept="image/*" multiple onChange={e => handleFileUpload(e, false)} />
                      <div className="w-12 h-12 bg-transparent flex items-center justify-center mx-auto mb-3">
                        <Image className="w-10 h-10 text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Click to add more gallery images</p>
                      <p className="text-[10px] text-gray-400 mt-1">Select multiple files</p>
                      <input type="text" className="mt-4 w-full text-xs p-2 border border-cream rounded-lg" placeholder="Or paste comma separated URLs here" value={galleryImages} onClick={e => e.stopPropagation()} onChange={e=>setGalleryImages(e.target.value)}/>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECS & SIZES TAB */}
              {activeTab === 'specs' && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Top Row: Firmness, Height, Warranty, Returns */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">FIRMNESS</label>
                      <select value={specFirmness} onChange={e=>setSpecFirmness(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-dark focus:outline-none focus:border-primary">
                        <option>Soft</option>
                        <option>Medium Soft</option>
                        <option>Medium</option>
                        <option>Medium Firm</option>
                        <option>Firm</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">HEIGHT (CM)</label>
                      <input type="number" value={specHeight} onChange={e=>setSpecHeight(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-dark focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">WARRANTY</label>
                      <div className="flex flex-wrap gap-2">
                        {['1 Year', '2 Years', '5 Years', '10 Years'].map(w => (
                          <button type="button" key={w} onClick={() => { setSpecWarranty(w); setSpecWarrantyCustom(''); }} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${specWarranty === w && !specWarrantyCustom ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300'}`}>{w}</button>
                        ))}
                        <div className="flex items-center gap-2 mt-1 w-full">
                          <input type="text" placeholder="...أو اكتب ضمان مخصص" value={specWarrantyCustom} onChange={e=>setSpecWarrantyCustom(e.target.value)} className="w-full text-xs font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">RETURNS PERIOD</label>
                      <div className="flex flex-wrap gap-2">
                        {['7 Days', '10 Days', '30 Days', 'No Returns'].map(rp => (
                          <button type="button" key={rp} onClick={() => { setSpecReturns(rp); setSpecReturnsCustom(''); }} className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${specReturns === rp && !specReturnsCustom ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300'}`}>{rp}</button>
                        ))}
                        <div className="flex items-center gap-2 mt-1 w-full">
                          <input type="number" placeholder="...أو اكتب عدد الأيام" value={specReturnsCustom} onChange={e=>setSpecReturnsCustom(e.target.value)} className="w-full text-xs font-bold border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary" />
                          <span className="text-xs text-gray-400 font-bold">days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Structure */}
                  <div className="space-y-2 border-t border-slate-100 pt-6">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <List className="w-3.5 h-3.5 text-blue-500" /> STRUCTURE <span className="text-gray-400 font-normal lowercase">(اختيار متعدد)</span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {structureOptions.map(opt => {
                        const isSelected = specStructure.includes(opt);
                        return (
                          <button type="button" key={opt} onClick={() => {
                            if (isSelected) setSpecStructure(specStructure.filter(s=>s!==opt));
                            else setSpecStructure([...specStructure, opt]);
                          }} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${isSelected ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'}`}>{opt}</button>
                        )
                      })}
                      <button type="button" className="w-8 h-8 rounded-full border border-dashed border-blue-300 text-blue-400 flex items-center justify-center hover:bg-blue-50 transition-colors"><Plus className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>

                  {/* Dimensions Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">DIMENSIONS (المقاسات) <span className="text-gray-400 font-normal lowercase">(اختر من القائمة)</span></label>
                        <div className="flex">
                          <select multiple value={specDimensions} onChange={e => {
                            const selected = Array.from(e.target.selectedOptions, option => option.value);
                            setSpecDimensions(selected);
                          }} className="w-full h-44 bg-slate-50/50 border border-gray-200 rounded-l-xl border-r-0 p-3 text-sm font-medium text-dark focus:outline-none focus:border-primary custom-scrollbar">
                            {dimOptions.map(dim => <option key={dim} value={dim} className="py-1.5 px-2 hover:bg-white rounded-md mb-0.5">{dim}</option>)}
                          </select>
                          <div className="w-2 bg-amber-700/80 rounded-r-xl border border-gray-200 border-l-0"></div>
                        </div>
                        <p className="text-[10px] text-gray-400">Ctrl+Click لاختيار أكثر من قياس</p>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <input type="text" value={newDimInput} onChange={e=>setNewDimInput(e.target.value)} placeholder="إضافة مقاس جديد (مثال: 200x200)" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary shadow-sm" />
                        <button type="button" onClick={() => {
                          if (newDimInput.trim() && !dimOptions.includes(newDimInput.trim())) {
                            setDimOptions([...dimOptions, newDimInput.trim()]);
                            setSpecDimensions([...specDimensions, newDimInput.trim()]);
                            setNewDimInput('');
                          }
                        }} className="bg-primary text-white px-4 rounded-xl font-bold text-sm hover:bg-primary/90">إضافة</button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">NEWBORN SUB-SIZES <span className="text-gray-400 font-normal lowercase">(comma separated)</span></label>
                        <input type="text" value={specNewborn} onChange={e=>setSpecNewborn(e.target.value)} placeholder="0-3 Months, 3-6 Months, 6-12 Months" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Prices by Dimension */}
                  {(() => {
                    const allDims = [...specDimensions];
                    if (allDims.length === 0) return null;
                    
                    return (
                      <div className="space-y-4 border-t border-slate-100 pt-6 animate-fadeIn">
                        <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5" /> PRICES PER SIZE <span className="text-gray-400 font-normal lowercase">(إعدادات أسعار الأحجام)</span>
                        </label>
                        <div className="bg-slate-50 border border-cream rounded-2xl overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                              <thead>
                                <tr className="bg-cream/30 text-[10px] font-extrabold text-gray-500 uppercase">
                                  <th className="px-4 py-3" style={{ textAlign: isRtl ? 'right' : 'left' }}>Size (الحجم)</th>
                                  <th className="px-4 py-3" style={{ textAlign: isRtl ? 'right' : 'left' }}>Base Price (السعر الأساسي)</th>
                                  <th className="px-4 py-3" style={{ textAlign: isRtl ? 'right' : 'left' }}>Sale Price (السعر المخفض)</th>
                                  <th className="px-4 py-3 text-center">Stock (الكمية)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-cream/50">
                                {allDims.map((dim) => {
                                  const vd = variationsData[dim] || { price: '', salePrice: '', stock: '10' };
                                  const updateVar = (key: string, val: string) => {
                                    setVariationsData(prev => ({
                                      ...prev,
                                      [dim]: { ...vd, [key]: val }
                                    }));
                                  };
                                  return (
                                    <tr key={dim} className="hover:bg-white transition-colors">
                                      <td className="px-4 py-3 font-extrabold text-primary text-sm whitespace-nowrap">{dim}</td>
                                      <td className="px-4 py-3">
                                        <div className="relative">
                                          <input type="number" value={vd.price} onChange={e=>updateVar('price', e.target.value)} placeholder={prodBasePrice || '0'} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pl-12 text-sm font-bold focus:outline-none focus:border-primary" style={{ paddingLeft: isRtl ? '1rem' : '3rem', paddingRight: isRtl ? '3rem' : '1rem' }} />
                                          <span className="absolute top-2.5 text-xs font-bold text-gray-400" style={{ left: isRtl ? 'auto' : '0.75rem', right: isRtl ? '0.75rem' : 'auto' }}>AED</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="relative">
                                          <input type="number" value={vd.salePrice} onChange={e=>updateVar('salePrice', e.target.value)} placeholder="Optional" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pl-12 text-sm font-bold text-emerald-600 focus:outline-none focus:border-emerald-500" style={{ paddingLeft: isRtl ? '1rem' : '3rem', paddingRight: isRtl ? '3rem' : '1rem' }} />
                                          <span className="absolute top-2.5 text-xs font-bold text-gray-400" style={{ left: isRtl ? 'auto' : '0.75rem', right: isRtl ? '0.75rem' : 'auto' }}>AED</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <input type="number" value={vd.stock} onChange={e=>updateVar('stock', e.target.value)} className="w-20 mx-auto block bg-white border border-gray-200 rounded-lg px-2 py-2 text-center text-sm font-bold focus:outline-none focus:border-primary" />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold bg-amber-50 text-amber-700 p-2 rounded-lg inline-block border border-amber-200">
                          ملاحظة: السعر الخاص بأول حجم سيكون هو السعر الافتراضي للمنتج في واجهة المتجر.
                        </p>
                      </div>
                    );
                  })()}

                  {/* Colors */}
                  <div className="space-y-2 border-t border-slate-100 pt-6">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">AVAILABLE COLORS <span className="text-gray-400 font-normal lowercase">(comma separated)</span></label>
                    <input type="text" value={specColors} onChange={e=>setSpecColors(e.target.value)} placeholder="White, Beige, Grey, Charcoal" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary" />
                  </div>

                  {/* Custom Specs */}
                  <div className="space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <PlusCircle className="w-3.5 h-3.5" /> CUSTOM SPECIFICATIONS <span className="text-gray-400 font-normal lowercase">(مواصفات إضافية)</span>
                      </label>
                      <button type="button" onClick={() => setCustomSpecs([...customSpecs, {nameEn: '', nameAr: '', valueEn: '', valueAr: ''}])} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg">
                        <Plus className="w-3.5 h-3.5" /> Add Specification
                      </button>
                    </div>
                    
                    {customSpecs.length > 0 ? (
                      <div className="space-y-3">
                        {customSpecs.map((spec, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <div className="md:col-span-5 space-y-2">
                              <input type="text" value={spec.nameEn} onChange={e => { const newSpecs = [...customSpecs]; newSpecs[index].nameEn = e.target.value; setCustomSpecs(newSpecs); }} placeholder="Spec Name (English)" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary" />
                              <input type="text" value={spec.nameAr} onChange={e => { const newSpecs = [...customSpecs]; newSpecs[index].nameAr = e.target.value; setCustomSpecs(newSpecs); }} placeholder="اسم المواصفة (عربي)" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary text-right" dir="rtl" />
                            </div>
                            <div className="md:col-span-6 space-y-2">
                              <input type="text" value={spec.valueEn} onChange={e => { const newSpecs = [...customSpecs]; newSpecs[index].valueEn = e.target.value; setCustomSpecs(newSpecs); }} placeholder="Value (English)" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary" />
                              <input type="text" value={spec.valueAr} onChange={e => { const newSpecs = [...customSpecs]; newSpecs[index].valueAr = e.target.value; setCustomSpecs(newSpecs); }} placeholder="القيمة (عربي)" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-primary text-right" dir="rtl" />
                            </div>
                            <div className="md:col-span-1 flex justify-center md:pt-2">
                              <button type="button" onClick={() => setCustomSpecs(customSpecs.filter((_, i) => i !== index))} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500 font-medium">No custom specifications added.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* BADGE & STATUS TAB */}
              {activeTab === 'badge' && (
                <div className="space-y-8 animate-fadeIn max-w-2xl">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">BADGE LABEL <span className="font-normal text-gray-400 lowercase">(shown on card corner)</span></label>
                    <input 
                      type="text" value={badgeLabel} onChange={e => setBadgeLabel(e.target.value)}
                      className="w-full bg-white border border-cream rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                      placeholder="e.g. NEW, SALE, Best Seller, -40%"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">BADGE COLOR PRESET</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: 'Gold', class: 'bg-[#D4AF37] text-white' },
                        { id: 'Red', class: 'bg-[#E53E3E] text-white' },
                        { id: 'Green', class: 'bg-[#38A169] text-white' },
                        { id: 'Blue', class: 'bg-[#3182CE] text-white' },
                        { id: 'Black', class: 'bg-[#1A202C] text-white' },
                        { id: 'Purple', class: 'bg-[#805AD5] text-white' }
                      ].map(color => (
                        <label key={color.id} className="cursor-pointer">
                          <input 
                            type="radio" name="badgeColor" className="peer sr-only"
                            checked={badgeColor === color.id}
                            onChange={() => setBadgeColor(color.id)}
                          />
                          <div className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${color.class} ${badgeColor === color.id ? 'ring-2 ring-offset-2 ring-primary scale-105' : 'opacity-80 hover:opacity-100'}`}>
                            {color.id}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-cream rounded-2xl p-6">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block mb-4">PRODUCT STATUS</label>
                    <div className="flex gap-8">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative w-12 h-6 rounded-full transition-colors ${isFeatured ? 'bg-amber-400' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isFeatured ? 'left-7' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" className="sr-only" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                        <span className="text-sm font-bold text-dark flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500"/> Featured Product</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`relative w-12 h-6 rounded-full transition-colors ${isNewArrival ? 'bg-amber-400' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isNewArrival ? 'left-7' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" className="sr-only" checked={isNewArrival} onChange={e => setIsNewArrival(e.target.checked)} />
                        <span className="text-sm font-bold text-dark flex items-center gap-1.5"><Zap className="w-4 h-4 text-orange-500"/> New Arrival</span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

              {/* KEY FEATURES TAB */}
              {activeTab === 'features' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-dark font-bold">
                      <Star className="w-5 h-5 text-dark fill-dark" />
                      <h3 className="text-lg">Key Features</h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" onClick={loadDefaultFeatures}
                        className="bg-white border border-primary text-primary hover:bg-primary/5 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        تحميل الافتراضية
                      </button>
                      <button 
                        type="button" onClick={handleAddFeature}
                        className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        إضافة ميزة جديدة
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-6">"Key Features" هذه البطاقات تظهر في صفحة المنتج تحت تاب</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                    <p className="text-[10px] text-gray-400 font-bold mb-3 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> معاينة مباشرة</p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {keyFeatures.map((feat, idx) => {
                        const Icon = icons.find(i => i.name === feat.icon)?.component || Check;
                        return (
                          <div key={idx} className="bg-white border border-cream rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-primary border border-slate-100">
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-[13px] text-dark">{feat.title || 'Feature Title'}</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{feat.description || 'Feature description here.'}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {keyFeatures.map((feat, index) => (
                      <div key={index} className="border border-blue-200 bg-white rounded-xl overflow-hidden shadow-sm relative">
                        <div className="px-4 py-3 bg-blue-50/50 flex justify-between items-center border-b border-blue-100">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">#{index + 1}</span>
                            <span className="font-bold text-xs text-dark">Feature Card</span>
                          </div>
                          <button 
                            type="button" onClick={() => removeFeature(index)}
                            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> حذف
                          </button>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-gray-400 block">* العنوان</label>
                            <input 
                              type="text" value={feat.title} onChange={e => updateFeature(index, 'title', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                              placeholder="e.g. Temperature Control"
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold text-gray-400 block">الأيقونة</label>
                            <div className="flex flex-wrap gap-2">
                              {icons.map(icn => (
                                <button
                                  key={icn.name} type="button"
                                  onClick={() => updateFeature(index, 'icon', icn.name)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${feat.icon === icn.name ? 'bg-blue-600 text-white shadow-md scale-110' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'}`}
                                >
                                  <icn.component className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-extrabold text-gray-400 block">الوصف</label>
                            <textarea 
                              value={feat.description} onChange={e => updateFeature(index, 'description', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                              rows={2} placeholder="Feature description..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-cream bg-slate-50 flex justify-end gap-3 rounded-b-3xl mt-auto">
            <button 
              type="button" onClick={onCancel}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button 
              type="submit" disabled={isSubmitting}
              className="px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:bg-gray-800 shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
            >
              <Box className="w-4 h-4 text-amber-400" /> 
              {isSubmitting ? 'Saving...' : (initialData ? (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (language === 'ar' ? 'نشر المنتج' : 'Publish Product'))}
            </button>
          </div>
          
          {successMsg && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fadeIn rounded-3xl">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
              <h3 className="text-xl font-extrabold text-dark">Product Saved Successfully!</h3>
            </div>
          )}
        </form>

      </div>
    </div>,
    document.body
  );
};

