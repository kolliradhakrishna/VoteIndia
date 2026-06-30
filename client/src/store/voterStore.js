// API-based voter store — calls the Express/MongoDB backend
// VITE_API_URL is set in .env for production (Render URL)
// In local dev it's empty, so Vite proxy forwards /api → localhost:5000

const BASE = import.meta.env.VITE_API_URL || '';

// ── Register a new voter (multipart FormData for photo upload) ──
export const registerVoter = async (formData) => {
  const res = await fetch(`${BASE}/api/voters/register`, {
    method: 'POST',
    body: formData, // FormData — do NOT set Content-Type header (browser sets it)
  });
  const json = await res.json();
  if (!res.ok) throw json; // throw the full error object
  return json;
};

// ── Get dashboard stats ──
export const getStats = async () => {
  const res = await fetch(`${BASE}/api/voters/stats`);
  const json = await res.json();
  if (!res.ok) throw json;
  return json.data;
};

// ── Query voters with search / filter / pagination ──
export const queryVoters = async ({ search = '', state = '', status = '', page = 1, limit = 8 }) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (state)  params.set('state', state);
  if (status) params.set('status', status);
  params.set('page', page);
  params.set('limit', limit);

  const res = await fetch(`${BASE}/api/voters?${params.toString()}`);
  const json = await res.json();
  if (!res.ok) throw json;
  return json; // { success, total, page, pages, data }
};

// ── Update voter approval status ──
export const updateVoterStatus = async (id, status) => {
  const res = await fetch(`${BASE}/api/voters/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};

// ── Delete voter ──
export const deleteVoter = async (id) => {
  const res = await fetch(`${BASE}/api/voters/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};
