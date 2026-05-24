import React from 'react';
import { Settings } from 'lucide-react';

export default function ProductCard({ product, onCustomize }) {
  return (
    <div className="product-card" onClick={onCustomize}>
      <div className="product-img">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <img src={product.image} alt={product.name} />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        
        <div className="product-meta">
          <span className="product-from">From ₹{product.price}</span>
          <div className="product-dots">
            {product.colors.slice(0, 4).map((color, index) => (
              <span 
                key={index} 
                style={{ 
                  backgroundColor: color.value, 
                  border: color.value === '#ffffff' ? '1px solid #ddd' : 'none' 
                }}
              ></span>
            ))}
            {product.colors.length > 4 && <span className="dots-more">+{product.colors.length - 4}</span>}
          </div>
        </div>

        <button 
          className="btn-secondary card-customize-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onCustomize();
          }}
        >
          <Settings size={14} />
          <span>Customize Design</span>
        </button>
      </div>
    </div>
  );
}
