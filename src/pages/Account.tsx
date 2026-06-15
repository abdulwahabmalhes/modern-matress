import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Mail, Phone, MapPin, Clock, LogOut, Lock, AlertCircle, ShoppingBag } from 'lucide-react';
import { api } from '../lib/api';

export const Account: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  
  // Auth State
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('mm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      setOrdersLoading(true);
      api.getCustomerOrders(user.email)
        .then(res => {
          setOrders(res);
        })
        .catch(err => {
          console.error('Failed to load orders', err);
        })
        .finally(() => {
          setOrdersLoading(false);
        });
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const loggedInUser = await api.login({ email: loginEmail, password: loginPassword });
      localStorage.setItem('mm_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);

    try {
      const newUser = await api.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        city: regCity,
        address: regAddress
      });
      localStorage.setItem('mm_user', JSON.stringify(newUser));
      setUser(newUser);
      window.dispatchEvent(new Event('auth-change'));
    } catch (err: any) {
      setRegError(err.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mm_user');
    setUser(null);
    setOrders([]);
    window.dispatchEvent(new Event('auth-change'));
  };

  if (!user) {
    return (
      <div className="bg-light min-h-[85vh] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-white border border-cream rounded-3xl p-6 sm:p-8 shadow-premium space-y-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          
          {/* Tab Headers */}
          <div className="flex border-b border-cream">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-4 text-sm font-extrabold transition-all border-b-2 text-center ${
                activeTab === 'login' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-400 hover:text-dark'
              }`}
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-4 text-sm font-extrabold transition-all border-b-2 text-center ${
                activeTab === 'register' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-400 hover:text-dark'
              }`}
            >
              {language === 'ar' ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-dark">
                  {language === 'ar' ? 'مرحباً بعودتك!' : 'Welcome Back!'}
                </h3>
                <p className="text-xs text-gray-400 font-semibold">
                  {language === 'ar' ? 'سجل دخولك لاستعراض فواتيرك وطلباتك السابقة' : 'Log in to view your orders, invoices, and shipment tracking'}
                </p>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-3 text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark placeholder-gray-400 focus:outline-none focus:border-primary pl-10"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark placeholder-gray-400 focus:outline-none focus:border-primary pl-10"
                    />
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-premium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <span>{language === 'ar' ? 'جاري التحقق...' : 'Logging in...'}</span>
                ) : (
                  <span>{language === 'ar' ? 'دخول' : 'Sign In'}</span>
                )}
              </button>
            </form>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-dark">
                  {language === 'ar' ? 'انضم إلى مودرن ماترسز' : 'Join Modern Mattresses'}
                </h3>
                <p className="text-xs text-gray-400 font-semibold">
                  {language === 'ar' ? 'سجل حساباً لتتبع الطلبيات وحفظ تفاصيل التوصيل' : 'Create an account to track deliveries, order history, and custom specs'}
                </p>
              </div>

              {regError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-3 text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Amira Al Rashidi"
                    className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'المدينة / الإمارة' : 'City / Emirate'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Dubai"
                    className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {language === 'ar' ? 'عنوان التوصيل بالتفصيل' : 'Street Address'}
                  </label>
                  <textarea
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Marina Heights, Apt 2504, Dubai Marina"
                    rows={2}
                    className="w-full bg-cream/60 border border-primary/5 rounded-xl px-4 py-2.5 text-xs text-dark focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-premium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {regLoading ? (
                  <span>{language === 'ar' ? 'جاري الحفظ...' : 'Creating...'}</span>
                ) : (
                  <span>{language === 'ar' ? 'إنشاء حساب جديد' : 'Register Now'}</span>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pb-20">
      <section className="bg-cream/40 border-b border-cream py-8 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-wide">{t('nav.account')}</h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          
          {/* PROFILE SUMMARY */}
          <div className="bg-white border border-cream rounded-3xl p-6 shadow-premium space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary font-bold text-2xl border-2 border-primary/10">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-base text-dark">{user.name}</h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {language === 'ar' ? 'عضو نوم معتمد' : 'Verified Sleep Member'}
                </span>
              </div>
            </div>

            <hr className="border-cream" />

            <div className="space-y-4 text-xs font-semibold text-dark">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{user.city}, UAE</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-cream hover:bg-cream/80 text-primary border border-primary/5 font-bold py-3.5 px-4 rounded-xl text-xs transition-premium flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
            </button>
          </div>

          {/* ORDER HISTORY & INVOICES */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-cream rounded-3xl p-6 md:p-8 shadow-premium space-y-6">
              <h2 className="font-extrabold text-lg text-dark tracking-wide flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>{language === 'ar' ? 'سجل الفواتير والطلبات' : 'Invoices & Orders'}</span>
              </h2>

              {ordersLoading ? (
                <div className="py-12 text-center text-gray-400 font-semibold text-xs animate-pulse">
                  {language === 'ar' ? 'جاري تحميل سجل الفواتير...' : 'Loading invoices...'}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-semibold text-xs space-y-3">
                  <ShoppingBag className="w-8 h-8 mx-auto text-gray-300" />
                  <p>{language === 'ar' ? 'لا توجد فواتير أو طلبات مسجلة بعد.' : 'No invoices or past orders found.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border border-cream rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center text-xs font-semibold text-dark">
                        <div>
                          <span className="text-gray-400">{language === 'ar' ? 'رقم الفاتورة:' : 'Invoice ID:'} </span>
                          <span className="font-bold text-primary">{order.order_number}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                            order.payment_status === 'paid' 
                              ? 'bg-emerald-500/10 text-emerald-600' 
                              : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {language === 'ar' 
                              ? (order.payment_status === 'paid' ? 'مدفوعة' : 'معلقة') 
                              : order.payment_status}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                            order.status === 'delivered' 
                              ? 'bg-blue-500/10 text-blue-600' 
                              : 'bg-slate-500/10 text-slate-600'
                          }`}>
                            {language === 'ar' 
                              ? (order.status === 'delivered' ? 'تم التوصيل' : 'تحت المعالجة') 
                              : order.status}
                          </span>
                        </div>
                      </div>

                      <hr className="border-cream" />

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items && order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start text-xs">
                            <div>
                              <h4 className="font-bold text-dark">{language === 'ar' ? item.name_ar || item.name : item.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.size} x {item.quantity}</p>
                            </div>
                            <span className="font-bold text-dark">{item.price * item.quantity} AED</span>
                          </div>
                        ))}
                      </div>

                      <hr className="border-cream" />

                      <div className="text-[10px] text-gray-400 font-bold flex justify-between items-center pt-2">
                        <span>{language === 'ar' ? 'التاريخ:' : 'Date:'} {new Date(order.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-4">
                          <span className="text-secondary font-extrabold uppercase">{order.payment_method}</span>
                          <span className="text-primary text-xs font-extrabold">{order.total_amount} AED</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trial care advice banner */}
            <div className="bg-gradient-to-r from-secondary/5 to-white border border-secondary/15 rounded-3xl p-6 shadow-premium flex gap-4 items-center">
              <ShieldCheck className="w-10 h-10 text-secondary flex-shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-dark">{language === 'ar' ? 'فترة تجربة النوم الفاخرة' : 'Premium Sleep Trial'}</h4>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  {language === 'ar'
                    ? 'جميع مراتب مودرن ماترسز الفاخرة مشمولة بـ 100 ليلة تجربة مع إمكانية التبديل أو الاسترجاع بكل سهولة وبدون تعقيد.'
                    : 'All Modern Mattresses premium collections include a 100-night sleep trial. If you are not satisfied, we exchange or refund instantly.'}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
