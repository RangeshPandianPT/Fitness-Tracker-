const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (demo mode - data resets on server restart)
const users = [];
const workouts = [];
let userIdCounter = 1;
let workoutIdCounter = 1;

const JWT_SECRET = 'demo_jwt_secret_key_2024';

// Auth Middleware
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find(u => u._id === decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      _id: String(userIdCounter++),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt
  });
});

// ==================== WORKOUT ROUTES ====================

// Get all workouts
app.get('/api/workouts', protect, (req, res) => {
  const userWorkouts = workouts
    .filter(w => w.user === req.user._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(userWorkouts);
});

// Get stats
app.get('/api/workouts/stats', protect, (req, res) => {
  const userWorkouts = workouts.filter(w => w.user === req.user._id);
  
  const totalWorkouts = userWorkouts.length;
  const totalCalories = userWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const totalDuration = userWorkouts.reduce((sum, w) => sum + w.duration, 0);

  // Calculate streak
  const sortedDates = [...new Set(
    userWorkouts.map(w => new Date(w.date).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const workoutDate = new Date(sortedDates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    if (workoutDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }

  // Workouts by type
  const workoutsByType = userWorkouts.reduce((acc, w) => {
    acc[w.exerciseType] = (acc[w.exerciseType] || 0) + 1;
    return acc;
  }, {});

  // Last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const dayWorkouts = userWorkouts.filter(w => {
      const wDate = new Date(w.date);
      return wDate >= date && wDate < nextDate;
    });

    last7Days.push({
      date: date.toISOString().split('T')[0],
      calories: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      count: dayWorkouts.length
    });
  }

  res.json({ totalWorkouts, totalCalories, totalDuration, streak, workoutsByType, last7Days });
});

// Get single workout
app.get('/api/workouts/:id', protect, (req, res) => {
  const workout = workouts.find(w => w._id === req.params.id && w.user === req.user._id);
  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  res.json(workout);
});

// Create workout
app.post('/api/workouts', protect, (req, res) => {
  const { exerciseName, exerciseType, duration, caloriesBurned, sets, reps, weight, distance, notes, date } = req.body;

  if (!exerciseName || !exerciseType || !duration || caloriesBurned === undefined) {
    return res.status(400).json({ message: 'Please fill required fields' });
  }

  const workout = {
    _id: String(workoutIdCounter++),
    user: req.user._id,
    exerciseName,
    exerciseType,
    duration: parseInt(duration),
    caloriesBurned: parseInt(caloriesBurned),
    sets: sets ? parseInt(sets) : 0,
    reps: reps ? parseInt(reps) : 0,
    weight: weight ? parseFloat(weight) : 0,
    distance: distance ? parseFloat(distance) : 0,
    notes: notes || '',
    date: date ? new Date(date) : new Date(),
    createdAt: new Date()
  };

  workouts.push(workout);
  res.status(201).json(workout);
});

// Update workout
app.put('/api/workouts/:id', protect, (req, res) => {
  const index = workouts.findIndex(w => w._id === req.params.id && w.user === req.user._id);
  if (index === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  workouts[index] = { ...workouts[index], ...req.body };
  res.json(workouts[index]);
});

// Delete workout
app.delete('/api/workouts/:id', protect, (req, res) => {
  const index = workouts.findIndex(w => w._id === req.params.id && w.user === req.user._id);
  if (index === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  workouts.splice(index, 1);
  res.json({ message: 'Workout removed' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fitness Tracker API running in DEMO mode (in-memory storage)' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🏋️ Fitness Tracker API running in DEMO mode`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`⚠️  Note: Data is stored in memory and will reset on server restart\n`);
});
