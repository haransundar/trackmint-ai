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
    <form onSubmit={handleSubmit} className="company-form">
      <input
        type="url"
        placeholder="Enter company website URL..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="company-input"
        disabled={loading}
        required
      />
      <button
        type="submit"
        className="company-analyze-btn"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Analyze'}
      </button>
      {error && <span className="company-form-error">{error}</span>}
    </form>
  );
} 