
import React from 'react';
import { AdminViewState } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeView: AdminViewState;
  onViewChange: (view: AdminViewState) => void;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeView, onViewChange, onLogout }) => {
  const menuItems: { id: AdminViewState; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: 'fa-gauge-high' },
    { id: 'products', label: 'Inventory', icon: 'fa-shirt' },
    { id: 'orders', label: 'Sales & Orders', icon: 'fa-receipt' },
    { id: 'customers', label: 'User Nodes', icon: 'fa-users' },
    { id: 'settings', label: 'API Config', icon: 'fa-sliders' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 font-sans text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fa-solid fa-cube text-lg"></i>
            </div>
            <span className="text-xl font-black tracking-tighter italic uppercase">Master OS</span>
          </div>

          <nav className="space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Management</div>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold transition-all ${
                  activeView === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-900">
          <div className="bg-slate-900 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">API Status: Active</span>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed font-medium">
              V 3.2.0-Alpha<br/>
              Last sync: Just now
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-10">
          <div className="flex items-center gap-6">
             <div className="text-slate-500">
               <i className="fa-solid fa-bars-staggered cursor-pointer hover:text-white transition-colors"></i>
             </div>
             <h2 className="text-sm font-black uppercase tracking-widest text-white">
               {activeView.replace('-', ' ')}
             </h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2 bg-slate-900 rounded-full px-4 py-2 border border-slate-800">
              <i className="fa-solid fa-magnifying-glass text-slate-500 text-xs"></i>
              <input type="text" placeholder="Search data points..." className="bg-transparent border-none outline-none text-xs text-slate-300 w-48 font-medium" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 relative">
                <i className="fa-solid fa-bell text-slate-400"></i>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
              </div>
              <div className="flex items-center gap-4 cursor-pointer group">
                <div className="text-right hidden sm:block">
                   <div className="text-xs font-bold text-white uppercase tracking-tight">System Admin</div>
                   <div className="text-[10px] text-slate-500 font-bold">Node: SG-01</div>
                </div>
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">AD</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content */}
        <main className="flex-1 overflow-y-auto p-10 bg-slate-900">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
