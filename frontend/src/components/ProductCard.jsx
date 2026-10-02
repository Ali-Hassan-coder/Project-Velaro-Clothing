import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const productId = product._id || product.id;
  const isSaved = isInWishlist(productId);

  // Pick primary image or first available
  const primaryImage =
    product.images?.[0]?.url ||
    (typeof product.images?.[0] === 'string' ? product.images[0] : '/photo_1.jpg');

  const displayName = product.title || product.name || 'Atelier Garment';

  return (
    <div className="atelier-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {product.isFeatured && (
          <span className="badge-gold" style={{ fontSize: '0.65rem' }}>ICONIC</span>
        )}
        {product.badges?.map((b, i) => (
          <span key={i} className="badge-tag" style={{ fontSize: '0.65rem' }}>{b}</span>
        ))}
      </div>

      {/* Wishlist toggle button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        aria-label="Save item"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 2,
          background: 'rgba(12, 13, 14, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(223, 186, 115, 0.2)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isSaved ? '#DFBA73' : '#8E949D',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {isSaved ? '★' : '☆'}
      </button>

      {/* Image container */}
      <Link to={`/product/${product.slug || productId}`} style={{ overflow: 'hidden', display: 'block', position: 'relative', paddingTop: '125%', background: '#16191D' }}>
        <img
          src={primaryImage}
          alt={displayName}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </Link>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Category division code */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
            {product.category?.divisionNumber ? `DIV // ${product.category.divisionNumber}` : (product.category?.divisionCode || 'DIV // 01')}
          </span>
          {(product.rating > 0 || product.ratings?.average > 0) && (
            <span style={{ fontSize: '0.75rem', color: '#CA7D4B' }}>
              ★ {(product.rating || product.ratings?.average || 5.0).toFixed(1)} ({product.numReviews || product.ratings?.count || 1})
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>
          <Link to={`/product/${product.slug || productId}`} style={{ color: '#F5F5F7', textDecoration: 'none' }}>
            {displayName}
          </Link>
        </h3>

        {/* Material & Leather Tag */}
        {(product.materialTag || product.material) && (
          <p style={{ fontSize: '0.78rem', color: '#8E949D', marginBottom: '0.8rem' }}>
            {product.materialTag || product.material} {product.hideGauge ? `• ${product.hideGauge}` : ''}
          </p>
        )}

        {/* Sizes available preview */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {product.sizes.map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  border: '1px solid rgba(223, 186, 115, 0.2)',
                  borderRadius: '3px',
                  color: '#C2C8D2',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                {s.label || s.size || s}
              </span>
            ))}
          </div>
        )}

        {/* Showcase Specifications & Inquiry Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid rgba(223, 186, 115, 0.12)' }}>
          <div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#DFBA73', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {product.isTailored ? 'MADE-TO-MEASURE' : 'ARCHIVAL SHOWCASE'}
            </span>
          </div>
          <Link
            to={`/product/${product.slug || productId}`}
            style={{
              fontSize: '0.75rem',
              color: '#F5F5F7',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              background: 'rgba(223, 186, 115, 0.1)',
              border: '1px solid rgba(223, 186, 115, 0.25)',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'var(--color-gold)';
              e.currentTarget.style.color = '#0C0D0E';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(223, 186, 115, 0.1)';
              e.currentTarget.style.color = '#F5F5F7';
            }}
          >
            EXPLORE PIECE →
          </Link>
        </div>
      </div>
    </div>
  );
};


export default ProductCard;
