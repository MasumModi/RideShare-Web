const Ride = require('../models/Ride');

// GET all rides with filtering and pagination
const getRide = async (req, res) => {
  try {
    const {
      city,
      time,
      seats,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.body;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    // Filter by pickup or dropoff city
    if (city) {
      const regex = new RegExp(`${city}`, 'i');
      filter.$or = [
        { pickupLocation: { $regex: regex } },
        { dropOffLocation: { $regex: regex } }
      ];
    }

    // Filter by time
    if (time) {
      filter.time = time;
    }

    // Filter by minimum seats
    if (seats) {
      filter.seats = { $gte: parseInt(seats) };
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    console.log("Applying Filters:", filter);

    const rides = await Ride.find(filter).skip(skip).limit(limitNumber);
    const totalRides = await Ride.countDocuments(filter);

    if (!rides.length) {
      return res.status(404).json({ message: 'No rides found for the given filters' });
    }

    // Map _id to postId for better clarity
    const formattedRides = rides.map(ride => ({
      postId: ride._id,
      userId: ride.userId,
      isDriver: ride.isDriver,
      date: ride.date,
      time: ride.time,
      pickupLocation: ride.pickupLocation,
      dropOffLocation: ride.dropOffLocation,
      bags: ride.bags,
      seats: ride.seats,
      isFlexibleTime: ride.isFlexibleTime
    }));

    return res.status(200).json({
      message: 'Filtered rides retrieved successfully',
      data: formattedRides,
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
