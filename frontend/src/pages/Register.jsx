import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiActivity } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const success = await register(name, email, password);
    
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const displayError = localError || error;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FiActivity size={32} style={{ color: '#6366f1' }} />
          </div>
          <h1>Create Account</h1>
          <p>Start your fitness journey today</p>
        </div>

        {displayError && (
          <div className="alert alert-error">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <FiUser style={{ marginRight: '0.5rem' }} />
              Full Name
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
                setLocalError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMail style={{ marginRight: '0.5rem' }} />
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
                setLocalError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiLock style={{ marginRight: '0.5rem' }} />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
                setLocalError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiLock style={{ marginRight: '0.5rem' }} />
              Confirm Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
                setLocalError('');
              }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
