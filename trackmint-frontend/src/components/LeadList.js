import React from 'react';
import LeadCard from './LeadCard';

export default function LeadList({ leads, onSelect, selectedId }) {
  return (
    <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '2rem' }}>
      {leads.length === 0 && <div style={{ color: '#aaa', textAlign: 'center' }}>No leads yet.</div>}
      {leads.map(lead => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onClick={() => onSelect(lead.id)}
          selected={lead.id === selectedId}
        />
      ))}
    </div>
  );
} 