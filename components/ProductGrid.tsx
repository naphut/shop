
import React from 'react';
import { Product, Language } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  lang: Language;
  formatPrice: (p: number) => string;
  onAddToCart: (p: Product, color: string, size: string, quantity?: number) => void;
  onQuickView?: (p: Product) => void;
  onOpenCustomizer?: (p: Product) => void;
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, lang, formatPrice, onAddToCart, onQuickView, onOpenCustomizer, wishlist, onToggleWishlist 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          lang={lang} 
          formatPrice={formatPrice}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          onOpenCustomizer={onOpenCustomizer}
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
