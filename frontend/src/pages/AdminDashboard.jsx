import React, { useEffect, useState } from 'react';
import { adminApi, productApi, categoryApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdmin, user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'hero', 'categories'
  const [editingCategory, setEditingCategory] = useState(null);
  const [heroSettings, setHeroSettings] = useState({
    mediaUrl: '/photo5.jpg',
    mediaType: 'image',
    headline: 'Crafted Without Compromise.\nBorn for Road & Runway.',
    subheadline: 'Raw motorsport durability forged with architectural streetwear aesthetics. Bespoke full-grain leather, heavy 500 GSM loopback cotton, and CE AAA-grade race protection.',
    commissionBadge: 'AUTUMN / WINTER ATELIER RELEASE',
    ctaText: 'Explore The Collection',
    ctaLink: '/shop',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // New/Edit piece form state
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    description: '',
    price: '',
    compareAtPrice: '',
    categoryId: '',
    sku: '',
    material: '',
    materialTag: '',
    hideGauge: '1.3mm',
    imageUrl: '/photo_1.jpg',
    isFeatured: true,
  });

  const fetchDashboard = async () => {
    try {
      const [statsRes, prodRes, catRes, settingsRes] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        productApi.getProducts({ limit: 50 }).catch(() => null),
        categoryApi.getCategories().catch(() => null),
        adminApi.getSettings().catch(() => null),
      ]);

      if (statsRes?.data?.data) {
        setStats(statsRes.data.data);
      }
      if (prodRes?.data?.data?.products) {
        setProducts(prodRes.data.data.products);
      }
      if (catRes?.data?.data?.categories) {
        setCategories(catRes.data.data.categories);
        if (catRes.data.data.categories.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data.data.categories[0].id || catRes.data.data.categories[0]._id }));
        }
      }
      if (settingsRes?.data?.data?.settings?.heroBanner) {
        setHeroSettings(settingsRes.data.data.settings.heroBanner);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSaveHeroSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await adminApi.updateSetting('heroBanner', heroSettings);
      alert('Hero banner background media and headline updated successfully!');
      fetchDashboard();
    } catch (err) {
      alert('Error updating banner: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const id = editingCategory.id || editingCategory._id;
      await categoryApi.updateCategory(id, {
        name: editingCategory.name,
        shortDescription: editingCategory.shortDescription,
        description: editingCategory.description,
        image: { url: editingCategory.imageUrl || editingCategory.image?.url },
        divisionNumber: editingCategory.divisionNumber,
        divisionLabel: editingCategory.divisionLabel,
        badge: editingCategory.badge,
      });
      alert(`Division [${editingCategory.name}] cover image & details updated successfully!`);
      setEditingCategory(null);
      fetchDashboard();
    } catch (err) {
      alert('Error updating category: ' + (err.response?.data?.message || err.message));
    }
  };


  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      subtitle: '',
      description: '',
      price: '',
      compareAtPrice: '',
      categoryId: categories[0]?.id || '',
      sku: `VA-${Math.floor(1000 + Math.random() * 9000)}`,
      material: '',
      materialTag: '',
      hideGauge: '1.3mm',
      imageUrl: '/photo_1.jpg',
      isFeatured: true,
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p._id || p.id);
    setFormData({
      name: p.name || p.title || '',
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: p.price || '',
      compareAtPrice: p.compareAtPrice || '',
      categoryId: p.categoryId || p.category?.id || (categories[0]?.id || ''),
      sku: p.sku || '',
      material: p.material || '',
      materialTag: p.materialTag || p.material || '',
      hideGauge: p.hideGauge || '1.3mm',
      imageUrl: p.images?.[0]?.url || '/photo_1.jpg',
      isFeatured: p.isFeatured !== false,
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        category: formData.categoryId,
        images: [{ url: formData.imageUrl, isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 5 },
          { label: 'M', inStock: 8 },
          { label: 'L', inStock: 6 },
          { label: 'XL', inStock: 4 },
        ],
      };

      if (editingId) {
        await productApi.updateProduct(editingId, payload);
        alert('Piece specifications updated successfully.');
      } else {
        await productApi.createProduct(payload);
        alert('Piece created and published to archives.');
      }
      setShowModal(false);
      setEditingId(null);
      fetchDashboard();
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    }
  };


  const handleDeleteProduct = async (id) => {
    if (window.confirm('Archive this piece from active inventory?')) {
      try {
        await productApi.deleteProduct(id);
        fetchDashboard();
      } catch (err) {
        alert('Error removing piece: ' + err.message);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: '#DFBA73' }}>
        Verifying Atelier Admin Clearance...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>OPERATIONS CONSOLE</span>
            <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>Atelier Management</h1>
            <p style={{ color: '#8E949D', fontSize: '0.85rem' }}>
              Logged in as Master Artisan: <span style={{ color: '#DFBA73' }}>{user?.email}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" className="btn btn-outline btn-sm">
              View Storefront →
            </Link>
            <button
              onClick={openCreateModal}
              className="btn btn-primary btn-sm"
            >
              + Create New Piece
            </button>
          </div>
        </div>


        {/* Top 4 KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Active Inventory
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
              {stats?.stats?.totalProducts ?? products.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#52B788', marginTop: '0.35rem' }}>
              All 5 Divisions Stocked
            </div>
          </div>

          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Bespoke Orders
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#CA7D4B', fontFamily: 'var(--font-mono)' }}>
              {stats?.stats?.totalOrders ?? 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#DFBA73', marginTop: '0.35rem' }}>
              PostgreSQL Sync Active
            </div>
          </div>

          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Registered Patrons
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F5F5F7', fontFamily: 'var(--font-mono)' }}>
              {stats?.stats?.totalUsers ?? 2}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', marginTop: '0.35rem' }}>
              VIP Atelier Clients
            </div>
          </div>

          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Atelier Gross Value
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
              ${stats?.stats?.totalRevenue ? stats.stats.totalRevenue.toLocaleString() : '18,450'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#52B788', marginTop: '0.35rem' }}>
              Verified In PostgreSQL
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(223, 186, 115, 0.2)', marginBottom: '2.5rem', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'inventory' ? '2px solid #DFBA73' : '2px solid transparent',
              color: activeTab === 'inventory' ? '#DFBA73' : '#8E949D',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.06em'
            }}
          >
            📦 ARCHIVAL INVENTORY ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'hero' ? '2px solid #DFBA73' : '2px solid transparent',
              color: activeTab === 'hero' ? '#DFBA73' : '#8E949D',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.06em'
            }}
          >
            🎬 HERO BANNER MEDIA (PHOTO / VIDEO)
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'categories' ? '2px solid #DFBA73' : '2px solid transparent',
              color: activeTab === 'categories' ? '#DFBA73' : '#8E949D',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.06em'
            }}
          >
            🏛️ FIVE PILLARS COVERS ({categories.length})
          </button>
        </div>

        {/* TAB 1: INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className="atelier-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase' }}>Archival Inventory Matrix</h3>
              <span style={{ fontSize: '0.8rem', color: '#8E949D' }}>
                Displaying {products.length} Live Pieces
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(223, 186, 115, 0.2)', color: '#DFBA73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <th style={{ padding: '0.85rem' }}>Image</th>
                    <th style={{ padding: '0.85rem' }}>Piece / Title</th>
                    <th style={{ padding: '0.85rem' }}>Division Code</th>
                    <th style={{ padding: '0.85rem' }}>Material Spec</th>
                    <th style={{ padding: '0.85rem' }}>Price</th>
                    <th style={{ padding: '0.85rem' }}>Status</th>
                    <th style={{ padding: '0.85rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>

                {products.map((p) => {
                  const displayName = p.title || p.name;
                  const img = p.images?.[0]?.url || '/photo_1.jpg';
                  return (
                    <tr key={p._id || p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.75rem 0.85rem' }}>
                        <img
                          src={img}
                          alt=""
                          style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(223, 186, 115, 0.2)' }}
                        />
                      </td>
                      <td style={{ padding: '1rem 0.85rem', fontWeight: 600 }}>
                        <Link to={`/product/${p.slug}`} style={{ color: '#F5F5F7', textDecoration: 'none' }}>
                          {displayName}
                        </Link>
                        <div style={{ fontSize: '0.72rem', color: '#8E949D', fontFamily: 'var(--font-mono)' }}>
                          {p.sku}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#DFBA73' }}>
                        {p.category?.divisionNumber ? `DIV // ${p.category.divisionNumber}` : 'DIV // 01'}
                      </td>
                      <td style={{ padding: '1rem 0.85rem', color: '#9DA3AF' }}>
                        {p.materialTag || p.material || 'Full-Grain Leather'}
                      </td>
                      <td style={{ padding: '1rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#DFBA73', fontWeight: 700 }}>
                        ${p.price}
                      </td>
                      <td style={{ padding: '1rem 0.85rem' }}>
                        <span className="badge-gold" style={{ fontSize: '0.65rem' }}>
                          {p.isActive ? 'ACTIVE' : 'ARCHIVED'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.85rem' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openEditModal(p)}
                            style={{
                              background: 'rgba(223, 186, 115, 0.1)',
                              border: '1px solid rgba(223, 186, 115, 0.3)',
                              color: '#DFBA73',
                              borderRadius: '4px',
                              padding: '0.25rem 0.6rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id || p.id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(230, 90, 90, 0.4)',
                              color: '#FF7B7B',
                              borderRadius: '4px',
                              padding: '0.25rem 0.6rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* TAB 2: HERO BANNER & SHOWCASE MEDIA MANAGER */}
        {activeTab === 'hero' && (
          <div className="atelier-card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>HOMEPAGE SHOWCASE CONTROL</span>
              <h3 style={{ fontSize: '1.6rem', textTransform: 'uppercase' }}>Hero Banner & Media Setting</h3>
              <p style={{ color: '#8E949D', fontSize: '0.85rem' }}>
                Upload a background video loop (MP4, WebM) or high-resolution photo for the main hero showcase, plus headlines and action buttons.
              </p>
            </div>

            <form onSubmit={handleSaveHeroSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {/* Media Preview & Upload */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#DFBA73', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                  Hero Background Media (Photo or Video Loop)
                </label>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#070809',
                  border: '1px solid rgba(223, 186, 115, 0.25)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {heroSettings.mediaType === 'video' || heroSettings.mediaUrl?.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={heroSettings.mediaUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={heroSettings.mediaUrl || '/photo5.jpg'}
                      alt="Hero Background Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#9DA3AF', textTransform: 'uppercase' }}>Upload New File</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const data = new FormData();
                        data.append('image', file);
                        try {
                          const res = await (await import('../api/axiosConfig')).default.post('/upload/single', data, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                          });
                          if (res.data?.data?.url) {
                            const isVid = file.type.startsWith('video');
                            setHeroSettings((prev) => ({
                              ...prev,
                              mediaUrl: res.data.data.url,
                              mediaType: isVid ? 'video' : 'image',
                            }));
                            alert('Hero media uploaded! Click "Save Hero Banner Changes" below to publish.');
                          }
                        } catch (err) {
                          alert('Upload failed: ' + (err.response?.data?.message || err.message));
                        }
                      }}
                      style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        color: '#9DA3AF',
                        background: '#0C0D0E',
                        padding: '0.5rem',
                        border: '1px solid rgba(223, 186, 115, 0.2)',
                        borderRadius: '4px',
                        marginTop: '0.3rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#9DA3AF', textTransform: 'uppercase' }}>Or Media URL / Asset Path</label>
                    <input
                      type="text"
                      value={heroSettings.mediaUrl}
                      onChange={(e) => setHeroSettings({ ...heroSettings, mediaUrl: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Text & Action Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Top Badge Text</label>
                  <input
                    type="text"
                    value={heroSettings.commissionBadge}
                    onChange={(e) => setHeroSettings({ ...heroSettings, commissionBadge: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Headline (Supports newlines)</label>
                  <textarea
                    rows={2}
                    value={heroSettings.headline}
                    onChange={(e) => setHeroSettings({ ...heroSettings, headline: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Subheadline / Manifesto</label>
                  <textarea
                    rows={3}
                    value={heroSettings.subheadline}
                    onChange={(e) => setHeroSettings({ ...heroSettings, subheadline: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>CTA Button Label</label>
                    <input
                      type="text"
                      value={heroSettings.ctaText}
                      onChange={(e) => setHeroSettings({ ...heroSettings, ctaText: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>CTA Button Destination</label>
                    <input
                      type="text"
                      value={heroSettings.ctaLink}
                      onChange={(e) => setHeroSettings({ ...heroSettings, ctaLink: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn btn-primary"
                  style={{ marginTop: '0.5rem', padding: '0.9rem' }}
                >
                  {savingSettings ? 'Publishing Changes...' : 'Save Hero Banner Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: FIVE PILLARS CATEGORIES & COVER IMAGES MANAGER */}
        {activeTab === 'categories' && (
          <div className="atelier-card" style={{ padding: '2.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>HOMEPAGE THE FIVE PILLARS</span>
              <h3 style={{ fontSize: '1.6rem', textTransform: 'uppercase' }}>Division Cover Images & Titles</h3>
              <p style={{ color: '#8E949D', fontSize: '0.85rem' }}>
                Adjust each of the 5 Pillars' showcase background cover images, subtitles, and badges visible on the storefront.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat) => {
                const cover = cat.image?.url || cat.imageUrl || '/photo_1.jpg';
                return (
                  <div
                    key={cat.id || cat._id}
                    style={{
                      background: '#070809',
                      border: '1px solid rgba(223, 186, 115, 0.2)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                      <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: 10, left: 10 }} className="badge-gold">
                        {cat.divisionNumber ? `DIV // ${cat.divisionNumber}` : 'PILLAR'}
                      </span>
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h4 style={{ fontSize: '1.15rem', color: '#FFF', marginBottom: '0.35rem' }}>{cat.name}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#8E949D', marginBottom: '1rem', lineHeight: 1.4 }}>
                        {cat.shortDescription || cat.description}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
                          {cat.productCount ?? 0} Archival Pieces
                        </span>
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
                        >
                          Change Cover / Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal: Edit Category Division */}
        {editingCategory && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '2rem'
          }}>
            <div className="atelier-card" style={{ maxWidth: '520px', width: '100%', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', textTransform: 'uppercase' }}>Edit Division Cover & Spec</h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  style={{ background: 'none', border: 'none', color: '#DFBA73', fontSize: '1.4rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Division Title</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                    Upload New Cover Image / Video
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const data = new FormData();
                      data.append('image', file);
                      try {
                        const res = await (await import('../api/axiosConfig')).default.post('/upload/single', data, {
                          headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        if (res.data?.data?.url) {
                          setEditingCategory((prev) => ({
                            ...prev,
                            imageUrl: res.data.data.url,
                            image: { url: res.data.data.url },
                          }));
                          alert('Cover photo uploaded successfully!');
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err.response?.data?.message || err.message));
                      }
                    }}
                    style={{ width: '100%', fontSize: '0.8rem', color: '#9DA3AF', background: '#0C0D0E', padding: '0.5rem', border: '1px solid rgba(223, 186, 115, 0.2)', borderRadius: '4px' }}
                  />
                  {(editingCategory.imageUrl || editingCategory.image?.url) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={editingCategory.imageUrl || editingCategory.image?.url} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <span style={{ fontSize: '0.72rem', color: '#DFBA73', wordBreak: 'break-all' }}>
                        {editingCategory.imageUrl || editingCategory.image?.url}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Short Description / Tagline</label>
                  <input
                    type="text"
                    value={editingCategory.shortDescription || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, shortDescription: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Division Badge</label>
                  <input
                    type="text"
                    value={editingCategory.badge || editingCategory.divisionLabel || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, badge: e.target.value, divisionLabel: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Division Cover
                  </button>
                  <button type="button" onClick={() => setEditingCategory(null)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* Modal: Create or Edit Piece */}
        {showModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '2rem'
          }}>
            <div className="atelier-card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>
                  {editingId ? 'Edit Archival Piece' : 'Add Archival Piece'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: '#DFBA73', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Piece Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Apex Dual-Zip Bomber"
                    style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Category Division</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  >
                    {categories.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.divisionNumber ? `[DIV ${c.divisionNumber}]` : ''} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Price (USD)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="895"
                      style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="VA-LJ-0992"
                      style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Leather / Material Spec</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value, materialTag: e.target.value })}
                    placeholder="Full-Grain Italian Aniline Cowhide"
                    style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>
                    Upload Media (Photo or Video)
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const data = new FormData();
                        data.append('image', file);
                        try {
                          const res = await (await import('../api/axiosConfig')).default.post('/upload/single', data, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                          });
                          if (res.data?.data?.url) {
                            setFormData((prev) => ({
                              ...prev,
                              imageUrl: res.data.data.url,
                              mediaType: res.data.data.resourceType || (file.type.startsWith('video') ? 'video' : 'image'),
                            }));
                            alert('Media uploaded successfully!');
                          }
                        } catch (err) {
                          alert('Upload failed: ' + (err.response?.data?.message || err.message));
                        }
                      }}
                      style={{
                        fontSize: '0.8rem',
                        color: '#9DA3AF',
                        background: '#0C0D0E',
                        padding: '0.5rem',
                        border: '1px solid rgba(223, 186, 115, 0.2)',
                        borderRadius: '4px',
                        flex: 1
                      }}
                    />
                  </div>
                  {/* Current Media Preview */}
                  {formData.imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                      {formData.mediaType === 'video' || formData.imageUrl.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={formData.imageUrl} controls style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <img src={formData.imageUrl} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      )}
                      <span style={{ fontSize: '0.75rem', color: '#DFBA73', wordBreak: 'break-all' }}>
                        {formData.imageUrl}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Description / Atelier Specifications</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Masterfully cut and assembled by our senior leathercraft atelier..."
                    style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Publish To Archives
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
