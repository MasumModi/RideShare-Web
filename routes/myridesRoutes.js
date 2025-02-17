const express = require('express');
const { getmyRide } = require('../controllers/myrideController');
const verifyApiAccessToken = require('../middleware/authMiddleware'); // Make sure this import is correct

const router = express.Router();

// Route for getting all rides
router.get('/get-my-rides', verifyApiAccessToken, getmyRide);

module.exports = router;
