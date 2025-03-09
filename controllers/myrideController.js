const Ride = require('../models/Ride');

const getmyRide = async (req, res) => {
  try {
    const { userId } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const filter = { userId };
    const rides = await Ride.find(filter).skip(skip).limit(limit);
    const totalRides = await Ride.countDocuments(filter);

    if (!rides.length) {
      return res.status(404).json({ message: "No rides found for this user" });
    }

    // Format each ride object to return only desired fields
    const formattedRides = rides.map(ride => ({
      postId: ride._id,
      userId: ride.userId,
      isDriver: ride.isDriver,
      date: ride.date,
      time: ride.time,
      pickupLocation: ride.pickupLocation,
      dropOffLocation: ride.dropOffLocation, // Match your current DB field
      bags: ride.bags,
      seats: ride.seats || ride.seatsNeeded, // In case some rides use "seatsNeeded"
      isFlexibleTime: ride.isFlexibleTime
    }));

    return res.status(200).json({
      message: "User rides retrieved successfully",
      data: formattedRides,
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
