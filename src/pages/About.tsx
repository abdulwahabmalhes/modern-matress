import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { language, isRtl } = useLanguage();

  return (
    <div className="bg-light min-h-screen pt-24 pb-16" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-dark tracking-tight mb-4">
            {language === 'ar' ? 'من نحن' : 'About Us'}
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="space-y-12 text-gray-700 leading-relaxed text-lg bg-white p-8 sm:p-12 rounded-3xl shadow-card">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">
              {language === 'ar' ? 'قصتنا' : 'Our Story'}
            </h2>
            <p>
              {language === 'ar' 
                ? 'بدأت شركة المراتب الحديثة بشغف لتوفير أفضل تجربة نوم لعملائنا في المنطقة. نحن نؤمن بأن النوم الجيد هو أساس الحياة الصحية والسعيدة. لذلك قمنا باختيار أفضل المواد الأولية وتصنيع مراتبنا بأعلى معايير الجودة العالمية.'
                : 'Modern Mattresses began with a passion for providing the best sleep experience for our customers in the region. We believe that good sleep is the foundation of a healthy and happy life. Therefore, we have selected the best raw materials and manufactured our mattresses to the highest international quality standards.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">
              {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
            </h2>
            <p>
              {language === 'ar'
                ? 'أن نكون العلامة التجارية الأولى الموثوقة في تقديم حلول النوم المريحة والفاخرة، والمساهمة في تحسين جودة حياة الملايين من خلال منتجات مبتكرة تدعم الصحة والراحة التامة.'
                : 'To be the first trusted brand in providing comfortable and luxurious sleep solutions, and contributing to improving the quality of life of millions through innovative products that support total health and comfort.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">
              {language === 'ar' ? 'لماذا نحن؟' : 'Why Us?'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>{language === 'ar' ? 'جودة لا تضاهى بمواد فاخرة.' : 'Unmatched quality with premium materials.'}</li>
              <li>{language === 'ar' ? 'ضمانات ممتدة لراحة بالك.' : 'Extended warranties for your peace of mind.'}</li>
              <li>{language === 'ar' ? 'خدمة عملاء استثنائية على مدار الساعة.' : 'Exceptional customer service around the clock.'}</li>
              <li>{language === 'ar' ? 'توصيل وتركيب مجاني وسريع.' : 'Fast, free delivery and setup.'}</li>
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
};
