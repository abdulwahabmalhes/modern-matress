import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

export const Cart: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartShipping, cartTotal } = useCart();

  return (
    <div className="bg-light min-h-screen pb-20">
      <section className="bg-cream/40 border-b border-cream py-8 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-dark tracking-wide">{t('cart.title')}</h1>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {cart.length === 0 ? (
          <div className="bg-white border border-cream rounded-3xl p-16 text-center max-w-xl mx-auto shadow-premium space-y-4">
            <ShoppingBag className="w-16 h-16 text-primary/20 mx-auto" />
            <h2 className="text-xl font-bold text-dark">{t('cart.empty')}</h2>
            <p className="text-xs text-gray-400 font-medium">
              {language === 'ar' 
                ? 'لم تقم بإضافة أي منتجات إلى سلتك بعد. تصفح تشكيلة منتجاتنا الآن.' 
                : 'You have not added any sleep products to your cart yet. Explore our luxury items now.'}
            </p>
            <Link 
              to="/shop" 
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl text-xs shadow-sm transition-premium inline-flex items-center gap-2"
            >
              <span>{t('hero.cta.shop')}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              {cart.map(item => (
                <div key={item.id} className="bg-white border border-cream rounded-2xl p-5 shadow-card flex gap-5 items-center">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name[language]} 
                    className="w-20 h-20 object-cover rounded-xl border border-cream flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-extrabold text-base text-dark leading-snug">{item.product.name[language]}</h3>
                        <p className="text-xs text-gray-400 font-bold mt-1">{item.sizeName}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-primary transition-colors p-1.5 rounded-full hover:bg-cream/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Qty Counter */}
                      <div className="flex items-center border border-cream rounded-xl bg-cream/20">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 font-bold text-gray-500 hover:text-primary"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-dark">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 font-bold text-gray-500 hover:text-primary"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-bold text-base text-primary">
                        {item.price * item.quantity} AED
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY PANEL */}
            <div className="bg-white border border-cream rounded-3xl p-6 shadow-premium space-y-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              <h2 className="font-extrabold text-lg text-dark tracking-wide">
                {language === 'ar' ? 'ملخص السلة' : 'Order Summary'}
              </h2>
              
              <div className="space-y-4 text-xs font-semibold text-dark">
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

              <Link 
                to="/checkout"
                className="w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-premium hover:shadow-lg transition-premium text-sm"
              >
                <span>{t('cart.checkout')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>{language === 'ar' ? 'ضمان إرجاع آمن ومدفوعات مشفرة 100%' : '100% Secure Encrypted Checkout & Returns'}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
