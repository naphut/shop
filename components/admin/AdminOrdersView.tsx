
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../types';

interface Props {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

type SortKey = 'id' | 'customer' | 'total' | 'status' | 'date';
type SortDirection = 'asc' | 'desc' | null;

const AdminOrdersView: React.FC<Props> = ({ orders, onUpdateStatus }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'date', direction: null });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = useMemo(() => {
    if (!sortConfig.direction) return orders;

    return [...orders].sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortConfig.key) {
        case 'id':
          valA = a.id.toLowerCase();
          valB = b.id.toLowerCase();
          break;
        case 'customer':
          valA = a.customerName.toLowerCase();
          valB = b.customerName.toLowerCase();
          break;
        case 'total':
          valA = a.total;
          valB = b.total;
          break;
        case 'status':
          valA = a.status.toLowerCase();
          valB = b.status.toLowerCase();
          break;
        case 'date':
          valA = new Date(a.date).getTime() || a.date;
          valB = new Date(b.date).getTime() || b.date;
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedOrders.map(o => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = (status: OrderStatus) => {
    selectedIds.forEach(id => onUpdateStatus(id, status));
    setSelectedIds([]);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column || !sortConfig.direction) {
      return <i className="fa-solid fa-sort ml-2 opacity-20 group-hover:opacity-100 transition-opacity"></i>;
    }
    return sortConfig.direction === 'asc' 
      ? <i className="fa-solid fa-sort-up ml-2 text-indigo-500"></i> 
      : <i className="fa-solid fa-sort-down ml-2 text-indigo-500"></i>;
  };

  return (
    <div className="space-y-8 relative pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Global Ledger</h2>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mt-1">Real-time Transaction Monitor</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-8 py-6 w-12">
                  <button 
                    onClick={toggleSelectAll}
                    className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                      selectedIds.length === sortedOrders.length && sortedOrders.length > 0
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {selectedIds.length === sortedOrders.length && sortedOrders.length > 0 && (
                      <i className="fa-solid fa-check text-[10px]"></i>
                    )}
                  </button>
                </th>
                <th 
                  className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('id')}
                >
                  ID Node <SortIcon column="id" />
                </th>
                <th 
                  className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('customer')}
                >
                  Customer Source <SortIcon column="customer" />
                </th>
                <th 
                  className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('total')}
                >
                  Volume <SortIcon column="total" />
                </th>
                <th 
                  className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('status')}
                >
                  Status Logic <SortIcon column="status" />
                </th>
                <th 
                  className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('date')}
                >
                  Dispatch Time <SortIcon column="date" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {sortedOrders.map((o) => (
                <tr key={o.id} className={`hover:bg-slate-900 transition-colors group ${selectedIds.includes(o.id) ? 'bg-indigo-600/5' : ''}`}>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleSelect(o.id)}
                      className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${
                        selectedIds.includes(o.id)
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-700 hover:border-slate-500 group-hover:border-slate-400'
                      }`}
                    >
                      {selectedIds.includes(o.id) && <i className="fa-solid fa-check text-[10px]"></i>}
                    </button>
                  </td>
                  <td className="px-8 py-6 font-black italic text-indigo-400">{o.id}</td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-white text-sm">{o.customerName}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{o.address}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black italic text-white">${o.total}</div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 transition-all text-slate-300"
                      value={o.status}
                      onChange={(e) => onUpdateStatus(o.id, e.target.value as OrderStatus)}
                    >
                      <option value="pending">Pending Node</option>
                      <option value="shipping">In Transit</option>
                      <option value="completed">Success Delivery</option>
                      <option value="cancelled">Protocol Failed</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-500 font-bold">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <span className="text-xs font-black text-white uppercase tracking-widest">Orders Active</span>
                <button onClick={() => setSelectedIds([])} className="text-[10px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest text-left">Cancel Selection</button>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800"></div>

            <div className="flex items-center gap-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 pr-2">Set Status:</div>
              {(['pending', 'shipping', 'completed', 'cancelled'] as OrderStatus[]).map(status => (
                <button 
                  key={status}
                  onClick={() => handleBulkStatusUpdate(status)}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    status === 'completed' ? 'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white' :
                    status === 'cancelled' ? 'text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white' :
                    'text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersView;
