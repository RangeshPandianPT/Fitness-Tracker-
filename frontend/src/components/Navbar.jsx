import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiActivity, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FiActivity size={24} />
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
          
          <div className="nav-link" style={{ cursor: 'default' }}>
            <FiUser size={18} />
            {user?.name}
          </div>
          
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
