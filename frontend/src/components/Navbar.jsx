import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinkStyle = (isActive) => ({
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isActive ? '#DFBA73' : '#9DA3AF',
    borderBottom: isActive ? '2px solid #DFBA73' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease',
    textDecoration: 'none'
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(12, 13, 14, 0.94)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ color: '#DFBA73', fontWeight: 600 }}>ATELIER VELARO</span> — BESPOKE ROAD & RUNWAY SHOWCASE
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a
            href="https://www.instagram.com/velaroclothing_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#DFBA73',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @velaroclothing_
          </a>
          <span style={{ color: '#DFBA73' }}>COMMISSIONS OPEN</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
      }}>
        {/* Brand Logo with Enhanced VC Emblem */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img
            src="/logo-gold.png"
            alt="Velaro Clothing Logo"
            style={{
              width: '44px',
              height: '44px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(223, 186, 115, 0.4))'
            }}
            onError={(e) => {
              e.currentTarget.src = '/logo-light.png';
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.6rem',
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
              marginTop: '4px'
            }}>
              ROAD & RUNWAY ATELIER
            </span>
          </div>
        </Link>

        {/* Desktop Category Navigation with active indicators */}
        <nav style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }} className="desktop-nav">
          <NavLink
            to="/shop"
            end
            style={({ isActive }) => navLinkStyle(isActive && !location.search)}
          >
            All Works
          </NavLink>
          <NavLink
            to="/shop?category=leather-jackets"
            style={() => navLinkStyle(location.search.includes('leather-jackets'))}
          >
            Leather Jackets
          </NavLink>
          <NavLink
            to="/shop?category=hoodies-sweatshirts"
            style={() => navLinkStyle(location.search.includes('hoodies-sweatshirts'))}
          >
            Heavy Hoodies
          </NavLink>
          <NavLink
            to="/shop?category=streetwear"
            style={() => navLinkStyle(location.search.includes('streetwear'))}
          >
            Streetwear
          </NavLink>
          <NavLink
            to="/shop?category=sportswear"
            style={() => navLinkStyle(location.search.includes('sportswear'))}
          >
            Sportswear
          </NavLink>
          <NavLink
            to="/shop?category=motorbike-riding-suits"
            style={() => navLinkStyle(location.search.includes('motorbike-riding-suits'))}
          >
            Racing Suits
          </NavLink>
        </nav>


        {/* Right utility navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="hide-sm" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search armor, hide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(223, 186, 115, 0.2)',
                borderRadius: '4px',
                padding: '0.42rem 0.8rem',
                fontSize: '0.78rem',
                color: '#FFF',
                outline: 'none',
                width: '160px',
                transition: 'all 0.2s'
              }}
            />
          </form>

          {/* Wishlist Link */}
          <NavLink
            to="/wishlist"
            title="Saved Archives"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isActive ? '#DFBA73' : '#F5F5F7',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              background: isActive ? 'rgba(223, 186, 115, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              border: isActive ? '1px solid #DFBA73' : '1px solid rgba(223, 186, 115, 0.2)',
              transition: 'all 0.2s ease'
            })}
          >
            <span style={{ color: '#DFBA73', fontSize: '0.95rem' }}>★</span>
            <span className="hide-sm">SAVED</span>
            <span style={{
              background: 'var(--color-gold)',
              color: '#0C0D0E',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '10px'
            }}>
              {wishlistCount}
            </span>
          </NavLink>

          {/* Admin link if logged in as admin */}
          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                color: isActive ? '#0C0D0E' : '#DFBA73',
                background: isActive ? '#DFBA73' : 'rgba(223, 186, 115, 0.1)',
                border: '1px solid #DFBA73',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'all 0.2s'
              })}
            >
              ADMIN
            </NavLink>
          )}

          {/* User Profile or Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#9DA3AF', fontFamily: 'var(--font-mono)' }} className="hide-sm">
                {user.firstName || user.email.split('@')[0]}
              </span>
              <button
                onClick={logout}
                style={{
                  fontSize: '0.75rem',
                  color: '#8E949D',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: isActive ? '#DFBA73' : '#F5F5F7',
                border: '1px solid rgba(223, 186, 115, 0.3)',
                padding: '0.4rem 0.9rem',
                borderRadius: '4px',
                textDecoration: 'none',
                background: isActive ? 'rgba(223, 186, 115, 0.1)' : 'transparent',
                transition: 'all 0.2s'
              })}
            >
              Sign In
            </NavLink>
          )}


          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid rgba(223, 186, 115, 0.3)',
              borderRadius: '4px',

              padding: '0.4rem 0.6rem',
              color: '#DFBA73',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Luxury Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#070809',
          borderBottom: '1px solid rgba(223, 186, 115, 0.25)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'fadeInScale 0.25s ease forwards'
        }}>
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }}>
            <input
              type="text"
              placeholder="Search all pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(223, 186, 115, 0.25)',
                borderRadius: '4px',
                padding: '0.65rem 1rem',
                fontSize: '0.85rem',
                color: '#FFF',
                outline: 'none'
              }}
            />
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            <NavLink
              to="/shop"
              end
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => navLinkStyle(isActive && !location.search)}
            >
              All Works
            </NavLink>
            <NavLink
              to="/shop?category=leather-jackets"
              onClick={() => setMobileMenuOpen(false)}
              style={() => navLinkStyle(location.search.includes('leather-jackets'))}
            >
              Leather Jackets
            </NavLink>
            <NavLink
              to="/shop?category=hoodies-sweatshirts"
              onClick={() => setMobileMenuOpen(false)}
              style={() => navLinkStyle(location.search.includes('hoodies-sweatshirts'))}
            >
              Heavy Hoodies
            </NavLink>
            <NavLink
              to="/shop?category=streetwear"
              onClick={() => setMobileMenuOpen(false)}
              style={() => navLinkStyle(location.search.includes('streetwear'))}
            >
              Streetwear
            </NavLink>
            <NavLink
              to="/shop?category=sportswear"
              onClick={() => setMobileMenuOpen(false)}
              style={() => navLinkStyle(location.search.includes('sportswear'))}
            >
              Sportswear
            </NavLink>
            <NavLink
              to="/shop?category=motorbike-riding-suits"
              onClick={() => setMobileMenuOpen(false)}
              style={() => navLinkStyle(location.search.includes('motorbike-riding-suits'))}
            >
              Racing Suits
            </NavLink>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a
              href="https://www.instagram.com/velaroclothing_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#DFBA73', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 }}
            >
              Follow @velaroclothing_ ↗
            </a>
            <NavLink
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#DFBA73', fontSize: '0.82rem', textDecoration: 'none' }}
            >
              Saved Archive ({wishlistCount})
            </NavLink>
          </div>
        </div>
      )}
    </header>

  );
};

export default Navbar;


