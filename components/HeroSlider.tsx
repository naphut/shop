
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Language, ThemeColor, HeroVariant } from '../types';

interface HeroSliderProps {
  lang: Language;
  theme: ThemeColor;
  setView: (v: ViewState) => void;
  variant?: HeroVariant;
}

interface HeroStyleConfig {
  container: string;
  overlay: string;
  label: string;
  line: string;
  title: string;
  sub: string;
  primaryBtn: string;
  secondaryBtn: string;
  navBtn: string;
  progress: string;
  progressActive: string;
}

const HERO_VARIANTS: Record<HeroVariant, HeroStyleConfig> = {
  luxury: {
    container: "bg-black",
    overlay: "bg-gradient-to-r from-black/80 via-black/40 to-transparent",
    label: "text-white/90 tracking-[0.6em]",
    line: "bg-white/80",
    title: "text-white italic font-black tracking-tighter leading-[0.75]",
    sub: "text-white/80 italic font-medium",
    primaryBtn: "bg-white text-black hover:bg-gray-200 shadow-[0_30px_60px_rgba(0,0,0,0.4)]",
    secondaryBtn: "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black backdrop-blur-2xl",
    navBtn: "border-white/20 bg-white/5 text-white hover:bg-white hover:text-black rounded-[1.5rem]",
    progress: "bg-white/10",
    progressActive: "bg-white shadow-[0_0_30px_rgba(255,255,255,0.8)]",
  },
  minimal: {
    container: "bg-gray-50",
    overlay: "bg-white/60 backdrop-blur-[2px]",
    label: "text-black/60 tracking-[0.2em] font-bold",
    line: "bg-black/20",
    title: "text-black font-light tracking-normal leading-[1.1] not-italic",
    sub: "text-black/70 not-italic font-normal",
    primaryBtn: "bg-black text-white hover:bg-gray-800 shadow-none rounded-none px-12",
    secondaryBtn: "bg-transparent text-black border-black/10 hover:border-black rounded-none px-10",
    navBtn: "border-black/5 bg-black/5 text-black hover:bg-black hover:text-white rounded-full",
    progress: "bg-black/5",
    progressActive: "bg-black",
  },
  flashSale: {
    container: "bg-red-950",
    overlay: "bg-gradient-to-t from-red-950/95 via-transparent to-black/30",
    label: "text-yellow-400 tracking-[0.4em] font-black",
    line: "bg-yellow-400",
    title: "text-white font-black uppercase italic tracking-tighter",
    sub: "text-yellow-100/90 font-bold drop-shadow-lg",
    primaryBtn: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_20px_40px_rgba(234,179,8,0.3)]",
    secondaryBtn: "bg-red-600/20 text-white border-white/40 hover:bg-red-600",
    navBtn: "border-yellow-400/30 bg-black/20 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-2xl",
    progress: "bg-white/20",
    progressActive: "bg-yellow-400 shadow-[0_0_15px_#facc15]",
  },
  tech: {
    container: "bg-slate-950",
    overlay: "bg-slate-950/40 backdrop-blur-sm",
    label: "text-cyan-400 tracking-[0.8em] font-mono",
    line: "bg-cyan-500 shadow-[0_0_10px_#06b6d4]",
    title: "text-white font-bold tracking-widest uppercase font-mono",
    sub: "text-cyan-100/70 font-light font-mono italic",
    primaryBtn: "bg-transparent text-cyan-400 border border-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    secondaryBtn: "bg-slate-900 text-slate-400 border-slate-800 hover:text-cyan-400",
    navBtn: "border-cyan-500/20 bg-slate-900/80 text-cyan-400 hover:border-cyan-400 rounded-lg",
    progress: "bg-slate-800",
    progressActive: "bg-cyan-500 shadow-[0_0_15px_#06b6d4]",
  }
};

