import React from 'react';
import SignalCluster3D from './SignalCluster3D';

export default function LeadDetail({ lead }) {
  if (!lead) return <div className="lead-detail lead-detail-fadein" style={{ color: '#aaa', textAlign: 'center' }}>Select a lead to view details.</div>;

  const hasSignals = lead.ai_analysis && Object.keys(lead.ai_analysis).length > 0;

  return (
    <div className="lead-detail lead-detail-fadein">
      <h2 className="lead-detail-title">{lead.url}</h2>
      <div className="lead-detail-timestamp">{lead.timestamp && new Date(lead.timestamp).toLocaleString()}</div>
      <h3 style={{ marginBottom: '0.5rem' }}>AI Buying Signals</h3>
      {hasSignals ? (
        <ul className="lead-detail-signals">
          {Object.entries(lead.ai_analysis).map(([key, value]) => (
            <li key={key} style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#ffd700' }}>{key}:</strong> {String(value)}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: '#ff4d4f' }}>No buying signals found.</div>
      )}
      {hasSignals && (
        <div style={{ marginTop: '2rem' }}>
          <SignalCluster3D lead={lead} />
        </div>
      )}
    </div>
  );
}

// Add keyframes to global style
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}`;
document.head.appendChild(style); 