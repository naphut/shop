
import React, { useState } from 'react';
import { Language, Product } from '../types';
import { TRANSLATIONS } from '../constants';
import { expandPrompt, generateDesignImage } from '../services/geminiService';

interface CustomizerProps {
  lang: Language;
  onAddToCart: (product: Product, color: string, size: string, quantity: number, customPrompt: string, customImageUrl: string) => void;
  onClose: () => void;
  product: Product;
}

const Customizer: React.FC<CustomizerProps> = ({ lang, onAddToCart, onClose, product }) => {
  const [basicIdea, setBasicIdea] = useState('');
  const [expandedPrompt, setExpandedPrompt] = useState<{ proPrompt: string; shortDescription: string } | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedColor, setSelectedColor] = useState('White');
  const [selectedSize, setSelectedSize] = useState<string>('XL');
  const [step, setStep] = useState<'ideate' | 'preview'>('ideate');

  const handleDesignGeneration = async () => {
    if (!basicIdea.trim()) return;
    setIsExpanding(true);
    setExpandedPrompt(null);
    setGeneratedImageUrl(null);
    
    try {
      // Logic expansion via Gemini Pro
      const expansion = await expandPrompt(basicIdea, lang);
      setExpandedPrompt(expansion);
      
      // Visual synthesis via Gemini Flash Image
      setIsGeneratingImage(true);
      const imageUrl = await generateDesignImage(expansion.proPrompt);
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        setStep('preview');
      }
    } catch (error) {
      console.error("Neural Studio Error:", error);
    } finally {
      setIsExpanding(false);
      setIsGeneratingImage(false);
    }
  };

  const getBaseImage = () => {
    if (selectedColor === 'Black') return 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80';
  };

  const isSynthesizing = isExpanding || isGeneratingImage;

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col lg:flex-row animate-in fade-in duration-1000 overflow-hidden">
      
      {/* 1. STUDIO CANVAS (Left) */}
      <div className="flex-1 bg-[#F1F3F5] relative flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden border-r border-gray-100">
        
        {/* Subtle Ambient Studio Light */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,1)_0%,rgba(241,243,245,0)_70%)] opacity-50 pointer-events-none"></div>

        {/* Header Branding for Studio */}
        <div className="absolute top-10 left-12 hidden lg:flex items-center gap-4 select-none opacity-20">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-black italic">Neural Live Node // 2025</span>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-10 right-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:scale-110 active:scale-95 transition-all z-20 group border border-gray-50"
        >
          <i className="fa-solid fa-xmark text-xl group-hover:rotate-90 transition-transform"></i>
        </button>

        {/* The Mockup Layer */}
        <div className="relative w-full max-w-[550px] aspect-[4/5] flex items-center justify-center">
          <div className={`relative w-full h-full transition-all duration-1000 ${isSynthesizing ? 'blur-sm scale-95 grayscale' : ''}`}>
            <img 
              src={getBaseImage()} 
              className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.1)] animate-in zoom-in duration-1000" 
              alt="Shirt Mockup" 
            />
            
            {/* AI Generated Graphic Placement */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[45%] h-[45%] mt-[-5%] overflow-hidden flex items-center justify-center">
                {isSynthesizing ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-[3px] border-black/5 rounded-full"></div>
                      <div className="absolute inset-0 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : generatedImageUrl ? (
                  <img 
                    src={generatedImageUrl} 
                    className={`w-full h-full object-contain mix-blend-multiply drop-shadow-2xl animate-in zoom-in-50 duration-700 ${selectedColor === 'Black' ? 'brightness-125 contrast-125' : ''}`} 
                    alt="AI Artwork" 
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Contextual Toolbar */}
        <div className="absolute bottom-12 bg-white/70 backdrop-blur-3xl border border-white/50 h-20 rounded-[2.5rem] px-10 flex items-center gap-12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-10 duration-700">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSelectedColor('White')} 
              className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === 'White' ? 'border-black ring-4 ring-black/5 scale-110 shadow-lg' : 'border-gray-100'}`}
              style={{ backgroundColor: '#FFFFFF' }}
            />
            <button 
              onClick={() => setSelectedColor('Black')} 
              className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === 'Black' ? 'border-black ring-4 ring-black/5 scale-110 shadow-lg' : 'border-gray-100'}`}
              style={{ backgroundColor: '#000000' }}
            />
          </div>
          <div className="w-px h-8 bg-black/5"></div>
          <div className="flex items-center gap-8 text-gray-400">
            <button className="hover:text-black transition-colors group"><i className="fa-solid fa-expand text-sm group-hover:scale-125 transition-transform"></i></button>
            <button 
              onClick={() => { setStep('ideate'); setExpandedPrompt(null); setGeneratedImageUrl(null); }}
              className="hover:text-black transition-colors group"
            >
              <i className="fa-solid fa-rotate-left text-sm group-hover:-rotate-90 transition-transform"></i>
            </button>
            <button className="hover:text-black transition-colors group"><i className="fa-solid fa-cloud-arrow-down text-sm group-hover:translate-y-1 transition-transform"></i></button>
          </div>
        </div>
      </div>

      {/* 2. NEURAL CONTROLS (Right) */}
      <div className="w-full lg:w-[540px] bg-white flex flex-col h-full shadow-[-40px_0_100px_rgba(0,0,0,0.03)] z-10">
        <div className="flex-1 overflow-y-auto p-10 lg:p-16 space-y-14 hide-scrollbar">
          
          <header className="space-y-6 pt-6">
            <h2 className="text-[54px] font-black italic tracking-tighter uppercase leading-[0.8] text-black">
              Neural Studio.
            </h2>
            <p className="text-gray-400 font-medium text-[16px] leading-relaxed max-w-sm">
              Translate your imagination into a premium wearable masterpiece.
            </p>
          </header>

          <div className={`space-y-12 transition-all duration-700 ${step === 'preview' ? 'opacity-40 pointer-events-none grayscale blur-[2px]' : 'opacity-100'}`}>
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1">1. THE VISION</label>
              <div className="relative">
                <textarea 
                  value={basicIdea} 
                  onChange={(e) => setBasicIdea(e.target.value)}
                  placeholder="e.g. A minimalist oil painting of a lonely cosmonaut on Mars, cinematic lighting..."
                  className="w-full h-44 bg-[#F8F9FA] border-2 border-transparent focus:border-black/5 focus:bg-white rounded-[2.5rem] p-8 text-[17px] font-bold outline-none transition-all resize-none shadow-inner placeholder:text-gray-300"
                />
                <div className="absolute bottom-6 right-8 text-gray-200">
                   <i className="fa-solid fa-sparkles text-xl"></i>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDesignGeneration}
              disabled={isSynthesizing || !basicIdea.trim()}
              className="w-full h-20 bg-black text-white rounded-full font-black text-[14px] uppercase tracking-[0.35em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-5 group"
            >
              {isSynthesizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Synthesizing Node
                </>
              ) : (
                <>
                  SYNTHESIZE DESIGN
                  <i className="fa-solid fa-arrow-right text-[12px] group-hover:translate-x-3 transition-transform"></i>
                </>
              )}
            </button>
          </div>

          {/* AI Refinement View */}
          {(expandedPrompt || isGeneratingImage) && (
            <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
              <div className="p-10 bg-black text-white rounded-[3.5rem] relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center gap-3 text-yellow-400">
                    <i className="fa-solid fa-bolt-lightning text-xs"></i>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">AI Expansion Matrix</span>
                  </div>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-tight">{expandedPrompt?.shortDescription || "Expanding logic..."}</h4>
                  <p className="text-[13px] text-gray-400 font-medium leading-relaxed italic border-l border-white/10 pl-5">
                    "{expandedPrompt?.proPrompt}"
                  </p>
                </div>
              </div>

              <div className="space-y-8 border-t border-gray-100 pt-10">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em]">2. CONFIGURE SPECS</label>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">220 GSM PREMIUM COTTON</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 rounded-2xl text-[12px] font-black transition-all ${selectedSize === size ? 'bg-black text-white shadow-xl scale-110' : 'bg-[#F8F9FA] text-gray-400 hover:text-black hover:bg-gray-100'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Studio Footer Actions */}
        <div className="p-12 border-t border-gray-100 bg-white/80 backdrop-blur-md space-y-6">
          <button 
            disabled={!generatedImageUrl || isSynthesizing}
            onClick={() => onAddToCart(product, selectedColor, selectedSize, 1, expandedPrompt?.proPrompt || basicIdea, generatedImageUrl!)}
            className="w-full h-22 bg-black text-white rounded-full font-black text-[16px] uppercase tracking-[0.4em] shadow-[0_25px_60px_rgba(0,0,0,0.25)] hover:-translate-y-2 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-6 group"
          >
            ADD TO BAG
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <i className="fa-solid fa-plus text-[12px]"></i>
            </div>
          </button>
          
          <div className="flex items-center justify-center gap-8">
            <button 
              onClick={() => { setStep('ideate'); setExpandedPrompt(null); setGeneratedImageUrl(null); setBasicIdea(''); }}
              className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] hover:text-red-500 transition-colors"
            >
              Start Over
            </button>
            <div className="w-px h-3 bg-gray-100"></div>
            <button className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] hover:text-black transition-colors">
              Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;
