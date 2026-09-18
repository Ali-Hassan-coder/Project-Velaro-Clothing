import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api';
import { useWishlist } from '../context/WishlistContext';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedArmor, setSelectedArmor] = useState(null);
  const [activeTab, setActiveTab] = useState('specs');
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProductBySlug(slug);
        if (res.data?.data?.product) {
          const prod = res.data.data.product;
          setProduct(prod);
          if (prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0].label || prod.sizes[0].size || 'M');
          }
          if (prod.armorPackage?.available) {
            setSelectedArmor(prod.armorPackage.options?.[0]?.name || null);
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: '#DFBA73' }}>
        Retrieving atelier piece specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Archival Piece Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Archives
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const isSaved = isInWishlist(productId);
  const displayName = product.title || product.name;
  const images = product.images?.length > 0 ? product.images : [
    { url: '/photo_1.jpg' }
  ];

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.8rem', color: '#8E949D', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#8E949D', textDecoration: 'none' }}>HOME</Link> /{' '}
          <Link to="/shop" style={{ color: '#8E949D', textDecoration: 'none' }}>ARCHIVES</Link> /{' '}
          <span style={{ color: '#DFBA73' }}>{displayName?.toUpperCase()}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start'
        }}>
          {/* LEFT: GALLERY */}
          <div>
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#131518',
              border: '1px solid rgba(223, 186, 115, 0.2)',
              position: 'relative',
              paddingTop: '120%',
              marginBottom: '1rem'
            }}>
              <img
                src={images[selectedImage]?.url || images[0].url}
                alt={displayName}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: selectedImage === i ? '2px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.1)',
                      padding: 0,
                      background: '#131518',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & CONFIGURATOR */}
          <div>
            {/* Division & Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span className="badge-gold">
                {product.category?.divisionNumber ? `DIV // ${product.category.divisionNumber}` : 'DIV // 01'} • {product.sku || 'VEL-SPEC-09'}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isSaved ? '#DFBA73' : '#8E949D',
                  fontSize: '1.4rem',
                  cursor: 'pointer'
                }}
              >
                {isSaved ? '★' : '☆'}
              </button>
            </div>

            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem', lineHeight: 1.15 }}>
              {displayName}
            </h1>

            {product.subtitle && (
              <p style={{ color: '#8E949D', fontSize: '0.95rem', marginBottom: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                {product.subtitle}
              </p>
            )}

            {/* Price block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
                ${product.price}
              </span>
              {product.compareAtPrice && (
                <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: '#646B77' }}>
                  ${product.compareAtPrice}
                </span>
              )}
              {product.availabilityTag && (
                <span className="badge-tag" style={{ marginLeft: 'auto' }}>
                  {product.availabilityTag}
                </span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: '#C2C8D2', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73' }}>
                    Select Size
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#8E949D', cursor: 'pointer' }}>
                    Measurement Chart
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((s, idx) => {
                    const label = s.label || s.size || s;
                    const isSelected = selectedSize === label;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(label)}
                        style={{
                          minWidth: '48px',
                          height: '48px',
                          padding: '0 0.85rem',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid #DFBA73' : '1px solid rgba(223, 186, 115, 0.2)',
                          background: isSelected ? '#DFBA73' : 'rgba(255,255,255,0.03)',
                          color: isSelected ? '#0C0D0E' : '#FFF',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color swatches */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73', marginBottom: '0.6rem' }}>
                  Atelier Leather Finish
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {product.colors.map((c, i) => (
                    <div
                      key={i}
                      title={c.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: '2px solid rgba(223, 186, 115, 0.4)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Armor Package Option */}
            {product.armorPackage?.available && (
              <div className="atelier-card" style={{ padding: '1.25rem', marginBottom: '2rem', border: '1px solid rgba(202, 125, 75, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#CA7D4B', textTransform: 'uppercase' }}>
                    CE Level 2 Armor Package
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#DFBA73', fontWeight: 700 }}>
                    +${product.armorPackage.price || 120}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#8E949D', marginBottom: '0.75rem' }}>
                  {product.armorPackage.description || 'Full D3O® armor set for shoulders, elbows, and back.'}
                </p>
                {product.armorPackage.options?.map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#FFF', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="armor"
                      checked={selectedArmor === opt.name}
                      onChange={() => setSelectedArmor(opt.name)}
                    />
                    {opt.name}
                  </label>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '1rem' }}
                onClick={() => alert(`Added ${displayName} (${selectedSize}) to Atelier Bag`)}
              >
                Acquire Piece • ${product.price}
              </button>
              {product.isTailored && (
                <button
                  className="btn btn-outline"
                  onClick={() => alert('Opening Bespoke Measurement Specifier')}
                >
                  Custom Tailoring
                </button>
              )}
            </div>

            {/* Features / Tabs */}
            <div style={{ borderTop: '1px solid rgba(223, 186, 115, 0.15)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setActiveTab('specs')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'specs' ? '2px solid #DFBA73' : '2px solid transparent',
                    color: activeTab === 'specs' ? '#DFBA73' : '#8E949D',
                    paddingBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  SPECIFICATIONS
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'delivery' ? '2px solid #DFBA73' : '2px solid transparent',
                    color: activeTab === 'delivery' ? '#DFBA73' : '#8E949D',
                    paddingBottom: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  DISPATCH & COURIER
                </button>
              </div>

              {activeTab === 'specs' ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#9DA3AF' }}>
                  <li>• Material: <strong style={{ color: '#FFF' }}>{product.material || product.materialTag}</strong></li>
                  {product.hideGauge && <li>• Hide Gauge: <strong style={{ color: '#FFF' }}>{product.hideGauge}</strong></li>}
                  {product.features?.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                  <li>• Hardware: Solid Milled Antique Brass with Japanese Excella slider system</li>
                </ul>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#9DA3AF', lineHeight: 1.6 }}>
                  <p>• Worldwide insured courier dispatch with tracked customs clearance.</p>
                  <p>• Ready-to-ship pieces dispatched within 24–48 hours from our atelier.</p>
                  <p>• Bespoke and Made-To-Order builds typically require 10–14 craftsmanship days.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
