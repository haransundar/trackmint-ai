import React, { useState } from 'react';

const signalTypes = [
  'funding',
  'new_hire',
  'expansion',
  'hiring',
  'product_launch',
  'integration',
];

export default function LeadFilterBar({ onFilterChange }) {
  const [keyword, setKeyword] = useState('');
  const [signal, setSignal] = useState('');
  const [sort, setSort] = useState('score');

  function handleChange() {
    onFilterChange({ keyword, signal, sort });
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search by keyword..."
        value={keyword}
        onChange={e => { setKeyword(e.target.value); setTimeout(handleChange, 0); }}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #00eaff', minWidth: 180 }}
      />
      <select
        value={signal}
        onChange={e => { setSignal(e.target.value); handleChange(); }}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #00eaff' }}
      >
        <option value="">All Signals</option>
        {signalTypes.map(type => (
          <option key={type} value={type}>{type.replace('_', ' ')}</option>
        ))}
      </select>
      <select
        value={sort}
        onChange={e => { setSort(e.target.value); handleChange(); }}
        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #00eaff' }}
      >
        <option value="score">Sort by Score</option>
        <option value="recent">Sort by Recent</option>
        <option value="oldest">Sort by Oldest</option>
      </select>
    </div>
  );
} 