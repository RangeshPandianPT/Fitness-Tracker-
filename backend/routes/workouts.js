const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Workout = require('../models/Workout');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/workouts
// @desc    Get all workouts for logged in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workouts/stats
// @desc    Get workout statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id });
    
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    
    // Calculate workout streak
    const sortedDates = [...new Set(
      workouts.map(w => new Date(w.date).toDateString())
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

    // Get workouts by type
    const workoutsByType = workouts.reduce((acc, w) => {
      acc[w.exerciseType] = (acc[w.exerciseType] || 0) + 1;
      return acc;
    }, {});

    // Get last 7 days of workouts
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const dayWorkouts = workouts.filter(w => {
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

    res.json({
      totalWorkouts,
      totalCalories,
      totalDuration,
      streak,
      workoutsByType,
      last7Days
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Make sure user owns workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/workouts
// @desc    Create a workout
// @access  Private
router.post(
  '/',
  [
    body('exerciseName', 'Exercise name is required').notEmpty(),
    body('exerciseType', 'Exercise type is required').notEmpty(),
    body('duration', 'Duration must be a positive number').isInt({ min: 1 }),
    body('caloriesBurned', 'Calories must be a positive number').isInt({ min: 0 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        exerciseName,
        exerciseType,
        duration,
        caloriesBurned,
        sets,
        reps,
        weight,
        distance,
        notes,
        date
      } = req.body;

      const workout = await Workout.create({
        user: req.user.id,
        exerciseName,
        exerciseType,
        duration,
        caloriesBurned,
        sets: sets || 0,
        reps: reps || 0,
        weight: weight || 0,
        distance: distance || 0,
        notes: notes || '',
        date: date || Date.now()
      });

      res.status(201).json(workout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Make sure user owns workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Make sure user owns workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Workout.findByIdAndDelete(req.params.id);

    res.json({ message: 'Workout removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
