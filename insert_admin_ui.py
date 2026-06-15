import re

with open('src/AdminApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the UI code
ui_code = """
          {activeTab === 'home-layout' && (
            <div className="space-y-6 animate-fade-in pb-12">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-xl font-extrabold text-dark tracking-wide">{language === 'ar' ? 'مُنشئ الصفحة الرئيسية' : 'Home Page Builder'}</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">{language === 'ar' ? 'رتب أقسام الصفحة الرئيسية وحدد الأقسام المرئية' : 'Reorder and toggle visibility of home page sections'}</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={async () => {
                      const api = (await import('./lib/api')).api;
                      const layout = await api.getHomeLayout();
                      setHomeLayout(layout);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-dark rounded-xl text-xs font-bold transition-colors"
                  >
                    {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
                  </button>
                  <button 
                    onClick={async () => {
                      const api = (await import('./lib/api')).api;
                      await api.saveHomeLayout(homeLayout);
                      alert(language === 'ar' ? 'تم حفظ الترتيب بنجاح!' : 'Layout saved successfully!');
                    }}
                    className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {language === 'ar' ? 'حفظ التعديلات' : 'Save Layout'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="space-y-3">
                  {homeLayout.map((section, index) => (
                    <div 
                      key={section.id} 
                      className={`flex items-center justify-between p-4 rounded-2xl border ${section.visible ? 'border-primary/20 bg-cream/30' : 'border-gray-200 bg-gray-50 opacity-60'} transition-all`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button 
                            disabled={index === 0}
                            onClick={() => {
                              const newLayout = [...homeLayout];
                              const temp = newLayout[index - 1];
                              newLayout[index - 1] = newLayout[index];
                              newLayout[index] = temp;
                              newLayout.forEach((s, i) => s.order = i + 1);
                              setHomeLayout(newLayout);
                            }}
                            className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                          </button>
                          <button 
                            disabled={index === homeLayout.length - 1}
                            onClick={() => {
                              const newLayout = [...homeLayout];
                              const temp = newLayout[index + 1];
                              newLayout[index + 1] = newLayout[index];
                              newLayout[index] = temp;
                              newLayout.forEach((s, i) => s.order = i + 1);
                              setHomeLayout(newLayout);
                            }}
                            className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-dark">{section.name[language as 'en'|'ar'] || section.name.en}</h3>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{section.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500">
                          {section.visible ? (language === 'ar' ? 'مرئي' : 'Visible') : (language === 'ar' ? 'مخفي' : 'Hidden')}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={section.visible}
                            onChange={() => {
                              const newLayout = [...homeLayout];
                              newLayout[index].visible = !newLayout[index].visible;
                              setHomeLayout(newLayout);
                            }}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
"""

target = "        </section>\n      </div>\n\n      {/* INVOICE MANAGEMENT DIALOG MODAL */}"
content = content.replace(target, ui_code + "\n" + target)

with open('src/AdminApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
