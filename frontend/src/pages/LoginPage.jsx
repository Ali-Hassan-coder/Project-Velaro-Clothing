import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        const loggedUser = await login(email, password);
        if (loggedUser?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const parts = name.trim().split(' ');
        const firstName = parts[0] || 'Patron';
        const lastName = parts.slice(1).join(' ') || 'Client';
        await register({ firstName, lastName, email, password });
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="atelier-card" style={{ padding: '2rem', border: '1px solid rgba(223, 186, 115, 0.25)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.5rem', fontSize: '0.65rem' }}>
              ATELIER ACCESS & CONTROL
            </span>
            <h1 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>
              {isLogin ? 'Client & Admin Sign In' : 'Create Patron Account'}
            </h1>
          </div>

          {error && (
            <div style={{
              background: 'rgba(230, 90, 90, 0.12)',
              border: '1px solid rgba(230, 90, 90, 0.3)',
              color: '#FF7B7B',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0C0D0E',
                    border: '1px solid rgba(223, 186, 115, 0.2)',
                    borderRadius: '4px',
                    padding: '0.75rem',
                    color: '#FFF',
                    fontSize: '0.85rem'
                  }}
                  placeholder="e.g. Sterling Archer"
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0C0D0E',
                  border: '1px solid rgba(223, 186, 115, 0.2)',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  color: '#FFF',
                  fontSize: '0.85rem'
                }}
                placeholder="admin@velaroclothing.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#DFBA73', marginBottom: '0.35rem' }}>
                Passphrase
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0C0D0E',
                  border: '1px solid rgba(223, 186, 115, 0.2)',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  color: '#FFF',
                  fontSize: '0.85rem'
                }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {submitting ? 'Authenticating...' : (isLogin ? 'Enter Atelier' : 'Register Profile')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: '#8E949D' }}>
            {isLogin ? "Don't have a patron account? " : "Already registered with Velaro? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{
                color: '#DFBA73',
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isLogin ? 'Register here' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
