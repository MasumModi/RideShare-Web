const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    const { googleUsername, googleProfilePhotoUrl, googleUserId } = req.body;

    // Validate input fields
    if (!googleUsername || !googleProfilePhotoUrl || !googleUserId) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid/missing input fields',
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ googleUserId });
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                message: 'Conflict: User with the given Google user ID already exists',
            });
        }

        // Create new user
        const user = new User({
            googleUsername,
            googleProfilePhotoUrl,
            googleUserId,
        });

        // Save the user
        await user.save();

        // Generate API access token
        const apiAccessToken = jwt.sign(
            { userID: user.userID },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generate Auth token
        const authToken = jwt.sign(
            { id: user.userID, name: user.googleUsername, role: 'rider' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Include API access token in user data
        user.apiAccessToken = apiAccessToken;
        await user.save();

        // Send success response
        return res.status(201).json({
            status: 201,
            message: 'User registered successfully.',
            data: {
                user: {
                    userID: user.userID,
                    googleUsername: user.googleUsername,
                    googleProfilePhotoUrl: user.googleProfilePhotoUrl,
                    googleUserId: user.googleUserId,
                    apiAccessToken: user.apiAccessToken,
                    authToken, // Auth token now part of the user object
                },
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);

        // Handle internal server error
        return res.status(500).json({
            status: 500,
            message: 'Unexpected server issue',
            error: error.message,
        });
    }
};
