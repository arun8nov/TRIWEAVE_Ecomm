import React, { useState, useRef, useEffect } from 'react';
import TShirtCustomizer from '../components/TShirtCustomizer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { fallbackGallery } from '../data/gallery';
import { Mail, Phone, MapPin, Clock, ArrowRight, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbycqcEASzRvkDH4NPJeNLhnv-dLpWnuC013bmgvuf7b63AAt0KPCEfJw4fH1-sXPhj9/exec";

export default function Home() {
  const customizerRef = useRef(null);
  const [activeProduct, setActiveProduct] = useState(products[0]);

  // Gallery state & fetch
  const [galleryData, setGalleryData] = useState(fallbackGallery);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(APPS_SCRIPT_URL);
        const data = await response.json();
        if (Array.isArray(data)) {
          const formatted = data.map(item => ({
            id: item.id || Math.random(),
            title: item.title || "Custom Printed Tee",
            category: item.category || "tees",
            printMethod: item.printMethod || "DTF Print",
            url: item.url
          })).filter(item => item.url);
          
          if (formatted.length > 0) {
            setGalleryData(formatted);
          }
        }
      } catch (error) {
        console.log("Could not fetch Google Sheet gallery, using local fallbacks.", error);
      }
    };
    fetchGallery();
  }, []);

  const filteredGallery = selectedFilter === "all" 
    ? galleryData 
    : galleryData.filter(item => item.category === selectedFilter);

  // Lightbox navigation handlers
  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setActiveLightboxIndex((prev) => (prev === filteredGallery.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setActiveLightboxIndex((prev) => (prev === 0 ? filteredGallery.length - 1 : prev - 1));
  };

  const handleOrderSimilar = (item) => {
    let serviceChoice = "";
    if (item.category === "tees") serviceChoice = "Classic Crew Neck";
    else if (item.category === "polos") serviceChoice = "Polo Shirt";
    else if (item.category === "hoodies") serviceChoice = "Premium Street Hoodie";

    setLeadForm(prev => ({
      ...prev,
      service: serviceChoice,
      msg: `Hi! I saw the "${item.title}" in your gallery and I would like to get a quote for a similar design. Please share details.`
    }));

    setActiveLightboxIndex(null);
    const contactSec = document.getElementById("contact");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Keyboard support for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, filteredGallery]);

  // Unique Categories Calculator
  const uniqueCategories = ["all", ...new Set(galleryData.map(item => item.category).filter(Boolean))];

  const getCategoryLabel = (cat) => {
    const labels = {
      all: "All Work",
      tees: "Custom Tees",
      polos: "Corporate Polos",
      hoodies: "Streetwear Hoodies",
      kids: "Kids Wear",
      womens: "Womens Fitted",
    };
    return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    qty: '',
    msg: ''
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleCustomizeProduct = (product) => {
    setActiveProduct(product);
    if (customizerRef.current) {
      customizerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLeadChange = (e) => {
    const { id, value } = e.target;
    setLeadForm(prev => ({ ...prev, [id]: value }));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    setLeadSuccess(false);

    const payload = {
      type: "lead",
      name: leadForm.name,
      phone: leadForm.phone,
      email: leadForm.email,
      service: leadForm.service || "General Inquiry",
      quantity: leadForm.qty ? parseInt(leadForm.qty) : 0,
      message: leadForm.msg
    };

    try {
      // Direct POST to Google Sheets Apps Script Web App
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script Web App redirects
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Since mode: "no-cors" doesn't return response body, we assume success if no error is thrown
      setLeadSuccess(true);
      setLeadForm({
        name: '',
        phone: '',
        email: '',
        service: '',
        qty: '',
        msg: ''
      });
    } catch (error) {
      console.error("Lead submission error:", error);
      alert("Failed to submit inquiry. Please try again or contact us directly on WhatsApp.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="home-container">
      {/* ── HERO BANNER ── */}
      <section id="hero">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        <div className="scan-line"></div>
        
        {/* Blueprint Coordinates */}
        <div className="tech-coord">[ 13.0827° N, 80.2707° E ] · CHENNAI PRECISION · DTF REGISTERED</div>
        
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">Wear Your Story · Chennai</div>
            <h1 className="hero-title">
              <span className="line"><span className="line-inner">YOUR</span></span>
              <span className="line"><span className="line-inner">DESIGN.</span></span>
              <span className="line"><span className="line-inner">PERFECTLY</span></span>
              <span className="line"><span className="line-inner highlighted-text">PRINTED.</span></span>
            </h1>
            <p className="hero-sub">
              From concept to wearable art. Custom t-shirts printed with precision for individuals, teams, fests & corporate branding. Wash-safe, vibrant inks.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">DTF Print</span>
              <span className="hero-tag">Screen Print</span>
              <span className="hero-tag">Bulk Orders</span>
              <span className="hero-tag">MOQ: 1 Piece</span>
              <span className="hero-tag">24H Samples</span>
            </div>
            <div className="hero-actions">
              <button onClick={() => handleCustomizeProduct(products[0])} className="btn-primary">
                → Design Now
              </button>
              <a href="#products" className="btn-secondary">Explore Products</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="collage-stage">
              {/* Grid Background Effect */}
              <div className="collage-grid-bg"></div>

              {/* Card 1: Streetwear Hoodie (Back Left-Top Layer) */}
              <div className="collage-card card-hoodies">
                <span className="collage-badge">Hoodies</span>
                <div className="collage-card-inner">
                  <img src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779279050/Untitled_design_4_1_yedbef.png" alt="Custom printed fleece hoodie" />
                </div>
              </div>

              {/* Card 2: Raudhram Tamil Tee (Back Left-Bottom Layer) */}
              <div className="collage-card card-tees-black">
                <span className="collage-badge">Tamil Tee</span>
                <div className="collage-card-inner">
                  <img src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779273834/Frame_2_1_x5oyfx.png" alt="Raudhram Classic Tamil Tee" />
                </div>
              </div>

              {/* Card 3: Corporate Polo (Back Right-Top Layer) */}
              <div className="collage-card card-polos">
                <span className="collage-badge">Corporate Polo</span>
                <div className="collage-card-inner">
                  <img src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779273689/Frame_3_1_uhohia.png" alt="Embroidered corporate polo" />
                </div>
              </div>

              {/* Card 4: Sunset Yellow Polo (Back Right-Bottom Layer) */}
              <div className="collage-card card-polos-yellow">
                <span className="collage-badge">Ribbed Polo</span>
                <div className="collage-card-inner">
                  <img src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779278522/Untitled_design_3_1_fdagwj.png" alt="Sunset Yellow Ribbed Polo" />
                </div>
              </div>

              {/* Card 5: Custom Graphic Tee (Front Focal Layer with Laser Scan Reveal) */}
              <div className="collage-card card-tees">
                <span className="collage-badge accent">Custom Tees</span>
                <div className="collage-card-inner tee-scanner-box">
                  {/* Glowing Laser Sweep Beam */}
                  <div className="laser-beam">
                    <div className="laser-glow"></div>
                  </div>
                  
                  {/* Underlay: Holographic wireframe/blueprint version of the shirt */}
                  <img className="tee-img tee-holo" src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779270075/Frame_1_1_mcrxjx.png" alt="Holographic Tee Blueprint" />
                  
                  {/* Overlay: Full color printed product, clipped by the scanner keyframes */}
                  <div className="tee-print-overlay">
                    <img className="tee-img tee-printed" src="https://res.cloudinary.com/dpaxjxw3z/image/upload/q_auto/f_auto/v1779270075/Frame_1_1_mcrxjx.png" alt="Finished Printed Tee" />
                  </div>
                </div>
              </div>

              {/* Decorative Tech Rings */}
              <div className="tech-ring tr1"></div>
              <div className="tech-ring tr2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER MARQUEE ── */}
      <div className="ticker">
        <div className="ticker-inner">
          <span className="ticker-item">YOUR DESIGN<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">DTF PRINTING<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">SCREEN PRINTING<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">BULK ORDERS<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">CUSTOM DESIGNS<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">FAST DELIVERY<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">MOQ 1 PIECE<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">YOUR DESIGN<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">DTF PRINTING<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">SCREEN PRINTING<span className="ticker-dot">◆</span></span>
          <span className="ticker-item">BULK ORDERS<span className="ticker-dot">◆</span></span>
        </div>
      </div>

      {/* ── CUSTOMIZER SECTION ── */}
      <section id="customizer" ref={customizerRef} style={{ borderTop: '1px solid var(--border)', padding: '100px 5vw' }}>
        <TShirtCustomizer activeProduct={activeProduct} />
      </section>

      {/* ── PRODUCTS SECTION ── */}
      <section id="products">
        <div className="products-header">
          <div>
            <div className="section-label">// 01 — Products</div>
            <h2 className="section-title">Shop The Catalog.</h2>
          </div>
          <button onClick={() => handleCustomizeProduct(products[0])} className="btn-secondary">Custom Design Visualizer →</button>
        </div>
        
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onCustomize={() => handleCustomizeProduct(product)} 
            />
          ))}
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section id="services">
        <div>
          <div className="section-label">// 02 — Services</div>
          <h2 className="section-title">How We Print.</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🖨️</div>
            <h3 className="service-name">DTF PRINTING</h3>
            <p className="service-desc">Direct-to-Film transfers for vivid, durable full-color prints on any fabric. Perfect for highly detailed or photographic designs.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎨</div>
            <h3 className="service-name">SCREEN PRINTING</h3>
            <p className="service-desc">Classic silkscreen method for bulk orders. Extremely cost-effective and long-lasting for simple to multi-color vector designs.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">📦</div>
            <h3 className="service-name">BULK ORDERS</h3>
            <p className="service-desc">From 10 to 10,000 pieces. Corporate events, uniforms, college fests, and sports clubs—we handle volume scaling easily.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">✏️</div>
            <h3 className="service-name">CUSTOM ARTWORK</h3>
            <p className="service-desc">Don't have print-ready graphics? Our team offers custom layout touch-ups and vector tracing free with orders.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">👕</div>
            <h3 className="service-name">GARMENT SUPPLY</h3>
            <p className="service-desc">We source high-grade apparel—round necks, polos, drop-shoulders, and warm winter fleece hoodies—in bulk sizes.</p>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about">
        <div className="about-text">
          <div className="section-label">// 03 — About</div>
          <h2 className="section-title">We Print Your<br/>Vision.</h2>
          <p>Triweave Print Xpress is a Chennai-based custom printing studio bringing your designs to life on premium garments. From a single custom piece to thousands of bulk tees — we handle it all.</p>
          <p>Every product leaves our studio with precision printing, vibrant colors, and wearability that lasts. We're not just printers — we're your production partner.</p>
          <p style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '1rem' }}>
            Adampakkam, Chennai · Active & delivering citywide.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat-box"><span className="stat-num">500+</span><span class="stat-label">Orders Delivered</span></div>
          <div className="stat-box"><span className="stat-num">4+</span><span class="stat-label">Print Methods</span></div>
          <div className="stat-box"><span className="stat-num">24H</span><span class="stat-label">Sample Turnaround</span></div>
          <div className="stat-box"><span className="stat-num">1</span><span class="stat-label">Min. Order Qty</span></div>
        </div>
      </section>

      {/* ── GALLERY SECTION ── */}
      <section id="gallery">
        <div className="gallery-header-container">
          <div className="gallery-header">
            <div>
              <div className="section-label">// 04 — Gallery</div>
              <h2 className="section-title">Our Work.</h2>
            </div>
          </div>
          
          {/* Dynamic Category Filter Tabs */}
          <div className="gallery-filters">
            {uniqueCategories.map((category) => (
              <button 
                key={category}
                className={`filter-tab-btn ${selectedFilter === category ? "active" : ""}`}
                onClick={() => setSelectedFilter(category)}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-grid">
          {filteredGallery.map((item, index) => (
            <div 
              key={item.id || index} 
              className="g-item fade-in-scale"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setActiveLightboxIndex(index)}
              title="Click to zoom view"
            >
              <img src={item.url} alt={item.title} loading="lazy" />
              <div className="g-item-overlay">
                <div className="g-overlay-details">
                  <span className="g-overlay-method">{item.printMethod}</span>
                  <h4 className="g-overlay-title">{item.title}</h4>
                  <span className="g-overlay-link">Zoom View 🔍</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY LIGHTBOX MODAL ── */}
      {activeLightboxIndex !== null && filteredGallery[activeLightboxIndex] && (
        <div className="lightbox-overlay" onClick={() => setActiveLightboxIndex(null)}>
          <button 
            className="lightbox-close-btn" 
            onClick={() => setActiveLightboxIndex(null)}
            aria-label="Close Lightbox"
          >
            <X size={28} />
          </button>
          
          <button 
            className="lightbox-nav-btn prev" 
            onClick={handlePrevImage}
            aria-label="Previous Image"
          >
            <ChevronLeft size={36} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img-wrapper">
              <img 
                src={filteredGallery[activeLightboxIndex].url} 
                alt={filteredGallery[activeLightboxIndex].title} 
                className="lightbox-img"
              />
            </div>
            <div className="lightbox-caption">
              <div className="lightbox-meta">
                <span className="lightbox-method">{filteredGallery[activeLightboxIndex].printMethod}</span>
                <span className="lightbox-category-badge">{getCategoryLabel(filteredGallery[activeLightboxIndex].category)}</span>
              </div>
              <h3 className="lightbox-title">{filteredGallery[activeLightboxIndex].title}</h3>
              <button 
                className="btn-primary lightbox-order-btn"
                onClick={() => handleOrderSimilar(filteredGallery[activeLightboxIndex])}
              >
                Order Similar Design
              </button>
            </div>
          </div>
          
          <button 
            className="lightbox-nav-btn next" 
            onClick={handleNextImage}
            aria-label="Next Image"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}

      {/* ── CONTACT SECTION ── */}
      <section id="contact">
        <div>
          <div className="section-label">// 05 — Contact</div>
          <h2 className="section-title">Let's Get in Touch.</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><Phone size={18} /></div>
              <div>
                <div className="contact-item-label">Phone Support</div>
                <div className="contact-item-value">
                  <a href="tel:+916374338510">+91 63743 38510</a><br/>
                  <a href="tel:+919360689035">+91 93606 89035</a>
                </div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><Mail size={18} /></div>
              <div>
                <div className="contact-item-label">Email</div>
                <div className="contact-item-value">
                  <a href="mailto:Triweave35@gmail.com">Triweave35@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><MapPin size={18} /></div>
              <div>
                <div className="contact-item-label">Studio Address</div>
                <div className="contact-item-value">
                  5, 2nd Street, Balakrishnapuram,<br/>
                  Adampakkam, Chennai, Tamilnadu - 600088
                </div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><Clock size={18} /></div>
              <div>
                <div className="contact-item-label">Working Hours</div>
                <div className="contact-item-value">
                  Mon – Sat: 9:00 AM – 7:00 PM<br/>
                  Sunday: By Appointment
                </div>
              </div>
            </div>
          </div>

          {/* Lead Submission Form */}
          <form className="contact-form" onSubmit={handleLeadSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={leadForm.name}
                  onChange={handleLeadChange}
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  value={leadForm.phone}
                  onChange={handleLeadChange}
                  placeholder="+91 98765 43210" 
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={leadForm.email}
                onChange={handleLeadChange}
                placeholder="john@example.com" 
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="service">Product / Service Choice</label>
                <select 
                  id="service"
                  value={leadForm.service}
                  onChange={handleLeadChange}
                >
                  <option value="">Select Option...</option>
                  <option value="Classic Crew Neck">Classic Crew Neck</option>
                  <option value="Event Tee">Event Tee</option>
                  <option value="Polo Shirt">Polo Shirt</option>
                  <option value="Oversized Drop Shoulder">Oversized Drop Shoulder</option>
                  <option value="Premium Street Hoodie">Premium Street Hoodie</option>
                  <option value="DTF Printing Service">DTF Printing Service</option>
                  <option value="Bulk Order Inquiry">Bulk Order Inquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="qty">Estimated Quantity</label>
                <input 
                  type="number" 
                  id="qty" 
                  value={leadForm.qty}
                  onChange={handleLeadChange}
                  placeholder="e.g. 50" 
                  min="1" 
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="msg">Message / Requirements</label>
              <textarea 
                id="msg" 
                rows="4" 
                value={leadForm.msg}
                onChange={handleLeadChange}
                placeholder="Describe your prints, size distribution, deadlines..." 
                required
              ></textarea>
            </div>
            
            <button type="submit" className="form-submit" disabled={isSubmittingLead}>
              {isSubmittingLead ? "Sending Request..." : "Send Quote Request →"}
            </button>
            
            {leadSuccess && (
              <p className="lead-success-msg">
                <Check size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Inquiry saved to Google Sheets! We will contact you shortly.
              </p>
            )}
          </form>
        </div>

        {/* Google Map */}
        <div className="map-wrap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.9794076564858!2d80.20503511502638!3d12.992912862647465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52675eb8422bed%3A0xae3381e52ee6cf2e!2s5%2C%202nd%20St%2C%20Ramapuram%2C%20Balakrishnapuram%2C%20Balkrishanapuram%2C%20Chennai%2C%20Tamil%20Nadu%20600088!5e0!3m2!1sen!2sin!4v1779188466441!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Triweave Location Map"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
