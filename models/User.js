const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  punti: { type: Number, default: 0 },
  missioniCompletate: [String],
});

module.exports = mongoose.model('User', userSchema);
