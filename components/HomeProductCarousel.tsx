import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Product, Language } from '../types';
import ProductCard from './ProductCard';

interface HomeProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  lang: Language;
  formatPrice: (p: number) => string;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

const HomeProductCarousel: React.FC<HomeProductCarouselProps> = ({
  title,
  subtitle,
  products,
  lang,
  formatPrice,
  onAddToCart,
  onQuickView,
  wishlist,
  onToggleWishlist
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < maxScroll - 10);
      
      // Calculate current index based on scroll position
      const itemWidth = 350; // Approximate width of product card
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(Math.min(newIndex, products.length - 1));
    }
  }, [products.length]);

  const handleScroll = () => {
    requestAnimationFrame(updateScrollState);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = 350; // Match product card width
      const gap = 32; // gap-8 = 32px
      scrollRef.current.scrollTo({
        left: index * (itemWidth + gap),
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.removeProperty('user-select');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered) return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          scroll('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          scroll('right');
          break;
        case 'Home':
          e.preventDefault();
          scrollToIndex(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToIndex(products.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, products.length]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  if (products.length === 0) {
    return (
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 md:py-24 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-10 md:mb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="space-y-3 md:space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-px w-8 md:w-12 bg-gradient-to-r from-black/20 to-black/10"></div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                {subtitle || "Curated Selection"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight leading-none text-black pr-4">
                {title}
              </h2>
              
              {/* Mobile Controls */}
              <div className="flex md:hidden gap-2">
                <button
                  onClick={() => scroll('left')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                    showLeftArrow 
                      ? 'bg-white border-black/20 text-black hover:bg-black hover:text-white shadow-md' 
                      : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!showLeftArrow}
                  aria-label="Scroll left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => scroll('right')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                    showRightArrow 
                      ? 'bg-white border-black/20 text-black hover:bg-black hover:text-white shadow-md' 
                      : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!showRightArrow}
                  aria-label="Scroll right"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => scroll('left')}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 border transform hover:scale-105 active:scale-95 ${
                  showLeftArrow 
                    ? 'bg-white border-black/10 text-black hover:bg-black hover:text-white hover:border-black shadow-lg hover:shadow-xl' 
                    : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed hover:scale-100'
                }`}
                disabled={!showLeftArrow}
                aria-label="Scroll left"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 border transform hover:scale-105 active:scale-95 ${
                  showRightArrow 
                    ? 'bg-white border-black/10 text-black hover:bg-black hover:text-white hover:border-black shadow-lg hover:shadow-xl' 
                    : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed hover:scale-100'
                }`}
                disabled={!showRightArrow}
                aria-label="Scroll right"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Progress dots */}
            <div className="hidden lg:flex items-center gap-2 ml-4">
              {products.slice(0, Math.min(6, products.length)).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index 
                      ? 'bg-black w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
              {products.length > 6 && (
                <span className="text-xs text-gray-500 ml-1">+{products.length - 6}</span>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="w-full bg-gray-100 rounded-full h-1 mb-8 overflow-hidden">
          <div 
            className="bg-black h-full transition-all duration-300 ease-out"
            style={{ 
              width: `${((currentIndex + 1) / products.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Gradient Overlays - Always visible but subtle */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />
        
        {/* Enhanced gradient on hover */}
        <div className={`absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none transition-opacity duration-500 ${
          showLeftArrow ? 'opacity-100' : 'opacity-0'
        }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none transition-opacity duration-500 ${
          showRightArrow ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex overflow-x-auto scrollbar-hide gap-6 md:gap-8 px-4 md:px-6 lg:px-8 pb-4 scroll-smooth snap-x snap-mandatory ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          role="region"
          aria-label="Product carousel"
          aria-roledescription="carousel"
          tabIndex={0}
        >
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`shrink-0 snap-start transition-transform duration-300 ${
                currentIndex === index ? 'scale-[1.02]' : 'scale-100'
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${products.length}`}
            >
              <div className="w-[280px] sm:w-[300px] md:w-[330px] lg:w-[350px] px-2">
                <ProductCard
                  product={product}
                  lang={lang}
                  formatPrice={formatPrice}
                  onAddToCart={(p, c, s, q) => onAddToCart(p, c, s, q || 1)}
                  onQuickView={onQuickView}
                  wishlist={wishlist}
                  onToggleWishlist={onToggleWishlist}
                  isFeatured={currentIndex === index}
                />
              </div>
            </div>
          ))}
          
          {/* End Spacer for better scroll */}
          <div className="w-4 md:w-8 shrink-0" />
        </div>

        {/* Mobile Progress Indicator */}
        <div className="flex md:hidden justify-center gap-2 mt-8 px-4">
          {products.slice(0, Math.min(5, products.length)).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-black w-6' 
                  : 'bg-gray-200 w-2'
              }`}
            />
          ))}
        </div>

        {/* Accessibility Instructions */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Product carousel with {products.length} items. Use arrow keys to navigate.
        </div>
      </div>
    </section>
  );
};

// Custom scrollbar hide utility
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default HomeProductCarousel;