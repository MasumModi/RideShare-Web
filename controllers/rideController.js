const Ride = require('../models/Ride');
const verifyApiAccessToken = require('../middleware/authMiddleware');

exports.postRide = [
  verifyApiAccessToken, // Use the middleware to validate the access token
  async (req, res) => {
    try {
      const { isDriver, date, time, pickupLocation, dropoffLocation, bags, seats } = req.body;

      // Input validation
      if (!isDriver || !date || !time || !pickupLocation || !dropoffLocation || !bags || !seats) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new ride
      const newRide = new Ride({
        userId: req.user._id, // The user from the validated token
        isDriver,
        date,
        time,
        pickupLocation,
        dropoffLocation,
        bags,
        seats
      });

      await newRide.save();

      return res.status(201).json({
        message: 'Ride posted successfully',
        data: newRide
      });
    } catch (error) {
      console.error('Error posting ride:', error);
      return res.status(500).json({
        message: 'Server Error',
        error: error.message
      });
    }
  }
];
