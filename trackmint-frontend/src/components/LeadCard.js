import React from 'react';

export default function LeadCard({ lead, onClick, selected }) {
  // Simple lead score based on number of signals
  const score = lead.ai_analysis ? Object.keys(lead.ai_analysis).length : 0;
  const glow = score > 2 ? '#00eaff' : score > 0 ? '#ffd700' : '#888';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(20, 30, 40, 0.85)',
        borderRadius: '16px',
        boxShadow: selected ? `0 0 24px 4px ${glow}` : `0 0 8px 2px ${glow}66`,
        border: selected ? `2px solid ${glow}` : '1px solid #222',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        cursor: 'pointer',
        color: '#fff',
        transition: 'box-shadow 0.2s, border 0.2s',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{lead.url}</div>
      <div style={{ fontSize: '0.95rem', color: '#00eaff', marginBottom: '0.5rem' }}>
        {score > 0 ? `${score} buying signals` : 'No signals found'}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{lead.timestamp && new Date(lead.timestamp).toLocaleString()}</div>
    </div>
  );
} 