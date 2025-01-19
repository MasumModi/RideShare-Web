const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid to generate unique IDs

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String, // Store URL to photo
    },
    userID: {
        type: String,
        required: true,
        unique: true,
        default: () => uuidv4() // Automatically generate unique userID
    },
    apiAccessToken: {
        type: String, // Store generated API token
    },
    googleAccessToken: {
        type: String, // Store Google OAuth token
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
