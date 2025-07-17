import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  const colors = {
    info: '#00eaff',
    success: '#4caf50',
    error: '#ff4d4f',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      background: colors[type] || '#00eaff',
      color: '#222',
      padding: '1rem 2rem',
      borderRadius: '12px',
      boxShadow: '0 2px 16px #0008',
      zIndex: 2000,
      fontWeight: 'bold',
      fontSize: '1rem',
      minWidth: 180,
      textAlign: 'center',
      opacity: 0.97,
      transition: 'opacity 0.3s',
    }}>
      {message}
    </div>
  );
} 