
import React, { useState, useEffect } from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS, PRODUCTS } from '../constants';
import ProductGrid from './ProductGrid';

interface FlashSaleProps {
  lang: Language;
  formatPrice: (p: number) => string;
  onQuickView: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

const FlashSale: React.FC<FlashSaleProps> = ({ lang, formatPrice, onQuickView, wishlist, onToggleWishlist }) => {
  const t = TRANSLATIONS[lang];
  const flashProducts = PRODUCTS.filter(p => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 51,
    seconds: 36
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-700">
      {/* High-Impact Urgency Hero */}
      <section className="bg-black text-white py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/10 skew-x-12 transform translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                <i className="fa-solid fa-fire"></i>
                Flash Sale Active
              </div>
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                {t.flashSaleTitle}
              </h1>
              <p className="text-gray-400 font-medium max-w-lg text-[15px] uppercase tracking-widest leading-relaxed">
                {t.flashSaleSub}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl font-black italic">{formatTime(timeLeft.hours)}</div>
                    <span className="text-[9px] font-black uppercase tracking-widest mt-2 text-gray-500">HRS</span>
                 </div>
                 <div className="text-3xl font-black pt-4">:</div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl font-black italic">{formatTime(timeLeft.minutes)}</div>
                    <span className="text-[9px] font-black uppercase tracking-widest mt-2 text-gray-500">MINS</span>
                 </div>
                 <div className="text-3xl font-black pt-4">:</div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-3xl font-black italic">{formatTime(timeLeft.seconds)}</div>
                    <span className="text-[9px] font-black uppercase tracking-widest mt-2 text-red-500">SECS</span>
                 </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8 max-w-sm w-full">
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Flash Offers</h3>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <i className="fa-solid fa-check-circle text-green-500"></i>
                    Deep Discounts up to 60%
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <i className="fa-solid fa-check-circle text-green-500"></i>
                    Buy 2 -> Extra Discount
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold">
                    <i className="fa-solid fa-check-circle text-green-500"></i>
                    Free Express Delivery
                  </li>
               </ul>
               <div className="p-4 bg-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400">
                  ⚠️ Items sell out fast. 12 items already sold in last hour.
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">Available Now</h2>
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{flashProducts.length} Items</span>
        </div>

        <ProductGrid 
          products={flashProducts} 
          lang={lang} 
          formatPrice={formatPrice} 
          onAddToCart={() => {}} 
          onQuickView={onQuickView} 
          wishlist={wishlist} 
          onToggleWishlist={onToggleWishlist} 
        />
        
        {/* Call to Action Footer */}
        <div className="mt-20 p-12 bg-[#F3F4F6] rounded-[3rem] flex flex-col items-center text-center space-y-6">
           <h3 className="text-3xl font-black italic uppercase">Want bulk orders?</h3>
           <p className="text-gray-500 font-medium text-sm max-w-md">Message us directly on Telegram or WhatsApp for special wholesale pricing during flash sales.</p>
           <div className="flex gap-4">
              <button className="h-14 px-10 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition shadow-xl">
                 <i className="fa-brands fa-telegram"></i> Message Us
              </button>
              <button className="h-14 px-10 bg-white border border-gray-200 text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition shadow-sm">
                 <i className="fa-solid fa-phone"></i> Call Now
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default FlashSale;
