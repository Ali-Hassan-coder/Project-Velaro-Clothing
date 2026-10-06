import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi, adminApi } from '../api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSettings, setHeroSettings] = useState({
    mediaUrl: '/photo5.jpg',
    mediaType: 'image',
    headline: 'Crafted Without Compromise.\nBorn for Road & Runway.',
    subheadline: 'Raw motorsport durability forged with architectural streetwear aesthetics. Bespoke full-grain leather, heavy 500 GSM loopback cotton, and CE AAA-grade race protection.',
    commissionBadge: 'AUTUMN / WINTER ATELIER RELEASE',
    ctaText: 'Explore The Collection',
    ctaLink: '/shop',
  });
  const [loading, setLoading] = useState(true);

  // Fallback high-impact images using local project assets
  const defaultCategories = [
    {
      name: 'Leather Jackets',
      divisionNumber: '01',
      divisionLabel: 'FLAGSHIP LINE',
      slug: 'leather-jackets',
      image: { url: '/photo_1.jpg' },
      description: '1.3mm Italian Full-Grain, YKK Excella Brass'
    },
    {
      name: 'Hoodies & Fleece',
      divisionNumber: '02',
      divisionLabel: '500 GSM LOOPBACK',
      slug: 'hoodies-sweatshirts',
      image: { url: '/photo11.jpg' },
      description: '500 GSM French Terry Cotton, Double-Faced'
    },
    {
      name: 'Streetwear',
      divisionNumber: '03',
      divisionLabel: 'APPAREL',
      slug: 'streetwear',
      image: { url: '/photo4.jpg' },
      description: 'Cordura® Reinforced Cargo & Modular Systems'
    },
    {
      name: 'Sportswear',
      divisionNumber: '04',
      divisionLabel: 'TECHNICAL',
      slug: 'sportswear',
      image: { url: '/photo12.jpg' },
      description: 'Aerodynamic Compressive Engineered Fabrics'
    },
    {
      name: 'Motorbike Suits',
      divisionNumber: '05',
      divisionLabel: 'TRACK ARMOR',
      slug: 'motorbike-riding-suits',
      image: { url: '/photo5.jpg' },
      description: 'CE AAA Certified Racing Suits with D3O® Armor'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, settingsRes] = await Promise.all([
          productApi.getFeaturedProducts().catch(() => ({ data: { data: { products: [] } } })),
          categoryApi.getCategories().catch(() => ({ data: { data: { categories: [] } } })),
          adminApi.getPublicSettings().catch(() => null),
        ]);
        if (prodRes.data?.data?.products?.length > 0) {
          setFeaturedProducts(prodRes.data.data.products);
        }
        if (catRes.data?.data?.categories?.length > 0) {
          setCategories(catRes.data.data.categories);
        } else {
          setCategories(defaultCategories);
        }
        if (settingsRes?.data?.data?.settings?.heroBanner) {
          setHeroSettings((prev) => ({
            ...prev,
            ...settingsRes.data.data.settings.heroBanner,
          }));
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isHeroVideo = heroSettings.mediaType === 'video' || heroSettings.mediaUrl?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div>
      {/* 1. HERO SECTION (Dynamic Video or Image Background) */}
      <section style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(223, 186, 115, 0.2)',
        backgroundColor: '#0C0D0E'
      }}>
        {/* Dynamic Background Media */}
        {isHeroVideo ? (
          <video
            src={heroSettings.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              opacity: 0.45,
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(12, 13, 14, 0.55), rgba(12, 13, 14, 0.95)), url("${heroSettings.mediaUrl || '/photo5.jpg'}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            zIndex: 1,
          }} />
        )}

        {/* Dark luxury overlay vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(12,13,14,0.3) 0%, rgba(12,13,14,0.85) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3.5rem 1.5rem' }}>
          <div style={{ maxWidth: '720px' }}>
            <div className="badge-gold" style={{ marginBottom: '1rem', fontSize: '0.65rem' }}>
              {heroSettings.commissionBadge || 'AUTUMN / WINTER ATELIER RELEASE'}
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              lineHeight: 1.08,
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
              whiteSpace: 'pre-line'
            }}>
              {heroSettings.headline || 'Crafted Without Compromise.\nBorn for Road & Runway.'}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#C2C8D2',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '580px'
            }}>
              {heroSettings.subheadline || 'Raw motorsport durability forged with architectural streetwear aesthetics. Bespoke full-grain leather, heavy 500 GSM loopback cotton, and CE AAA-grade race protection.'}
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <Link to={heroSettings.ctaLink || '/shop'} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>
                {heroSettings.ctaText || 'Explore The Collection'}
              </Link>
              <Link to="/shop?category=motorbike-riding-suits" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>
                Motorbike Suite Configurator
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 2. SPECIFICATION STATS BAR */}
      <section style={{
        backgroundColor: '#070809',
        borderBottom: '1px solid rgba(223, 186, 115, 0.12)',
        padding: '1.8rem 0'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#DFBA73', fontWeight: 700 }}>1.3 - 1.4 MM</div>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Full-Grain Cowhide & Kangaroo</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#DFBA73', fontWeight: 700 }}>500 GSM</div>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Heavyweight French Terry Hoodies</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#DFBA73', fontWeight: 700 }}>CE LEVEL 2</div>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>D3O® Armored Impact Systems</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#DFBA73', fontWeight: 700 }}>100% BESPOKE</div>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Custom Pattern Drafting Available</div>
          </div>
        </div>
      </section>

      {/* 3. THE FIVE PILLARS: CATEGORY SHOWCASE */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '0.5rem', fontSize: '0.65rem' }}>SYSTEM DIVISIONS</span>
              <h2 style={{ fontSize: '1.85rem', textTransform: 'uppercase' }}>The Five Pillars</h2>
            </div>
            <Link to="/shop" style={{ color: '#DFBA73', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              VIEW ALL ARCHIVES →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {(categories.length > 0 ? categories : defaultCategories).map((cat, idx) => {
              const catImg = cat.image?.url || cat.imageUrl || `/photo_${(idx % 2) + 1}.jpg`;
              return (
                <Link
                  key={cat.slug || idx}
                  to={`/shop?category=${cat.slug}`}
                  className="atelier-card"
                  style={{
                    height: '310px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem',
                    textDecoration: 'none',
                    backgroundImage: `linear-gradient(to top, rgba(12, 13, 14, 0.95) 0%, rgba(12, 13, 14, 0.25) 60%, transparent 100%), url(${catImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#DFBA73',
                      letterSpacing: '0.15em',
                      display: 'block',
                      marginBottom: '0.35rem'
                    }}>
                      {cat.divisionNumber ? `DIV // ${cat.divisionNumber}` : `DIV // 0${idx + 1}`}
                      {cat.divisionLabel ? ` • ${cat.divisionLabel}` : ''}
                    </span>
                    <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', color: '#FFF' }}>
                      {cat.name || cat.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#9DA3AF', lineHeight: 1.4 }}>
                      {cat.shortDescription || cat.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ICONIC PIECES (FEATURED PRODUCTS) */}
      <section style={{ padding: '3.5rem 0 4.5rem 0', backgroundColor: '#0B0C0E', borderTop: '1px solid rgba(223, 186, 115, 0.1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            <span className="badge-gold" style={{ marginBottom: '0.5rem', fontSize: '0.65rem' }}>ATELIER HIGHLIGHTS</span>
            <h2 style={{ fontSize: '1.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Iconic Works</h2>
            <p style={{ color: '#8E949D', fontSize: '0.85rem' }}>
              Engineered with proprietary tannery finishes, reinforced stress joints, and custom hardware.
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {featuredProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#8E949D' }}>
              <p>Explore our complete catalog in the archives.</p>
              <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                Browse All Pieces
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. BESPOKE ATELIER BANNER */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(rgba(12, 13, 14, 0.85), rgba(12, 13, 14, 0.85)), url("/photo_2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderTop: '1px solid rgba(223, 186, 115, 0.15)',
        borderBottom: '1px solid rgba(223, 186, 115, 0.15)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '680px' }}>
          <span className="badge-gold" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>BESPOKE COMMISSIONS</span>
          <h2 style={{ fontSize: '1.85rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Custom Tailored To Your Exact Silhouette
          </h2>
          <p style={{ color: '#C2C8D2', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            From individual rider aerodynamic measurements to exclusive hide choices and custom-machined metal hardware, our master tailors accept private commissions worldwide.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>
            Initiate Bespoke Order
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
