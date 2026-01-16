
import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import { ProductCategory, ProductSubCategory, Product } from '../types';

interface FilterSidebarProps {
  products: Product[]; // Added to calculate observed price range
  selectedDept: string;
  selectedCat: string;
  selectedItemType: string;
  selectedBrands: string[];
  selectedSizes: string[];
  selectedColors: string[];
  selectedMaterials: string[];
  priceRange: [number, number];
  minRating: number;
  selectedOthers: string[];
  
  setSelectedDept: (d: string) => void;
  setSelectedCat: (c: string) => void;
  setSelectedItemType: (it: string) => void;
  toggleBrand: (b: string) => void;
  toggleSize: (s: string) => void;
  toggleColor: (c: string) => void;
  toggleMaterial: (m: string) => void;
  setPriceRange: (r: [number, number]) => void;
  setMinRating: (r: number) => void;
  toggleOther: (o: string) => void;
  clearFilters: () => void;
}

const BRAND_LIST = [
  { name: 'Nike', type: 'Int' }, 
  { name: 'Adidas', type: 'Int' }, 
  { name: 'Zara', type: 'Int' }, 
  { name: 'Uniqlo', type: 'Int' }, 
  { name: 'Levi\'s', type: 'Int' }, 
  { name: 'H&M', type: 'Int' },
  { name: 'Khmer Cotton', type: 'Local' }, 
  { name: 'Marvel', type: 'Kids' }
];

