
import React, { useState } from 'react';
import { Language, Order, UserAccount } from '../types';
import { TRANSLATIONS } from '../constants';

interface AccountViewProps {
  lang: Language;
  onLogin: (email: string) => void;
  isLoggedIn: boolean;
  currentUser: UserAccount | null;
  onLogout: () => void;
  orders: Order[];
}

const AccountView: React.FC<AccountViewProps> = ({ lang, onLogin, isLoggedIn, currentUser, onLogout, orders }) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(emailInput);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <h1 className="text-[64px] md:text-[100px] font-black italic uppercase tracking-tighter leading-[0.8] text-black">
              {mode === 'login' ? t.loginLabel : t.registerLabel}
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[12px] tracking-[0.4em] max-w-md">
              Welcome to the elite club of Master Studio. Access your premium collection and tracking history.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setMode('login')}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
              >
                {t.loginLabel}
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
              >
                {t.registerLabel}
              </button>
            </div>
          </div>

          <div className="w-full max-w-md bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">{t.fullNameLabel}</label>
                  <input required type="text" className="w-full px-8 py-4 rounded-3xl border-2 border-gray-50 focus:border-black outline-none transition font-bold" placeholder="Your Name" />
                </div>
              )}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">{t.emailPhoneLabel}</label>
                <input 
                  required type="text" 
                  className="w-full px-8 py-4 rounded-3xl border-2 border-gray-50 focus:border-black outline-none transition font-bold" 
                  placeholder="hello@master.com" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">{t.passwordLabel}</label>
                <input required type="password" className="w-full px-8 py-4 rounded-3xl border-2 border-gray-50 focus:border-black outline-none transition font-bold" placeholder="••••••••" />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-black text-white py-5 rounded-3xl font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4"
              >
                {mode === 'login' ? t.loginLabel : t.registerLabel}
              </button>

              <div className="text-center pt-4 italic text-[10px] text-gray-300">
                (Simulation: Use admin@master.com or dara@example.com)
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Profile Sidebar */}
        <div className="w-full lg:w-80 space-y-8">
          <div className="flex flex-col items-center text-center p-12 bg-[#F8F9FA] rounded-[3.5rem] border border-gray-50 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-black italic mb-6 shadow-2xl">
              {currentUser?.name.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-black">{currentUser?.name}</h2>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">{currentUser?.email}</p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'profile', label: t.personalInfoLabel, icon: 'fa-user' },
              { id: 'history', label: t.orderHistoryLabel, icon: 'fa-clock-rotate-left' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-gray-400 hover:text-black hover:bg-gray-50'}`}
              >
                <i className={`fa-solid ${tab.icon}`}></i>
                {tab.label}
              </button>
            ))}
            <button 
              onClick={onLogout}
              className="flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              {t.logoutLabel}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 space-y-12">
          {activeTab === 'profile' && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right duration-500">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10">{t.personalInfoLabel}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.fullNameLabel}</label>
                  <div className="w-full p-5 bg-gray-50 rounded-2xl font-bold">{currentUser?.name}</div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.emailPhoneLabel}</label>
                  <div className="w-full p-5 bg-gray-50 rounded-2xl font-bold">{currentUser?.email}</div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.addressLabel}</label>
                  <div className="w-full p-5 bg-gray-50 rounded-2xl font-bold">{currentUser?.address}</div>
                </div>
              </div>
              <button className="mt-12 px-12 py-5 bg-black text-white rounded-3xl font-black text-[12px] uppercase tracking-widest hover:scale-105 transition shadow-2xl">
                {t.editInfoLabel}
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{t.orderHistoryLabel}</h3>
              {orders.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                  <i className="fa-solid fa-box-open text-6xl mb-6"></i>
                  <p className="font-black uppercase italic text-xs">No orders found</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-10 hover:shadow-lg transition-all group">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <i className="fa-solid fa-receipt text-3xl text-gray-200"></i>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{t.orderNumberLabel}</span>
                          <h4 className="font-black italic text-xl">{order.id}</h4>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest border ${
                          order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-12 mt-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{t.dateLabel}</span>
                          <span className="text-sm font-bold">{order.date}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{t.totalPriceLabel}</span>
                          <span className="text-sm font-black italic">${order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountView;
