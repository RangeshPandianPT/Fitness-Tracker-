import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiActivity, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FiActivity size={22} />
          FitTracker
        </Link>

        <div className="navbar-nav">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') || isActive('/') ? 'active' : ''}`}
          >
            <FiHome size={18} />
            Dashboard
          </Link>
          <Link
            to="/workouts"
            className={`nav-link ${isActive('/workouts') ? 'active' : ''}`}
          >
            <FiActivity size={18} />
            Workouts
          </Link>
          
          <Link
            to="/profile"
            className={`nav-profile ${isActive('/profile') ? 'active' : ''}`}
          >
            <div className="nav-avatar">
              {getInitials(user?.name)}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: isActive('/profile') ? '#4f46e5' : '#64748b' }}>
              {user?.name?.split(' ')[0]}
            </span>
          </Link>
          
          <button onClick={logout} className="btn btn-secondary" style={{ marginLeft: '0.5rem' }}>
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
