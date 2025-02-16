const Ride = require('../models/Ride');

// GET all rides with filtering and pagination
const getRide = async (req, res) => {
  try {
    // Extract filters from query parameters
    const { city, time, seats, date, page = 1, limit = 10 } = req.query;

    // Convert pagination params to integers
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build the filter object dynamically
    const filter = {};

    // If a city is provided, search in both pickupLocation and dropoffLocation
    if (city) {
      filter.$or = [
        { pickupLocation: { $regex: new RegExp(`^${city}$`, 'i') } },
        { dropoffLocation: { $regex: new RegExp(`^${city}$`, 'i') } }
      ];
    }

    if (time) {
      filter.time = time; // Exact time match
    }

    if (seats) {
      filter.seatsNeeded = { $gte: parseInt(seats) }; // Find rides with at least the requested seats
    }

    if (date) {
      filter.date = new Date(date); // Match exact date
    }

    console.log("Applying Filters:", filter); // Debugging filter object

    // Fetch filtered rides with pagination
    const rides = await Ride.find(filter)
      .skip(skip)
      .limit(limitNumber);

    // Get total count of filtered rides
    const totalRides = await Ride.countDocuments(filter);

    if (!rides.length) {
      return res.status(404).json({ message: 'No rides found for the given filters' });
    }

    // Return the filtered and paginated results
    return res.status(200).json({
      message: 'Filtered rides retrieved successfully',
      data: rides,
      pagination: {
        totalRides,
        totalPages: Math.ceil(totalRides / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });

  } catch (error) {
    console.error('Error fetching rides:', error);
    return res.status(500).json({
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getRide
};
