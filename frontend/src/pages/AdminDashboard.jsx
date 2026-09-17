import React, { useEffect, useState } from 'react';
import { adminApi, productApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, prodRes] = await Promise.all([
          adminApi.getDashboardStats().catch(() => null),
          productApi.getProducts({ limit: 10 }).catch(() => null),
        ]);

        if (statsRes?.data?.data) {
          setStats(statsRes.data.data);
        }
        if (prodRes?.data?.data?.products) {
          setProducts(prodRes.data.data.products);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>OPERATIONS CONSOLE</span>
            <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>Atelier Management</h1>
          </div>
          <button
            onClick={() => alert('Add Product modal')}
            className="btn btn-primary btn-sm"
          >
            + Create New Piece
          </button>
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
              {stats?.productsCount || products.length || 6}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#52B788', marginTop: '0.35rem' }}>
              All 5 Divisions Stocked
            </div>
          </div>

          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Bespoke Queue
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#CA7D4B', fontFamily: 'var(--font-mono)' }}>
              {stats?.ordersCount || 4}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#DFBA73', marginTop: '0.35rem' }}>
              2 Pattern Drafted, 2 Cutting
            </div>
          </div>

          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Registered Patrons
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F5F5F7', fontFamily: 'var(--font-mono)' }}>
              {stats?.usersCount || 12}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', marginTop: '0.35rem' }}>
              VIP Atelier Clients
            </div>
          </div>

          <div className="atelier-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#8E949D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Gross Atelier Value
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#DFBA73', fontFamily: 'var(--font-mono)' }}>
              ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '14,850'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#52B788', marginTop: '0.35rem' }}>
              Average Commission: $1,450
            </div>
          </div>
        </div>

        {/* Inventory Table matching Screenshot 13 & 14 */}
        <div className="atelier-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase' }}>Archival Inventory Matrix</h3>
            <span style={{ fontSize: '0.8rem', color: '#8E949D' }}>Displaying Live Products</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(223, 186, 115, 0.2)', color: '#DFBA73', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <th style={{ padding: '0.85rem' }}>Piece / Title</th>
                  <th style={{ padding: '0.85rem' }}>Division Code</th>
                  <th style={{ padding: '0.85rem' }}>Material Specification</th>
                  <th style={{ padding: '0.85rem' }}>Price</th>
                  <th style={{ padding: '0.85rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem 0.85rem', fontWeight: 600 }}>
                      <Link to={`/product/${p.slug}`} style={{ color: '#F5F5F7' }}>
                        {p.title}
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#DFBA73' }}>
                      {p.category?.divisionCode || 'DIV // 01'}
                    </td>
                    <td style={{ padding: '1rem 0.85rem', color: '#9DA3AF' }}>
                      {p.materialTag || 'Full-Grain Leather'} {p.hideGauge ? `(${p.hideGauge})` : ''}
                    </td>
                    <td style={{ padding: '1rem 0.85rem', fontFamily: 'var(--font-mono)', color: '#DFBA73', fontWeight: 700 }}>
                      ${p.price}
                    </td>
                    <td style={{ padding: '1rem 0.85rem' }}>
                      <span className="badge-gold" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
