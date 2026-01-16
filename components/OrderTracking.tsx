
import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface OrderTrackingProps {
  lang: Language;
}

interface TrackingData {
  orderId: string;
  status: 'processing' | 'shipped' | 'delivery' | 'delivered' | 'failed';
  estimatedDate: string;
  carrier: string;
  customerName: string;
  history: { time: string; activity: Record<Language, string>; status: string }[];
}

const MOCK_ORDER: TrackingData = {
  orderId: 'MS-2025-001',
  status: 'shipped',
  estimatedDate: 'Oct 24, 2025',
  carrier: 'J&T Express',
  customerName: 'Sok Vichea',
  history: [
    { 
      time: 'Oct 20, 2:30 PM', 
      activity: { en: 'Order Processed', kh: 'ការបញ្ជាទិញត្រូវបានដំណើរការ', cn: '订单已处理' },
      status: 'completed'
    },
    { 
      time: 'Oct 21, 9:00 AM', 
      activity: { en: 'Handed over to Carrier', kh: 'បានប្រគល់ជូនក្រុមហ៊ុនដឹកជញ្ជូន', cn: '已移交给承运人' },
      status: 'completed'
    },
    { 
      time: 'Oct 22, 10:15 AM', 
      activity: { en: 'In Transit - Arrived at Warehouse', kh: 'កំពុងដឹកជញ្ជូន - ដល់ឃ្លាំង', cn: '运输中 - 已到达仓库' },
      status: 'active'
    },
    { 
      time: 'Pending', 
      activity: { en: 'Out for Delivery', kh: 'កំពុងចេញដឹកជញ្ជូន', cn: '派送中' },
      status: 'pending'
    },
    { 
      time: 'Pending', 
      activity: { en: 'Delivered', kh: 'បានដឹកជញ្ជូនរួចរាល់', cn: '已送达' },
      status: 'pending'
    }
  ]
};

const OrderTracking: React.FC<OrderTrackingProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [orderIdInput, setOrderIdInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setIsSearching(true);
    setResult(null);
    setError(null);

    // Simulate API Call
    setTimeout(() => {
      setIsSearching(false);
      if (orderIdInput.toUpperCase() === 'MS-2025-001') {
        setResult(MOCK_ORDER);
      } else {
        setError(lang === Language.KH ? 'រកមិនឃើញការបញ្ជាទិញទេ' : 'Order not found');
      }
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#1E3A8A]';
      case 'active': return 'bg-orange-500';
      default: return 'bg-gray-200';
    }
  };

  const getStatusIcon = (activity: string) => {
    if (activity.includes('Process')) return 'fa-clipboard-check';
    if (activity.includes('Carrier')) return 'fa-box';
    if (activity.includes('Transit')) return 'fa-truck-fast';
    if (activity.includes('Delivery')) return 'fa-motorcycle';
    if (activity.includes('Delivered')) return 'fa-house-circle-check';
    return 'fa-circle';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">{t.trackOrderTitle}</h1>
        <p className="text-gray-400 font-medium tracking-wide uppercase text-xs">{t.trackOrderSub}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-barcode absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder={t.trackPlaceholder}
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full h-16 bg-white border-2 border-gray-100 rounded-3xl px-14 font-black text-sm outline-none focus:border-[#1E3A8A] transition-all shadow-sm"
            />
          </div>
          <button 
            type="submit" disabled={isSearching}
            className="h-16 px-12 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#1E3A8A] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : t.trackCta}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500 font-black text-xs uppercase tracking-widest">{error}</p>}
      </div>

      {result && (
        <div className="space-y-12 animate-in zoom-in duration-500">
          {/* Summary Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tracking Number</span>
              <div className="text-xl font-black italic">{result.orderId}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Est. Delivery</span>
              <div className="text-xl font-black italic">{result.estimatedDate}</div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shipping Carrier</span>
              <div className="text-xl font-black italic">{result.carrier}</div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-gray-50">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-12">Shipment Timeline</h3>
            
            <div className="space-y-10 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-6 bottom-6 w-1 bg-gray-100 rounded-full"></div>

              {result.history.map((step, idx) => (
                <div key={idx} className="flex gap-10 relative group">
                  {/* Status Circle */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white z-10 transition-all shadow-lg ${getStatusColor(step.status)}`}>
                    <i className={`fa-solid ${getStatusIcon(step.activity.en)}`}></i>
                  </div>
                  
                  {/* Activity Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-black text-sm uppercase tracking-tight ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-900'}`}>
                        {step.activity[lang]}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{step.time}</span>
                    </div>
                    {step.status === 'active' && (
                      <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
                        On the way 🚚
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-gray-50 rounded-[2.5rem]">
            <div className="text-center md:text-left">
              <h4 className="text-sm font-black uppercase tracking-tight">Notification Channels</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Get instant updates via your favorite app</p>
            </div>
            <div className="flex gap-4">
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500 hover:scale-110 transition"><i className="fa-solid fa-envelope"></i></button>
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500 hover:scale-110 transition"><i className="fa-solid fa-message"></i></button>
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#0088cc] hover:scale-110 transition"><i className="fa-brands fa-telegram"></i></button>
              <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#25D366] hover:scale-110 transition"><i className="fa-brands fa-whatsapp"></i></button>
            </div>
          </div>

          {/* Download Invoice / Help */}
          <div className="flex gap-4">
            <button className="flex-1 h-14 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
              <i className="fa-solid fa-file-invoice"></i> Download Invoice
            </button>
            <button className="flex-1 h-14 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
              <i className="fa-solid fa-headset"></i> Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
