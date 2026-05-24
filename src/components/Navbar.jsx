import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { getCartCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCartOpen = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  return (
    <>
      <nav id="mainNav" className="navbar">
        <Link to="/" className="nav-logo">
          <img 
            src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779181349/logo_resized_ntkzkz.png" 
            alt="Triweave Logo" 
            className="nav-logo-img" 
          />
          <span className="nav-logo-text">TRIWEAVE <span>XPRESS</span></span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li><a href="#products">Products</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <button className="nav-cart-btn" onClick={handleCartOpen} aria-label="Open Shopping Cart">
              <ShoppingBag size={18} />
              {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
            </button>
          </li>
          <li><a href="#contact" className="nav-cta">Get Quote</a></li>
        </ul>

        {/* Mobile Hamburger */}
        <div className="mobile-nav-controls">
          <button className="nav-cart-btn mobile-cart-trigger" onClick={handleCartOpen} aria-label="Open Shopping Cart">
            <ShoppingBag size={18} />
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </button>
          <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      
      {/* Mobile Drawer Menu */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#products" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Products</a>
        <a href="#services" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Services</a>
        <a href="#gallery" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Gallery</a>
        <a href="#contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        <a href="#contact" className="btn-primary mobile-cta-btn" onClick={() => setMobileMenuOpen(false)}>Get a Quote</a>
      </nav>
    </>
  );
}
