const User = require('../models/User');
const jwt = require('jsonwebtoken');

function sendResponse(responseUser, responseMessage)
{
    return {
        message: responseMessage,
        data: {
            user: {
                userID: responseUser.userId,
                googleUsername: responseUser.googleUsername,
                googleProfilePhotoUrl: responseUser.googleProfilePhotoUrl,
                googleUserId: responseUser.googleUserId,
                apiAccessToken: responseUser.apiAccessToken
            },
        },
    }
}

// Register User
exports.registerUser = async (req, res) => {
    const { googleUsername, googleProfilePhotoUrl, googleUserId } = req.body;

    // Validate input fields
    if (!googleUsername || !googleProfilePhotoUrl || !googleUserId) {
        return res.status(400).json({
            message: 'Invalid/missing input fields',
        });
    }
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ googleUserId });
        if (existingUser) {
            // Send success response
            // Generate API access token
            const apiAccessToken = jwt.sign(
                { userId: existingUser.userId },
                process.env.JWT_SECRET
            );

            // Include API access token in user data
            existingUser.apiAccessToken = apiAccessToken;
            await existingUser.save();

            return res.status(201).json(
                sendResponse(existingUser, 'User logged in successfully.')
            );
        }

        // Create new user
        const newUser = new User({
            googleUsername,
            googleProfilePhotoUrl,
            googleUserId,
        });

        // Save the user
        await newUser.save();

        // Generate API access token
        const apiAccessToken = jwt.sign(
            { userId: newUser.userId },
            process.env.JWT_SECRET
        );



        // Include API access token in user data
        newUser.apiAccessToken = apiAccessToken;
        await newUser.save();

        // Send success response
        return res.status(201).json(
            sendResponse(newUser, 'User registered successfully.')
            );
    } catch (error) {
        console.error('Error registering user:', error);

        // Handle internal server error
        return res.status(500).json({

            message: 'Unexpected server issue',
            error: error.message,
        });
    }
};
