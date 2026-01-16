
import React, { useState } from 'react';
import { Language, Currency, ViewState, ThemeColor } from '../types';
import { LANGUAGES, THEMES, TRANSLATIONS } from '../constants';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  setCurrency: (c: Currency) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  setView: (v: ViewState) => void;
  setSelectedCategory: (cat: string) => void;
  currentView: ViewState;
  theme: ThemeColor;
  setTheme: (t: ThemeColor) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (q: string) => void;
  isLoggedIn: boolean;
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  lang, setLang, setCurrency, cartCount, wishlistCount, onCartClick, onWishlistClick, setView, setSelectedCategory, currentView, theme, setTheme,
  searchQuery, setSearchQuery, onSearch, isLoggedIn, onAdminClick
}) => {
  const [isVibeMenuOpen, setIsVibeMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleCategorySelect = (cat: string) => {
    setView('home');
    setSelectedCategory(cat);
    setTimeout(() => {
      const element = document.getElementById('products');
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const currentTheme = THEMES[theme];

  return (
    <nav className="z-[100] relative">
      <div className="bg-[#f8f9fa] border-b border-gray-100 py-2 hidden lg:block">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
              <i className={`fa-solid fa-truck-fast ${currentTheme.text} animate-bounce`}></i>
              FREE SHIPPING ON ORDERS OVER $50
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onAdminClick}
              className="text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-600 transition-colors tracking-widest flex items-center gap-2 mr-6 border-r pr-6 border-gray-100"
            >
              <i className="fa-solid fa-lock"></i> Admin Console
            </button>
            <div className="flex items-center gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setCurrency(l.currency as Currency); }}
                  className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full transition-all flex items-center gap-2 hover:-translate-y-1 hover:shadow-md ${lang === l.code ? `${currentTheme.primary} text-white shadow-lg scale-105` : 'text-gray-400 hover:text-black hover:bg-white'}`}
                >
                  <span className="text-xs">{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${currentTheme.primary} text-white py-6 transition-all duration-700 shadow-xl relative`}>
        <div className="container mx-auto px-6 flex items-center justify-between gap-12">
          <button onClick={() => { setView('home'); setSelectedCategory('All'); }} className="text-2xl lg:text-3xl font-black italic tracking-tighter hover:opacity-80 transition-all hover:scale-105 active:scale-95 shrink-0">
            MASTER STUDIO.
          </button>

          <div className="hidden lg:flex flex-1 max-w-2xl relative group">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for premium apparel, designs, and more..."
                className="w-full h-14 bg-white/10 border border-white/10 rounded-full px-14 text-sm font-medium placeholder:text-white/40 outline-none focus:bg-white focus:text-black focus:placeholder:text-gray-400 focus:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 shadow-xl"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gray-400 transition-colors group-hover:scale-125"></i>
            </form>
          </div>

          <div className="flex items-center gap-2 lg:gap-8">
            <button onClick={() => setIsVibeMenuOpen(!isVibeMenuOpen)} className="flex flex-col items-center group transition-all">
              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg ${isVibeMenuOpen ? 'bg-white/20 shadow-inner' : 'bg-white/5'}`}><i className="fa-solid fa-palette text-xl group-hover:rotate-45 transition-transform duration-500"></i></div>
              <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100">VIBE</span>
            </button>
            {isVibeMenuOpen && (
              <div className="absolute top-full right-40 mt-6 bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-300 min-w-[160px] z-[200]">
                {(Object.keys(THEMES) as ThemeColor[]).map((t) => (
                  <button key={t} onClick={() => { setTheme(t); setIsVibeMenuOpen(false); }} className={`flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all hover:-translate-y-1 hover:shadow-md ${theme === t ? 'bg-gray-100 ring-2 ring-black/5' : ''}`}>
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-md ${t === 'black' ? 'bg-black' : t === 'red' ? 'bg-[#d0011b]' : t === 'blue' ? 'bg-[#1E3A8A]' : 'bg-[#b8860b]'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-widest ${theme === t ? 'text-black' : 'text-gray-400'}`}>{t}</span>
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setView('account')} className="flex flex-col items-center group transition-all">
              <div className={`w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg relative ${currentView === 'account' ? 'bg-white/20' : 'bg-white/5'}`}><i className={`fa-solid ${isLoggedIn ? 'fa-user-check' : 'fa-user'} text-xl lg:text-2xl`}></i></div>
              <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100">{isLoggedIn ? 'PROFILE' : 'LOGIN'}</span>
            </button>

            <button onClick={onWishlistClick} className="flex flex-col items-center group transition-all">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg bg-white/5 relative">
                <i className="fa-solid fa-heart text-xl lg:text-2xl group-hover:scale-125 transition-transform duration-300"></i>
                {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xl border border-black/5">{wishlistCount}</span>}
              </div>
              <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100">WISHLIST</span>
            </button>

            <button onClick={onCartClick} className="flex flex-col items-center group transition-all">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 transition-all hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] relative shadow-lg">
                <i className="fa-solid fa-bag-shopping text-xl lg:text-2xl group-hover:animate-bounce"></i>
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-2xl border-2 border-transparent">{cartCount}</span>}
              </div>
              <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100">BAG</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 hidden lg:block sticky top-0 shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex h-full">
            <button onClick={() => handleCategorySelect('All')} className={`px-10 flex items-center gap-4 ${currentTheme.primary} ${currentTheme.hover} text-white h-full font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 shadow-md hover:shadow-lg hover:px-12 active:scale-95`}>
              <i className="fa-solid fa-bars-staggered group-hover:rotate-90 transition-transform"></i> ALL DEPARTMENTS
            </button>
            <div className="flex items-center px-6 gap-2">
              {['NEW ARRIVALS', 'BEST SELLERS', 'MEN', 'WOMEN', 'KIDS'].map((item) => (
                <button key={item} onClick={() => handleCategorySelect(item.split(' ')[0])} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-all relative group hover:-translate-y-0.5">
                  {item}
                  <span className={`absolute bottom-0 left-6 right-6 h-1 ${currentTheme.primary} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
