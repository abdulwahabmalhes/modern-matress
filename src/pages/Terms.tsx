import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Terms: React.FC = () => {
  const { language, isRtl } = useLanguage();

  return (
    <div className="bg-light min-h-screen pt-24 pb-16" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight mb-8 text-center">
          {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
        </h1>

        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-card space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-primary mb-3">
              {language === 'ar' ? '1. مقدمة' : '1. Introduction'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'مرحباً بكم في منصة المراتب الحديثة. باستخدامكم لهذا الموقع، فإنكم توافقون على الالتزام بالشروط والأحكام التالية.'
                : 'Welcome to the Modern Mattresses platform. By using this site, you agree to comply with the following terms and conditions.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">
              {language === 'ar' ? '2. المبيعات والطلبات' : '2. Sales & Orders'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'جميع الطلبات تخضع للتوفر وتأكيد سعر الطلب. يحق لنا رفض أو إلغاء أي طلب لسبب نراه مناسباً.'
                : 'All orders are subject to availability and confirmation of the order price. We reserve the right to refuse or cancel any order for a reason we deem appropriate.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">
              {language === 'ar' ? '3. سياسة الإرجاع والضمان' : '3. Returns & Warranty Policy'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'تخضع منتجاتنا لضمانات متفاوتة حسب المنتج. يتم قبول المرتجعات فقط خلال الفترة المحددة وبشرط عدم الاستخدام للحفاظ على الصحة العامة، باستثناء المنتجات التي يثبت وجود عيب مصنعي بها.'
                : 'Our products are subject to varying warranties depending on the product. Returns are accepted only within the specified period and on condition of non-use to maintain public health, except for products proven to have a manufacturing defect.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
