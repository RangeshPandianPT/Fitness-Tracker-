import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FiActivity, FiZap, FiTrendingUp, FiClock, FiPlus } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/workouts/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const lineChartData = {
    labels: stats?.last7Days?.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }) || [],
    datasets: [
      {
        label: 'Calories Burned',
        data: stats?.last7Days?.map(d => d.calories) || [],
        fill: true,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 6
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          color: '#64748b'
        },
        beginAtZero: true
      }
    }
  };

  const doughnutData = {
    labels: Object.keys(stats?.workoutsByType || {}),
    datasets: [
      {
        data: Object.values(stats?.workoutsByType || {}),
        backgroundColor: [
          '#ef4444',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 8
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '70%'
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's your fitness overview</p>
        </div>
        <Link to="/workouts" className="btn btn-primary">
          <FiPlus size={18} />
          Add Workout
        </Link>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiActivity size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalWorkouts || 0}</h3>
            <p>Total Workouts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FiZap size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalCalories?.toLocaleString() || 0}</h3>
            <p>Calories Burned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FiTrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.streak || 0}</h3>
            <p>Day Streak 🔥</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FiClock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalDuration || 0}</h3>
            <p>Minutes Active</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Weekly Activity</h3>
          </div>
          <div style={{ height: '300px' }}>
            {stats?.last7Days?.length > 0 ? (
              <Line data={lineChartData} options={lineChartOptions} />
            ) : (
              <div className="empty-state">
                <p>No workout data yet. Start logging workouts!</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Workout Distribution</h3>
          </div>
          <div style={{ height: '300px' }}>
            {Object.keys(stats?.workoutsByType || {}).length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="empty-state">
                <p>No workout types yet. Add different workout types!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
