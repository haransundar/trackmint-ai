import React, { useState } from 'react';

export default function CompanyForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) {
      setError('Please enter a company website URL.');
      return;
    }
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
      <input
        type="url"
        placeholder="Enter company website URL..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #00eaff', fontSize: '1rem' }}
        disabled={loading}
        required
      />
      <button
        type="submit"
        style={{ padding: '0.75rem 2rem', borderRadius: '8px', background: '#00eaff', color: '#222', fontWeight: 'bold', border: 'none', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #00eaff44' }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Analyze'}
      </button>
      {error && <span style={{ color: '#ff4d4f', marginLeft: '1rem' }}>{error}</span>}
    </form>
  );
} 