
import React, { useState, useEffect, useRef } from 'react';
import { Product, Language } from '../types';
import { TRANSLATIONS, PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  lang: Language;
  formatPrice: (p: number) => string;
  onAddToCart: (p: Product, color: string, size: string, quantity: number) => void;
  onClose: () => void;
  onSelectProduct?: (p: Product) => void;
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, lang, formatPrice, onAddToCart, onClose, onSelectProduct, wishlist = [], onToggleWishlist 
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping' | 'reviews'>('details');
  
  // Slide Bar State
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeSlide, setActiveSlide] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', top: 0, left: 0, bgPos: '0% 0%' });

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });

  const t = TRANSLATIONS[lang];
  const isInWishlist = wishlist.includes(product.id);
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  useEffect(() => {
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
    setActiveSlide(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      top: 0,
      left: 0,
      bgPos: `${x}% ${y}%`
    });
  };

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % productImages.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + productImages.length) % productImages.length);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  };

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700 overflow-x-hidden pb-32">
      <div className="flex flex-col lg:flex-row">
        
        {/* LEFT: IMAGE SLIDE BAR SECTION */}
        <div className="flex-1 bg-white relative flex flex-col lg:min-h-screen">
          <button onClick={onClose} className="absolute top-8 left-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 z-50 transition-all border border-black/5 group">
            <i className="fa-solid fa-arrow-left text-black group-hover:-translate-x-1 transition-transform"></i>
          </button>

          {/* Main Slide Display */}
          <div className="relative flex-1 flex items-center justify-center bg-[#F8F8F8] overflow-hidden group/slider">
            <div 
              className="relative w-full aspect-[4/5] cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ ...zoomStyle, display: 'none' })}
            >
              <img 
                src={productImages[activeSlide]} 
                alt="" 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700"
              />
              {/* Magnification Glass Effect */}
              <div 
                className="absolute inset-0 z-40 pointer-events-none hidden lg:block"
                style={{
                  ...zoomStyle,
                  backgroundImage: `url(${productImages[activeSlide]})`,
                  backgroundSize: '250%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: zoomStyle.bgPos
                }}
              />
            </div>

            {/* Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur rounded-full shadow-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all z-40">
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button onClick={nextSlide} className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur rounded-full shadow-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all z-40">
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </>
            )}

            {/* Badges Stack */}
            <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-30">
              {product.isFlashSale && (
                <div className="bg-red-600 text-white text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 border border-red-500">
                  <i className="fa-solid fa-bolt animate-pulse"></i> FLASH SALE
                </div>
              )}
              {product.isBestSeller && (
                <div className="bg-black text-white text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                  BEST SELLER
                </div>
              )}
            </div>

            {/* Progress Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {productImages.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveSlide(i)}
                  className={`h-1 rounded-full transition-all duration-700 ${i === activeSlide ? 'w-12 bg-black' : 'w-3 bg-black/10 hover:bg-black/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-4 p-8 overflow-x-auto hide-scrollbar bg-white">
            {productImages.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSlide(i)}
                className={`w-24 h-28 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-500 ${activeSlide === i ? 'border-black scale-105 shadow-xl' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
              >
                <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt="" />
              </button>
            ))}
          </div>
        </div>
        
        {/* RIGHT: PRODUCT INFO SECTION */}
        <div className="w-full lg:w-[720px] bg-white p-10 md:p-16 lg:p-24 flex flex-col space-y-16 lg:h-screen lg:overflow-y-auto hide-scrollbar border-l border-gray-50">
          
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">{product.brand}</span>
              <div className="h-px flex-1 bg-black/5"></div>
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50">
                {[1,2,3,4,5].map(s => <i key={s} className={`fa-solid fa-star ${s > Math.round(product.rating) ? 'text-amber-100' : ''}`}></i>)}
                <span className="text-black font-black ml-1">{product.reviews}</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-[80px] font-black tracking-tighter uppercase italic leading-[0.85] text-black">
              {product.name[lang]}
            </h1>
            
            {/* Price & Flash Sale Info */}
            <div className="flex flex-col gap-6">
              <div className="flex items-baseline gap-8">
                <span className="text-7xl font-black italic tracking-tighter text-black price-number">
                  {formatPrice(product.price)}
                </span>
                {product.typicalPrice && (
                  <span className="text-3xl text-gray-200 font-bold line-through italic tracking-tighter">
                    {formatPrice(product.typicalPrice)}
                  </span>
                )}
              </div>

              {product.isFlashSale && (
                <div className="bg-red-50 border border-red-100/50 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                      <i className="fa-solid fa-bolt-lightning text-lg"></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Limited Offer</div>
                      <div className="text-[11px] font-bold text-red-400 uppercase tracking-widest mt-0.5">Sale Ends Soon</div>
                    </div>
                  </div>
                  <div className="flex gap-3 font-black italic text-2xl text-red-600 tracking-tighter">
                    <span className="bg-white px-3 py-1 rounded-xl shadow-sm">{timeLeft.h.toString().padStart(2, '0')}</span>
                    <span className="pt-1">:</span>
                    <span className="bg-white px-3 py-1 rounded-xl shadow-sm">{timeLeft.m.toString().padStart(2, '0')}</span>
                    <span className="pt-1">:</span>
                    <span className="bg-white px-3 py-1 rounded-xl shadow-sm">{timeLeft.s.toString().padStart(2, '0')}</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-4 border-l-2 border-black/5 pl-6 py-2">
              <i className="fa-solid fa-fingerprint text-black opacity-40"></i>
              Verified Premium Selection // Secure Node Checkout Active.
            </p>
          </div>

          <div className="space-y-16">
            {/* Color Selector */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">SHADE SELECTOR</h4>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-5">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-14 h-14 rounded-full border-2 transition-all p-1.5 ${
                      selectedColor === color ? 'border-black ring-8 ring-gray-50 scale-110 shadow-2xl' : 'border-transparent hover:scale-110'
                    }`}
                  >
                    <div className="w-full h-full rounded-full shadow-inner border border-black/5" style={{ backgroundColor: color.toLowerCase().replace(' ', '') }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-300">SIZE MATRIX</h4>
                <button className="text-[9px] font-black uppercase underline decoration-black/20 underline-offset-4 text-black hover:decoration-black transition-all">Sizing Logic</button>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-16 rounded-2xl text-[13px] font-black transition-all border-2 ${
                      selectedSize === size ? 'bg-black text-white border-black shadow-2xl scale-105' : 'bg-white text-gray-300 border-gray-50 hover:border-black hover:text-black hover:shadow-lg'
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and CTA */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-3xl h-20 w-full sm:w-48 px-6 shadow-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 hover:bg-white rounded-2xl transition-all flex items-center justify-center"><i className="fa-solid fa-minus text-[10px]"></i></button>
                <span className="flex-1 text-center font-black text-2xl italic tracking-tighter">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 hover:bg-white rounded-2xl transition-all flex items-center justify-center"><i className="fa-solid fa-plus text-[10px]"></i></button>
              </div>
              <button 
                onClick={() => onAddToCart(product, selectedColor, selectedSize!, quantity)}
                className="flex-1 h-20 bg-black text-white rounded-[2.5rem] font-black text-[14px] uppercase tracking-[0.4em] hover:bg-gray-900 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.3)] active:scale-95 transition-all flex items-center justify-center gap-6 shadow-2xl group"
              >
                <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i>
                ADD TO BAG
              </button>
              <button 
                onClick={() => onToggleWishlist?.(product.id)}
                className={`w-20 h-20 rounded-[2.5rem] border-2 transition-all flex items-center justify-center ${isInWishlist ? 'bg-red-600 border-red-600 text-white shadow-red-200 shadow-xl' : 'border-gray-100 text-black hover:border-black hover:shadow-xl hover:-translate-y-1'}`}
              >
                <i className={`fa-solid fa-heart text-xl ${isInWishlist ? 'scale-125' : ''}`}></i>
              </button>
            </div>
          </div>

          {/* Detailed Info Tabs */}
          <div className="pt-16 border-t border-black/5 space-y-10">
            <div className="flex gap-12 overflow-x-auto hide-scrollbar border-b border-black/5">
              {['details', 'specs', 'shipping', 'reviews'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-6 text-[11px] font-black uppercase tracking-[0.4em] relative transition-all shrink-0 ${activeTab === tab ? 'text-black translate-y-px' : 'text-gray-300 hover:text-black'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full animate-in slide-in-from-left duration-300"></div>}
                </button>
              ))}
            </div>

            <div className="min-h-[220px] animate-in fade-in duration-700">
              {activeTab === 'details' && (
                <div className="space-y-10">
                  <p className="text-[18px] text-gray-500 leading-relaxed font-medium italic opacity-90 tracking-tight max-w-2xl">"{product.description[lang]}"</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {product.features?.[lang].map((f, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-black/5 transition-all">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3 p-8 bg-gray-50 rounded-[2.5rem]"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Core Material</span><p className="font-black italic text-lg uppercase tracking-tighter">{product.material}</p></div>
                  <div className="space-y-3 p-8 bg-gray-50 rounded-[2.5rem]"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Technical Weight</span><p className="font-black italic text-lg uppercase tracking-tighter">220 GSM PREMIUM</p></div>
                  <div className="space-y-3 p-8 bg-gray-50 rounded-[2.5rem]"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Preservation</span><p className="font-black italic text-lg uppercase tracking-tighter">Machine Wash Cold</p></div>
                  <div className="space-y-3 p-8 bg-gray-50 rounded-[2.5rem]"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Ethics Node</span><p className="font-black italic text-lg uppercase tracking-tighter">Fair Trade Certified</p></div>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-start gap-6 p-8 bg-black text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                    <i className="fa-solid fa-truck-fast text-3xl mt-2 text-white"></i>
                    <div>
                      <h5 className="font-black uppercase text-[12px] tracking-[0.3em]">Global Logistics</h5>
                      <p className="text-[13px] text-gray-400 font-medium mt-3 leading-relaxed italic">Priority node dispatch within 24 hours. Free standard transit for all orders exceeding $50.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 p-8 bg-gray-50 rounded-[3rem] border border-gray-100">
                    <i className="fa-solid fa-rotate-left text-3xl mt-2 text-black"></i>
                    <div>
                      <h5 className="font-black uppercase text-[12px] tracking-[0.3em]">Return Protocol</h5>
                      <p className="text-[13px] text-gray-400 font-medium mt-3 leading-relaxed italic">30-day absolute satisfaction guarantee. Automated returns process through our neural portal.</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-12">
                  <div className="flex items-center gap-8 p-10 bg-black text-white rounded-[3rem] shadow-2xl">
                    <span className="text-[80px] font-black italic tracking-tighter leading-none">{product.rating}</span>
                    <div className="flex-1">
                      <div className="flex gap-1.5 text-amber-400 text-xs">
                        {[1,2,3,4,5].map(s => <i key={s} className="fa-solid fa-star"></i>)}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-40">SYNTHESIZED FROM {product.reviews} NODES</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">Submit Feedback</button>
                  </div>
                  <div className="space-y-10">
                    {[
                      { name: 'Sok Dara', rating: 5, comment: 'Technical precision at its finest. The fit is absolute perfection.', date: '2 DAYS AGO' },
                      { name: 'Linda K.', rating: 4, comment: 'Exceptional material quality. The tactile feel of the cotton is world-class.', date: '1 WEEK AGO' }
                    ].map((rev, i) => (
                      <div key={i} className="pb-10 border-b border-black/5 space-y-4 group">
                        <div className="flex justify-between items-center">
                          <span className="font-black italic text-[16px] group-hover:text-black transition-colors">{rev.name}</span>
                          <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">{rev.date}</span>
                        </div>
                        <div className="flex gap-1 text-amber-400 text-[8px]">
                          {[1,2,3,4,5].map(s => <i key={s} className={`fa-solid fa-star ${s > rev.rating ? 'text-gray-100' : ''}`}></i>)}
                        </div>
                        <p className="text-[15px] text-gray-500 font-medium leading-relaxed italic tracking-tight opacity-80">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Sharing */}
          <div className="pt-12 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-10">
             <div className="flex items-center gap-10">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic">SHARE MATRIX</span>
                <div className="flex gap-6">
                   <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all hover:-translate-y-2 hover:shadow-xl"><i className="fa-brands fa-facebook-f"></i></button>
                   <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all hover:-translate-y-2 hover:shadow-xl"><i className="fa-brands fa-instagram"></i></button>
                   <button onClick={copyToClipboard} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all hover:-translate-y-2 hover:shadow-xl"><i className="fa-solid fa-link"></i></button>
                </div>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-black/5 grayscale hover:grayscale-0 transition-all cursor-pointer">
               <i className="fa-solid fa-qrcode text-xl opacity-20"></i>
               <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Mobile Node Access</span>
             </div>
          </div>

          {/* Related Products Section (ELEVATED GRID) */}
          <div className="pt-32 border-t border-black/5 space-y-16 pb-32">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-1 w-20 bg-black rounded-full"></div>
                <h3 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">YOU MAY ALSO LIKE</h3>
              </div>
              <div className="flex gap-3">
                 <button className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"><i className="fa-solid fa-chevron-left text-[10px]"></i></button>
                 <button className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"><i className="fa-solid fa-chevron-right text-[10px]"></i></button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
              {relatedProducts.map(rp => (
                <ProductCard 
                  key={rp.id} 
                  product={rp} 
                  lang={lang} 
                  formatPrice={formatPrice}
                  onAddToCart={(p, c, s, q) => onAddToCart(p, c, s, q || 1)}
                  onQuickView={onSelectProduct}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* STICKY MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-3xl border-t border-black/5 z-[100] flex gap-5 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-700">
        <div className="flex flex-col justify-center px-2">
           <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">TOTAL</span>
           <span className="text-2xl font-black italic leading-none tracking-tighter">{formatPrice(product.price * quantity)}</span>
        </div>
        <button 
          onClick={() => onAddToCart(product, selectedColor, selectedSize!, quantity)}
          className="flex-1 h-18 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all"
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
