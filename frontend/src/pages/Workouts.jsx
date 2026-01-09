import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiClock, FiZap, FiCalendar } from 'react-icons/fi';
import api from '../services/api';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    exerciseName: '',
    exerciseType: 'cardio',
    duration: '',
    caloriesBurned: '',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get('/workouts');
      setWorkouts(response.data);
    } catch (err) {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      exerciseName: '',
      exerciseType: 'cardio',
      duration: '',
      caloriesBurned: '',
      sets: '',
      reps: '',
      weight: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingWorkout(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      exerciseName: workout.exerciseName,
      exerciseType: workout.exerciseType,
      duration: workout.duration.toString(),
      caloriesBurned: workout.caloriesBurned.toString(),
      sets: workout.sets?.toString() || '',
      reps: workout.reps?.toString() || '',
      weight: workout.weight?.toString() || '',
      notes: workout.notes || '',
      date: new Date(workout.date).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const workoutData = {
      ...formData,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned),
      sets: formData.sets ? parseInt(formData.sets) : 0,
      reps: formData.reps ? parseInt(formData.reps) : 0,
      weight: formData.weight ? parseFloat(formData.weight) : 0
    };

    try {
      if (editingWorkout) {
        const response = await api.put(`/workouts/${editingWorkout._id}`, workoutData);
        setWorkouts(prev => prev.map(w => w._id === editingWorkout._id ? response.data : w));
      } else {
        const response = await api.post('/workouts', workoutData);
        setWorkouts(prev => [response.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save workout');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;

    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      setError('Failed to delete workout');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">My Workouts</h1>
          <p className="page-subtitle">Track and manage your exercises</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <FiPlus size={18} />
          Add Workout
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <FiX />
          </button>
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🏋️</div>
            <h3>No workouts yet</h3>
            <p>Start by adding your first workout</p>
            <button onClick={openAddModal} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <FiPlus size={18} />
              Add Your First Workout
            </button>
          </div>
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map(workout => (
            <div key={workout._id} className="workout-item">
              <div className="workout-info">
                <span className={`workout-type-badge ${workout.exerciseType}`}>
                  {workout.exerciseType}
                </span>
                <div className="workout-details">
                  <h4>{workout.exerciseName}</h4>
                  <div className="workout-meta">
                    <span><FiClock size={14} /> {workout.duration} min</span>
                    <span><FiZap size={14} /> {workout.caloriesBurned} cal</span>
                    <span><FiCalendar size={14} /> {formatDate(workout.date)}</span>
                  </div>
                </div>
              </div>
              <div className="workout-actions">
                <button onClick={() => openEditModal(workout)} className="btn btn-icon">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleDelete(workout._id)} className="btn btn-icon" style={{ color: '#ef4444' }}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWorkout ? 'Edit Workout' : 'Add New Workout'}</h2>
              <button onClick={closeModal} className="btn btn-icon">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Exercise Name</label>
                  <input
                    type="text"
                    name="exerciseName"
                    className="form-input"
                    placeholder="e.g., Running, Bench Press"
                    value={formData.exerciseName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Exercise Type</label>
                  <select
                    name="exerciseType"
                    className="form-select"
                    value={formData.exerciseType}
                    onChange={handleInputChange}
                  >
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      className="form-input"
                      placeholder="30"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Calories Burned</label>
                    <input
                      type="number"
                      name="caloriesBurned"
                      className="form-input"
                      placeholder="200"
                      min="0"
                      value={formData.caloriesBurned}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {formData.exerciseType === 'strength' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Sets</label>
                      <input
                        type="number"
                        name="sets"
                        className="form-input"
                        placeholder="3"
                        min="0"
                        value={formData.sets}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Reps</label>
                      <input
                        type="number"
                        name="reps"
                        className="form-input"
                        placeholder="12"
                        min="0"
                        value={formData.reps}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        className="form-input"
                        placeholder="50"
                        min="0"
                        step="0.5"
                        value={formData.weight}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea
                    name="notes"
                    className="form-textarea"
                    placeholder="How did the workout feel?"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingWorkout ? 'Update Workout' : 'Add Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
