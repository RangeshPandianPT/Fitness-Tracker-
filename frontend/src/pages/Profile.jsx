import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiActivity, FiZap, FiClock, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/workouts/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-large">
              {getInitials(user?.name)}
            </div>
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>

          {/* Profile Body */}
          <div className="profile-body">
            {/* Statistics Section */}
            <div className="profile-section">
              <h3 className="profile-section-title">Fitness Statistics</h3>
              <div className="profile-stats">
                <div className="profile-stat">
                  <div className="profile-stat-value">{stats?.totalWorkouts || 0}</div>
                  <div className="profile-stat-label">Total Workouts</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{stats?.totalCalories?.toLocaleString() || 0}</div>
                  <div className="profile-stat-label">Calories Burned</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{stats?.streak || 0}</div>
                  <div className="profile-stat-label">Day Streak</div>
                </div>
              </div>
            </div>

            {/* Account Info Section */}
            <div className="profile-section">
              <h3 className="profile-section-title">Account Information</h3>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiUser size={18} />
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">Full Name</div>
                  <div className="profile-info-value">{user?.name}</div>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiMail size={18} />
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">Email Address</div>
                  <div className="profile-info-value">{user?.email}</div>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiCalendar size={18} />
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">Member Since</div>
                  <div className="profile-info-value">
                    {user?.createdAt ? formatDate(user.createdAt) : 'Today'}
                  </div>
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <FiClock size={18} />
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">Total Active Time</div>
                  <div className="profile-info-value">{stats?.totalDuration || 0} minutes</div>
                </div>
              </div>
            </div>

            {/* Workout Breakdown */}
            {stats?.workoutsByType && Object.keys(stats.workoutsByType).length > 0 && (
              <div className="profile-section">
                <h3 className="profile-section-title">Workout Breakdown</h3>
                <div className="profile-stats">
                  {Object.entries(stats.workoutsByType).map(([type, count]) => (
                    <div className="profile-stat" key={type}>
                      <div className="profile-stat-value">{count}</div>
                      <div className="profile-stat-label" style={{ textTransform: 'capitalize' }}>{type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
