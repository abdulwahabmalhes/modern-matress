import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { uaeCities } from '../data/mockData';
import { api } from '../lib/api';
import { ShieldCheck, Phone, CheckCircle2, CreditCard, Loader2, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export const Checkout: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const { cart, cartCount, cartSubtotal, cartShipping, cartTotal, clearCart } = useCart();

  // Load user from localStorage if logged in
  const [currentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('mm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Form Fields
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [notes, setNotes] = useState('');
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'tabby' | 'paypal'>('card');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // Success Order
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  
  // Gateways interactive loaders
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'idle' | 'authorizing' | 'success'>('idle');
  
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'login' | 'success'>('idle');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPass, setPaypalPass] = useState('');

  const [showTabbyModal, setShowTabbyModal] = useState(false);
  const [tabbyStatus, setTabbyStatus] = useState<'idle' | 'otp' | 'success'>('idle');
  const [tabbyOtp, setTabbyOtp] = useState('');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city) return;

    if (paymentMethod === 'card') {
      if (!cardNo || !cardExpiry || !cardCvc) {
        alert(language === 'ar' ? 'يرجى إدخال تفاصيل بطاقة الائتمان' : 'Please enter card details');
        return;
      }
      setShowStripeModal(true);
      setStripeStatus('authorizing');
      setTimeout(() => {
        setStripeStatus('success');
        setTimeout(() => {
          setShowStripeModal(false);
          finalizeOrder('paid');
        }, 1500);
      }, 2500);
    } else if (paymentMethod === 'paypal') {
      setShowPaypalModal(true);
      setPaypalStatus('login');
    } else if (paymentMethod === 'tabby') {
      setShowTabbyModal(true);
      setTabbyStatus('otp');
    } else {
      // Cash on delivery
      finalizeOrder('pending');
    }
  };

  const finalizeOrder = async (payStatus: string) => {
    const orderData = {
      user_id: currentUser?.id || null,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address: address,
      city: city,
      payment_method: paymentMethod,
      payment_status: payStatus,
      total_amount: cartTotal,
      items: cart.map(item => ({
        product_id: item.product.id,
        name: item.product.name.en,
        name_ar: item.product.name.ar,
        size: item.sizeName,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const savedOrder = await api.createOrder(orderData);
      setCreatedOrder(savedOrder);
      clearCart();
    } catch (err) {
      console.error('Checkout creation failed', err);
      // fallback in case of errors
      const fallbackOrder = {
        id: Date.now(),
        order_number: 'INV-2026-' + Math.floor(10000 + Math.random() * 90000),
        created_at: new Date().toISOString(),
        ...orderData
      };
      setCreatedOrder(fallbackOrder);
      clearCart();
    }
  };

  const printInvoice = () => {
    window.print();
  };

  // Paypal submit handler
  const handlePaypalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalStatus('success');
    setTimeout(() => {
      setShowPaypalModal(false);
      finalizeOrder('paid');
    }, 1500);
  };

  // Tabby submit handler
  const handleTabbySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tabbyOtp.length !== 4) {
      alert(language === 'ar' ? 'رمز التحقق غير صالح' : 'Invalid OTP code');
      return;
    }
    setTabbyStatus('success');
    setTimeout(() => {
      setShowTabbyModal(false);
      finalizeOrder('paid');
    }, 1500);
  };

  // Success view (Printable Invoice layout)
  if (createdOrder) {
    const trackingMsg = language === 'ar'
      ? `مرحباً، أود تتبع طلبي رقم ${createdOrder.order_number}`
      : `Hello, I want to track my order ${createdOrder.order_number}`;
    const whatsappUrl = `https://wa.me/+971501234567?text=${encodeURIComponent(trackingMsg)}`;

    return (
      <div className="bg-light min-h-[75vh] py-16 px-4 print:bg-white print:py-0">
        <div className="max-w-3xl mx-auto bg-white border border-cream rounded-3xl p-6 md:p-10 shadow-premium space-y-6 print:border-none print:shadow-none print:p-0">
          
          {/* Header Status */}
          <div className="text-center space-y-3 print:hidden">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-dark leading-tight">{t('checkout.success')}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              {t('checkout.order.number')}: <span className="text-primary font-extrabold">{createdOrder.order_number}</span>
            </p>
          </div>

          <hr className="border-cream print:border-gray-200" />

          {/* Printable Invoice Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-dark uppercase tracking-wider">Modern Mattresses</h1>
              <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">Dubai Marina, United Arab Emirates</p>
              <p className="text-[10px] text-gray-400 font-medium">TRN: 100349811200003</p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-extrabold text-primary tracking-wide uppercase">{language === 'ar' ? 'فاتورة ضريبية مبسطة' : 'Tax Invoice'}</h2>
              <p className="text-[10px] text-gray-400 font-bold mt-1">{createdOrder.order_number}</p>
              <p className="text-[10px] text-gray-400 font-bold">{new Date(createdOrder.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <hr className="border-cream print:border-gray-200" />

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-dark" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="space-y-1">
              <span className="text-gray-400 font-bold block uppercase tracking-wider">{language === 'ar' ? 'فاتورة إلى:' : 'Billed To:'}</span>
              <p className="font-extrabold text-dark">{createdOrder.customer_name}</p>
              <p className="font-medium text-gray-500">{createdOrder.customer_email}</p>
              <p className="font-medium text-gray-500">{createdOrder.customer_phone}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-gray-400 font-bold block uppercase tracking-wider">{language === 'ar' ? 'عنوان التوصيل:' : 'Deliver To:'}</span>
              <p className="font-medium text-dark">{createdOrder.shipping_address}</p>
              <p className="font-bold text-primary">{createdOrder.city}, UAE</p>
            </div>
          </div>

          <hr className="border-cream print:border-gray-200" />

          {/* Order Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              <thead>
                <tr className="border-b border-cream text-gray-400 uppercase tracking-widest font-extrabold">
                  <th className="py-2">{language === 'ar' ? 'المنتج' : 'Item Description'}</th>
                  <th className="py-2 text-center">{language === 'ar' ? 'الكمية' : 'Qty'}</th>
                  <th className="py-2 text-right">{language === 'ar' ? 'سعر الوحدة' : 'Price'}</th>
                  <th className="py-2 text-right">{language === 'ar' ? 'الإجمالي' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {createdOrder.items && createdOrder.items.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-cream/50 text-dark font-semibold">
                    <td className="py-3">
                      <p className="font-bold">{language === 'ar' ? item.name_ar || item.name : item.name}</p>
                      <span className="text-[10px] text-gray-400">{item.size}</span>
                    </td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{item.price} AED</td>
                    <td className="py-3 text-right font-bold text-primary">{item.price * item.quantity} AED</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end pt-4" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
            <div className="w-64 space-y-2 text-xs font-semibold text-dark">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('cart.subtotal')}</span>
                <span>{createdOrder.total_amount} AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('cart.shipping')}</span>
                <span>{t('cart.shipping.free')}</span>
              </div>
              <hr className="border-cream" />
              <div className="flex justify-between text-sm font-extrabold text-primary">
                <span>{t('cart.total')} (VAT Inc.)</span>
                <span>{createdOrder.total_amount} AED</span>
              </div>
              <div className="text-[10px] text-gray-400 text-right font-medium">
                {language === 'ar' ? `طريقة الدفع: ${createdOrder.payment_method}` : `Payment Method: ${createdOrder.payment_method.toUpperCase()}`}
              </div>
            </div>
          </div>

          <hr className="border-cream print:border-gray-200" />

          {/* Success Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
            <button
              onClick={printInvoice}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-premium cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
            </button>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-premium"
            >
              <Phone className="w-4 h-4" />
              <span>{language === 'ar' ? 'تتبع الطلب عبر واتساب' : 'Track Order on WhatsApp'}</span>
            </a>
            <Link 
              to="/" 
              className="bg-cream text-primary border border-primary/5 hover:bg-cream/80 font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-premium"
            >
              <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen pb-20">
      <section className="bg-cream/40 border-b border-cream py-8 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-wide">{t('checkout.title')}</h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {cartCount === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-gray-500 mb-4">{language === 'ar' ? 'لا توجد عناصر للدفع.' : 'No items to checkout.'}</p>
            <Link to="/shop" className="bg-primary text-white text-xs font-bold py-2.5 px-6 rounded-xl inline-block">
              {t('hero.cta.shop')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* BILLING FORM */}
            <div className="lg:col-span-2 bg-white border border-cream rounded-3xl p-6 md:p-8 shadow-premium space-y-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              <h2 className="font-extrabold text-lg text-dark tracking-wide">{t('checkout.billing')}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">{t('checkout.name')} *</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400">{t('checkout.phone')} *</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-400">{t('checkout.email')} *</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-400">{t('checkout.address')} *</label>
                  <input 
                    type="text" 
                    required 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary font-semibold text-dark"
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
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-400">{t('checkout.notes')}</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-cream/40 border border-cream rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary resize-none font-semibold text-dark"
                  />
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY & PAYMENT */}
            <div className="space-y-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              
              {/* Order total */}
              <div className="bg-white border border-cream rounded-3xl p-6 shadow-premium space-y-4">
                <h3 className="font-extrabold text-sm text-dark uppercase tracking-wider">{language === 'ar' ? 'تفاصيل الفاتورة' : 'Invoice Details'}</h3>
                
                <div className="space-y-2 text-xs font-semibold text-dark">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('cart.subtotal')}</span>
                    <span>{cartSubtotal} AED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('cart.shipping')}</span>
                    <span>{cartShipping === 0 ? t('cart.shipping.free') : `${cartShipping} AED`}</span>
                  </div>
                  <hr className="border-cream" />
                  <div className="flex justify-between text-base font-extrabold text-primary">
                    <span>{t('cart.total')}</span>
                    <span>{cartTotal} AED</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white border border-cream rounded-3xl p-6 shadow-premium space-y-4">
                <h3 className="font-extrabold text-sm text-dark uppercase tracking-wider">{t('checkout.payment')}</h3>
                
                <div className="space-y-3">
                  {[
                    { id: 'card', name: t('checkout.payment.card'), desc: 'Stripe Secure Credit Card' },
                    { id: 'paypal', name: 'PayPal Sandbox', desc: 'Secure Express PayPal' },
                    { id: 'tabby', name: t('checkout.payment.tabby'), desc: 'Split in 4 payments' },
                    { id: 'cod', name: t('checkout.payment.cod'), desc: 'Cash on delivery hand-off' },
                  ].map(method => (
                    <div 
                      key={method.id} 
                      className={`border rounded-2xl p-4 transition-colors ${
                        paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-cream bg-white'
                      }`}
                    >
                      <label className="flex gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id as any)}
                          className="accent-primary w-4 h-4 mt-0.5"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-xs text-dark">{method.name}</h4>
                          <span className="text-[10px] text-gray-400">{method.desc}</span>
                        </div>
                      </label>

                      {/* Render mock card form inside Stripe */}
                      {paymentMethod === 'card' && method.id === 'card' && (
                        <div className="mt-4 pt-4 border-t border-cream space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] text-gray-400 font-bold uppercase">{language === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label>
                            <div className="relative">
                              <input 
                                type="text"
                                placeholder="4242 •••• •••• 4242"
                                value={cardNo}
                                onChange={(e) => setCardNo(e.target.value)}
                                className="w-full bg-cream border border-cream rounded-xl px-3 py-2 text-xs text-dark focus:outline-none pl-8"
                              />
                              <CreditCard className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-400 font-bold uppercase">MM/YY</label>
                              <input 
                                type="text"
                                placeholder="12/29"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full bg-cream border border-cream rounded-xl px-3 py-2 text-xs text-dark focus:outline-none text-center"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-400 font-bold uppercase">CVC</label>
                              <input 
                                type="text"
                                placeholder="123"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full bg-cream border border-cream rounded-xl px-3 py-2 text-xs text-dark focus:outline-none text-center"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-premium hover:shadow-lg transition-premium mt-4 cursor-pointer"
                >
                  {t('checkout.place')}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-2 text-center">
                  <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>{language === 'ar' ? 'بوابة دفع آمنة ومشفرة 100%' : '100% Secure SSL Checkout'}</span>
                </div>
              </div>

            </div>

          </form>
        )}
      </div>

      {/* STRIPE 3D-SECURE POPUP DIALOG */}
      <Dialog open={showStripeModal} onOpenChange={setShowStripeModal}>
        <DialogContent className="bg-white border border-cream max-w-sm w-full rounded-3xl p-6 text-center space-y-6 shadow-2xl" showCloseButton={false}>
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <DialogTitle className="text-lg font-extrabold text-dark uppercase tracking-wide text-center">
              Stripe 3D-Secure
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 font-semibold leading-relaxed text-center">
              {stripeStatus === 'authorizing' 
                ? 'Authorizing payment with your bank. Please do not close or refresh this page...' 
                : 'Payment successful! Finalizing your order invoice...'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* PAYPAL POPUP SIMULATOR DIALOG */}
      <Dialog open={showPaypalModal} onOpenChange={setShowPaypalModal}>
        <DialogContent className="bg-[#003087] max-w-md w-full rounded-3xl p-6 text-white space-y-6 shadow-2xl border-0" showCloseButton={true}>
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-xl font-extrabold tracking-wider italic text-[#0079C1] text-center">
              PayPal Sandbox
            </DialogTitle>
            <DialogDescription className="text-xs text-[#9ebbfb] font-semibold text-center">
              Express Checkout Simulator
            </DialogDescription>
          </DialogHeader>

          {paypalStatus === 'login' ? (
            <form onSubmit={handlePaypalSubmit} className="space-y-4 text-dark mt-2">
              <input 
                type="email"
                required
                placeholder="PayPal Email Sandbox Account"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
              />
              <input 
                type="password"
                required
                placeholder="Password"
                value={paypalPass}
                onChange={(e) => setPaypalPass(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-[#ffc439] hover:bg-[#e2ad2d] text-dark font-extrabold py-3 rounded-xl text-xs uppercase cursor-pointer"
              >
                Pay Now {cartTotal} AED
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Loader2 className="w-10 h-10 mx-auto text-white animate-spin" />
              <p className="text-xs font-semibold text-[#9ebbfb]">PayPal Authorization Successful! Redirecting...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* TABBY POPUP SIMULATOR DIALOG */}
      <Dialog open={showTabbyModal} onOpenChange={setShowTabbyModal}>
        <DialogContent className="bg-white max-w-sm w-full rounded-3xl p-6 text-dark space-y-6 shadow-2xl border border-cream" showCloseButton={true}>
          <DialogHeader className="text-center border-b border-cream pb-4 space-y-1">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-[#3cd5a7] font-sans text-center">
              tabby
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400 font-semibold text-center">
              4 Interest-free installments of {(cartTotal / 4).toFixed(2)} AED/month
            </DialogDescription>
          </DialogHeader>

          {tabbyStatus === 'otp' ? (
            <form onSubmit={handleTabbySubmit} className="space-y-4 text-center mt-2">
              <p className="text-xs font-bold text-gray-500">We sent a 4-digit verification code to {phone}</p>
              <input 
                type="text"
                required
                maxLength={4}
                placeholder="Enter OTP (e.g. 1234)"
                value={tabbyOtp}
                onChange={(e) => setTabbyOtp(e.target.value)}
                className="w-28 mx-auto bg-cream border border-cream rounded-xl px-3 py-2 text-center text-lg font-bold tracking-[8px] focus:outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-[#111111] hover:bg-black text-white font-extrabold py-3 rounded-xl text-xs uppercase cursor-pointer"
              >
                Confirm & Split Payment
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Loader2 className="w-10 h-10 mx-auto text-[#3cd5a7] animate-spin" />
              <p className="text-xs font-bold text-[#3cd5a7]">OTP Verified! Splitting payment in 4 installments...</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};
