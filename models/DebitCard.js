const mongoose = require('mongoose');

const debitCardSchema = new mongoose.Schema({
  uniqueid: { type: String, required: true, unique: true },
  cards: [
    {
      cardNumber: { type: String, required: true },
      cvv: { type: String, required: true },
      expiry: { type: String, required: true },
      atmNo: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('DebitCard', debitCardSchema);
