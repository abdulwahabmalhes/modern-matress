import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { products } from '../../data/mockData';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  products?: typeof products;
  isLeadForm?: boolean;
}

export const ChatWidget: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: t('ai.chat.welcome'),
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // User message
    const newMessages = [...messages, { sender: 'user', text } as Message];
    setMessages(newMessages);
    setInputValue('');

    // Generate AI response after a short delay
    setTimeout(() => {
      let aiText = '';
      let suggestedProducts: typeof products = [];
      let isLeadForm = false;

      const lowerText = text.toLowerCase();

      if (lowerText.includes('back') || lowerText.includes('pain') || lowerText.includes('ظهر') || lowerText.includes('ألم')) {
        // Recommend orthopedic mattress
        aiText = language === 'ar'
          ? 'أنصحك بمرتبة رويال الطبية والتقويمية (Royal Orthopedic). تم تصميمها خصيصاً بمناقشة مع أطباء العمود الفقري لتوزيع الضغط ومحاذاة الرقبة والظهر بشكل مثالي. إليك تفاصيلها:'
          : 'I highly recommend the Royal Orthopedic Mattress. It is specifically designed with physical therapists to ensure proper spinal alignment and relieve lumbar pressure. Here is the product details:';
        suggestedProducts = products.filter(p => p.id === '2');
      } else if (lowerText.includes('free') || lowerText.includes('delivery') || lowerText.includes('توصيل') || lowerText.includes('شحن')) {
        aiText = language === 'ar'
          ? 'نعم، نوفر توصيل وتركيب مجاني لكافة أنحاء الإمارات العربية المتحدة (دبي، أبوظبي، الشارقة، عجمان، إلخ) لجميع الطلبات التي تتجاوز 200 درهم، ويستغرق التوصيل عادةً بين 2 إلى 3 أيام عمل.'
          : 'Yes! We offer 100% free home delivery and white-glove installation across all UAE Emirates (Dubai, Abu Dhabi, Sharjah, etc.) for all orders above 200 AED. Deliveries usually take 2-3 working days.';
      } else if (lowerText.includes('quote') || lowerText.includes('wholesale') || lowerText.includes('جملة') || lowerText.includes('سعر') || lowerText.includes('فندق')) {
        aiText = language === 'ar'
          ? 'رائع! للحصول على أسعار مخصصة للطلبيات الكبيرة أو المشاريع، يرجى تزويدنا برقم هاتفك أو حسابك وسيقوم خبير مبيعات بالاتصال بك فوراً.'
          : 'Great! For wholesale or custom B2B projects, please provide your contact info and a sales representative will contact you with a customized quote.';
        isLeadForm = true;
      } else if (lowerText.includes('mattress') || lowerText.includes('مرتبة')) {
        aiText = language === 'ar'
          ? 'لدينا تشكيلة رائعة من المراتب الفاخرة مثل دريم كلاود الهجينة (DreamCloud Hybrid) ورويال الطبية. يمكنك الاطلاع عليها هنا:'
          : 'We have an amazing collection of premium mattresses. Take a look at these popular options:';
        suggestedProducts = products.filter(p => p.category === 'mattresses');
      } else {
        aiText = language === 'ar'
          ? 'أشكرك على استفسارك. هل ترغب في تصفح كتالوج المنتجات، أو الحصول على استشارة مخصصة بخصوص درجة الصلابة الأنسب لطريقة نومك؟'
          : "Thank you for your message. Would you like to browse our catalog, or get a personalized recommendation on which firmness level fits your sleeping style?";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText, products: suggestedProducts, isLeadForm }]);
    }, 800);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate lead capture
    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: language === 'ar'
          ? 'شكراً لك. تم إرسال معلوماتك بنجاح لمكتب المبيعات (CTO Pipeline) وسيتواصل معك خبير النوم لدينا على واتساب في أقل من ساعتين.'
          : 'Thank you! Your information has been sent to our B2B sales office. Our sleep expert will WhatsApp you in less than 2 hours.',
      }
    ]);
  };

  return (
    <div className={`fixed bottom-24 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
        >
          <Bot className="w-6 h-6" />
          <span className="hidden sm:inline text-xs font-bold px-1">{t('ai.chat.title')}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`w-80 sm:w-96 h-[500px] bg-light rounded-2xl shadow-2xl border border-primary/10 flex flex-col overflow-hidden animate-slideUp`}>
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none">{t('ai.chat.title')}</h4>
                <span className="text-[10px] text-white/60 font-medium">Modern Mattresses AI Assistant</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/20">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className="max-w-[75%] space-y-2">
                  {/* Chat text bubble */}
                  <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-dark border border-cream rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Render suggested products inline */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2">
                      {msg.products.map(prod => (
                        <div key={prod.id} className="bg-white rounded-xl border border-cream p-2 flex gap-2 shadow-sm">
                          <img src={prod.images[0]} alt={prod.name[language]} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <h5 className="font-bold text-[10px] text-dark truncate">{prod.name[language]}</h5>
                            <span className="text-[10px] text-primary font-bold">{prod.salePrice || prod.basePrice} AED</span>
                            <Link 
                              to={`/product/${prod.slug}`} 
                              onClick={() => setIsOpen(false)}
                              className="text-[9px] text-secondary font-bold hover:underline self-start"
                            >
                              {language === 'ar' ? 'عرض المنتج' : 'View Product'}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lead form if triggered */}
                  {msg.isLeadForm && (
                    <form onSubmit={handleLeadSubmit} className="bg-white rounded-xl border border-cream p-3 space-y-2 shadow-sm">
                      <input 
                        type="text" 
                        placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'} 
                        className="w-full text-xs p-2 border border-cream rounded focus:outline-none focus:border-primary"
                        required
                      />
                      <input 
                        type="tel" 
                        placeholder={language === 'ar' ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'} 
                        className="w-full text-xs p-2 border border-cream rounded focus:outline-none focus:border-primary"
                        required
                      />
                      <button 
                        type="submit" 
                        className="w-full bg-secondary hover:bg-secondary-dark text-white font-bold py-1.5 px-3 rounded text-[10px]"
                      >
                        {t('quote.submit')}
                      </button>
                    </form>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 bg-cream border border-cream text-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 border-t border-cream flex gap-1.5 overflow-x-auto whitespace-nowrap bg-cream/10">
            <button 
              onClick={() => handleSendMessage(t('ai.chat.suggest.1'))}
              className="text-[10px] bg-white border border-cream hover:border-primary rounded-full px-2.5 py-1 text-gray-500 font-semibold"
            >
              {t('ai.chat.suggest.1')}
            </button>
            <button 
              onClick={() => handleSendMessage(t('ai.chat.suggest.2'))}
              className="text-[10px] bg-white border border-cream hover:border-primary rounded-full px-2.5 py-1 text-gray-500 font-semibold"
            >
              {t('ai.chat.suggest.2')}
            </button>
            <button 
              onClick={() => handleSendMessage(t('ai.chat.suggest.3'))}
              className="text-[10px] bg-white border border-cream hover:border-primary rounded-full px-2.5 py-1 text-gray-500 font-semibold"
            >
              {t('ai.chat.suggest.3')}
            </button>
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }} 
            className="p-3 border-t border-cream flex gap-2 bg-white"
          >
            <input
              type="text"
              placeholder={t('ai.chat.placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-cream/40 border border-cream rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
            />
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-dark text-white rounded-xl p-2 transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
