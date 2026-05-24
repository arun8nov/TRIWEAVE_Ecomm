import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { Upload, ShoppingBag, Check } from 'lucide-react';

export default function TShirtCustomizer({ activeProduct }) {
  const { addToCart } = useCart();
  const currentProduct = activeProduct || products[0];

  // Customizer state
  const [selectedColor, setSelectedColor] = useState(currentProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  // Sync state if activeProduct changes
  useEffect(() => {
    if (currentProduct) {
      setSelectedColor(currentProduct.colors[0]);
      setSelectedSize(currentProduct.sizes[0] || 'M');
      setQuantity(1);
    }
  }, [currentProduct]);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [customLogoUrl, setCustomLogoUrl] = useState(
    'https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779181349/logo_resized_ntkzkz.png'
  );
  const fileInputRef = useRef(null);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogoUrl(event.target.result);
        setUploadedLogo({
          name: file.name,
          url: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity, selectedColor, selectedSize, uploadedLogo);
    alert(`Successfully added ${quantity}x Custom ${currentProduct.name} (${selectedColor.name}, Size: ${selectedSize}) to your cart!`);
  };

  return (
    <div className="customizer-container">
      {/* Visualizer Column */}
      <div className="customizer-visual-pane">
        <div className="orbit-ring"></div>
        <div className="glow-ring"></div>
        <div className="tshirt-aura"></div>
        
        <div className="tshirt-wrapper">
          <svg className="tshirt-3d" id="tshirtSvg" viewBox="0 0 240 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="120" cy="252" rx="72" ry="6" fill="rgba(0,0,0,0.10)"/>
            {/* Main shirt body with dynamic fill and stroke */}
            <path 
              id="shirtBody" 
              d="M60 52 L20 88 L44 108 L44 240 L196 240 L196 108 L220 88 L180 52 C180 52 165 76 120 76 C75 76 60 52 60 52 Z" 
              fill={selectedColor.value} 
              stroke={selectedColor.stroke} 
              strokeWidth="1.5"
              style={{ transition: 'fill 0.4s ease, stroke 0.4s ease' }}
            />
            {/* Neck details */}
            <path d="M92 52 Q120 80 148 52" fill="none" stroke="#ccc" strokeWidth="2"/>
            <path d="M92 52 Q120 68 148 52" fill="rgba(0,0,0,0.04)"/>
            {/* Sleeve hems */}
            <path d="M60 52 L20 88 L44 108 L60 92 Z" fill={selectedColor.value === '#ffffff' ? '#f0f0f0' : 'rgba(0,0,0,0.06)'} stroke={selectedColor.stroke} strokeWidth="1"/>
            <path d="M180 52 L220 88 L196 108 L180 92 Z" fill={selectedColor.value === '#ffffff' ? '#f0f0f0' : 'rgba(0,0,0,0.06)'} stroke={selectedColor.stroke} strokeWidth="1"/>
            
            {/* Shadow fold lines */}
            <line x1="52" y1="62" x2="32" y2="96" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
            <line x1="188" y1="62" x2="208" y2="96" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
            
            {/* Print Guidelines */}
            <rect id="printArea" x="72" y="105" width="96" height="80" rx="4" fill="rgba(0,0,0,0.02)" stroke="rgba(0,151,178,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
            
            {/* Custom Design Image overlay */}
            <g id="shirtPrint">
              {customLogoUrl && (
                <image 
                  href={customLogoUrl} 
                  x="85" 
                  y="110" 
                  width="70" 
                  height="70" 
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </g>
            <line x1="120" y1="76" x2="120" y2="240" stroke="rgba(0,0,0,0.03)" strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="44" y1="108" x2="196" y2="108" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
            <line x1="44" y1="235" x2="196" y2="235" stroke="rgba(0,0,0,0.05)" strokeWidth="1"/>
          </svg>

          {/* Hologram callouts */}
          <div className="tshirt-callout c1">DTF Color Print</div>
          <div className="tshirt-callout c2">200 GSM Cotton</div>
          <div className="tshirt-callout c3">Double Stitched</div>
          <div className="tshirt-callout c-left" style={{ top: '40%', left: '-120px' }}>Custom Design</div>
        </div>

        {/* Floating details */}
        <div className="float-badge fb1">✦ Premium Cotton</div>
        <div className="float-badge fb2">Wash Proof ✓</div>
        <div className="float-badge fb3">Design Preview</div>
      </div>

      {/* Editor Panel Column */}
      <div className="customizer-options-pane">
        <span className="section-label">// Live Customizer</span>
        <h2 className="customizer-title">Design Your Tee.</h2>
        <p className="customizer-desc">
          Choose a fabric color, upload your logo or graphics, select size, and customize in real time. We print custom orders starting from just 1 piece!
        </p>

        {/* Color Switcher */}
        <div className="config-section">
          <label className="config-label">1. Choose Fabric Color: <span>{selectedColor.name}</span></label>
          <div className="customizer-colors">
            {currentProduct.colors.map((color) => (
              <button
                key={color.name}
                className={`color-dot-btn ${selectedColor.name === color.name ? 'active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color)}
                title={color.name}
              >
                {selectedColor.name === color.name && (
                  <Check className="check-icon" style={{ stroke: color.value === '#ffffff' ? '#000' : '#fff' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logo Uploader */}
        <div className="config-section">
          <label className="config-label">2. Upload Your Graphics / Logo:</label>
          <div className="logo-upload-box" onClick={triggerFileInput}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleLogoUpload} 
            />
            <Upload className="upload-icon" />
            <div className="upload-text">
              {uploadedLogo ? (
                <span className="file-name">{uploadedLogo.name} (Uploaded)</span>
              ) : (
                <span>Click to Upload JPG/PNG Artwork</span>
              )}
            </div>
            <p className="upload-note">Transparent background PNG works best for previews</p>
          </div>
        </div>

        {/* Size Selection */}
        <div className="config-section">
          <label className="config-label">3. Select Size:</label>
          <div className="size-selector">
            {currentProduct.sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selection & Add to Cart */}
        <div className="config-section checkout-block">
          <div className="qty-row">
            <label className="config-label">4. Quantity:</label>
            <div className="qty-counter">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
              <span className="qty-number">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="qty-btn">+</button>
            </div>
          </div>

          <div className="price-tag-row">
            <span className="price-label">Price per unit:</span>
            <span className="price-val">₹{currentProduct.price}</span>
          </div>

          <button className="btn-primary add-to-cart-cta" onClick={handleAddToCart}>
            <ShoppingBag size={16} />
            <span>Add Custom Design to Cart — ₹{currentProduct.price * quantity}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
