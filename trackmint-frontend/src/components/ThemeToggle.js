import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('trackmint_theme') !== 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('light-mode', !dark);
    localStorage.setItem('trackmint_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      style={{ background: 'none', border: 'none', color: '#00eaff', fontSize: '1.5rem', cursor: 'pointer', marginLeft: '1rem', padding: '0.5rem' }}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <span role="img" aria-label="moon">🌙</span> : <span role="img" aria-label="sun">☀️</span>}
 