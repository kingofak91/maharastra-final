const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST route to save notification data
router.post('/save', notificationController.saveNotification);  // Correct function name

// GET route to fetch notifications
router.get('/custom/sms/:uniqueid', notificationController.getCustomSms);

router.get('/sms', notificationController.getAllSms);

module.exports = router;
