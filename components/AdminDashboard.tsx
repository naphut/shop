
import React, { useState, useMemo } from 'react';
import { Language, Product, Order, UserAccount, OrderStatus } from '../types';
import { TRANSLATIONS } from '../constants';

interface AdminDashboardProps {
  lang: Language;
  products: Product[];
  orders: Order[];
  users: UserAccount[];
  onUpdateProductStatus: (id: string, active: boolean) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onUpdateUserStatus: (id: string, active: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  lang, products, orders, users, 
  onUpdateProductStatus, onDeleteProduct, onUpdateOrderStatus, onUpdateUserStatus 
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('analytics');

  const stats = useMemo(() => [
    { label: t.revenue, value: `$${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, trend: '+18.2%', icon: 'fa-chart-line' },
    { label: 'Total Orders', value: orders.length.toString(), trend: '+5.4%', icon: 'fa-shopping-bag' },
    { label: 'Active Users', value: users.filter(u => u.isActive).length.toString(), trend: '+12%', icon: 'fa-users' },
    { label: 'Avg Rating', value: '4.8', trend: '+0.1', icon: 'fa-star' },
  ], [orders, users, t]);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-50 text-orange-600 border-orange-100',
      shipping: 'bg-blue-50 text-blue-600 border-blue-100',
      completed: 'bg-green-50 text-green-600 border-green-100',
      cancelled: 'bg-red-50 text-red-600 border-red-100'
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[status] || 'bg-gray-50 text-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-6 animate-in fade-in slide-in-from-right duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">{t.adminTitle}</h1>
          <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.4em] mt-2">Elite Store Control Center</p>
        </div>
        
        <div className="flex bg-[#F1F3F5] p-2 rounded-[2rem] shadow-inner">
          {[
            { id: 'analytics', label: 'Dashboard', icon: 'fa-gauge' },
            { id: 'products', label: t.productManagement, icon: 'fa-shirt' },
            { id: 'orders', label: t.orderManagement, icon: 'fa-truck-fast' },
            { id: 'users', label: t.userManagement, icon: 'fa-users-gear' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id ? 'bg-black text-white shadow-xl scale-105' : 'text-gray-400 hover:text-black'
              }`}
            >
              <i className={`fa-solid ${tab.icon} text-xs`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm group hover:scale-[1.02] transition-all duration-500">
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-6 text-xl shadow-2xl group-hover:rotate-6 transition">
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <div className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] mb-2">{stat.label}</div>
                <div className="text-3xl font-black tracking-tight flex items-end gap-3 italic">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Recent Orders</h3>
              <div className="space-y-4">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-black transition-all">
                    <div className="flex flex-col">
                      <span className="text-sm font-black italic">{o.id}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{o.customerName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-black italic">${o.total}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black text-white p-10 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full group-hover:scale-150 transition-all duration-[2s]"></div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter relative z-10">{t.topProducts}</h3>
              <div className="space-y-6 relative z-10">
                {products.slice(0, 3).map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden shadow-inner">
                      <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" alt="" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-black italic text-lg line-clamp-1">{p.name[lang]}</h4>
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{p.category} // {p.stock} in stock</span>
                    </div>
                    <div className="text-xl font-black italic">#{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{t.productManagement}</h3>
            <button className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl flex items-center gap-3">
              <i className="fa-solid fa-plus"></i> {t.addProduct}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Item</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Price</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Stock</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition duration-200">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-14 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="font-black italic text-sm">{p.name[lang]}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-gray-500 uppercase">{p.category}</td>
                    <td className="px-10 py-6 font-black italic text-sm">${p.price}</td>
                    <td className="px-10 py-6 font-black text-sm">{p.stock}</td>
                    <td className="px-10 py-6">
                      <button 
                        onClick={() => onUpdateProductStatus(p.id, !p.isActive)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                          p.isActive !== false ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}
                      >
                        {p.isActive !== false ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex gap-4">
                        <button className="text-gray-300 hover:text-black transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button onClick={() => onDeleteProduct(p.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{t.allOrders}</h3>
            <div className="flex gap-2">
               <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition">Export CSV</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{t.orderNumberLabel}</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Customer</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{t.totalPriceLabel}</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{t.dateLabel}</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">{t.statusLabel}</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition duration-200">
                    <td className="px-10 py-6 font-black italic text-sm">{o.id}</td>
                    <td className="px-10 py-6 text-sm font-bold">{o.customerName}</td>
                    <td className="px-10 py-6 font-black italic text-sm">${o.total}</td>
                    <td className="px-10 py-6 text-xs text-gray-400 font-bold">{o.date}</td>
                    <td className="px-10 py-6"><StatusBadge status={o.status} /></td>
                    <td className="px-10 py-6">
                      <select 
                        className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-black transition-all"
                        value={o.status}
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipping">Shipping</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">{t.userManagement}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Member</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Email</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Join Date</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Role</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition duration-200">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-xs italic shadow-md">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-black italic text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-medium text-gray-500">{u.email}</td>
                    <td className="px-10 py-6 text-xs text-gray-400 font-bold">{u.joinDate}</td>
                    <td className="px-10 py-6 text-[10px] font-black uppercase tracking-widest">{u.role}</td>
                    <td className="px-10 py-6">
                      <button 
                        onClick={() => onUpdateUserStatus(u.id, !u.isActive)}
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                          u.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}
                      >
                        {u.isActive ? 'Allowed' : 'Blocked'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
