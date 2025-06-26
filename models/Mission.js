// models/Mission.js
const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  points: { type: Number, default: 10 },
  eventCategoryRequired: String, // es: "musica" = vai a un concerto
  daily: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mission', missionSchema);
