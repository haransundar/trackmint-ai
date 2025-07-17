import React, { useEffect, useState } from 'react';
import DataConstellation from './DataConstellation';
import CompanyForm from './components/CompanyForm';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import LeadFilterBar from './components/LeadFilterBar';
import SettingsPanel from './components/SettingsPanel';
import AuthPanel from './components/AuthPanel';
import Toast from './components/Toast';
import { processCompany, getLeads, getLead } from './api';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ keyword: '', signal: '', sort: 'score' });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('trackmint_user'));
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setError('');
    try {
      const data = await getLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to fetch leads.');
    }
  }

  async function handleSubmit(url) {
    setLoading(true);
    setError('');
    try {
      const result = await processCompany(url);
      if (!result.success) {
        setError(result.message || 'Analysis failed.');
        setToast({ message: result.message || 'Analysis failed.', type: 'error' });
      } else {
        await fetchLeads();
        setError('');
        setToast({ message: 'Lead processed and saved!', type: 'success' });
      }
    } catch (e) {
      setError('Failed to process company.');
      setToast({ message: 'Failed to process company.', type: 'error' });
    }
    setLoading(false);
  }

  async function handleSelect(id) {
    setSelectedId(id);
    setSelectedLead(null);
    setError('');
    try {
      const data = await getLead(id);
      setSelectedLead(data);
    } catch (e) {
      setError('Failed to fetch lead details.');
      setToast({ message: 'Failed to fetch lead details.', type: 'error' });
    }
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  // Filtering, searching, and sorting logic
  const filteredLeads = leads
    .filter(lead => {
      // Keyword search (url or any signal value)
      const kw = filter.keyword.toLowerCase();
      if (kw && !lead.url.toLowerCase().includes(kw) && !Object.values(lead.ai_analysis || {}).some(v => String(v).toLowerCase().includes(kw))) {
        return false;
      }
      // Signal type filter
      if (filter.signal && !(lead.ai_analysis && lead.ai_analysis[filter.signal])) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filter.sort === 'score') {
        const sa = a.ai_analysis ? Object.keys(a.ai_analysis).length : 0;
        const sb = b.ai_analysis ? Object.keys(b.ai_analysis).length : 0;
        return sb - sa;
      } else if (filter.sort === 'recent') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (filter.sort === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return 0;
    });

  if (!loggedIn) {
    return <AuthPanel onAuthChange={setLoggedIn} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <DataConstellation />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="App-main" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <header className="App-header" style={{ color: '#fff', textShadow: '0 2px 8px #000', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>TrackMint AI - Signal Intelligence Hub</h1>
            <p>Discover actionable B2B buying signals in real time.</p>
          </div>
          <button onClick={() => setSettingsOpen(true)} style={{ background: 'none', border: 'none', color: '#00eaff', fontSize: '1.5rem', cursor: 'pointer', marginLeft: '1rem', padding: '0.5rem' }} title="Settings">
            <span role="img" aria-label="settings">⚙️</span>
          </button>
        </header>
        <CompanyForm onSubmit={handleSubmit} loading={loading} />
        <LeadFilterBar onFilterChange={handleFilterChange} />
        {error && <div style={{ color: '#ff4d4f', marginBottom: '1rem' }}>{error}</div>}
        <div className="App-main" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <LeadList leads={filteredLeads} onSelect={handleSelect} selectedId={selectedId} />
          </div>
          <div style={{ flex: 2 }}>
            <LeadDetail lead={selectedLead} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
