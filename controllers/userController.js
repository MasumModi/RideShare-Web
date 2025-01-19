const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    const { googleUsername, googleProfilePhotoUrl, googleAccessToken, googleUserId } = req.body;

    // Validate input fields
    if (!googleUsername || !googleProfilePhotoUrl || !googleAccessToken || !googleUserId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if the user with the same googleUserId already exists
        // let existingUser = await User.findOne({ googleUserId });
        // if (existingUser) {
        //     return res.status(409).json({ message: 'User with this Google user ID already exists' });
        // }

        // Create new user with auto-generated userID
        let user = new User({
            googleUsername,
            googleProfilePhotoUrl,
            googleAccessToken,
            googleUserId
        });

        // Save user to DB
        await user.save();

        // Generate API token for the user
        const apiAccessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update user with the generated API token
        user.apiAccessToken = apiAccessToken;
        await user.save();

        // Send success response with the new user data
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                userID: user.userID,
                googleUsername: user.googleUsername,
                googleProfilePhotoUrl: user.googleProfilePhotoUrl,
                googleAccessToken: user.googleAccessToken,
                googleUserId: user.googleUserId,
                apiAccessToken: user.apiAccessToken,
            },
        });
    } catch (error) {
        // Log the error details for debugging
        console.error(error);

        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', error: error.message });
        }

        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate entry, user already exists' });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(500).json({ message: 'JWT generation error' });
        }

        // Generic error handling for other unexpected issues
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
