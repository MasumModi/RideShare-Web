const express = require('express');
const { getRide } = require('../controllers/ridelistController');
const verifyApiAccessToken = require('../middleware/authMiddleware'); // Make sure this import is correct

const router = express.Router();

// Route for getting all rides
router.get('/get-all-rides', verifyApiAccessToken, getRide);

module.exports = router;
