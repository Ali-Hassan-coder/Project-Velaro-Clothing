import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { items, loading } = useWishlist();

  return (
    <div style={{ padding: '4rem 0 6rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>CLIENT ARCHIVE</span>
          <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>Saved Pieces</h1>
          <p style={{ color: '#8E949D', fontSize: '0.95rem' }}>
            Your curated collection of handcrafted leather and technical garments.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#DFBA73' }}>
            Loading saved pieces...
          </div>
        ) : items.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              return <ProductCard key={product._id || product.id} product={product} />;
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'var(--bg-surface)',
            borderRadius: '8px',
            border: '1px solid rgba(223, 186, 115, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your Archive Is Empty</h3>
            <p style={{ color: '#8E949D', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Explore our current releases to save iconic pieces to your private wishlist.
            </p>
            <Link to="/shop" className="btn btn-primary btn-sm">
              Explore Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
