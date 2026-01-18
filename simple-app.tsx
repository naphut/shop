import React, { useState, useEffect } from 'react';
import { Language, Currency, ViewState, ThemeColor } from './types';
import { THEMES, PRODUCTS } from './constants';

const SimpleApp: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [view, setView] = useState<ViewState>('home');
  const [theme, setTheme] = useState<ThemeColor>('black');
  const [products, setProducts] = useState(PRODUCTS);

  // Simple useEffect without API calls
  useEffect(() => {
    console.log('Simple App mounted with', PRODUCTS.length, 'products');
  }, []);

  const formatPrice = (usdPrice: number) => {
    const rates: Record<Currency, number> = { [Currency.USD]: 1, [Currency.KHR]: 4100, [Currency.CNY]: 7.2 };
    const converted = usdPrice * rates[currency];
    const symbol = currency === Currency.USD ? '$' : currency === Currency.KHR ? '៛' : '¥';
    return `${symbol} ${converted.toLocaleString()}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${THEMES[theme].bgLight}`}>
      {/* Simple Header */}
      <div style={{ 
        backgroundColor: THEMES[theme].primary, 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          🚀 Master Shirt Shop
        </h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Simple Version - Working Correctly
        </p>
      </div>

      {/* Product Grid */}
      <div style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Featured Products ({products.length})
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {products.slice(0, 6).map((product) => (
            <div key={product.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1f2937', 
                margin: '0 0 10px 0' 
              }}>
                {product.name?.en || 'Classic T-Shirt'}
              </h3>
              <p style={{ 
                color: '#666', 
                marginBottom: '15px',
                lineHeight: '1.5'
              }}>
                {product.description?.en || 'Comfortable cotton t-shirt perfect for everyday wear.'}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#059669' 
                }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  color: '#666' 
                }}>
                  {product.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Footer */}
      <div style={{
        backgroundColor: THEMES[theme].primary,
        color: 'white',
        padding: '40px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 Master Shirt Shop - Simple Version Working
        </p>
      </div>
    </div>
  );
};

export default SimpleApp;
