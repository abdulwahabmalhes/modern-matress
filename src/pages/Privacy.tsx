import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Privacy: React.FC = () => {
  const { language, isRtl } = useLanguage();

  return (
    <div className="bg-light min-h-screen pt-24 pb-16" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-8 text-center">
          {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
        </h1>

        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-card space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">
              {language === 'ar' ? '1. جمع المعلومات' : '1. Information Collection'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'نحن نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب، أو تقديم طلب، أو التواصل معنا لدعم العملاء.'
                : 'We collect information you provide directly to us, such as when you create an account, place an order, or contact us for customer support.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">
              {language === 'ar' ? '2. استخدام المعلومات' : '2. Use of Information'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'نستخدم المعلومات التي نجمعها لتقديم وصيانة وتحسين خدماتنا، ومعالجة المعاملات، وإرسال الإشعارات المتعلقة بطلبك.'
                : 'We use the information we collect to provide, maintain, and improve our services, process transactions, and send notifications related to your order.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">
              {language === 'ar' ? '3. أمان البيانات' : '3. Data Security'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الفقدان والسرقة وسوء الاستخدام والوصول غير المصرح به.'
                : 'We take reasonable security measures to protect your personal information from loss, theft, misuse, and unauthorized access.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