const HeroSlider: React.FC<HeroSliderProps> = ({ lang, theme, setView, variant = 'luxury' }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const styles = HERO_VARIANTS[variant];

  const slides = [
    {
      id: 1,
      title: variant === 'minimal' ? "Simply\nRefined." : "CURATED\nDISCOVERY.",
      sub: "Discover the intersection of high fashion and technical precision. Redefining the wardrobe of the modern professional.",
      cta: "Explore Shop",
      action: () => {
        const el = document.getElementById('products');
        if (el) {
          const navHeight = 120;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      },
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?auto=format&fit=crop&w=1920&q=80"
    },
    {
      id: 2,
      title: variant === 'flashSale' ? "LIMITED\nDROPS." : "FLASH\nPRECISION.",
      sub: "Up to 60% off our signature pieces. Time is of the essence. Quality never compromised.",
      cta: "VIEW OFFERS",
      action: () => setView('flashSale'),
      image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1920&q=80"
    }
  ];

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 600);
  }, [slides.length, isTransitioning]);

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className={`relative w-full h-[85vh] lg:h-[95vh] overflow-hidden ${styles.container}`}>
      {/* Background Images with Cross-fade */}
      {slides.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1.5s] ease-in-out ${idx === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
        >
          <img 
            src={slide.image} 
            alt="" 
            className={`w-full h-full object-cover transition-transform duration-[15s] ease-linear ${idx === currentSlide ? 'scale-115 translate-x-4' : 'scale-100'}`}
          />
          <div className={`absolute inset-0 ${styles.overlay}`}></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="container mx-auto px-6 lg:px-24 h-full relative z-10 flex flex-col justify-center">
        <div className={`transition-all duration-1000 delay-200 ${isTransitioning ? 'opacity-0 translate-y-12 blur-lg' : 'opacity-100 translate-y-0 blur-0'}`}>
          {/* Collection Label with horizontal line */}
          <div className="flex items-center gap-6 mb-10 group cursor-default">
            <div className={`w-16 h-[2px] transition-all duration-700 group-hover:w-24 ${styles.line}`}></div>
            <div className={`text-[12px] lg:text-[14px] font-black uppercase transition-all group-hover:tracking-[0.8em] ${styles.label}`}>
              COLLECTION 2025 // EDITION.01
            </div>
          </div>
          
          {/* Massive Headline */}
          <h1 className={`text-[72px] lg:text-[140px] mb-12 animate-in slide-in-from-left duration-1000 ${styles.title}`}>
            {slides[currentSlide].title}
          </h1>
          
          {/* Subtext */}
          <p className={`max-w-3xl text-[18px] lg:text-[22px] leading-relaxed mb-16 opacity-90 ${styles.sub}`}>
            {slides[currentSlide].sub}
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-8">
            <button 
              onClick={slides[currentSlide].action}
              className={`px-16 py-7 rounded-3xl text-[13px] font-black uppercase tracking-[0.3em] hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-4 group border border-transparent ${styles.primaryBtn}`}
            >
              {slides[currentSlide].cta}
              <i className="fa-solid fa-arrow-right text-[12px] group-hover:translate-x-3 transition-transform duration-500"></i>
            </button>
            <button 
              onClick={() => setView('tracking')}
              className={`px-14 py-7 border rounded-3xl text-[13px] font-black uppercase tracking-[0.3em] hover:scale-110 active:scale-95 transition-all flex items-center justify-center shadow-2xl ${styles.secondaryBtn}`}
            >
              TRACK ORDER
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-24 right-6 lg:right-24 flex items-center gap-6 z-20">
        <button 
          onClick={prevSlide}
          className={`w-16 h-16 border-2 flex items-center justify-center hover:-translate-x-2 transition-all group shadow-2xl active:scale-90 ${styles.navBtn}`}
        >
          <i className="fa-solid fa-chevron-left text-sm group-hover:scale-125 transition-transform"></i>
        </button>
        <button 
          onClick={nextSlide}
          className={`w-16 h-16 border-2 flex items-center justify-center hover:translate-x-2 transition-all group shadow-2xl active:scale-90 ${styles.navBtn}`}
        >
          <i className="fa-solid fa-chevron-right text-sm group-hover:scale-125 transition-transform"></i>
        </button>
      </div>

      {/* Bottom Progress Bars */}
      <div className="absolute bottom-0 left-0 w-full flex items-end h-3 z-20 gap-1 px-1">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`flex-1 h-full relative cursor-pointer overflow-hidden rounded-t-full transition-all ${styles.progress}`}
            onClick={() => setCurrentSlide(idx)}
          >
            {idx === currentSlide && (
              <div 
                className={`absolute top-0 left-0 h-full animate-[progress_8s_linear_infinite] origin-left w-full ${styles.progressActive}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
