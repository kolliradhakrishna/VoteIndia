import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" id="navbar-brand-link">
        <div className="navbar-logo">🗳</div>
        <div className="navbar-title">
          Vote<span>India</span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="navbar-badge">
          <span>●</span> Secure Registration Portal
        </div>
        {!isAdmin && (
          <Link to="/admin" className="btn btn-ghost btn-sm" id="admin-link" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            Admin Panel
          </Link>
        )}
        {isAdmin && (
          <Link to="/" className="btn btn-ghost btn-sm" id="home-link" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            ← Home
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
