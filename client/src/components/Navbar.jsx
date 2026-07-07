import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand flex-shrink-0" id="navbar-brand-link">
        <div className="navbar-logo">🗳</div>
        <div className="navbar-title">
          Vote<span>India</span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div className="navbar-badge d-none d-sm-flex">
          <span>●</span> Secure Registration Portal
        </div>
        {!isAdmin && (
          <Link to="/admin" className="btn btn-ghost btn-sm flex-shrink-0" id="admin-link" style={{ fontSize: '0.8rem', padding: '6px 12px', whiteSpace: 'nowrap' }}>
            Admin Panel
          </Link>
        )}
        {isAdmin && (
          <Link to="/" className="btn btn-ghost btn-sm flex-shrink-0" id="home-link" style={{ fontSize: '0.8rem', padding: '6px 12px', whiteSpace: 'nowrap' }}>
            ← Home
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
