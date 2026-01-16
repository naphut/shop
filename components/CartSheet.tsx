
import React from 'react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  lang: Language;
  formatPrice: (p: number) => string;
  onCheckout: () => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose, cart, setCart, lang, formatPrice, onCheckout }) => {
  const FREE_SHIPPING_LIMIT = 50;
  const FLAT_SHIPPING_FEE = 10;
  
  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const isFreeShipping = subtotal >= FREE_SHIPPING_LIMIT;
  const shippingCost = cart.length > 0 ? (isFreeShipping ? 0 : FLAT_SHIPPING_FEE) : 0;
  const totalAmount = subtotal + shippingCost;
  
  const progress = Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100);

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) newCart.splice(index, 1);
      return newCart;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 animate-in fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 border-l border-gray-100">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[32px] font-black italic uppercase tracking-tighter leading-none text-black">YOUR BAG</h2>
            <span className="text-[12px] font-black text-white bg-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 hover:rotate-90 transition-all duration-500 group"
          >
            <i className="fa-solid fa-xmark text-2xl text-black group-hover:scale-110"></i>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-8 py-6 space-y-4">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
            <span className={isFreeShipping ? "text-[#00B140]" : "text-gray-400"}>
              {isFreeShipping ? "CONGRATS! YOU GET FREE SHIPPING" : `ADD ${formatPrice(FREE_SHIPPING_LIMIT - subtotal)} FOR FREE SHIPPING`}
            </span>
            <span className="text-black font-black">{Math.round(progress)} %</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-lg ${isFreeShipping ? 'bg-[#00B140]' : 'bg-black'}`} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="w-full h-px bg-gray-50 mt-4 shadow-sm"></div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 hide-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-24 opacity-30">
              <i className="fa-solid fa-bag-shopping text-7xl mb-8 animate-pulse"></i>
              <p className="font-black uppercase tracking-[0.4em] text-sm italic">Your bag is empty</p>
              <button onClick={onClose} className="mt-10 text-[10px] font-black uppercase underline tracking-widest hover:text-black transition-colors">START SHOPPING</button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-8 animate-in slide-in-from-right duration-500 group hover:-translate-y-1 transition-transform">
                <div className="relative w-28 h-32 bg-[#f6f6f6] rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-sm border border-gray-50">
                  <img src={item.customImageUrl || item.product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" alt="" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-[15px] uppercase tracking-tighter leading-tight w-4/5 text-gray-900 italic group-hover:text-black">
                      {item.product.name[lang]}
                    </h3>
                    <button 
                      onClick={() => updateQuantity(idx, -item.quantity)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                  
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg tracking-widest group-hover:bg-gray-200 transition-colors">{item.selectedSize}</span>
                    <span className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg tracking-widest group-hover:bg-gray-200 transition-colors">{item.selectedColor}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl h-10 w-28 overflow-hidden shadow-sm">
                      <button onClick={() => updateQuantity(idx, -1)} className="flex-1 h-full flex items-center justify-center hover:bg-white transition-all"><i className="fa-solid fa-minus text-[8px]"></i></button>
                      <span className="w-8 text-center text-sm font-black italic">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="flex-1 h-full flex items-center justify-center hover:bg-white transition-all"><i className="fa-solid fa-plus text-[8px]"></i></button>
                    </div>
                    
                    <div className="text-[20px] font-black italic tracking-tighter text-black">
                      $ {item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-8 pt-0 bg-white shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.1)] rounded-t-[3rem]">
            <div className="w-full h-px bg-gray-50 mb-10"></div>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-[13px] font-black uppercase tracking-widest text-gray-400 italic">
                <span>SUBTOTAL</span>
                <span className="text-black font-black">$ {subtotal}</span>
              </div>
              <div className="flex justify-between text-[13px] font-black uppercase tracking-widest text-gray-400 italic">
                <span>SHIPPING</span>
                <span className={`font-black ${isFreeShipping ? 'text-[#00B140]' : 'text-black'}`}>{isFreeShipping ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between items-end pt-8 border-t border-gray-50">
                <span className="text-[14px] font-black uppercase italic tracking-tighter text-black">TOTAL AMOUNT</span>
                <span className="text-[64px] font-black tracking-tighter italic leading-[0.6] text-black">$ {totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={onCheckout}
                className="w-full bg-black text-white py-7 rounded-[2rem] font-black text-[16px] uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:bg-gray-900 hover:-translate-y-2 hover:shadow-black/30 active:scale-95 transition-all flex items-center justify-center gap-6 group"
              >
                CHECKOUT NOW
                <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-4 transition-transform duration-500"></i>
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-white text-gray-400 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:text-black hover:bg-gray-50 transition-all hover:scale-105"
              >
                CONTINUE SHOPPING
              </button>
            </div>
            
            {/* Payment Icons */}
            <div className="flex items-center justify-center gap-10 pt-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
              <i className="fa-brands fa-cc-visa text-3xl"></i>
              <i className="fa-brands fa-cc-mastercard text-3xl"></i>
              <i className="fa-brands fa-cc-paypal text-3xl"></i>
              <i className="fa-brands fa-cc-apple-pay text-3xl"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSheet;
