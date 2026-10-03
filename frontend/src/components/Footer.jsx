import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#070809',
      borderTop: '1px solid rgba(223, 186, 115, 0.15)',
      marginTop: '5rem',
      padding: '4.5rem 0 2.5rem 0',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Col 1: Brand & Atelier Guild */}
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: '#F5F5F7',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              VELARO
            </span>
            <p style={{
              fontSize: '0.85rem',
              color: '#9DA3AF',
              lineHeight: 1.6,
              marginBottom: '1.25rem'
            }}>
              Born from motorsport heritage and uncompromising haute-streetwear tailoring. Hand-selected hides, triple-stitched seams, and bespoke precision.
            </p>
            <div className="badge-gold" style={{ marginBottom: '1rem' }}>
              THE ATELIER GUILD • NO. 448
            </div>
            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <a
                href="https://www.instagram.com/velaroclothing_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Velaro Clothing on Instagram"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#DFBA73',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '6px 12px',
                  background: 'rgba(223, 186, 115, 0.08)',
                  border: '1px solid rgba(223, 186, 115, 0.25)',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(223, 186, 115, 0.18)';
                  e.currentTarget.style.borderColor = '#DFBA73';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(223, 186, 115, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(223, 186, 115, 0.25)';
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Col 2: The Five Pillars */}
          <div>
            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.12em', color: '#DFBA73', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
              Divisions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <li><Link to="/shop?category=leather-jackets" style={{ color: '#8E949D' }}>Leather Jackets</Link></li>
              <li><Link to="/shop?category=hoodies-sweatshirts" style={{ color: '#8E949D' }}>Heavyweight Hoodies</Link></li>
              <li><Link to="/shop?category=streetwear" style={{ color: '#8E949D' }}>Technical Streetwear</Link></li>
              <li><Link to="/shop?category=sportswear" style={{ color: '#8E949D' }}>Performance Activewear</Link></li>
              <li><Link to="/shop?category=motorbike-riding-suits" style={{ color: '#DFBA73' }}>CE-Certified Racing Suits</Link></li>
            </ul>
          </div>

          {/* Col 3: Bespoke & Craftsmanship */}
          <div>
            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.12em', color: '#DFBA73', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
              Bespoke Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#8E949D' }}>
              <li>
                <Link to="/contact" style={{ color: '#DFBA73', fontWeight: 600 }}>
                  ★ Initiate Custom Order →
                </Link>
              </li>
              <li>Custom Sizing & Pattern Drafting</li>
              <li>Hand-Selected Italian Full-Grain</li>
              <li>D3O® Level 2 Armor Integration</li>
              <li>Custom Embroidery & Patches</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.12em', color: '#DFBA73', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
              Atelier Dispatch
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#9DA3AF', marginBottom: '1rem', lineHeight: 1.5 }}>
              Connect with our official Instagram channel and join our private list for atelier showcase previews.
            </p>
            <a
              href="https://www.instagram.com/velaroclothing_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Follow @velaroclothing_ →
            </a>
          </div>
        </div>

        {/* Bottom bar & Creator Trademark */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.8rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#646B77',
          gap: '1rem'
        }}>
          <div>
            © {new Date().getFullYear()} VELARO CLOTHING ATELIER. OFFICIAL SHOWCASE.
          </div>

          {/* Aesthetic Trademark Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(223, 186, 115, 0.06)',
            padding: '5px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(223, 186, 115, 0.22)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)'
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              color: '#8E949D',
              textTransform: 'uppercase'
            }}>
              ENGINEERED & CRAFTED BY:
            </span>
            <a
              href="https://www.linkedin.com/in/ali-hassan-206392317/"
              target="_blank"
              rel="noopener noreferrer"
              title="Connect with Ali Hassan on LinkedIn"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#DFBA73',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFF';
                e.currentTarget.style.textShadow = '0 0 10px rgba(223, 186, 115, 0.8)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#DFBA73';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              ALI HASSAN ↗
            </a>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="https://www.instagram.com/velaroclothing_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#DFBA73' }}
            >
              INSTAGRAM SHOWCASE
            </a>
            <a
              href="https://www.linkedin.com/in/ali-hassan-206392317/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#9DA3AF' }}
            >
              DEVELOPER CONTACT
            </a>
            <span>CE COMPLIANCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;

