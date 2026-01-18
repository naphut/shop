import React from 'react';

const FreshApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🚀 Master Shirt Shop
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
        ✅ React is working!
      </p>
      <div style={{
        backgroundColor: '#10b981',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Frontend Status</h2>
        <p>✅ Vite Development Server: Running</p>
        <p>✅ React Component: Mounted</p>
        <p>✅ Browser: Compatible</p>
        <p>✅ URL: http://localhost:3000</p>
      </div>
    </div>
  );
};

export default FreshApp;
