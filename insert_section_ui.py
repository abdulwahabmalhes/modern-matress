import re

with open('src/AdminApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert States
state_code = """  // Home Builder states
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [newSectionType, setNewSectionType] = useState('custom_full_banner');
  const [newSectionNameEn, setNewSectionNameEn] = useState('');
  const [newSectionNameAr, setNewSectionNameAr] = useState('');
  const [newSectionImageUrl, setNewSectionImageUrl] = useState('');
  const [newSectionLink, setNewSectionLink] = useState('');
  const [newSectionFilterType, setNewSectionFilterType] = useState<'category' | 'brand'>('category');
  const [newSectionFilterId, setNewSectionFilterId] = useState('');

  const handleAddCustomSection = () => {
    if (!newSectionNameEn || !newSectionNameAr) return;
    const newSection: any = {
      id: `custom_${Date.now()}`,
      type: newSectionType,
      name: { en: newSectionNameEn, ar: newSectionNameAr },
      visible: true,
      order: homeLayout.length + 1,
      content: {
        imageUrl: newSectionImageUrl,
        link: newSectionLink,
        title: { en: newSectionNameEn, ar: newSectionNameAr }
      }
    };

    if (newSectionType === 'custom_banner_products') {
      newSection.content.filterType = newSectionFilterType;
      newSection.content.filterId = newSectionFilterId;
    }

    setHomeLayout([...homeLayout, newSection]);
    setIsSectionModalOpen(false);
    setNewSectionNameEn('');
    setNewSectionNameAr('');
    setNewSectionImageUrl('');
    setNewSectionLink('');
  };
"""
content = content.replace("  const [homeLayout, setHomeLayout] = useState<HomeSection[]>([]);", "  const [homeLayout, setHomeLayout] = useState<HomeSection[]>([]);\n" + state_code)

# 2. Insert Add Button
btn_code = """
                  <button 
                    onClick={() => setIsSectionModalOpen(true)}
                    className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {language === 'ar' ? 'إضافة قسم مخصص' : 'Add Section'}
                  </button>"""
content = content.replace("                <div className=\"flex gap-3\">", "                <div className=\"flex gap-3\">" + btn_code)

# 3. Insert Modal Code
modal_code = """
              {isSectionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
                  <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-y-auto max-h-[90vh]">
                    <button 
                      onClick={() => setIsSectionModalOpen(false)}
                      className="absolute top-6 right-6 text-gray-400 hover:text-dark transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-extrabold text-dark tracking-wide mb-6">
                      {language === 'ar' ? 'إضافة قسم جديد' : 'Add Custom Section'}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                          {language === 'ar' ? 'نوع القسم' : 'Section Type'}
                        </label>
                        <select 
                          value={newSectionType}
                          onChange={e => setNewSectionType(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                        >
                          <option value="custom_full_banner">{language === 'ar' ? 'بانر عرض كامل' : 'Full Width Banner'}</option>
                          <option value="custom_banner_products">{language === 'ar' ? 'بانر جانبي + منتجات' : 'Banner + Products'}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                            {language === 'ar' ? 'العنوان الإنجليزي' : 'Title (EN)'}
                          </label>
                          <input 
                            type="text" 
                            value={newSectionNameEn}
                            onChange={e => setNewSectionNameEn(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                            {language === 'ar' ? 'العنوان العربي' : 'Title (AR)'}
                          </label>
                          <input 
                            type="text" 
                            value={newSectionNameAr}
                            onChange={e => setNewSectionNameAr(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                          {language === 'ar' ? 'رابط الصورة (URL)' : 'Image URL'}
                        </label>
                        <input 
                          type="text" 
                          value={newSectionImageUrl}
                          onChange={e => setNewSectionImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                          {language === 'ar' ? 'رابط التوجيه (اختياري)' : 'Link to (Optional)'}
                        </label>
                        <input 
                          type="text" 
                          value={newSectionLink}
                          onChange={e => setNewSectionLink(e.target.value)}
                          placeholder="/shop?category=beds"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                        />
                      </div>

                      {newSectionType === 'custom_banner_products' && (
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                              {language === 'ar' ? 'تصفية المنتجات حسب' : 'Filter Products By'}
                            </label>
                            <select 
                              value={newSectionFilterType}
                              onChange={e => setNewSectionFilterType(e.target.value as any)}
                              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                            >
                              <option value="category">{language === 'ar' ? 'القسم (Category)' : 'Category'}</option>
                              <option value="brand">{language === 'ar' ? 'الماركة (Brand)' : 'Brand'}</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                              {language === 'ar' ? 'اختر العنصر' : 'Select Item'}
                            </label>
                            <select 
                              value={newSectionFilterId}
                              onChange={e => setNewSectionFilterId(e.target.value)}
                              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary font-semibold"
                            >
                              <option value="">{language === 'ar' ? '-- اختر --' : '-- Select --'}</option>
                              {newSectionFilterType === 'category' ? categories.map(c => (
                                <option key={c.id} value={c.id}>{language === 'ar' ? c.name_ar : c.name_en}</option>
                              )) : brandsList.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={handleAddCustomSection}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs tracking-wider transition-colors mt-4"
                      >
                        {language === 'ar' ? 'إضافة القسم' : 'Add Section'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
"""
content = content.replace("            </div>\n          )}\n\n        </main>", "            </div>\n" + modal_code + "          )}\n\n        </main>")

with open('src/AdminApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
