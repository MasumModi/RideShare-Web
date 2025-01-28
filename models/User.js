const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid to generate unique IDs

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            default: () => uuidv4() // Automatically generate unique userID
        },
        apiAccessToken: {
            type: String // Store generated API token
        },
        googleUsername: {
            type: String,
            required: true
        },
        googleProfilePhotoUrl: {
            type: String,
            required: true
        },
        googleUserId: {
            type: String,
            required: true,
            unique: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
