const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
    const { email, name, profilePhoto, googleAccessToken } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user, userID will be auto-generated
        user = new User({
            email,
            name,
            profilePhoto,
            googleAccessToken
        });

        // Save user to DB
        await user.save();

        // Generate API token for the user
        const apiAccessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update user with API token
        user.apiAccessToken = apiAccessToken;
        await user.save();

        res.status(200).json({ message: 'User registered successfully', user, apiAccessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
