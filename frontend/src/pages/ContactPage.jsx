import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneOrHandle: '',
    categoryInterest: 'Motorbike Riding Suits (Bespoke)',
    measurementsNotes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const instagramUrl = 'https://www.instagram.com/velaroclothing_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleInstagramDirect = () => {
    const text = `Hello Velaro Atelier, I would like to inquire about a bespoke commission:%0A- Name: ${encodeURIComponent(formData.fullName || 'Client')}%0A- Division: ${encodeURIComponent(formData.categoryInterest)}%0A- Notes: ${encodeURIComponent(formData.measurementsNotes || 'Custom tailored request')}`;
    navigator.clipboard?.writeText(`Client: ${formData.fullName}\nDivision: ${formData.categoryInterest}\nNotes: ${formData.measurementsNotes}`);
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ backgroundColor: '#0C0D0E', minHeight: '85vh', padding: '4rem 0 7rem 0' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge-gold" style={{ marginBottom: '1rem' }}>
            PRIVATE COMMISSIONS & CLIENT SERVICES
          </span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '1rem',
            color: '#F5F5F7'
          }}>
            Initiate Your Bespoke Order
          </h1>
          <p style={{
            color: '#9DA3AF',
            fontSize: '1.05rem',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Every Velaro bespoke commission is drafted individually to client anatomy. Connect directly with our master tailors via Instagram Direct or submit your private atelier inquiry below.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Direct Instagram Atelier Card */}
          <div className="atelier-card" style={{ padding: '2.5rem', background: '#0F1113' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(223, 186, 115, 0.12)',
                border: '1px solid rgba(223, 186, 115, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DFBA73'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#DFBA73', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                  OFFICIAL ATELIER CHANNEL
                </span>
                <h3 style={{ fontSize: '1.4rem', color: '#FFF' }}>@velaroclothing_</h3>
              </div>
            </div>

            <p style={{ color: '#C2C8D2', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Direct messaging on Instagram is our primary and fastest conduit for custom leather hide selections, CE armor configurations, and colorway pattern drafting.
            </p>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '0.85rem',
                gap: '10px',
                marginBottom: '1.25rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Open Instagram & Direct Message ↗</span>
            </a>

            <div style={{
              background: '#070809',
              border: '1px solid rgba(223, 186, 115, 0.15)',
              borderRadius: '6px',
              padding: '1.25rem',
              marginTop: '1.5rem'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#DFBA73', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Atelier Commission Guidelines:
              </span>
              <ul style={{ color: '#8E949D', fontSize: '0.8rem', paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                <li>Typical turn-around time: 14 to 28 business days.</li>
                <li>Leather gauges available: 1.2mm, 1.3mm, and 1.4mm Italian bovine & kangaroo.</li>
                <li>Full custom aero humps, knee puck placements, and CE AAA certifications.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Commission Form */}
          <div className="atelier-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Private Commission Spec Sheet
            </h3>
            <p style={{ color: '#8E949D', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Fill in your specifications to copy your dossier and open Instagram directly.
            </p>

            {submitted ? (
              <div style={{
                background: 'rgba(223, 186, 115, 0.1)',
                border: '1px solid #DFBA73',
                borderRadius: '6px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '1.8rem', color: '#DFBA73', display: 'block', marginBottom: '0.5rem' }}>✓</span>
                <h4 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Dossier Formatted</h4>
                <p style={{ color: '#C2C8D2', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Your bespoke requirements have been formatted. Click below to copy details and jump straight into our Instagram DM.
                </p>
                <button
                  type="button"
                  onClick={handleInstagramDirect}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  📋 Copy Spec & Open Instagram DM ↗
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Full Name / Call-Sign *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#070809',
                      border: '1px solid rgba(223, 186, 115, 0.2)',
                      borderRadius: '4px',
                      color: '#FFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Email or Instagram Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @yourhandle or client@domain.com"
                    value={formData.phoneOrHandle}
                    onChange={(e) => setFormData({ ...formData, phoneOrHandle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#070809',
                      border: '1px solid rgba(223, 186, 115, 0.2)',
                      borderRadius: '4px',
                      color: '#FFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Division of Interest
                  </label>
                  <select
                    value={formData.categoryInterest}
                    onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#070809',
                      border: '1px solid rgba(223, 186, 115, 0.2)',
                      borderRadius: '4px',
                      color: '#FFF',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Motorbike Riding Suits (Bespoke)">Motorbike Riding Suits (Bespoke CE AAA)</option>
                    <option value="Leather Jackets (Custom Fitted)">Leather Jackets (1.3mm Italian Full-Grain)</option>
                    <option value="Heavy Hoodies (500 GSM Loopback)">Heavy Hoodies (500 GSM French Terry)</option>
                    <option value="Streetwear (Cordura / Technical)">Streetwear & Modular Armor</option>
                    <option value="Sportswear (Engineered Aero)">Sportswear (Aero Compressive)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#DFBA73', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Silhouette & Customization Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your height, chest/waist measurements, hide preference, armor level, or specific livery colors..."
                    value={formData.measurementsNotes}
                    onChange={(e) => setFormData({ ...formData, measurementsNotes: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: '#070809',
                      border: '1px solid rgba(223, 186, 115, 0.2)',
                      borderRadius: '4px',
                      color: '#FFF',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '0.95rem',
                    marginTop: '0.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  Generate Inquiry & Connect on Instagram ↗
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
