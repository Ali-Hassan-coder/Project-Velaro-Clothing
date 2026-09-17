import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(product._id);

  // Pick primary image or fallback
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800';

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
          transition: 'all 0.2s'
        }}
      >
        {isSaved ? '★' : '☆'}
      </button>

      {/* Image container */}
      <Link to={`/product/${product.slug}`} style={{ overflow: 'hidden', display: 'block', position: 'relative', paddingTop: '125%', background: '#16191D' }}>
        <img
          src={primaryImage}
          alt={product.title}
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
            {product.category?.divisionCode || 'DIV // 01'}
          </span>
          {product.ratings?.average > 0 && (
            <span style={{ fontSize: '0.75rem', color: '#CA7D4B' }}>
              ★ {product.ratings.average.toFixed(1)} ({product.ratings.count})
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', lineHeight: 1.3 }}>
          <Link to={`/product/${product.slug}`} style={{ color: '#F5F5F7' }}>
            {product.title}
          </Link>
        </h3>

        {/* Material & Leather Tag */}
        {product.materialTag && (
          <p style={{ fontSize: '0.78rem', color: '#8E949D', marginBottom: '0.8rem' }}>
            {product.materialTag} {product.hideGauge ? `• ${product.hideGauge}` : ''}
          </p>
        )}

        {/* Sizes available preview */}
        {product.sizes && product.sizes.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {product.sizes.slice(0, 5).map((s) => (
              <span
                key={s.size}
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '2px',
                  color: s.stock > 0 ? '#C2C8D2' : '#555A63',
                  textDecoration: s.stock === 0 ? 'line-through' : 'none'
                }}
              >
                {s.size}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '0.75rem', color: '#646B77', textDecoration: 'line-through' }}>
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          <Link to={`/product/${product.slug}`} className="btn btn-outline btn-sm">
            Inspect
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
