const Ride = require('../models/Ride');
const verifyApiAccessToken = require('../middleware/authMiddleware');

exports.postRide = [
  verifyApiAccessToken, // Middleware to validate access token
  async (req, res) => {
    try {
      const { isDriver, date, time, pickupLocation, dropOffLocation, bags, seats } = req.body;

      // Input validation
      if (
        date === undefined || 
        time === undefined || 
        pickupLocation === undefined || 
        dropOffLocation === undefined || 
        bags === undefined || 
        seats === undefined || 
        isDriver === undefined
      ) {
        console.log(isDriver, date, time, pickupLocation, dropOffLocation, bags, seats);
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Create a new ride
      const newRide = new Ride({
        userId: req.user._id, // The user from the validated token
        isDriver,
        date,
        time,
        pickupLocation,
        dropOffLocation,
        bags,
        seats
      });

      // Save the ride to the database
      const savedRide = await newRide.save();

      return res.status(201).json({
        message: 'Ride posted successfully',
        data: {
          postId: savedRide._id, // Include post ID in response
          userId: savedRide.userId,
          isDriver: savedRide.isDriver,
          date: savedRide.date,
          time: savedRide.time,
          pickupLocation: savedRide.pickupLocation,
          dropOffLocation: savedRide.dropOffLocation,
          bags: savedRide.bags,
          seats: savedRide.seats
        }
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
