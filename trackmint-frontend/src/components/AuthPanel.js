import React, { useState, useEffect } from 'react';

export default function AuthPanel({ onAuthChange }) {
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('trackmint_user');
    if (stored) setUsername(stored);
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (input.trim()) {
      localStorage.setItem('trackmint_user', input.trim());
      setUsername(input.trim());
      setInput('');
      onAuthChange(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem('trackmint_user');
    setUsername('');
    onAuthChange(false);
  }

  if (!username) {
    return (
      <form onSubmit={handleLogin} style={{ margin: '2rem auto', maxWidth: 320, background: 'rgba(20,30,40,0.95)', borderRadius: '16px', padding: '2rem', boxShadow: '0 0 16px #00eaff33', color: '#fff' }}>
        <h2 style={{ color: '#00eaff', marginBottom: '1rem' }}>Login</h2>
        <input
          type="text"
          placeholder="Enter your username..."
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #00eaff', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#00eaff', color: '#222', fontWeight: 'bold', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Login</button>
      </form>
    );
  }

  return (
    <div style={{ margin: '2rem auto', maxWidth: 320, background: 'rgba(20,30,40,0.95)', borderRadius: '16px', padding: '2rem', boxShadow: '0 0 16px #00eaff33', color: '#fff', textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem' }}>Logged in as <span style={{ color: '#ffd700' }}>{username}</span></div>
      <button onClick={handleLogout} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#ff4d4f', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>Logout</button>
    </div>
  );
} 