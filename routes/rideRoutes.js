const express = require('express');
const { postRide } = require('../controllers/rideController');

const router = express.Router();

// Route for posting a new ride
router.post('/post-ride', postRide);

module.exports = router;
