import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [materialFilter, setMaterialFilter] = useState('all');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        if (res.data?.data?.categories) {
          setCategories(res.data.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: categoryParam || undefined,
          search: searchParam || undefined,
          sort: sortBy,
        };
        const res = await productApi.getProducts(params);
        if (res.data?.data?.products) {
          let list = res.data.data.products;
          if (materialFilter !== 'all') {
            list = list.filter((p) => p.materialTag?.toLowerCase().includes(materialFilter.toLowerCase()));
          }
          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam, searchParam, sortBy, materialFilter]);

  const handleCategorySelect = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>ARCHIVAL CATALOG</span>
          <h1 style={{ fontSize: '2.8rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {categoryParam ? categoryParam.replace('-', ' ') : 'All Collections'}
          </h1>
          <p style={{ color: '#8E949D', fontSize: '0.95rem' }}>
            High-tensile motorsport garments and luxury streetwear engineered for longevity.
          </p>
        </div>

        {/* Filters & Division Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(223, 186, 115, 0.15)',
          paddingBottom: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <button
            onClick={() => handleCategorySelect('all')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: !categoryParam ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.05)',
              color: !categoryParam ? '#0C0D0E' : '#9DA3AF',
              border: !categoryParam ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer'
            }}
          >
            All Works
          </button>

          {categories.map((c) => {
            const active = categoryParam === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => handleCategorySelect(c.slug)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: active ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.05)',
                  color: active ? '#0C0D0E' : '#9DA3AF',
                  border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer'
                }}
              >
                {c.name || c.title}
              </button>
            );
          })}
        </div>

        {/* Sub-filtering bar: Sort & Material */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#8E949D' }}>
            Showing <span style={{ color: '#DFBA73', fontWeight: 700 }}>{products.length}</span> pieces
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Material dropdown */}
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              style={{
                background: '#131518',
                color: '#FFF',
                border: '1px solid rgba(223, 186, 115, 0.2)',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem'
              }}
            >
              <option value="all">All Hides & Materials</option>
              <option value="leather">Full-Grain Leather</option>
              <option value="cotton">Heavy Cotton</option>
              <option value="cordura">Cordura / Technical</option>
            </select>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#131518',
                color: '#FFF',
                border: '1px solid rgba(223, 186, 115, 0.2)',
                borderRadius: '4px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem'
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#DFBA73' }}>
            Loading archival works...
          </div>
        ) : products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {products.map((prod) => (
              <ProductCard key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: 'var(--bg-surface)',
            borderRadius: '8px',
            border: '1px solid rgba(223, 186, 115, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No pieces match your filter</h3>
            <p style={{ color: '#8E949D', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Clear your active filters to browse the complete archive.
            </p>
            <button onClick={() => { setSearchParams({}); setMaterialFilter('all'); }} className="btn btn-outline btn-sm">
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
