// API-based voter store — calls the Express/MongoDB backend
// VITE_API_URL is set in .env for production (Render URL)
// In local dev it's empty, so Vite proxy forwards /api → localhost:5000

const BASE = import.meta.env.VITE_API_URL || '';

// ── Safe JSON parser ──────────────────────────────────────────────────────────
// res.json() throws "Unexpected end of JSON input" when:
//   • the server returns an empty body (network error, CORS block, server crash)
//   • the server returns HTML (e.g. a 502/504 gateway error page)
// This helper reads the raw text first, then tries to parse it.
const safeJson = async (res) => {
  const text = await res.text();

  if (!text || text.trim() === '') {
    throw new Error(
      res.status === 0 || !res.status
        ? 'Cannot reach the server. Please make sure the backend is running.'
        : `Server returned an empty response (HTTP ${res.status}). Is the backend running?`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    // Server returned non-JSON (HTML error page, nginx 502, etc.)
    throw new Error(
      `Server returned an unexpected response (HTTP ${res.status}). ` +
      `Make sure your backend URL is correct and the server is running.\n` +
      `Response preview: ${text.substring(0, 120)}`
    );
  }
};

// ── Register a new voter (multipart FormData for photo upload) ────────────────
export const registerVoter = async (formData) => {
  let res;
  try {
    res = await fetch(`${BASE}/api/voters/register`, {
      method: 'POST',
      body: formData, // FormData — do NOT set Content-Type header (browser sets it with boundary)
    });
  } catch (networkErr) {
    throw new Error('Network error: Cannot reach the backend. Is the server running?');
  }

  const json = await safeJson(res);
  if (!res.ok) throw json;
  return json;
};

// ── Get dashboard stats ───────────────────────────────────────────────────────
export const getStats = async () => {
  let res;
  try {
    res = await fetch(`${BASE}/api/voters/stats`);
  } catch {
    throw new Error('Network error: Cannot reach the backend.');
  }

  const json = await safeJson(res);
  if (!res.ok) throw json;
  return json.data;
};

// ── Query voters with search / filter / pagination ────────────────────────────
export const queryVoters = async ({ search = '', state = '', status = '', page = 1, limit = 8 }) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (state)  params.set('state', state);
  if (status) params.set('status', status);
  params.set('page', page);
  params.set('limit', limit);

  let res;
  try {
    res = await fetch(`${BASE}/api/voters?${params.toString()}`);
  } catch {
    throw new Error('Network error: Cannot reach the backend.');
  }

  const json = await safeJson(res);
  if (!res.ok) throw json;
  return json; // { success, total, page, pages, data }
};

// ── Update voter approval status ──────────────────────────────────────────────
export const updateVoterStatus = async (id, status) => {
  let res;
  try {
    res = await fetch(`${BASE}/api/voters/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch {
    throw new Error('Network error: Cannot reach the backend.');
  }

  const json = await safeJson(res);
  if (!res.ok) throw json;
  return json;
};

// ── Delete voter ──────────────────────────────────────────────────────────────
export const deleteVoter = async (id) => {
  let res;
  try {
    res = await fetch(`${BASE}/api/voters/${id}`, { method: 'DELETE' });
  } catch {
    throw new Error('Network error: Cannot reach the backend.');
  }

  const json = await safeJson(res);
  if (!res.ok) throw json;
  return json;
};
