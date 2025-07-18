import React from 'react';

export default function LeadCard({ lead, onClick, selected }) {
  // Simple lead score based on number of signals
  const score = lead.ai_analysis ? Object.keys(lead.ai_analysis).length : 0;
  const glowClass = selected ? 'lead-card-selected' : '';

  return (
    <div
      onClick={onClick}
      className={`lead-card ${glowClass}`}
    >
      <div className="lead-card-url">{lead.url}</div>
      <div className="lead-card-signals">
        {score > 0 ? `${score} buying signals` : 'No signals found'}
      </div>
      <div className="lead-card-timestamp">{lead.timestamp && new Date(lead.timestamp).toLocaleString()}</div>
    </div>
  );
} 