const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid to generate unique IDs

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4() // Automatically generate unique userID
    },
    apiAccessToken: {
        type: String, // Store generated API token
    },
    googleUsername: {
        type: String,
        required: true,
        unique: true
    },
    googleProfilePhotoUrl: {
        type: String,
        required: true
    },
    //googleAccessToken: {
      //  type: String, // Store Google OAuth token
    //},
    googleUserId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
