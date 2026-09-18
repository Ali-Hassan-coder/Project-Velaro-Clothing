import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(12, 13, 14, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(223, 186, 115, 0.18)',
    }}>
      {/* Top micro bar for Atelier VIP & announcements */}
      <div style={{
        backgroundColor: '#070809',
        borderBottom: '1px solid rgba(223, 186, 115, 0.08)',
        fontSize: '0.72rem',
        padding: '0.35rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#9DA3AF',
        letterSpacing: '0.05em'
      }}>
        <div>
          <span style={{ color: '#DFBA73', fontWeight: 600 }}>ATELIER BESPOKE</span> — MADE-TO-MEASURE HANDCRAFTED GARMENTS
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span>GLOBAL COURIER DISPATCH</span>
          <span style={{ color: '#DFBA73' }}>USD ($)</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            color: '#F5F5F7',
            lineHeight: 1
          }}>
            VELARO
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.35em',
            color: '#DFBA73',
            marginTop: '3px'
          }}>
            ROAD & RUNWAY ATELIER
          </span>
        </Link>

        {/* Desktop Category Navigation */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <Link to="/shop" style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#F5F5F7',
            transition: 'color 0.2s'
          }}>
            All Works
          </Link>
          <Link to="/shop?category=leather-jackets" style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9DA3AF'
          }}>
            Leather Jackets
          </Link>
          <Link to="/shop?category=hoodies-sweatshirts" style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9DA3AF'
          }}>
            Heavy Hoodies
          </Link>
          <Link to="/shop?category=streetwear" style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#9DA3AF'
          }}>
            Streetwear
          </Link>
          <Link to="/shop?category=motorbike-riding-suits" style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#DFBA73'
          }}>
            Racing Suits
          </Link>
        </nav>

        {/* Actions & Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Quick Search */}
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search armor, hide, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(223, 186, 115, 0.2)',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                color: '#FFF',
                outline: 'none',
                width: '190px',
                transition: 'all 0.2s'
              }}
            />
          </form>

          {/* Wishlist Link */}
          <Link to="/wishlist" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#DFBA73',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <span>★</span>
            <span>Saved</span>
            {wishlistCount > 0 && (
              <span style={{
                background: '#DFBA73',
                color: '#000',
                borderRadius: '50%',
                fontSize: '0.65rem',
                padding: '0.1rem 0.4rem',
                fontWeight: 700
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Auth State */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isAdmin && (
                <Link to="/admin" className="badge-gold" style={{ textDecoration: 'none' }}>
                  OPERATIONS
                </Link>
              )}
              <span style={{ fontSize: '0.8rem', color: '#9DA3AF' }}>
                {user.firstName || (user.name ? user.name.split(' ')[0] : 'Artisan')}
              </span>
              <button
                onClick={logout}
                style={{
                  fontSize: '0.75rem',
                  color: '#CA7D4B',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Exit
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
