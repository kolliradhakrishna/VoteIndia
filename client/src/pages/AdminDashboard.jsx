import { useState, useEffect, useCallback } from 'react';
import { queryVoters, getStats, updateVoterStatus, deleteVoter } from '../store/voterStore';

const STATUS_COLORS = {
  Pending: 'badge-gold',
  Approved: 'badge-green',
  Rejected: 'badge-danger',
};

const BASE_URL = import.meta.env.VITE_API_URL || '';

const AdminDashboard = () => {
  const [voters, setVoters] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const LIMIT = 8;

  const refresh = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const [result, statsData] = await Promise.all([
        queryVoters({ search, state: filterState, status: filterStatus, page, limit: LIMIT }),
        getStats(),
      ]);
      setVoters(result.data);
      setTotalPages(result.pages);
      setTotal(result.total);
      setStats(statsData);
    } catch (err) {
      setApiError(err?.message || 'Failed to load data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [search, filterState, filterStatus, page]);

  useEffect(() => {
    refresh();
  }, [page, filterState, filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refresh();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateVoterStatus(id, newStatus);
      refresh();
      if (selected?._id === id) setSelected((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err?.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voter record?')) return;
    try {
      await deleteVoter(id);
      if (selected?._id === id) setSelected(null);
      refresh();
    } catch (err) {
      alert(err?.message || 'Failed to delete voter.');
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

  // Resolve photo URL — backend stores /uploads/filename, so prepend BASE_URL
  const resolvePhoto = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh' }}>
      <div className="page-bg" aria-hidden="true"><div className="page-bg-blob" /></div>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Header */}
        <div className="animate-fadeInUp" style={{ marginBottom: '36px' }}>
          <div className="badge badge-saffron" style={{ marginBottom: '14px' }}>Admin Dashboard</div>
          <h1 className="heading-xl" style={{ marginBottom: '8px' }}>
            Voter <span className="text-gradient">Registry</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Manage and monitor all voter registrations. Total: <strong style={{ color: 'var(--white)' }}>{total}</strong>
          </p>
          <div className="tricolor-stripe" style={{ maxWidth: '120px', marginTop: '16px' }} />
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div style={{
            background: 'rgba(255,71,87,0.1)',
            border: '1px solid rgba(255,71,87,0.4)',
            borderRadius: '10px',
            padding: '14px 20px',
            color: 'var(--danger-light)',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}>
            ⚠️ {apiError}
          </div>
        )}

        {/* Stats Row */}
        {stats && (
          <div className="animate-fadeInUp animate-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Registered', value: stats.total, color: 'var(--saffron)', bg: 'rgba(255,153,51,0.08)', border: 'rgba(255,153,51,0.2)' },
              { label: 'Pending Review', value: stats.pending, color: 'var(--gold)', bg: 'rgba(245,197,24,0.08)', border: 'rgba(245,197,24,0.2)' },
              { label: 'Approved', value: stats.approved, color: 'var(--success)', bg: 'rgba(46,213,115,0.08)', border: 'rgba(46,213,115,0.2)' },
              { label: 'Rejected', value: stats.rejected, color: 'var(--danger-light)', bg: 'rgba(255,71,87,0.08)', border: 'rgba(255,71,87,0.2)' },
            ].map((s) => (
              <div key={s.label} className="stat-card glass-card" style={{ background: s.bg, borderColor: s.border }}>
                <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '24px' }}>
          {/* Table Panel */}
          <div>
            {/* Filters */}
            <div className="glass-card animate-fadeInUp animate-delay-2" style={{ padding: '20px', marginBottom: '20px' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  id="admin-search-input"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="🔍 Search name, email, voter ID..."
                  className="form-input"
                  style={{ flex: 2, minWidth: '200px' }}
                />
                <select
                  id="admin-state-filter"
                  value={filterState}
                  onChange={(e) => { setFilterState(e.target.value); setPage(1); }}
                  className="form-select"
                  style={{ flex: 1, minWidth: '140px' }}
                >
                  <option value="">All States</option>
                  {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Rajasthan', 'Kerala', 'Bihar'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  id="admin-status-filter"
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  className="form-select"
                  style={{ flex: 1, minWidth: '130px' }}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button type="submit" id="admin-search-btn" className="btn btn-primary btn-sm">Search</button>
              </form>
            </div>

            {/* Table */}
            <div className="glass-card animate-fadeInUp animate-delay-3" style={{ overflow: 'hidden' }}>
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                  <p className="text-muted">Loading registrations...</p>
                </div>
              ) : voters.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                  <p className="text-muted" style={{ marginBottom: '8px' }}>No registrations found</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Registrations will appear here after users complete the form.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table" id="voters-table">
                    <thead>
                      <tr>
                        <th>Voter ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>State</th>
                        <th>Registered</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voters.map((v) => (
                        <tr key={v._id}>
                          <td>
                            <code style={{ color: 'var(--gold)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {v.voterIdNumber}
                            </code>
                          </td>
                          <td>
                            <div style={{ fontWeight: '500' }}>{v.fullName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{v.email}</div>
                          </td>
                          <td>{v.age}</td>
                          <td>{v.state}</td>
                          <td>{formatDate(v.registrationDate)}</td>
                          <td>
                            <span className={`badge ${STATUS_COLORS[v.status] || 'badge-gold'}`} style={{ fontSize: '0.75rem' }}>
                              {v.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                id={`view-voter-${v._id}`}
                                className="btn btn-ghost btn-sm"
                                onClick={() => setSelected(v)}
                                title="View details"
                              >
                                👁
                              </button>
                              {v.status !== 'Approved' && (
                                <button
                                  id={`approve-voter-${v._id}`}
                                  className="btn btn-green btn-sm"
                                  onClick={() => handleStatusChange(v._id, 'Approved')}
                                  title="Approve"
                                >
                                  ✓
                                </button>
                              )}
                              {v.status !== 'Rejected' && (
                                <button
                                  id={`reject-voter-${v._id}`}
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleStatusChange(v._id, 'Rejected')}
                                  title="Reject"
                                >
                                  ✗
                                </button>
                              )}
                              <button
                                id={`delete-voter-${v._id}`}
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleDelete(v._id)}
                                title="Delete"
                                style={{ color: 'var(--danger-light)' }}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', gap: '8px', borderTop: '1px solid var(--glass-border)' }}>
                  <button
                    id="admin-prev-page"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>
                  <span style={{ padding: '6px 16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    id="admin-next-page"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="glass-card animate-scaleIn" style={{ padding: '24px', alignSelf: 'start', position: 'sticky', top: '88px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <div className="heading-md">Voter Details</div>
                <button id="close-detail-panel" className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>

              {selected.photoUrl && (
                <img
                  src={resolvePhoto(selected.photoUrl)}
                  alt="Voter"
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--saffron)', marginBottom: '16px', display: 'block' }}
                />
              )}

              <code style={{ color: 'var(--gold)', fontFamily: 'monospace', fontWeight: '700', fontSize: '1rem', display: 'block', marginBottom: '8px' }}>
                {selected.voterIdNumber}
              </code>

              <span className={`badge ${STATUS_COLORS[selected.status]}`} style={{ marginBottom: '20px', display: 'inline-flex' }}>
                {selected.status}
              </span>

              {[
                { label: 'Full Name', value: selected.fullName },
                { label: 'Age', value: `${selected.age} years` },
                { label: 'Gender', value: selected.gender },
                { label: 'Phone', value: selected.phone },
                { label: 'Email', value: selected.email },
                { label: 'City', value: `${selected.city}, ${selected.state}` },
                { label: 'PIN', value: selected.pinCode },
                { label: 'Registered', value: formatDate(selected.registrationDate) },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.value}</div>
                </div>
              ))}

              <div className="divider" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  id="detail-approve-btn"
                  className="btn btn-green btn-sm btn-full"
                  onClick={() => handleStatusChange(selected._id, 'Approved')}
                  disabled={selected.status === 'Approved'}
                >
                  ✓ Approve
                </button>
                <button
                  id="detail-reject-btn"
                  className="btn btn-danger btn-sm btn-full"
                  onClick={() => handleStatusChange(selected._id, 'Rejected')}
                  disabled={selected.status === 'Rejected'}
                >
                  ✗ Reject
                </button>
                <button
                  id="detail-delete-btn"
                  className="btn btn-ghost btn-sm btn-full"
                  onClick={() => handleDelete(selected._id)}
                  style={{ color: 'var(--danger-light)' }}
                >
                  🗑 Delete Record
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
