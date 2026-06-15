import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { language, isRtl } = useLanguage();

  const phoneNumber = '+971501234567'; // Mock business phone number
  const message = language === 'ar'
    ? 'مرحباً، أود الاستفسار عن مراتب مودرن ماترسز.'
    : 'Hello, I am interested in Modern Mattresses.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group`}
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 animate-pulse" />
      
      {/* Tooltip */}
      <span className={`absolute ${isRtl ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2 bg-dark text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md`}>
        {language === 'ar' ? 'تحدث معنا على واتساب' : 'Chat on WhatsApp'}
      </span>
    </a>
  );
};
