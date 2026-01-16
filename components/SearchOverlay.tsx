
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Language } from '../types';
import ProductGrid from './ProductGrid';
import { PRODUCTS } from '../constants';

interface SearchOverlayProps {
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  onSearch: (e: React.FormEvent | null) => void;
  isSearching: boolean;
  results: { ids: string[], message?: string } | null;
  // Added setResults prop to manage search state from the overlay
  setResults: (results: { ids: string[], message?: string } | null) => void;
  products: Product[];
  lang: Language;
  formatPrice: (p: number) => string;
  onAddToCart: (p: Product, color: string, size: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ 
  onClose, query, setQuery, onSearch, isSearching, results, setResults, products, lang, formatPrice, onAddToCart 
}) => {
  const trendingTerms = ['White Tee', 'Linen Shirt', 'Silk', 'Streetwear', 'Formal Shirts', 'Premium Cotton', 'Oversized', 'Slim Fit'];
  const [history, setHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ms-search-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse search history", e);
      }
    }
    inputRef.current?.focus();
  }, []);

  // Save successful searches to history
  useEffect(() => {
    if (results && query.trim() && !isSearching) {
      setHistory(prev => {
        const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 5);
        localStorage.setItem('ms-search-history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [results, isSearching]);

  // Extract unique product names and categories for suggestions
  const productNames = useMemo(() => {
    const names = new Set<string>();
    PRODUCTS.forEach(p => {
      names.add(p.name[lang]);
      names.add(p.brand);
      names.add(p.itemType);
    });
    return Array.from(names);
  }, [lang]);

  // Compute suggestions based on current query
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    
    const matches = new Set<string>();
    
    // 1. Direct matches in product metadata
    productNames.forEach(name => {
      if (name.toLowerCase().includes(q)) matches.add(name);
    });
    
    // 2. Matches in trending terms
    trendingTerms.forEach(term => {
      if (term.toLowerCase().includes(q)) matches.add(term);
    });
    
    return Array.from(matches).slice(0, 8); // Limit to 8 suggestions
  }, [query, productNames]);

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    setActiveIndex(-1);
    // Trigger search after state update
    setTimeout(() => {
      onSearch(null);
    }, 0);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory([]);
    localStorage.removeItem('ms-search-history');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      if (query) {
        setQuery('');
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-white flex flex-col animate-in fade-in duration-300">
      {/* Top Search Bar */}
      <div className="w-full px-4 md:px-12 pt-8 pb-4 border-b border-gray-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <form 
              onSubmit={(e) => { e.preventDefault(); onSearch(e); }} 
              className="flex items-center bg-[#f1f3f5] rounded-full px-6 py-1 border-2 border-transparent focus-within:border-black/5 focus-within:bg-white transition-all shadow-sm"
            >
              <i className="fa-solid fa-magnifying-glass text-gray-400 mr-4 text-sm"></i>
              <input 
                ref={inputRef}
                autoFocus
                type="text" 
                placeholder="Search for styles, brands or vibes..."
                className="bg-transparent border-none outline-none flex-1 py-4 text-[16px] font-bold placeholder:text-gray-400 text-black"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
              />
              {query && (
                <button 
                  type="button"
                  onClick={() => { setQuery(''); setActiveIndex(-1); }}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-circle-xmark text-gray-300"></i>
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && !isSearching && !results && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-20 animate-in slide-in-from-top-4 duration-300">
                <div className="p-3">
                  <div className="px-5 py-3 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Quick Suggestions</div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all group ${
                          activeIndex === index ? 'bg-gray-50 translate-x-1' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          activeIndex === index ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                        </div>
                        <span className={`text-[15px] font-bold ${activeIndex === index ? 'text-black' : 'text-gray-600'}`}>
                          {/* Intelligent Highlighting */}
                          {suggestion.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                            part.toLowerCase() === query.toLowerCase() 
                              ? <span key={i} className="text-black font-black underline decoration-black/20 underline-offset-4">{part}</span> 
                              : part
                          )}
                        </span>
                        {activeIndex === index && (
                          <i className="fa-solid fa-arrow-right text-[10px] ml-auto text-black animate-in slide-in-from-left-2"></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-all"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-20 scroll-smooth">
        {isSearching && (
          <div className="flex flex-col items-center justify-center h-full max-h-[500px]">
            <div className="relative w-16 h-16">
               <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Synthesizing Results...</p>
          </div>
        )}

        {!isSearching && results && (
          <div className="max-w-7xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {results.message && (
              <div className="bg-[#f8f9fa] border border-gray-100 p-8 rounded-[2.5rem] mb-16 flex gap-8 items-start shadow-sm">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl rotate-3">
                   <i className="fa-solid fa-robot text-lg"></i>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-2">AI Assistant</div>
                  <p className="text-gray-700 leading-relaxed italic text-[16px] font-medium tracking-tight">"{results.message}"</p>
                </div>
              </div>
            )}
            
            {products.length > 0 ? (
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Matching Pieces</h3>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>
                <ProductGrid 
                  products={products} 
                  lang={lang} 
                  formatPrice={formatPrice} 
                  onAddToCart={onAddToCart}
                />
              </div>
            ) : (
              <div className="text-center py-48">
                <div className="text-gray-100 text-[12vw] mb-8 italic font-black opacity-40 select-none tracking-tighter">EMPTY_SET</div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.5em]">No matching apparel found in current collection</p>
                <button 
                  onClick={() => { setQuery(''); setResults(null); }}
                  className="mt-12 px-10 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        )}

        {!isSearching && !results && (
          <div className="max-w-7xl mx-auto mt-16 flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full">
              {/* Left Column: Recent & Trending */}
              <div className="space-y-16">
                {history.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.4em]">RECENT SEARCHES</h4>
                      <button 
                        onClick={clearHistory}
                        className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {history.map((h, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSuggestionClick(h)}
                          className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-100 hover:border-black rounded-2xl text-[13px] font-bold transition-all shadow-sm group"
                        >
                          <i className="fa-solid fa-clock-rotate-left text-gray-300 group-hover:text-black"></i>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.4em]">TRENDING NOW</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {trendingTerms.map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => handleSuggestionClick(tag)}
                        className="group flex items-center justify-between p-6 bg-[#f8f9fa] hover:bg-black rounded-[2rem] transition-all duration-500 overflow-hidden relative"
                      >
                        <span className="text-[14px] font-black uppercase italic tracking-tighter group-hover:text-white transition-colors relative z-10">{tag}</span>
                        <i className="fa-solid fa-arrow-trend-up text-gray-200 group-hover:text-white/20 transition-all group-hover:scale-[3] absolute right-6"></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI & Help */}
              <div className="space-y-12">
                <div className="p-12 bg-black rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-[2s]"></div>
                  <div className="relative z-10 space-y-8">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner backdrop-blur-md">
                      <i className="fa-solid fa-wand-magic-sparkles text-yellow-400"></i>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Semantic Discovery</h3>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Don't just search for keywords. Describe your mood, the event you're attending, or the style you're trying to achieve. Our AI understands the nuances of fashion.
                      </p>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Try describing:</div>
                      <div className="italic text-lg font-bold text-white/90">"Something minimalist for a Phom Penh gala dinner"</div>
                      <div className="italic text-lg font-bold text-white/90">"Breathable clothes for a summer trip to Siem Reap"</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-8 border border-gray-100 rounded-[2.5rem]">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-circle-question text-gray-300"></i>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-widest mb-1">Need help finding something?</h5>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                      Our customer concierge is available 24/7. <button className="text-black underline">Chat Now</button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
