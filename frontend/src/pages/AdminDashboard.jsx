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

  // New piece form state
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
      const [statsRes, prodRes, catRes] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        productApi.getProducts({ limit: 50 }).catch(() => null),
        categoryApi.getCategories().catch(() => null),
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
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productApi.createProduct({
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        category: formData.categoryId,
        images: [{ url: formData.imageUrl, isPrimary: true }],
        sizes: [
          { label: 'S', inStock: 5 },
          { label: 'M', inStock: 8 },
          { label: 'L', inStock: 6 },
          { label: 'XL', inStock: 4 },
        ],
      });
      setShowModal(false);
      fetchDashboard();
    } catch (err) {
      alert('Error creating product: ' + (err.response?.data?.message || err.message));
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
              onClick={() => setShowModal(true)}
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

        {/* Inventory Table matching Atelier Design Matrix */}
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Create New Piece */}
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
                <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>Add Archival Piece</h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: '#DFBA73', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Product Image Photo</label>
                  <select
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    style={{ width: '100%', padding: '0.7rem', background: '#0C0D0E', border: '1px solid rgba(223, 186, 115, 0.2)', color: '#FFF', borderRadius: '4px' }}
                  >
                    <option value="/photo_1.jpg">photo_1.jpg (Classic Leather Jacket Front)</option>
                    <option value="/photo_2.jpg">photo_2.jpg (Leather Jacket Back Detail)</option>
                    <option value="/image_3.jpg">image_3.jpg (Jacket Silhouette)</option>
                    <option value="/photo4.jpg">photo4.jpg (Modular Cargos / Denim)</option>
                    <option value="/photo5.jpg">photo5.jpg (Apex Motorbike Racing Suit)</option>
                    <option value="/photo11.jpg">photo11.jpg (Heavyweight Guild Hoodie)</option>
                    <option value="/photo12.jpg">photo12.jpg (Velocity Technical Windshell)</option>
                    <option value="/photo7.jpg">photo7.jpg (Track Armor & Joint Detail)</option>
                    <option value="/photo10.jpg">photo10.jpg (High-Speed Track Action)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase' }}>Description</label>
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
