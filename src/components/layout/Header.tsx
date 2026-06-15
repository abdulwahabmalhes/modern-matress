import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Search, Menu, X, User, Globe, Trash2, ShieldCheck, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { api } from '../../lib/api';

export const Header: React.FC = () => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { cart, cartCount, cartSubtotal, removeFromCart, updateQuantity, wishlist, toggleWishlist, addToCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('mm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('mm_user');
      setCurrentUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleStorage);
    };
  }, []);

  useEffect(() => {
    let active = true;
    api.getCategories().then(res => {
      if (active) setCategories(res);
    });
    return () => { active = false; };
  }, []);
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const Logo = () => (
    <img src="/images/logo.jpeg" alt="Modern Mattresses" className="h-10 w-auto object-contain" />
  );

  return (
    <>
      <header className="sticky top-0 z-50 glass-nav shadow-premium transition-premium">
        {/* Top Info Bar */}
        <div className="bg-primary text-white text-[11px] md:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span>{t('hero.badge')}</span>
            <span className="hidden md:inline">📍 {language === 'ar' ? 'توصيل مجاني وتركيب لكافة أنحاء الإمارات' : 'Free Delivery & Installation Across UAE'}</span>
            <button 
              onClick={toggleLanguage} 
              className="flex items-center gap-1 hover:text-gold transition-colors font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream/60 border border-primary/10 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-premium pl-5 pr-10"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            />
            <button type="submit" className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} text-primary hover:text-primary-dark transition-colors`}>
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-dark">
            <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
            <Link to="/shop" className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
            <Link to="/quotation" className="hover:text-primary transition-colors">{t('nav.quotations')}</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Account Icon */}
            <Link to="/account" className="hidden sm:inline-flex items-center gap-1.5 text-dark hover:text-primary transition-colors p-2 rounded-full hover:bg-cream">
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="text-[11px] font-bold max-w-[80px] truncate text-primary uppercase tracking-wide">
                  {currentUser.name.split(' ')[0]}
                </span>
              )}
            </Link>

            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlistDrawerOpen(true)}
              className="relative text-dark hover:text-primary transition-colors p-2 rounded-full hover:bg-cream"
              title={language === 'ar' ? 'المفضلة' : 'Wishlist'}
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-primary fill-primary' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button 
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative text-dark hover:text-primary transition-colors p-2 rounded-full hover:bg-cream"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-dark hover:text-primary transition-colors p-2 rounded-full hover:bg-cream"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Secondary Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2.5 gap-6 sm:gap-8 lg:justify-center">
              <Link to="/shop" className="text-xs font-bold text-dark hover:text-primary transition-colors whitespace-nowrap shrink-0 snap-start">
                {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/shop?category=${cat.slug}`} 
                  className="text-xs font-semibold text-gray-600 hover:text-primary transition-colors whitespace-nowrap shrink-0 snap-start"
                >
                  {language === 'ar' ? cat.name.ar : cat.name.en}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Search & Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-light border-t border-cream px-4 py-4 space-y-4 animate-fadeIn shadow-premium">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cream border border-primary/10 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10"
              />
              <button type="submit" className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} text-primary`}>
                <Search className="w-4 h-4" />
              </button>
            </form>
            <nav className="flex flex-col gap-4 font-semibold text-base text-dark px-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">{t('nav.home')}</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">{t('nav.shop')}</Link>
              <Link to="/quotation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">{t('nav.quotations')}</Link>
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                {t('nav.account')}{currentUser ? ` (${currentUser.name.split(' ')[0]})` : ''}
              </Link>
              <hr className="border-cream" />
              <button 
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-between text-sm py-2 hover:text-primary"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {language === 'ar' ? 'English (RTL Off)' : 'العربية (تفعيل المحاذاة لليمين)'}
                </span>
                <span className="text-xs text-gray-400 font-normal">
                  {language === 'ar' ? 'EN' : 'AR'}
                </span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Shadcn UI Cart Sheet */}
      <Sheet open={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen}>
        <SheetContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md bg-light p-0 flex flex-col h-full border-l border-cream">
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-cream flex flex-row justify-between items-center bg-cream/40 shrink-0">
            <SheetTitle className="flex items-center gap-2 font-bold text-dark text-lg">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>{t('cart.title')}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {cartCount}
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <ShoppingBag className="w-12 h-12 text-primary/20 mb-3" />
                <p className="font-semibold text-dark">{t('cart.empty')}</p>
                <Link 
                  to="/shop" 
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-4 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>{t('hero.cta.shop')}</span>
                </Link>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-cream pb-4 last:border-0 last:pb-0">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name[language]} 
                    className="w-16 h-16 rounded-lg object-cover border border-cream flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-dark truncate">{item.product.name[language]}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.sizeName}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center border border-cream rounded-full bg-cream/40">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-500 hover:text-primary font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-dark">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-500 hover:text-primary font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-xs text-primary">{item.price * item.quantity} AED</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-primary transition-colors p-1 align-top self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-cream bg-cream/20 shrink-0">
              <div className="space-y-2 mb-4 text-sm text-dark">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('cart.subtotal')}</span>
                  <span className="font-bold">{cartSubtotal} AED</span>
                </div>
                <hr className="border-cream" />
                <div className="flex justify-between text-base font-extrabold text-primary">
                  <span>{t('cart.total')}</span>
                  <span>{cartSubtotal} AED</span>
                </div>
              </div>

              <Link 
                to="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full bg-primary hover:bg-primary-dark text-white text-center font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-premium hover:shadow-lg transition-premium mb-2.5 text-sm"
              >
                <span>{t('cart.checkout')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-3">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>{language === 'ar' ? 'ضمان إرجاع آمن ومدفوعات مشفرة 100%' : '100% Secure Encrypted Checkout & Returns'}</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Shadcn UI Wishlist Sheet */}
      <Sheet open={isWishlistDrawerOpen} onOpenChange={setIsWishlistDrawerOpen}>
        <SheetContent side={isRtl ? "left" : "right"} className="w-full sm:max-w-md bg-light p-0 flex flex-col h-full border-l border-cream">
          {/* Header */}
          <SheetHeader className="px-5 py-4 border-b border-cream flex flex-row justify-between items-center bg-cream/40 shrink-0">
            <SheetTitle className="flex items-center gap-2 font-bold text-dark text-lg">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span>{language === 'ar' ? 'قائمة المفضلة' : 'Wishlist'}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                {wishlist.length}
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Wishlist Items list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                <Heart className="w-12 h-12 text-primary/20 mb-3" />
                <p className="font-semibold text-dark">{language === 'ar' ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}</p>
                <Link 
                  to="/shop" 
                  onClick={() => setIsWishlistDrawerOpen(false)}
                  className="mt-4 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>{t('hero.cta.shop')}</span>
                </Link>
              </div>
            ) : (
              wishlist.map(product => (
                <div key={product.id} className="flex gap-4 border-b border-cream pb-4 last:border-0 last:pb-0">
                  <img 
                    src={product.images[0]} 
                    alt={product.name[language]} 
                    className="w-16 h-16 rounded-lg object-cover border border-cream flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-dark truncate">{product.name[language]}</h4>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{product.brand}</span>
                    <span className="font-bold text-xs text-primary block mt-1">
                      {product.variations?.[0]?.salePrice || product.variations?.[0]?.price || product.basePrice} AED
                    </span>
                    
                    <div className="flex gap-2 mt-2.5">
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={() => setIsWishlistDrawerOpen(false)}
                        className="bg-primary hover:bg-primary-dark text-white text-center font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-sm transition-premium flex items-center gap-1"
                      >
                        <span>{language === 'ar' ? 'عرض المنتج' : 'View Detail'}</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          if (product.variations && product.variations[0]) {
                            addToCart(product, product.variations[0].id, 1);
                            setIsWishlistDrawerOpen(false);
                            setIsCartDrawerOpen(true);
                          }
                        }}
                        className="bg-cream hover:bg-cream/80 text-primary border border-primary/10 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-premium"
                      >
                        {language === 'ar' ? 'إضافة للسلة' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="text-gray-300 hover:text-primary transition-colors p-1 align-top self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
