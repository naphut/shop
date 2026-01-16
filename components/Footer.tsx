
import React, { useState } from 'react';
import { Language } from '../types';

const Footer: React.FC<{ lang: Language }> = ({ lang }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const Section = ({ title, children, id }: { title: string, children?: React.ReactNode, id: string }) => (
    <div className="flex flex-col space-y-6">
      <h4 
        onClick={() => toggle(id)}
        className="font-black mb-2 uppercase text-[11px] tracking-[0.4em] text-gray-500 flex justify-between items-center md:cursor-default group"
      >
        <span className="group-hover:text-white transition-colors">{title}</span>
        <i className={`fa-solid fa-chevron-down md:hidden transition-transform ${openSection === id ? 'rotate-180' : ''}`}></i>
      </h4>
      <div className={`${openSection === id ? 'block' : 'hidden'} md:block animate-in fade-in slide-in-from-top-2 duration-500`}>
        {children}
      </div>
    </div>
  );

  return (
    <footer className="bg-black text-white pt-32 pb-16 lg:pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          
          <div className="space-y-10">
            <div className="text-[40px] font-black tracking-tighter italic leading-none text-white">MASTER STUDIO.</div>
            <p className="text-gray-400 text-[14px] leading-relaxed font-medium max-w-xs italic opacity-80">
              Defining the wardrobe of the modern professional through technical precision and ethical craftsmanship.
            </p>
            <div className="flex gap-8 text-2xl pt-4">
               <a href="#" className="hover:text-white text-gray-500 hover:-translate-y-2 transition-all duration-300"><i className="fa-brands fa-facebook-f"></i></a>
               <a href="#" className="hover:text-white text-gray-500 hover:-translate-y-2 transition-all duration-300"><i className="fa-brands fa-instagram"></i></a>
               <a href="#" className="hover:text-white text-gray-500 hover:-translate-y-2 transition-all duration-300"><i className="fa-brands fa-tiktok"></i></a>
               <a href="#" className="hover:text-white text-gray-500 hover:-translate-y-2 transition-all duration-300"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>

          <Section title="SHOP" id="shop">
            <ul className="space-y-5 text-[13px] text-gray-400 font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Men's Apparel</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Women's Collection</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">AI Customizer</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Wholesale Program</a></li>
            </ul>
          </Section>

          <Section title="SUPPORT" id="support">
            <ul className="space-y-5 text-[13px] text-gray-400 font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Return Policy</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Privacy Shield</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-2 block transition-all">Help Center</a></li>
            </ul>
          </Section>

          <div className="space-y-8">
            <h4 className="font-black uppercase text-[11px] tracking-[0.4em] text-gray-500">INSIDER ACCESS</h4>
            <p className="text-[13px] text-gray-400 font-medium italic">Join our network for early release access and 10% off your first curation.</p>
            <form className="flex gap-3 relative max-w-sm h-14" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-white/5 border border-white/10 rounded-2xl px-6 text-[14px] flex-1 outline-none focus:ring-1 focus:ring-white transition-all font-medium placeholder:text-gray-600 focus:bg-white/10" 
              />
              <button className="bg-white text-black px-6 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-all shadow-xl group shrink-0 active:scale-95">
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-2 transition-transform"></i>
              </button>
            </form>
            <div className="flex items-center gap-4 text-[9px] font-black text-gray-600 uppercase tracking-widest pt-4">
               <i className="fa-solid fa-lock text-gray-800"></i> Secure 256-bit SSL Encrypted
            </div>
          </div>
        </div>
        
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">
            © 2025 MASTER STUDIO INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-[10px] text-gray-600 font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             <i className="fa-brands fa-cc-visa text-2xl"></i>
             <i className="fa-brands fa-cc-mastercard text-2xl"></i>
             <i className="fa-brands fa-cc-apple-pay text-2xl"></i>
             <i className="fa-brands fa-google-pay text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
