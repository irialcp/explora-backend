// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points:   { type: Number, default: 0 },
  completedMissions: [{
    missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    completedAt: { type: Date, default: Date.now }
  }],
});

module.exports = mongoose.model('User', userSchema);
