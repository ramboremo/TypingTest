const mongoose = require('mongoose');
const statSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Track user by email
  date: { type: Date, default: Date.now },
  wpm: { type: Number },
  accuracy: { type: Number }
});
module.exports = mongoose.model('Stat', statSchema);