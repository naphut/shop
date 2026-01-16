
import React, { useRef, useState, useEffect } from 'react';
import { Product, Language, CartItem } from '../types';
import ProductCard from './ProductCard';
import { getProductRecommendation } from '../services/geminiService';
import { PRODUCTS } from '../constants';

interface HomeProductSectionProps {
  title: string;
  subtitle?: string;
  featuredProducts: Product[];
  moreProducts: Product[];
  lang: Language;
  formatPrice: (p: number) => string;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  cart: CartItem[];
}

const HomeProductSection: React.FC<HomeProductSectionProps> = ({
  title,
  subtitle,
  featuredProducts,
  moreProducts,
  lang,
  formatPrice,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist,
  cart
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const [recommendation, setRecommendation] = useState<{ product: Product, reason: string } | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, []);

  // Fetch AI Recommendations based on Cart
  useEffect(() => {
    const fetchRec = async () => {
      if (cart.length === 0) {
        setRecommendation(null);
        return;
      }
      
      setIsRecommending(true);
      try {
        const result = await getProductRecommendation(cart);
        if (result && result.recommendedId) {
          const found = PRODUCTS.find(p => p.id === result.recommendedId);
          if (found) {
            setRecommendation({ product: found, reason: result.reason });
          }
        }
      } catch (err) {
        console.error("Failed to fetch recommendation", err);
      } finally {
        setIsRecommending(false);
      }
    };

    const timeout = setTimeout(fetchRec, 1000); // Debounce slightly
    return () => clearTimeout(timeout);
  }, [cart]);

  return (
    <section className="py-24 lg:py-32 space-y-32">
      {/* 1. Header Section */}
      <div className="container mx-auto px-6 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 bg-black rounded-full"></div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-400">
            {subtitle || "Curated Discovery Node"}
          </span>
        </div>
        <h2 className="text-5xl md:text-[80px] font-black italic tracking-tighter uppercase leading-none text-black">
          {title}
        </h2>
      </div>

      {/* 2. Featured Horizontal Carousel */}
      <div className="space-y-12">
        <div className="container mx-auto px-6 flex justify-between items-end">
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Featured Series</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hand-picked Excellence</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              disabled={!showLeftArrow}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${showLeftArrow ? 'border-black text-black hover:bg-black hover:text-white' : 'border-gray-100 text-gray-200 cursor-not-allowed'}`}
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!showRightArrow}
              className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${showRightArrow ? 'border-black text-black hover:bg-black hover:text-white' : 'border-gray-100 text-gray-200 cursor-not-allowed'}`}
            >
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>

        <div className="relative group">
          {/* Subtle Side Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div 
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex overflow-x-auto gap-8 px-6 lg:px-24 py-4 hide-scrollbar snap-x snap-mandatory"
          >
            {featuredProducts.map(product => (
              <div key={product.id} className="w-[300px] md:w-[380px] shrink-0 snap-start">
                <ProductCard 
                  product={product} 
                  lang={lang} 
                  formatPrice={formatPrice} 
                  onAddToCart={(p, c, s, q) => onAddToCart(p, c, s, q || 1)}
                  onQuickView={onQuickView}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                />
              </div>
            ))}
            {/* End Spacer */}
            <div className="w-1 md:w-12 shrink-0"></div>
          </div>
        </div>
      </div>

      {/* NEW: Neural Recommendation Section */}
      {cart.length > 0 && (recommendation || isRecommending) && (
        <div className="container mx-auto px-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
           <div className="bg-black rounded-[4rem] p-12 md:p-20 overflow-hidden relative group">
              {/* Animated Background Elements */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-[3s]"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                <div className="flex-1 space-y-8">
                  <div className="flex items-center gap-4 text-amber-400">
                    <i className="fa-solid fa-brain-circuit animate-pulse"></i>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Suggestion Node</span>
                  </div>
                  <h3 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                    BASED ON YOUR<br/>SELECTION.
                  </h3>
                  {isRecommending ? (
                    <div className="flex items-center gap-4 text-white/40">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-[11px] font-black uppercase tracking-widest">Synthesizing perfect match...</span>
                    </div>
                  ) : recommendation && (
                    <div className="space-y-6">
                      <p className="text-xl md:text-2xl text-gray-400 font-medium italic leading-relaxed max-w-xl">
                        "{recommendation.reason}"
                      </p>
                      <div className="pt-4 flex items-center gap-6">
                        <div className="h-px w-12 bg-white/20"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">MASTER AI CURATION // 2025</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-[400px] shrink-0 transform lg:rotate-3 hover:rotate-0 transition-all duration-700">
                  {recommendation && !isRecommending ? (
                    <ProductCard 
                      product={recommendation.product} 
                      lang={lang} 
                      formatPrice={formatPrice} 
                      onAddToCart={(p, c, s, q) => onAddToCart(p, c, s, q || 1)}
                      onQuickView={onQuickView}
                      wishlist={wishlist}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ) : (
                    <div className="aspect-[4/5] bg-white/5 rounded-[2.5rem] animate-pulse border border-white/10 flex items-center justify-center">
                       <i className="fa-solid fa-sparkles text-4xl text-white/10"></i>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. Vertical Discovery Grid */}
      <div className="container mx-auto px-6 space-y-16">
        <div className="flex items-center gap-8">
          <h3 className="text-2xl font-black italic tracking-tighter uppercase shrink-0">Discovery Grid</h3>
          <div className="h-px flex-1 bg-gray-100"></div>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest shrink-0">
            {moreProducts.length} Unique Pieces
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-12">
          {moreProducts.slice(0, visibleCount).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              lang={lang} 
              formatPrice={formatPrice} 
              onAddToCart={(p, c, s, q) => onAddToCart(p, c, s, q || 1)}
              onQuickView={onQuickView}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {visibleCount < moreProducts.length && (
          <div className="flex justify-center pt-12">
            <button 
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="px-16 py-7 bg-black text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              LOAD FULL COLLECTION
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProductSection;
