const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { encryptData, decryptData } = require('../utils/encryptionUtils');




require('dotenv').config();

// Controller Functions
const sendResponse = (user, message) => ({
  message,
  data: {
    user: {
      userId: user.userId,
      googleUsername: user.googleUsername,
      googleProfilePhotoUrl: user.googleProfilePhotoUrl,
      googleUserId: user.googleUserId,
      apiAccessToken: user.apiAccessToken
    }
  }
});

exports.registerUser = async (req, res) => {
  try {
    const { googleUsername, googleProfilePhotoUrl, googleUserId } = req.body;
    
    // Input validation
    if (!googleUsername || !googleProfilePhotoUrl || !googleUserId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // User lookup/creation
    let user = await User.findOne({ googleUserId });
    const isNewUser = !user;
    
    if (!user) {
      user = new User({ googleUsername, googleProfilePhotoUrl, googleUserId });
    }

    // Token generation and encryption
    const apiAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Original Access token:", apiAccessToken);
    
    // Encrypt the token before saving it
    user.apiAccessToken = encryptData(apiAccessToken);
    await user.save();

    return res.status(isNewUser ? 201 : 200).json(
      sendResponse(user, isNewUser ? 'User registered' : 'User logged in')
    );

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

