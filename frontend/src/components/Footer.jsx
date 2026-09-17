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
            <div className="badge-gold">
              THE ATELIER GUILD • NO. 448
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
              <li>Custom Sizing & Pattern Drafting</li>
              <li>Hand-Selected Italian Full-Grain</li>
              <li>D3O® Level 2 Armor Integration</li>
              <li>Custom Embroidery & Patches</li>
              <li>Atelier Lifetime Warranty</li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.85rem', letterSpacing: '0.12em', color: '#DFBA73', marginBottom: '1.2rem', textTransform: 'uppercase' }}>
              Atelier Dispatch
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#9DA3AF', marginBottom: '1rem', lineHeight: 1.5 }}>
              Receive exclusive private drop notices, hide reserve releases, and runway invites.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="patron@domain.com"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(223, 186, 115, 0.25)',
                  borderRadius: '4px',
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.8rem',
                  color: '#FFF',
                  flex: 1
                }}
              />
              <button className="btn btn-primary btn-sm">JOIN</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.8rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#646B77'
        }}>
          <div>
            © {new Date().getFullYear()} VELARO CLOTHING CO. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
            <span>TERMS OF CRAFT</span>
            <span>PRIVACY DISCLOSURE</span>
            <span>CE SAFETY COMPLIANCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
