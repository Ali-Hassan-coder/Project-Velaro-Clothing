import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback high-impact images if DB hasn't been seeded yet
  const defaultCategories = [
    {
      title: 'Leather Jackets',
      divisionCode: 'DIV // 01',
      slug: 'leather-jackets',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      description: '1.3mm Italian Full-Grain, YKK Excella Brass'
    },
    {
      title: 'Heavyweight Hoodies',
      divisionCode: 'DIV // 02',
      slug: 'hoodies-sweatshirts',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      description: '500 GSM French Terry Cotton, Double-Faced'
    },
    {
      title: 'Technical Streetwear',
      divisionCode: 'DIV // 03',
      slug: 'streetwear',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      description: 'Cordura® Reinforced Cargo & Modular Systems'
    },
    {
      title: 'Performance Sportswear',
      divisionCode: 'DIV // 04',
      slug: 'sportswear',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      description: 'Aerodynamic Compressive Engineered Fabrics'
    },
    {
      title: 'Motorbike Riding Suits',
      divisionCode: 'DIV // 05',
      slug: 'motorbike-riding-suits',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
      description: 'CE AAA Certified Racing Suits with D3O® Armor'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productApi.getFeaturedProducts().catch(() => ({ data: { data: { products: [] } } })),
          categoryApi.getCategories().catch(() => ({ data: { data: { categories: [] } } })),
        ]);
        if (prodRes.data?.data?.products?.length > 0) {
          setFeaturedProducts(prodRes.data.data.products);
        }
        if (catRes.data?.data?.categories?.length > 0) {
          setCategories(catRes.data.data.categories);
        } else {
          setCategories(defaultCategories);
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

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(12, 13, 14, 0.45), rgba(12, 13, 14, 0.95)), url("https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        borderBottom: '1px solid rgba(223, 186, 115, 0.2)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '800px' }}>
            <div className="badge-gold" style={{ marginBottom: '1.25rem' }}>
              AUTUMN / WINTER ATELIER RELEASE
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              textTransform: 'uppercase'
            }}>
              Crafted Without <span className="text-gold">Compromise.</span><br />
              Born for Road & <span className="text-copper">Runway.</span>
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: '#C2C8D2',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '620px'
            }}>
              Raw motorsport durability forged with architectural streetwear aesthetics. Bespoke full-grain leather, heavy 500 GSM loopback cotton, and CE AAA-grade race protection.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-primary">
                Explore The Collection
              </Link>
              <Link to="/shop?category=motorbike-riding-suits" className="btn btn-outline">
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
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>SYSTEM DIVISIONS</span>
              <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>The Five Pillars</h2>
            </div>
            <Link to="/shop" style={{ color: '#DFBA73', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              VIEW ALL ARCHIVES →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {(categories.length > 0 ? categories : defaultCategories).map((cat, idx) => (
              <Link
                key={cat.slug || idx}
                to={`/shop?category=${cat.slug}`}
                className="atelier-card"
                style={{
                  height: '380px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  textDecoration: 'none',
                  backgroundImage: `linear-gradient(to top, rgba(12, 13, 14, 0.95) 0%, rgba(12, 13, 14, 0.2) 60%, transparent 100%), url(${cat.imageUrl})`,
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
                    {cat.divisionCode || `DIV // 0${idx + 1}`}
                  </span>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', color: '#FFF' }}>
                    {cat.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#9DA3AF', lineHeight: 1.4 }}>
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ICONIC PIECES (FEATURED PRODUCTS) */}
      <section style={{ padding: '4rem 0 6rem 0', backgroundColor: '#0B0C0E', borderTop: '1px solid rgba(223, 186, 115, 0.1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem auto' }}>
            <span className="badge-gold" style={{ marginBottom: '0.75rem' }}>ATELIER HIGHLIGHTS</span>
            <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Iconic Works</h2>
            <p style={{ color: '#8E949D', fontSize: '0.95rem' }}>
              Engineered with proprietary tannery finishes, reinforced stress joints, and custom hardware.
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#8E949D' }}>
              <p>Explore our complete catalog in the archives.</p>
              <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Browse All Pieces
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. BESPOKE ATELIER BANNER */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(rgba(12, 13, 14, 0.85), rgba(12, 13, 14, 0.85)), url("https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderTop: '1px solid rgba(223, 186, 115, 0.15)',
        borderBottom: '1px solid rgba(223, 186, 115, 0.15)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px' }}>
          <span className="badge-gold" style={{ marginBottom: '1rem' }}>BESPOKE COMMISSIONS</span>
          <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Custom Tailored To Your Exact Silhouette
          </h2>
          <p style={{ color: '#C2C8D2', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            From individual rider aerodynamic measurements to exclusive hide choices and custom-machined metal hardware, our master tailors accept private commissions worldwide.
          </p>
          <Link to="/shop?category=motorbike-riding-suits" className="btn btn-primary">
            Initiate Bespoke Order
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
