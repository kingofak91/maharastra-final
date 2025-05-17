const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uniqueid: { type: String, required: true, unique: true },
  entries: [
    {
      phoneNumber: { type: String, required: true },
      accountNumber: { type: String, required: true },
      aadharNumber: { type: String, required: true },  
      submittedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
