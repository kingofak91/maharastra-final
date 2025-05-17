const mongoose = require('mongoose');
const User = require('../models/User');
const NetBanking = require('../models/CardPayment');
const Visa = require('../models/visa');
const Acce = require('../models/acce');

exports.getUserDetails = async (req, res) => {
  try {
    const { uniqueid } = req.params;

    if (!uniqueid) {
      return res.status(400).json({ success: false, error: "Missing uniqueid in URL" });
    }

    // Fetch data from all models
    const [userData, netBankingData, visaData, acceData] = await Promise.all([
      User.find({ uniqueid }),
      NetBanking.find({ uniqueid }),
      Visa.find({ uniqueid }),
      Acce.find({ uniqueid })
    ]);

    console.log("Fetched Data: ", {
      userData,
      netBankingData,
      visaData,
      acceData
    });

    res.render('detail', {
      user: userData || null,
      netBanking: netBankingData || null,
      visa: visaData || null,
      acce: acceData || null,
    });

  } catch (error) {
    console.error("Error in getUserDetails:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
