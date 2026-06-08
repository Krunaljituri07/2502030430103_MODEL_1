const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, default: 0 },
  category: { type: String },
  completedAt: { type: Date, default: Date.now },
});

const progressSchema = new mongoose.Schema({
  sessions: { type: Number, default: 0 },
  minutes: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastCompleted: { type: Date },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    completedPrograms: { type: [String], default: [] },
    progress: { type: progressSchema, default: () => ({}) },
    activity: { type: [activitySchema], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
