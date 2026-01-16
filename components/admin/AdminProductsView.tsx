
import React, { useState, useMemo } from 'react';
import { Product } from '../../types';

interface Props {
  products: Product[];
  onUpdate: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'name' | 'category' | 'price' | 'stock' | 'status';
type SortDirection = 'asc' | 'desc' | null;

const AdminProductsView: React.FC<Props> = ({ products, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: null });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortConfig.direction) {
      result = [...result].sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (sortConfig.key) {
          case 'name':
            valA = a.name.en.toLowerCase();
            valB = b.name.en.toLowerCase();
            break;
          case 'category':
            valA = a.category.toLowerCase();
            valB = b.category.toLowerCase();
            break;
          case 'price':
            valA = a.price;
            valB = b.price;
            break;
          case 'stock':
            valA = a.stock;
            valB = b.stock;
            break;
          case 'status':
            valA = a.isActive !== false ? 1 : 0;
            valB = b.isActive !== false ? 1 : 0;
            break;
          default:
            return 0;
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, searchTerm, categoryFilter, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedAndFilteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedAndFilteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (active: boolean) => {
    selectedIds.forEach(id => onUpdate(id, active));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds([]);
    }
  };

  const categories = ['All', 'Men', 'Women', 'Kids', 'Custom', 'Bulk'];

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column || !sortConfig.direction) {
      return <i className="fa-solid fa-sort ml-2 opacity-20 group-hover:opacity-100 transition-opacity"></i>;
    }
    return sortConfig.direction === 'asc' 
      ? <i className="fa-solid fa-sort-up ml-2 text-indigo-500"></i> 
      : <i className="fa-solid fa-sort-down ml-2 text-indigo-500"></i>;
  };

  return (
    <div className="space-y-10 relative pb-32">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tight mb-2">Inventory Management</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Node: Product_Database_Alpha</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
          <i className="fa-solid fa-plus-circle"></i> Inject New SKU
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            placeholder="Filter by Name, Brand, or Serial ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-14 py-4 text-sm font-medium text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                categoryFilter === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/10' 
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800">
                <th className="px-10 py-8 w-12">
                  <button 
                    onClick={toggleSelectAll}
                    className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                      selectedIds.length === sortedAndFilteredProducts.length && sortedAndFilteredProducts.length > 0
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {selectedIds.length === sortedAndFilteredProducts.length && sortedAndFilteredProducts.length > 0 && (
                      <i className="fa-solid fa-check text-[10px]"></i>
                    )}
                  </button>
                </th>
                <th 
                  className="px-4 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('name')}
                >
                  Product Metadata <SortIcon column="name" />
                </th>
                <th 
                  className="px-8 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('category')}
                >
                  Category <SortIcon column="category" />
                </th>
                <th 
                  className="px-8 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('price')}
                >
                  Price Point <SortIcon column="price" />
                </th>
                <th 
                  className="px-8 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('stock')}
                >
                  Stock Level <SortIcon column="stock" />
                </th>
                <th 
                  className="px-8 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('status')}
                >
                  Live Status <SortIcon column="status" />
                </th>
                <th className="px-8 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Action Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedAndFilteredProducts.length > 0 ? sortedAndFilteredProducts.map((p) => (
                <tr key={p.id} className={`hover:bg-slate-900/40 transition-all group ${selectedIds.includes(p.id) ? 'bg-indigo-600/5' : ''}`}>
                  <td className="px-10 py-8">
                    <button 
                      onClick={() => toggleSelect(p.id)}
                      className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                        selectedIds.includes(p.id)
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-700 hover:border-slate-500 group-hover:border-slate-400'
                      }`}
                    >
                      {selectedIds.includes(p.id) && <i className="fa-solid fa-check text-[10px]"></i>}
                    </button>
                  </td>
                  <td className="px-4 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-20 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-800 p-1 flex-shrink-0 group-hover:border-indigo-500/50 transition-colors">
                        <img src={p.image} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" alt={p.name.en} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-black text-white italic group-hover:text-indigo-400 transition-colors leading-none">{p.name.en}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.brand} // ID: {p.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-tight">{p.category}</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{p.subCategory}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="text-base font-black italic text-white">${p.price}</span>
                      {p.typicalPrice && <span className="text-[10px] text-slate-600 line-through font-bold">${p.typicalPrice}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black italic ${p.stock < 50 ? 'text-rose-400' : 'text-white'}`}>{p.stock} Units</span>
                        <div className="w-24 h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full transition-all duration-1000 ${p.stock < 50 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${Math.min((p.stock / 200) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <button 
                      onClick={() => onUpdate(p.id, !p.isActive)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                        p.isActive !== false 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${p.isActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
                      {p.isActive !== false ? 'LIVESTREAM' : 'OFFLINE'}
                    </button>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex gap-4">
                      <button 
                        title="Edit Entry"
                        className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20 transition-all active:scale-90"
                      >
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(p.id)}
                        title="Delete Protocol"
                        className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-rose-600 hover:border-rose-600 hover:shadow-lg hover:shadow-rose-600/20 transition-all active:scale-90"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <i className="fa-solid fa-box-open text-7xl"></i>
                      <div className="text-xs font-black uppercase tracking-[0.5em]">No items match current query</div>
                      <button 
                        onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setSortConfig({ key: 'name', direction: null }); }}
                        className="text-[10px] font-black text-indigo-400 underline underline-offset-4 hover:text-indigo-300 transition-colors"
                      >
                        Reset Master Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="bg-slate-900/50 px-10 py-6 border-t border-slate-800 flex justify-between items-center">
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
             Showing {sortedAndFilteredProducts.length} of {products.length} catalog nodes
           </div>
           <div className="flex gap-2">
              <button className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fa-solid fa-chevron-left text-[10px]"></i></button>
              <button className="w-10 h-10 rounded-lg bg-indigo-600 border border-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 text-[10px] font-black">1</button>
              <button className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fa-solid fa-chevron-right text-[10px]"></i></button>
           </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-fit min-w-[500px] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-950/80 backdrop-blur-xl border border-indigo-500/30 rounded-[2.5rem] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex items-center justify-between gap-12 ring-1 ring-white/10">
            <div className="flex items-center gap-6 px-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-600/20">
                {selectedIds.length}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-widest">Nodes Selected</span>
                <button onClick={() => setSelectedIds([])} className="text-[10px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest text-left">Deselect All</button>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800"></div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleBulkStatusChange(true)}
                className="px-6 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
              >
                Go Online
              </button>
              <button 
                onClick={() => handleBulkStatusChange(false)}
                className="px-6 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-black hover:border-white transition-all"
              >
                Go Offline
              </button>
              <button 
                onClick={handleBulkDelete}
                className="px-6 py-3.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsView;
