
import React, { useState } from 'react';
import { Product, Language } from '../types';

// Fixed: Added isFeatured prop to satisfy usage in HomeProductCarousel
interface ProductCardProps {
  product: Product;
  lang: Language;
  formatPrice: (p: number) => string;
  onAddToCart: (p: Product, color: string, size: string, quantity?: number, prompt?: string, imageUrl?: string) => void;
  onQuickView?: (p: Product) => void;
  onOpenCustomizer?: (p: Product) => void;
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
  isFeatured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, lang, formatPrice, onQuickView, onOpenCustomizer, wishlist = [], onToggleWishlist, onAddToCart 
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isInWishlist = wishlist.includes(product.id);
  const isCustomizable = product.id === 'custom-tee';
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInWishlist) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    }
    onToggleWishlist?.(product.id);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCardClick = () => {
    if (isCustomizable) {
      onOpenCustomizer?.(product);
    } else {
      onQuickView?.(product);
    }
  };

  return (
    <div 
      className="group relative flex flex-col h-full transition-all duration-500 cursor-pointer bg-white rounded-[2.5rem] p-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-3 hover:scale-[1.01]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentImgIndex(0); }}
      onClick={handleCardClick}
    >
      {/* Image Section with Carousel */}
      <div className="relative aspect-[4/5] rounded-[2rem] bg-[#f8f8f8] overflow-hidden shadow-sm">
        <div className="w-full h-full relative">
          {images.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={product.name[lang]} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-110 ${
                idx === currentImgIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Carousel Controls (Show on Hover) */}
        {images.length > 1 && (
          <div className={`absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={prevImage}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white hover:-translate-x-1 transition-all active:scale-90"
            >
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <button 
              onClick={nextImage}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white hover:translate-x-1 transition-all active:scale-90"
            >
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        )}

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentImgIndex ? 'w-6 bg-black' : 'w-2 bg-black/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* Interaction Icons Overlay */}
        <div className={`absolute top-4 right-4 flex flex-col gap-3 z-30 transition-all duration-500 transform ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
          <button 
            onClick={handleToggleWishlist}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-125 hover:-translate-y-1 ${
              isInWishlist ? 'bg-red-600 text-white shadow-red-200' : 'bg-white text-gray-800'
            } ${isAnimating ? 'animate-bounce' : ''}`}
          >
            <i className={`fa-solid fa-heart ${isInWishlist ? 'scale-110' : ''}`}></i>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-gray-800 hover:scale-125 hover:-translate-y-1 transition-all"
          >
            <i className="fa-solid fa-expand"></i>
          </button>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isFlashSale && (
            <div className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-red-500">
              <i className="fa-solid fa-bolt text-[8px] animate-pulse"></i> FLASH
            </div>
          )}
          {product.isNewArrival && (
            <div className="bg-black text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-gray-800">
              NEW
            </div>
          )}
          {product.isBestSeller && (
            <div className="bg-amber-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-amber-300">
              BEST
            </div>
          )}
        </div>
        
        {/* Quick Add To Bag (Bottom Slide-in) */}
        <div className={`absolute inset-x-4 bottom-4 z-30 transition-all duration-500 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product, product.colors[0], product.sizes[0], 1); }}
            className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-900 hover:shadow-black/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            QUICK ADD TO BAG
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="pt-6 pb-2 px-3 space-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-black transition-colors">{product.brand}</span>
            <div className="flex items-center gap-1 text-[9px] text-amber-400 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
               <i className="fa-solid fa-star"></i>
               <span className="text-black font-black ml-0.5">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-[18px] font-black italic uppercase tracking-tighter text-gray-900 line-clamp-1 leading-none group-hover:text-black transition-colors">
            {product.name[lang]}
          </h3>
        </div>
        
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-black italic text-black tracking-tighter">
            {formatPrice(product.price)}
          </span>
          {product.typicalPrice && (
            <span className="text-sm text-gray-300 font-bold line-through italic tracking-tighter decoration-red-500/30">
              {formatPrice(product.typicalPrice)}
            </span>
          )}
        </div>

        {/* Color Indicators */}
        <div className="flex gap-2 pt-1">
          {product.colors.slice(0, 4).map((c) => (
            <div 
              key={c} 
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 transition-transform hover:scale-125 cursor-pointer" 
              style={{ backgroundColor: c.toLowerCase().replace(' ', '') }} 
              title={c}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] font-black text-gray-300 flex items-center">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
