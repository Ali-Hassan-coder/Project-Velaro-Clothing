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
            setSelectedSize(prod.sizes[0].size);
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

  const isSaved = isInWishlist(product._id);
  const images = product.images?.length > 0 ? product.images : [
    { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200' }
  ];

  return (
    <div style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ fontSize: '0.8rem', color: '#8E949D', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#8E949D' }}>HOME</Link> /{' '}
          <Link to="/shop" style={{ color: '#8E949D' }}>ARCHIVES</Link> /{' '}
          <span style={{ color: '#DFBA73' }}>{product.title?.toUpperCase()}</span>
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
                alt={product.title}
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
                {product.category?.divisionCode || 'DIV // 01'} • {product.sku || 'VEL-SPEC-09'}
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
              {product.title}
            </h1>

            {/* Price block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
                ${product.price}
              </span>
              {product.compareAtPrice && (
                <span style={{ fontSize: '1.1rem', color: '#646B77', textDecoration: 'line-through' }}>
                  ${product.compareAtPrice}
                </span>
              )}
            </div>

            <p style={{ color: '#C2C8D2', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Material & Leather Hide Tag */}
            {product.materialTag && (
              <div style={{
                background: 'rgba(223, 186, 115, 0.05)',
                border: '1px solid rgba(223, 186, 115, 0.15)',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1.75rem'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#DFBA73', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  Tannery & Spec Grade
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {product.materialTag}
                </div>
                {product.hideGauge && (
                  <div style={{ fontSize: '0.8rem', color: '#8E949D', marginTop: '0.25rem' }}>
                    Gauge: {product.hideGauge} (Track-spec abrasion resistance)
                  </div>
                )}
              </div>
            )}

            {/* Sizing selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73' }}>
                    Select Size
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#8E949D', cursor: 'pointer', textDecoration: 'underline' }}>
                    Atelier Sizing Matrix
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedSize(s.size)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        background: selectedSize === s.size ? '#DFBA73' : '#17191C',
                        color: selectedSize === s.size ? '#0C0D0E' : '#FFF',
                        border: selectedSize === s.size ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Armor Package Addon (for Riding Suits & Jackets) */}
            {product.armorPackage?.available && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73', marginBottom: '0.5rem' }}>
                  Armor Impact System
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {product.armorPackage.options?.map((opt) => (
                    <div
                      key={opt.name}
                      onClick={() => setSelectedArmor(opt.name)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: selectedArmor === opt.name ? 'rgba(223, 186, 115, 0.1)' : '#17191C',
                        border: selectedArmor === opt.name ? '1px solid #DFBA73' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem' }}>{opt.name}</span>
                      <span style={{ fontSize: '0.85rem', color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
                        +${opt.additionalPrice || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                onClick={() => alert(`Piece added to bag: ${product.title} (Size: ${selectedSize})`)}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Add To Atelier Bag
              </button>
              {product.isCustomizable && (
                <button
                  onClick={() => alert('Initiating Custom Bespoke Tailoring measurement intake.')}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Custom Bespoke Size
                </button>
              )}
            </div>

            {/* Tabs for Technical Specs & Delivery */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => setActiveTab('specs')}
                  style={{
                    color: activeTab === 'specs' ? '#DFBA73' : '#8E949D',
                    borderBottom: activeTab === 'specs' ? '2px solid #DFBA73' : 'none',
                    paddingBottom: '0.4rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Craft Specs
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  style={{
                    color: activeTab === 'shipping' ? '#DFBA73' : '#8E949D',
                    borderBottom: activeTab === 'shipping' ? '2px solid #DFBA73' : 'none',
                    paddingBottom: '0.4rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Courier & Delivery
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div style={{ fontSize: '0.85rem', color: '#9DA3AF', lineHeight: 1.6 }}>
                  <p>• Handcrafted in single-craftsman workshops.</p>
                  <p>• Heavy-gauge bonded nylon stitching throughout all high-impact stress lines.</p>
                  <p>• Solid brass hardware with anti-tarnish black oxidation finish.</p>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#9DA3AF', lineHeight: 1.6 }}>
                  <p>• Standard courier dispatch within 48 business hours.</p>
                  <p>• Bespoke custom-measured garments require 2-3 weeks pattern and leather cutting time.</p>
                  <p>• Fully insured worldwide express air transit.</p>
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
