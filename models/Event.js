// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  description: String,
  category:    String,
  location: {
    type: { 
      type: String, 
      enum: ['Point'], 
      default: 'Point' 
    },
    coordinates: {
      type: [Number],    // [lng, lat]
      required: true
    },
    city: String
  },
  date:        { type: Date, required: true },
  source:      String,
  createdAt:   { type: Date, default: Date.now }
});

// Crea l'indice geospaziale
eventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);
