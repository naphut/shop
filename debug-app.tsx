import React, { useState, useEffect } from 'react';
import apiService from './services/apiService';

const DebugApp: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch products...');
        
        const res = await apiService.getProducts();
        console.log('API Response:', res);
        console.log('Response data:', res.data);
        
        const productsData = res.data.data || res.data;
        console.log('Products data:', productsData);
        
        if (!Array.isArray(productsData)) {
          throw new Error('Products data is not an array');
        }
        
        setProducts(productsData);
        setLoading(false);
        console.log('Products loaded successfully:', productsData.length);
        
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Master Shirt Shop...</h2>
        <div style={{ fontSize: '18px', color: '#666' }}>Please wait...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Error Loading Products</h2>
        <p style={{ fontSize: '16px', color: '#666' }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Master Shirt Shop - Debug Mode</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Products loaded: {products.length}</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              {typeof product.name_json === 'string' ? JSON.parse(product.name_json).en : product.name_json?.en || 'Unknown Product'}
            </h3>
            <p style={{ color: '#666', margin: '0 0 10px 0' }}>
              {typeof product.description_json === 'string' ? JSON.parse(product.description_json).en : product.description_json?.en || 'No description'}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Category: {product.category_name || 'Unknown'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugApp;
