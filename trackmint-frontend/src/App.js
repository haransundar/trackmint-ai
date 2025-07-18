import React, { useEffect, useState } from 'react';
import CompanyForm from './components/CompanyForm';
import LeadList from './components/LeadList';
import LeadDetail from './components/LeadDetail';
import LeadFilterBar from './components/LeadFilterBar';
import SettingsPanel from './components/SettingsPanel';
import AuthPanel from './components/AuthPanel';
import Toast from './components/Toast';
import ThemeToggle from './components/ThemeToggle';
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

  const filteredLeads = leads
    .filter(lead => {
      const kw = filter.keyword.toLowerCase();
      if (kw && !lead.url.toLowerCase().includes(kw) && !Object.values(lead.ai_analysis || {}).some(v => String(v).toLowerCase().includes(kw))) {
        return false;
      }
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
    <>
      <div className="background-animated"></div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="App-main">
        <header className="App-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1>TrackMint AI <span className="brand-accent">- Signal Intelligence Hub</span></h1>
              <p className="subtitle">Discover actionable B2B buying signals in real time.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ThemeToggle />
              <button onClick={() => setSettingsOpen(true)} className="settings-btn" title="Settings">
                <span role="img" aria-label="settings">⚙️</span>
              </button>
            </div>
          </div>
        </header>
        <CompanyForm onSubmit={handleSubmit} loading={loading} />
        <LeadFilterBar onFilterChange={handleFilterChange} />
        {error && <div className="error-msg">{error}</div>}
        <div className="dashboard-columns">
          <div className="lead-list-col">
            <LeadList leads={filteredLeads} onSelect={handleSelect} selectedId={selectedId} />
          </div>
          <div className="lead-detail-col">
            <LeadDetail lead={selectedLead} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
