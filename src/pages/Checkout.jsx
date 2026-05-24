import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbycqcEASzRvkDH4NPJeNLhnv-dLpWnuC013bmgvuf7b63AAt0KPCEfJw4fH1-sXPhj9/exec";
const WHATSAPP_PHONE = "916374338510"; // Triweave business contact

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [waRedirectUrl, setWaRedirectUrl] = useState('');

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-empty-container">
        <ShoppingBag size={48} />
        <h2>Your cart is empty</h2>
        <p>Add products to your cart before proceeding to checkout.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Return to Shop</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = "TW-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedOrderId(orderId);

    // Format item details text
    const itemsDetailsText = cart.map(item => {
      let desc = `${item.quantity}x ${item.product.name} (Color: ${item.selectedColor.name}, Size: ${item.selectedSize}`;
      if (item.customDesignName) {
        desc += `, Custom design: ${item.customDesignName}`;
      }
      desc += `)`;
      return desc;
    }).join("\n");

    const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`;

    const payload = {
      type: "order",
      orderId: orderId,
      name: form.name,
      phone: form.phone,
      email: form.email,
      items: itemsDetailsText,
      totalPrice: getCartTotal(),
      shippingAddress: fullAddress
    };

    try {
      // POST order details to Google Sheets Web App URL
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Crucial for CORS bypass with Google Web Apps redirects
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Prepare WhatsApp text
      const waText = `Hi Triweave Print Xpress! 👋\nI just placed an order on your website.\n\n*Order ID:* ${orderId}\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email}\n\n*Order Details:*\n${itemsDetailsText}\n\n*Total Amount:* ₹${getCartTotal()}\n\n*Shipping Address:*\n${fullAddress}\n\nplease share your UPI details to confirm the payment!`;
      
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;
      setWaRedirectUrl(waUrl);

      // Complete checkout state
      setOrderComplete(true);
      clearCart();
      
      // Delay redirection slightly so the user sees the confirmation page, or open immediately in new tab
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1000);

    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Error registering order. Please contact us directly on WhatsApp to finalize your purchase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="checkout-success-container">
        <CheckCircle size={64} className="success-check-icon" />
        <h2>Order Received!</h2>
        <p className="success-order-id">Your Order ID is <strong>{generatedOrderId}</strong></p>
        <p className="success-desc">
          Your order has been recorded in our system. You are being redirected to WhatsApp to complete your payment via UPI QR.
        </p>
        <p className="success-note">
          If the WhatsApp window did not open, click the button below to initiate the chat manually.
        </p>
        <button 
          className="btn-primary whatsapp-chat-btn" 
          onClick={() => {
            if (waRedirectUrl) {
              window.open(waRedirectUrl, "_blank");
            } else {
              const waText = `Hi Triweave! I've placed order #${generatedOrderId}. Please send UPI details.`;
              window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`, "_blank");
            }
          }}
        >
          Open WhatsApp Chat
        </button>
        <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header-row">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} />
          <span>Back to Cart</span>
        </button>
        <h1 className="checkout-page-title">Checkout Details</h1>
      </div>

      <div className="checkout-grid">
        {/* Shipping Form */}
        <form className="checkout-form-pane" onSubmit={handleSubmit}>
          <h2 className="pane-title">Shipping & Contact Info</h2>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Arun Prakash" 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number (WhatsApp)</label>
              <input 
                type="tel" 
                id="phone" 
                value={form.phone} 
                onChange={handleChange} 
                placeholder="93606 89035" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="arun@example.com" 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <input 
              type="text" 
              id="address" 
              value={form.address} 
              onChange={handleChange} 
              placeholder="Door No, Street Name, Locality" 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                value={form.city} 
                onChange={handleChange} 
                placeholder="Chennai" 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input 
                type="text" 
                id="pincode" 
                value={form.pincode} 
                onChange={handleChange} 
                placeholder="600088" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="form-submit checkout-submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Confirm & Pay via WhatsApp →"}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout-summary-pane">
          <h2 className="pane-title">Order Summary</h2>
          <div className="summary-items-list">
            {cart.map((item, index) => (
              <div key={index} className="summary-item-card">
                <div className="summary-item-left">
                  <span className="summary-item-qty">{item.quantity}x</span>
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.product.name}</span>
                    <span className="summary-item-meta">{item.selectedColor.name} / Size: {item.selectedSize}</span>
                  </div>
                </div>
                <span className="summary-item-price">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-calculation">
            <div className="calc-row">
              <span>Items Total:</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className="calc-row">
              <span>Shipping Charge:</span>
              <span className="calc-free">FREE</span>
            </div>
            <div className="calc-row total-row">
              <span>Grand Total:</span>
              <span>₹{getCartTotal()}</span>
            </div>
          </div>
          <div className="checkout-instructions-box">
            <h4>💡 Quick Payment Instruction</h4>
            <p>
              After clicking the confirm button, your order will be logged to our Sheet. You will be redirected to WhatsApp to make your payment and get a receipt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
