
import React, { useState } from 'react';

interface Props {
  onLogin: (pass: string) => void;
  onCancel: () => void;
}

const AdminLoginView: React.FC<Props> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative AI Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl relative z-10 animate-in zoom-in duration-700">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-2xl shadow-indigo-600/40 mb-8 rotate-3">
             <i className="fa-solid fa-terminal"></i>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white mb-2">Master Admin</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Authorized Personnel Only</p>
        </div>

        <form 
          className="space-y-8"
          onSubmit={(e) => { e.preventDefault(); onLogin(password); }}
        >
          <div className="space-y-4">
             <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Terminal Password</label>
             <div className="relative">
                <i className="fa-solid fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="password" 
                  autoFocus
                  required
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl px-14 py-5 text-white font-bold outline-none focus:border-indigo-600 focus:shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Access Management Node
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Return to Public Storefront
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
           <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 border-t border-slate-800 pt-8">
             Secured via 256-bit Neural Encryption
           </div>
        </div>
      </div>
      
      <div className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-700 italic">
        Dev Note: Pass is admin123
      </div>
    </div>
  );
};

export default AdminLoginView;
