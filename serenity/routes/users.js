const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.put('/profile', authMiddleware, async (req, res) => {
  const { bio } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.bio = bio || user.bio;
    await user.save();
    const safeUser = { ...user.toObject(), password: undefined };
    res.json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update profile.' });
  }
});

router.put('/progress', authMiddleware, async (req, res) => {
  const { title, description, duration, category } = req.body;
  if (!title || !duration) {
    return res.status(400).json({ message: 'Session title and duration are required.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const now = new Date();
    const lastCompleted = user.progress.lastCompleted ? new Date(user.progress.lastCompleted) : null;
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const sameDay = lastCompleted && now.toDateString() === lastCompleted.toDateString();
    const yesterday = lastCompleted && yesterdayDate.toDateString() === lastCompleted.toDateString();

    user.progress.sessions += 1;
    user.progress.minutes += duration;
    if (!sameDay) {
      if (yesterday) {
        user.progress.streak += 1;
      } else {
        user.progress.streak = 1;
      }
      user.progress.lastCompleted = new Date();
    }

    if (!user.completedPrograms.includes(title.toLowerCase().replace(/\s+/g, '-'))) {
      user.completedPrograms.push(title.toLowerCase().replace(/\s+/g, '-'));
    }

    user.activity.unshift({ title, description, duration, category, completedAt: new Date() });
    if (user.activity.length > 20) {
      user.activity.pop();
    }

    await user.save();
    const safeUser = { ...user.toObject(), password: undefined };
    res.json({ user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to record progress.' });
  }
});

module.exports = router;
