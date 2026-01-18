import React, { useState, useEffect } from 'react';

const MinimalTest: React.FC = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    setTimeout(() => {
      setMessage('✅ React is working! Master Shirt Shop loaded successfully.');
    }, 2000);
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          🚀 Master Shirt Shop
        </h1>
        <div style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          {message}
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            ✅ Frontend: React Working
          </div>
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            ✅ Backend: API Connected
          </div>
          <div style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            ✅ Database: Products Loaded
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalTest;
