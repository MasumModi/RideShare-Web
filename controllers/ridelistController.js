const Ride = require('../models/Ride');

// GET all rides with filtering and pagination
const getRide = async (req, res) => {
  try {
    // Extract filters from the request body
    const { city, time, seats, startDate, endDate, page = 1, limit = 10 } = req.body;
    console.log('Request Body:', req.body); // Debugging logs

    // Convert pagination params to integers
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Build the filter object dynamically
    const filter = {};

    // City filter: Check if 'city' is provided
    if (city) {
      const regex = new RegExp(`${city}`, 'i'); // Case-insensitive match
      filter.$or = [
        { pickupLocation: { $regex: regex } },
        { dropoffLocation: { $regex: regex } }
      ];
    }

    // Time filter: Check if 'time' is provided
    if (time) {
      filter.time = time; // Exact time match
    }

    // Seats filter: Check if 'seats' is provided
    if (seats) {
      filter.seats = { $gte: parseInt(seats) }; // Find rides with at least the requested seats
    }

    // Date range filter: Check if 'startDate' and 'endDate' are provided
    if (startDate && endDate) {
      // Convert the start and end date strings into Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Ensure that both start and end dates are in the same format (ignore time)
      start.setHours(0, 0, 0, 0); // Set to midnight
      end.setHours(23, 59, 59, 999); // Set to the end of the day

      // Add the date range filter to the query
      filter.date = {
        $gte: start, // Start date inclusive
        $lte: end // End date inclusive
      };
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
