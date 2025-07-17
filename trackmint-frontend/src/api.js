function getApiUrl() {
  return localStorage.getItem('trackmint_api_url') || process.env.REACT_APP_API_URL || 'http://localhost:8000';
}
function getApiKey() {
  return localStorage.getItem('trackmint_api_key') || process.env.REACT_APP_API_KEY || 'Qw1n7vKp9zX2eR4sT8uY6bH3cJ5mL0aPqW2xZ8vB';
}

async function processCompany(url) {
  const res = await fetch(`${getApiUrl()}/process-company`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
    },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

async function getLeads() {
  const res = await fetch(`${getApiUrl()}/leads`, {
    headers: { 'x-api-key': getApiKey() },
  });
  return res.json();
}

async function getLead(id) {
  const res = await fetch(`${getApiUrl()}/leads/${id}`, {
    headers: { 'x-api-key': getApiKey() },
  });
  return res.json();
}

export { processCompany, getLeads, getLead }; 