const CATEGORY_LIST: ProductSubCategory[] = ['Clothing', 'Shoes', 'Accessories', 'Everyday Items'];
const MATERIAL_LIST = ['Cotton', 'Polyester', 'Denim', 'Wool', 'Leather', 'Linen', 'Silk', 'Canvas'];

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['dept', 'cat', 'brand', 'price', 'material', 'other']);

  const toggleSection = (id: string) => setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const getCount = (field: keyof Product, value: any) => {
    return props.products.filter(p => p[field] === value).length;
  };

  // Calculate observed bounds from products
  const { minBound, maxBound } = useMemo(() => {
    if (props.products.length === 0) return { minBound: 0, maxBound: 500 };
    const prices = props.products.map(p => p.price);
    return {
      minBound: Math.floor(Math.min(...prices)),
      maxBound: Math.ceil(Math.max(...prices))
    };
  }, [props.products]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), props.priceRange[1] - 5);
    props.setPriceRange([value, props.priceRange[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), props.priceRange[0] + 5);
    props.setPriceRange([props.priceRange[0], value]);
  };

  const Section = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <button onClick={() => toggleSection(id)} className="w-full flex justify-between items-center group mb-5">
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">{title}</h4>
        <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white ${expanded.includes(id) ? 'rotate-180' : ''}`}>
           <i className="fa-solid fa-chevron-down text-[8px]"></i>
        </div>
      </button>
      {expanded.includes(id) && <div className="animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[200] w-16 h-16 bg-black text-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all hover:-translate-y-2 hover:shadow-black/40 active:scale-90"
      >
        <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-sliders'} text-xl`}></i>
      </button>

      {/* Sidebar Container */}
      <aside className={`
        w-full lg:w-80 shrink-0 
        ${isMobileOpen ? 'fixed inset-0 z-[140] bg-white overflow-y-auto p-8' : 'hidden lg:block'}
      `}>
        <div className="bg-[#F8F9FA] border border-gray-100 p-8 rounded-[3.5rem] h-fit shadow-sm sticky top-32">
          
          <div className="flex justify-between items-center mb-10 px-2">
            <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-black italic">FILTERS</h3>
            <button onClick={props.clearFilters} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:scale-110 active:scale-95 transition-all">CLEAR</button>
          </div>

          {/* 1. Department */}
          <Section title="Department" id="dept">
            <div className="flex flex-wrap gap-2.5">
              {['All', 'Men', 'Women', 'Kids', 'Custom'].map(d => (
                <button
                  key={d} 
                  onClick={() => props.setSelectedDept(d)}
                  className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    props.selectedDept === d 
                      ? 'bg-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] scale-110 ring-2 ring-black/5' 
                      : 'bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Section>

          {/* 2. Categories */}
          <Section title="Categories" id="cat">
            <div className="space-y-2.5">
              {['All', ...CATEGORY_LIST].map(c => {
                const isSelected = props.selectedCat === c;
                const count = c === 'All' ? props.products.length : getCount('subCategory', c);
                return (
                  <button 
                    key={c}
                    onClick={() => props.setSelectedCat(c)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      isSelected 
                        ? 'bg-white border-black shadow-xl ring-2 ring-black/5 translate-x-2' 
                        : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <span className={`text-[12px] font-black uppercase tracking-tighter ${isSelected ? 'text-black' : 'text-gray-500'}`}>{c}</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors ${isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 4. Price Range - Refined Dual Slider with Dynamic Bounds */}
          <div className="py-8 border-b border-gray-100">
            <button onClick={() => toggleSection('price')} className="w-full flex justify-between items-center group mb-8">
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">Price Range</h4>
              <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white ${expanded.includes('price') ? 'rotate-180' : ''}`}>
                 <i className="fa-solid fa-chevron-down text-[8px]"></i>
              </div>
            </button>
            
            {expanded.includes('price') && (
              <div className="space-y-10 animate-in fade-in slide-in-from-top-2 duration-300 px-1">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">Min</span>
                    <div className="text-[40px] font-black italic tracking-tighter leading-none text-black price-number drop-shadow-sm">${props.priceRange[0]}</div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] block">Max</span>
                    <div className="text-[40px] font-black italic tracking-tighter leading-none text-black price-number drop-shadow-sm">${props.priceRange[1]}</div>
                  </div>
                </div>
                
                <div className="relative pt-8 pb-4">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full -translate-y-1/2" />
                  
                  <div 
                    className="absolute top-1/2 h-1 bg-black rounded-full -translate-y-1/2"
                    style={{ 
                      left: `${((props.priceRange[0] - minBound) / (maxBound - minBound)) * 100}%`, 
                      right: `${100 - ((props.priceRange[1] - minBound) / (maxBound - minBound)) * 100}%` 
                    }}
                  />

                  <input 
                    type="range" min={minBound} max={maxBound} step="1"
                    value={props.priceRange[0]}
                    onChange={handleMinChange}
                    className="absolute inset-0 w-full h-2 bg-transparent appearance-none cursor-pointer outline-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto" 
                  />
                  <input 
                    type="range" min={minBound} max={maxBound} step="1"
                    value={props.priceRange[1]}
                    onChange={handleMaxChange}
                    className="absolute inset-0 w-full h-2 bg-transparent appearance-none cursor-pointer outline-none pointer-events-none z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto" 
                  />

                  <div className="flex justify-between mt-8 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-1 opacity-70">
                    <span>${minBound}</span>
                    <span>OBSERVED RANGE</span>
                    <span>${maxBound}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Brands */}
          <Section title="Brands" id="brand">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-3 hide-scrollbar">
              {BRAND_LIST.map(b => {
                const isSelected = props.selectedBrands.includes(b.name);
                const count = getCount('brand', b.name);
                return (
                  <div 
                    key={b.name} 
                    onClick={() => props.toggleBrand(b.name)} 
                    className={`group flex items-center p-3 rounded-2xl border-2 transition-all cursor-pointer bg-white ${isSelected ? 'border-black shadow-lg scale-[1.02] ring-1 ring-black/5' : 'border-gray-50 hover:border-gray-200 hover:shadow-md hover:-translate-y-1'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform">
                       <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(b.name)}&background=f9f9f9&color=ccc&font-size=0.3&bold=true`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className={`text-[12px] font-black tracking-tight ${isSelected ? 'text-black' : 'text-gray-900'}`}>{b.name}</div>
                      <div className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.1em]">{count} ITEMS</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black shadow-md' : 'border-gray-100 bg-white group-hover:border-black'}`}>
                      {isSelected && <i className="fa-solid fa-check text-[8px] text-white"></i>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 5. Material */}
          <Section title="Material" id="material">
            <div className="grid grid-cols-1 gap-4">
              {MATERIAL_LIST.map(m => {
                const isSelected = props.selectedMaterials.includes(m);
                return (
                  <label key={m} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-black border-black text-white shadow-md scale-110' : 'border-gray-100 bg-white group-hover:border-black group-hover:shadow-sm'}`}>
                        {isSelected && <i className="fa-solid fa-check text-[8px]"></i>}
                      </div>
                      <input type="checkbox" className="hidden" checked={isSelected} onChange={() => props.toggleMaterial(m)} />
                      <span className={`text-[13px] font-bold tracking-tight uppercase transition-all ${isSelected ? 'text-black font-black translate-x-1' : 'text-gray-500 group-hover:text-black group-hover:translate-x-1'}`}>{m}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded transition-colors ${isSelected ? 'text-black bg-gray-100' : 'text-gray-300'}`}>{getCount('material', m)}</span>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* 6. Status / Other */}
          <Section title="Collection" id="other">
            <div className="space-y-3 pt-1">
              {['New Arrivals', 'Best Sellers', 'Limited Stock'].map(o => {
                const isSelected = props.selectedOthers.includes(o);
                return (
                  <button 
                    key={o} 
                    onClick={() => props.toggleOther(o)}
                    className={`w-full flex items-center justify-between h-14 px-6 rounded-2xl border-2 transition-all group ${
                      isSelected 
                        ? 'border-black bg-black text-white shadow-xl scale-[1.02] ring-2 ring-black/5' 
                        : 'border-black/5 bg-white hover:border-black hover:shadow-lg hover:-translate-y-1 text-gray-500 hover:text-black'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      {o.toUpperCase()}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-white' : 'bg-transparent border border-black/10 group-hover:border-black'}`}>
                      <i className={`fa-solid fa-check text-[8px] transition-opacity ${isSelected ? 'text-black opacity-100' : 'opacity-0'}`}></i>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
