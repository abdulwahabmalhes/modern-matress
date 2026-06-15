import React from 'react';
import { Truck, ShieldCheck, Sparkles, RefreshCcw, Percent } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Ticker: React.FC = () => {
  const { language } = useLanguage();

  const items = [
    {
      icon: <Truck className="w-4 h-4 text-gold" />,
      textEn: "FREE 48H DELIVERY & SETUP",
      textAr: "توصيل وتركيب مجاني خلال 48 ساعة"
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-gold" />,
      textEn: "UP TO 15-YEAR WARRANTY",
      textAr: "ضمان يصل إلى 15 سنة"
    },
    {
      icon: <Sparkles className="w-4 h-4 text-gold" />,
      textEn: "HANDCRAFTED PREMIUM MATERIALS",
      textAr: "مواد فاخرة مصنوعة يدوياً"
    },
    {
      icon: <RefreshCcw className="w-4 h-4 text-gold" />,
      textEn: "30 DAYS EASY RETURNS",
      textAr: "إرجاع سهل خلال 30 يوماً"
    },
    {
      icon: <Percent className="w-4 h-4 text-gold" />,
      textEn: "UP TO 70% OFF SELECT ITEMS",
      textAr: "خصم يصل إلى 70% على منتجات مختارة"
    }
  ];

  return (
    <div className="w-full bg-dark text-white border-y border-white/10 py-3 overflow-hidden flex items-center relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark to-transparent z-10"></div>
      
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Repeat the items multiple times for a seamless loop */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {items.map((item, idx) => (
              <div key={`${i}-${idx}`} className="flex items-center gap-2 mx-8">
                <span className="text-gold opacity-50 text-[10px]">✦</span>
                {item.icon}
                <span className="text-xs font-bold tracking-widest uppercase ml-1">
                  {language === 'ar' ? item.textAr : item.textEn}
                </span>
                <span className="text-gold opacity-50 text-[10px] ml-8">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
