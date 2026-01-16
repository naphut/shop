
import React, { useState } from 'react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CheckoutProps {
  lang: Language;
  cart: CartItem[];
  formatPrice: (p: number) => string;
  onSuccess: (orderData: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ lang, cart, formatPrice, onSuccess }) => {
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState(1); 
  const [paymentMethod, setPaymentMethod] = useState<'aba' | 'wing' | 'paypal'>('aba');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    phone: '', 
    city: 'Phnom Penh',
    zip: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingFee = shippingMethod === 'express' ? 15 : (subtotal > 50 ? 0 : 5);
  const total = subtotal + shippingFee;

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (step < 5) setStep(step + 1);
    else onSuccess(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const steps = [
    { id: 1, label: 'BAG' },
    { id: 2, label: 'ADDRESS' },
    { id: 3, label: 'METHOD' },
    { id: 4, label: 'REVIEW' },
    { id: 5, label: 'PAYMENT' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-20 space-y-4">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-black">
          FINAL CURATION.
        </h1>
        <p className="text-gray-400 font-bold uppercase text-[11px] tracking-[0.4em]">Review and secure your premium selection</p>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-24 max-w-3xl mx-auto px-4 overflow-x-auto hide-scrollbar">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-4 shrink-0 group">
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-[14px] transition-all duration-500 border-2 ${
                  step === s.id 
                    ? 'bg-black text-white border-black shadow-2xl scale-125' 
                    : step > s.id 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white text-gray-200 border-gray-100'
                }`}
              >
                {step > s.id ? <i className="fa-solid fa-check"></i> : s.id}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${step >= s.id ? 'text-black' : 'text-gray-300'}`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 min-w-[30px] h-0.5 mx-4 transition-colors duration-700 mb-9 ${step > s.id ? 'bg-green-500' : 'bg-gray-100'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-20">
        <div className="flex-1">
          <form onSubmit={handleNext} className="space-y-12">
            
            {step === 1 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left duration-500">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">01. Review Selection</h2>
                <div className="space-y-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-10 p-8 bg-white rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                      <div className="w-32 h-40 bg-gray-50 rounded-[2rem] overflow-hidden shadow-inner flex-shrink-0 border border-gray-50">
                        <img src={item.customImageUrl || item.product.image} className="w-full h-full object-cover transition-transform group-hover:scale-125 duration-1000" alt="" />
                      </div>
                      <div className="flex-1 py-4 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{item.product.brand}</div>
                          <h4 className="font-black text-2xl uppercase italic tracking-tighter group-hover:text-black transition-colors">{item.product.name[lang]}</h4>
                          <div className="flex gap-4 mt-3">
                            <span className="text-[11px] font-black bg-gray-50 px-4 py-1 rounded-lg uppercase tracking-widest border border-gray-100">{item.selectedSize}</span>
                            <span className="text-[11px] font-black bg-gray-50 px-4 py-1 rounded-lg uppercase tracking-widest border border-gray-100">{item.selectedColor}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-[12px] font-black italic text-gray-400">QTY: {item.quantity}</span>
                          <span className="text-3xl font-black italic tracking-tighter">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left duration-500">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">02. Destination</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-[11px] font-black uppercase text-gray-400 ml-4 tracking-[0.3em]">Full Name</label>
                    <input required type="text" className="w-full px-10 h-18 py-6 rounded-3xl border-2 border-gray-50 focus:border-black outline-none transition-all font-bold text-[16px] bg-gray-50/50 focus:bg-white focus:shadow-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Master Curation" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black uppercase text-gray-400 ml-4 tracking-[0.3em]">Email</label>
                    <input required type="email" className="w-full px-10 h-18 py-6 rounded-3xl border-2 border-gray-50 focus:border-black outline-none transition-all font-bold text-[16px] bg-gray-50/50 focus:bg-white focus:shadow-2xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="curator@master.com" />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black uppercase text-gray-400 ml-4 tracking-[0.3em]">Contact Phone</label>
                    <input required type="tel" className="w-full px-10 h-18 py-6 rounded-3xl border-2 border-gray-50 focus:border-black outline-none transition-all font-bold text-[16px] bg-gray-50/50 focus:bg-white focus:shadow-2xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+855 ..." />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="block text-[11px] font-black uppercase text-gray-400 ml-4 tracking-[0.3em]">Delivery Address</label>
                    <textarea required className="w-full px-10 py-8 rounded-[2.5rem] border-2 border-gray-50 focus:border-black outline-none transition-all font-bold text-[16px] resize-none bg-gray-50/50 focus:bg-white focus:shadow-2xl" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="St. 271, No. 42B..." />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left duration-500">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">03. Transit Logic</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { id: 'standard', title: 'Standard', time: '3-5 DAYS', price: subtotal > 50 ? 0 : 5, icon: 'fa-truck' },
                    { id: 'express', title: 'Express', time: '1-2 DAYS', price: 15, icon: 'fa-bolt' }
                  ].map((m) => (
                    <button 
                      key={m.id} type="button" onClick={() => setShippingMethod(m.id as any)}
                      className={`p-10 border-2 rounded-[3.5rem] text-left transition-all relative group overflow-hidden ${shippingMethod === m.id ? 'border-black bg-white shadow-2xl scale-[1.02]' : 'border-gray-100 hover:border-black/20 bg-gray-50/50'}`}
                    >
                      <div className="flex justify-between items-start mb-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${shippingMethod === m.id ? 'bg-black text-white' : 'bg-white text-gray-200'}`}>
                          <i className={`fa-solid ${m.icon}`}></i>
                        </div>
                        <div className="text-3xl font-black italic tracking-tighter">{m.price === 0 ? 'FREE' : formatPrice(m.price)}</div>
                      </div>
                      <h4 className="font-black text-2xl uppercase italic tracking-tighter mb-2">{m.title}</h4>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">{m.time} ARRIVAL</p>
                      {shippingMethod === m.id && (
                        <div className="absolute top-6 right-6 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[12px] shadow-lg animate-in zoom-in">
                           <i className="fa-solid fa-check"></i>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left duration-500">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">04. Final Review</h2>
                <div className="space-y-8 bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black uppercase text-white/30 tracking-[0.4em]">SHIP TO</h4>
                      <div className="text-2xl font-black italic uppercase leading-[1.1] tracking-tighter">
                        {formData.name}<br/>
                        <span className="text-white/60 text-lg">{formData.address}</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-black uppercase text-white/30 tracking-[0.4em]">METHOD</h4>
                      <div className="text-2xl font-black italic uppercase tracking-tighter">
                        {shippingMethod.toUpperCase()} DELIVERY<br/>
                        <span className="text-white/60 text-lg">Expected in {shippingMethod === 'express' ? '2' : '5'} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 border-t border-white/10 relative z-10">
                    <h4 className="text-[11px] font-black uppercase text-white/30 tracking-[0.4em] mb-8">ITEMIZED PIECES</h4>
                    <div className="space-y-6">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                          <span className="opacity-60">{item.quantity}x {item.product.name[lang]}</span>
                          <span className="font-black italic text-lg">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left duration-500">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase">05. Secure Node</h2>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { id: 'aba', name: 'ABA Pay', sub: 'Instant QR Scan', icon: 'fa-qrcode', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                    { id: 'wing', name: 'Wing Money', sub: 'E-Wallet Transfer', icon: 'fa-mobile-screen', color: 'text-green-500', bg: 'bg-green-50' },
                    { id: 'paypal', name: 'PayPal Global', sub: 'Debit / Credit Card', icon: 'fa-brands fa-paypal', color: 'text-indigo-500', bg: 'bg-indigo-50' }
                  ].map((method) => (
                    <button 
                      key={method.id} type="button" onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-10 border-2 rounded-[3.5rem] flex items-center justify-between transition-all group ${paymentMethod === method.id ? 'border-black bg-white shadow-2xl scale-[1.03] ring-4 ring-black/5' : 'border-gray-50 hover:border-black/10 bg-gray-50/50'}`}
                    >
                      <div className="flex items-center gap-10">
                        <div className={`w-20 h-20 ${method.bg} ${method.color} rounded-3xl flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition duration-700`}>
                          <i className={`fa-solid ${method.icon}`}></i>
                        </div>
                        <div className="text-left">
                          <div className="font-black text-2xl italic tracking-tighter uppercase group-hover:text-black transition-colors">{method.name}</div>
                          <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">{method.sub}</div>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method.id ? 'bg-black border-black text-white shadow-lg' : 'border-gray-200'}`}>
                        {paymentMethod === method.id && <i className="fa-solid fa-check text-[12px]"></i>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-8 pt-12">
              {step > 1 && (
                <button 
                  type="button" onClick={handleBack}
                  className="px-16 py-8 border-2 border-black rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-black hover:text-white hover:shadow-2xl hover:-translate-y-2 transition-all active:scale-95"
                >
                  PREVIOUS
                </button>
              )}
              <button 
                type="submit"
                className="flex-1 bg-black text-white py-8 rounded-[2.5rem] font-black text-xl uppercase italic tracking-widest shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-black/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 group"
              >
                {step === 5 ? `SECURE PAYMENT ${formatPrice(total)}` : 'NEXT SEQUENCE'}
                <i className="fa-solid fa-arrow-right text-[14px] group-hover:translate-x-4 transition-transform duration-500"></i>
              </button>
            </div>
          </form>
        </div>

        <div className="w-full xl:w-[500px]">
          <div className="sticky top-32 bg-white p-14 rounded-[4rem] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-12">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Order Logic</h3>
            
            <div className="space-y-8">
               <div className="flex justify-between items-center group">
                 <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-black transition-colors">SUBTOTAL</span>
                 <span className="text-2xl font-black italic tracking-tighter">{formatPrice(subtotal)}</span>
               </div>
               <div className="flex justify-between items-center group">
                 <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-black transition-colors">TRANSIT</span>
                 <span className={`text-2xl font-black italic tracking-tighter ${shippingFee === 0 ? 'text-green-500' : 'text-black'}`}>
                   {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                 </span>
               </div>
               <div className="pt-12 border-t border-gray-100 flex justify-between items-end">
                 <span className="text-[15px] font-black text-gray-900 uppercase tracking-tighter italic">TOTAL AMOUNT</span>
                 <span className="text-[84px] font-black tracking-tighter italic leading-[0.5] text-black drop-shadow-sm price-number">{formatPrice(total)}</span>
               </div>
            </div>

            <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-6">
              <div className="flex items-center gap-5 text-[12px] font-black uppercase text-black tracking-widest">
                <i className="fa-solid fa-shield-halved text-2xl"></i>
                Secure Processing
              </div>
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed uppercase tracking-[0.1em] opacity-80">
                Data is Curated via 256-bit SSL encryption. We do not store sensitive payment metadata.
              </p>
            </div>
            
            <div className="pt-4 flex items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
               <i className="fa-brands fa-cc-visa text-3xl"></i>
               <i className="fa-brands fa-cc-mastercard text-3xl"></i>
               <i className="fa-brands fa-cc-apple-pay text-3xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
