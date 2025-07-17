import React, { useState, useEffect } from 'react';

export default function SettingsPanel({ open, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    setApiKey(localStorage.getItem('trackmint_api_key') || '');
    setApiUrl(localStorage.getItem('trackmint_api_url') || 'http://localhost:8000');
  }, [open]);

  function handleSave() {
    localStorage.setItem('trackmint_api_key', apiKey);
    localStorage.setItem('trackmint_api_url', apiUrl);
    window.location.reload();
  }

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#18202a', borderRadius: '16px', padding: '2rem', minWidth: 320, color: '#fff', boxShadow: '0 0 32px #00eaff88' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#00eaff' }}>Settings</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #00eaff', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Backend URL</label>
          <input
            type="text"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #00eaff', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', background: '#00eaff', color: '#222', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
} 