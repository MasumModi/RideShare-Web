const Ride = require('../models/Ride');

// GET all rides for a specific user with pagination
const getmyRide = async (req, res) => {
    try {
        // Extract userId from request body
        const { userId } = req.body;
    
        // Extract pagination params from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
    
        // Validate userId
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }
    
        // Build the filter object dynamically
        const filter = { userId };
    
        // Fetch rides for the specific user with pagination
        const rides = await Ride.find(filter)
          .skip(skip)
          .limit(limit);
    
        // Get total count of rides for the user
        const totalRides = await Ride.countDocuments(filter);
    
        if (!rides.length) {
          return res.status(404).json({ message: "No rides found for this user" });
        }
    
        // Return the filtered and paginated results
        return res.status(200).json({
          message: "User rides retrieved successfully",
          data: rides,
          pagination: {
            totalRides,
            totalPages: Math.ceil(totalRides / limit),
            currentPage: page,
            limit,
          },
        });
    
      } catch (error) {
        console.error("Error fetching user rides:", error);
        return res.status(500).json({
          message: "Server Error",
          error: error.message,
        });
      }
    };

module.exports = {
    getmyRide
};
