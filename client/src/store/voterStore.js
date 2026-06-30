// localStorage-based voter data store — no backend required
const STORAGE_KEY = 'voteindia_registrations';

// Generate a unique voter ID
export const generateVoterId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `VTR-${random}`;
};

// Get all voters from localStorage
export const getAllVoters = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save a new voter to localStorage
export const saveVoter = (voterData) => {
  const voters = getAllVoters();

  // Check duplicate Aadhar
  const existing = voters.find((v) => v.aadharNumber === voterData.aadharNumber);
  if (existing) {
    throw { code: 'DUPLICATE', voterIdNumber: existing.voterIdNumber };
  }

  const newVoter = {
    _id: Date.now().toString(),
    voterIdNumber: generateVoterId(),
    ...voterData,
    status: 'Pending',
    registrationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  voters.unshift(newVoter); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
  return newVoter;
};

// Update voter status
export const updateVoterStatus = (id, status) => {
  const voters = getAllVoters();
  const idx = voters.findIndex((v) => v._id === id);
  if (idx === -1) throw new Error('Voter not found');
  voters[idx].status = status;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
  return voters[idx];
};

// Delete voter
export const deleteVoter = (id) => {
  const voters = getAllVoters().filter((v) => v._id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
};

// Get stats
export const getStats = () => {
  const voters = getAllVoters();
  const byState = voters.reduce((acc, v) => {
    acc[v.state] = (acc[v.state] || 0) + 1;
    return acc;
  }, {});
  const byStateArr = Object.entries(byState)
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: voters.length,
    pending: voters.filter((v) => v.status === 'Pending').length,
    approved: voters.filter((v) => v.status === 'Approved').length,
    rejected: voters.filter((v) => v.status === 'Rejected').length,
    byState: byStateArr,
  };
};

// Search + filter + paginate voters
export const queryVoters = ({ search = '', state = '', status = '', page = 1, limit = 8 }) => {
  let voters = getAllVoters();

  if (search) {
    const q = search.toLowerCase();
    voters = voters.filter(
      (v) =>
        v.fullName?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.voterIdNumber?.toLowerCase().includes(q)
    );
  }
  if (state) voters = voters.filter((v) => v.state === state);
  if (status) voters = voters.filter((v) => v.status === status);

  const total = voters.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = voters.slice(start, start + limit);

  return { total, pages, data };
};
