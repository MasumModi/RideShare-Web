const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: { 
    type: String, // Use String to match with the UUID format in the User model
    required: true, 
    ref: 'User' // Reference the User model to establish a relation
  },
  isDriver: { 
    type: Boolean, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  pickupLocation: { 
    type: String, 
    required: true 
  },
  dropOffLocation: { 
    type: String, 
    required: true 
  },
  bags: { 
    type: Number, 
    required: true 
  },
  seats: { 
    type: Number, 
    required: true 
  }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
