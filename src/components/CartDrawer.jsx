import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal 
  } = useCart();
  
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Background Dim Backdrop */}
      <div 
        className="cart-backdrop" 
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Cart Drawer Panel */}
      <div className={`cart-drawer-panel ${isCartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} />
            <span>Shopping Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
          </div>
          <button 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Contents */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart-view">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Add some custom prints to start your order!</p>
              <button 
                className="btn-secondary" 
                onClick={() => setIsCartOpen(false)}
              >
                Go Back Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedColor.value}-${item.selectedSize}-${index}`} className="cart-item-card">
                  {/* Thumbnail */}
                  <div className="cart-item-img-container" style={{ backgroundColor: item.product.id === 'oversized-drop' ? '#eceae5' : '#ffffff' }}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="cart-item-img" 
                    />
                    {/* Small print overlay preview if custom design logo is present */}
                    {item.customDesignUrl && (
                      <img 
                        src={item.customDesignUrl} 
                        alt="Logo Print" 
                        className="cart-item-logo-overlay" 
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <div className="cart-item-meta">
                      <span className="meta-tag">Color: {item.selectedColor.name}</span>
                      <span className="meta-tag">Size: {item.selectedSize}</span>
                      {item.customDesignName && (
                        <span className="meta-tag custom-design-tag">Custom Logo: {item.customDesignName}</span>
                      )}
                    </div>

                    <div className="cart-item-row">
                      {/* Qty controls */}
                      <div className="qty-controls">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedColor.value, item.selectedSize, item.quantity - 1)}
                          className="qty-control-btn"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.selectedColor.value, item.selectedSize, item.quantity + 1)}
                          className="qty-control-btn"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="cart-item-price">₹{item.product.price * item.quantity}</span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.selectedColor.value, item.selectedSize)}
                    className="cart-item-remove-btn"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer/Checkout */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <span className="subtotal-amount">₹{getCartTotal()}</span>
            </div>
            <p className="shipping-hint">Shipping and printing customized taxes calculated at checkout.</p>
            
            <div className="cart-action-buttons">
              <button 
                className="btn-primary checkout-cta" 
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </button>
              <button 
                className="btn-secondary continue-shopping-btn" 
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
