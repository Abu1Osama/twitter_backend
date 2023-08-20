const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  name:{ type: String, unique: true, required: true },
  tokens: [{ type: String }],
  dateOfBirth: { type: Date }, 
});

module.exports = mongoose.model('User', userSchema);
