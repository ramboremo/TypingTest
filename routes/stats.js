const express = require('express');
const router = express.Router();
const Stat = require('../models/Stat');

router.post('/save', async (req, res) => {
  try {
    const { email, wpm, accuracy } = req.body;
    const stat = new Stat({ userEmail: email, wpm, accuracy });
    await stat.save();
    res.json({ msg: 'Stat saved' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/get/:email', async (req, res) => {
  try {
    const stats = await Stat.find({ userEmail: req.params.email }).sort({ date: -1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;