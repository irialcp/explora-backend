// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String, // es: "musica", "arte", "parkour"
  location: {
    lat: Number,
    lng: Number,
    city: String
  },
  date: { type: Date, required: true },
  source: String, // es: "AI", "scraper", "manuale"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
