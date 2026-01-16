
import React, { useEffect, useState } from 'react';
import { Product, Order, UserAccount } from '../../types';
import { apiService } from '../../services/apiService';

interface Props {
  products: Product[];
  orders: Order[];
  users: UserAccount[];
}

const AdminDashboardView: React.FC<Props> = ({ products, orders: initialOrders, users: initialUsers }) => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await apiService.getAdminStats();
            setStats(res.data);
        } catch (err) {
            console.error("Stat Retrieval Failed");
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  const dashboardItems = [
    { label: 'Cumulative Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: 'fa-dollar-sign', trend: '+12.5%', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Total Node Orders', value: stats.orders, icon: 'fa-bag-shopping', trend: '+5.4%', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'User Nodes', value: stats.users, icon: 'fa-users', trend: '+18.2%', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Catalog Health', value: products.length, icon: 'fa-shirt', trend: 'Stable', color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Node Intelligence Overview</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Master Studio Administrative Interface</p>
        </div>
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all">Sync Mainframe</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((s, i) => (
          <div key={i} className="bg-slate-950 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-600 transition-all duration-500">
            <div className="flex items-start justify-between mb-8">
              <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            </div>
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-1">{s.label}</div>
            <div className="text-3xl font-black text-white italic tracking-tighter">{loading ? '---' : s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10">
          <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-10">Neural Sales Ledger</h3>
          <div className="space-y-4">
             {/* Mocking recent items or real fetch */}
             <p className="text-slate-500 italic text-sm">System ready for transaction throughput...</p>
          </div>
        </div>
        
        <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-microchip text-4xl text-indigo-500 mb-6 animate-pulse"></i>
            <h4 className="text-white font-black uppercase tracking-widest text-sm">API Node Status</h4>
            <div className="mt-4 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Operational</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
