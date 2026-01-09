const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseType: {
    type: String,
    required: [true, 'Please specify the exercise type'],
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    default: 'other'
  },
  exerciseName: {
    type: String,
    required: [true, 'Please add an exercise name'],
    trim: true,
    maxlength: [100, 'Exercise name cannot be more than 100 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes'],
    min: [1, 'Duration must be at least 1 minute']
  },
  caloriesBurned: {
    type: Number,
    required: [true, 'Please add calories burned'],
    min: [0, 'Calories cannot be negative']
  },
  sets: {
    type: Number,
    default: 0
  },
  reps: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  distance: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
