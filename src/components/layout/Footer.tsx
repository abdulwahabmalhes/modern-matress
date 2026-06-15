import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Mail, MapPin, Heart, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t-2 border-primary/20">
      {/* Top Banner / Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-xl md:text-2xl font-bold font-sans tracking-wide">
              {language === 'ar' 
                ? 'انضم إلى عائلة مودرن ماترسز للحصول على عروض حصرية' 
                : 'Join the Modern Mattresses Family for Exclusive Offers'}
            </h3>
            <p className="text-sm text-gray-400 mt-2">
              {language === 'ar'
                ? 'سجل بريدك الإلكتروني للحصول على نصائح النوم، إطلاق المنتجات الجديدة، وخصم 10% على طلبك الأول.'
                : 'Sign up to receive sleep guides, new product alerts, and 10% off your first purchase.'}
            </p>
          </div>
          <form className="flex gap-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={language === 'ar' ? 'عنوان بريدك الإلكتروني' : 'Your Email Address'}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary flex-grow"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white rounded-xl px-5 py-3 hover:shadow-lg transition-premium flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Brand */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/images/logo.jpeg" alt="Modern Mattresses" className="h-12 w-auto object-contain rounded" />
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              {language === 'ar'
                ? 'مودرن ماترسز هي منصة تجارة إلكترونية إماراتية رائدة متخصصة في صناعة المراتب الطبية الفاخرة وإطارات الأسرة المعاصرة، مصممة بأعلى معايير الجودة لتوفير نوم صحي ومريح.'
                : 'Modern Mattresses is a leading UAE-based brand specializing in luxury orthopedic mattresses and contemporary bed frames, crafted to provide the highest standards of support and sleep health.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest text-primary uppercase">
              {language === 'ar' ? 'روابط سريعة' : 'QUICK LINKS'}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
              </li>
              <li>
                <Link to="/shop?category=mattresses" className="hover:text-primary transition-colors">{t('category.mattresses')}</Link>
              </li>
              <li>
                <Link to="/shop?category=beds" className="hover:text-primary transition-colors">{t('category.beds')}</Link>
              </li>
              <li>
                <Link to="/quotation" className="hover:text-primary transition-colors">{t('quote.title')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  {language === 'ar' ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Policies */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest text-primary uppercase">
              {language === 'ar' ? 'السياسات والضمان' : 'POLICIES & CARE'}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400 font-medium">
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">
                  {language === 'ar' ? 'ضمان النوم التجاري لـ 100 ليلة' : '100-Night Sleep Trial'}
                </span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">
                  {language === 'ar' ? 'سياسة التوصيل والتركيب المجاني' : 'Free Delivery & Installation'}
                </span>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest text-primary uppercase">
              {language === 'ar' ? 'معلومات التواصل' : 'CONTACT INFO'}
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'شارع الشيخ زايد، دبي، الإمارات العربية المتحدة'
                    : 'Sheikh Zayed Road, Dubai, United Arab Emirates'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span style={{ direction: 'ltr' }}>+971 56 603 1021</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>info@modernmattresses.store</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Payment Info and Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[11px] text-gray-500 flex items-center gap-1">
          <span>&copy; {currentYear} Modern Mattresses. All rights reserved.</span>
          <span className="flex items-center text-primary-dark mx-1">
            Made with <Heart className="w-3.5 h-3.5 fill-primary text-primary inline" /> in Dubai
          </span>
        </p>

        {/* Payment Partners logos */}
        <div className="flex items-center gap-3 opacity-60">
          <span className="text-[10px] text-gray-500">
            {language === 'ar' ? 'شركاء الدفع الآمن:' : 'Secure Payments:'}
          </span>
          <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-gray-400">VISA</div>
          <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-gray-400">MASTERCARD</div>
          <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-gray-400">TABBY</div>
          <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-gray-400">COD</div>
        </div>
      </div>
    </footer>
  );
};
