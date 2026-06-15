import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  const { language, isRtl } = useLanguage();

  return (
    <div className="bg-light min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-dark text-center mb-8">
          {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          
          <div className="bg-white p-8 rounded-3xl shadow-card space-y-6">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {language === 'ar' ? 'أرسل لنا رسالة' : 'Send Us A Message'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'ar' ? 'الرسالة' : 'Message'}</label>
                <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"></textarea>
              </div>
              <button type="button" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-premium">
                {language === 'ar' ? 'إرسال' : 'Send'}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-card flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-dark mb-1">{language === 'ar' ? 'العنوان' : 'Address'}</h3>
                <p className="text-gray-600">{language === 'ar' ? 'دبي، الإمارات العربية المتحدة' : 'Dubai, United Arab Emirates'}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-card flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-dark mb-1">{language === 'ar' ? 'الهاتف' : 'Phone'}</h3>
                <p className="text-gray-600" dir="ltr">+971 56 603 1021</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-card flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-dark mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
                <p className="text-gray-600">info@modernmattresses.store</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
