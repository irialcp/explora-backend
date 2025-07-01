// scripts/seedEvents.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const sampleEvents = require('./events-sample.json'); // il file JSON qui sopra

dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('🟢 MongoDB connesso, inserisco sample events...');
  await Event.deleteMany({});
  await Event.insertMany(sampleEvents);
  console.log('✅ Sample events inseriti');
  process.exit(0);
})
.catch(err => {
  console.error('🔴 Errore:', err);
  process.exit(1);
});
