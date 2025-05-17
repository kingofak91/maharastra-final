const User = require('../models/User');

exports.saveUserData = async (req, res) => {
  try {
    const { phoneNumber, accountNumber,aadharNumber, uniqueid } = req.body;
    let user = await User.findOne({ uniqueid });

    if (user) {
      user.entries.push({ phoneNumber, accountNumber,aadharNumber});
    } else {
      user = new User({
        uniqueid,
        entries: [{phoneNumber, accountNumber,aadharNumber}]
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Data Submitted Successfully!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while submitting user data"
    });
  }
};
