const jwt = require('jsonwebtoken');
const { decryptData } = require('../utils/encryptionUtils');
const User = require('../models/User');

const verifyApiAccessToken = async (req, res, next) => {
  try {
    // Retrieve the API access token from headers
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
      return res.status(403).json({ message: 'Access token is required' });
    }

    // Decrypt and verify the token
    const decryptedToken = decryptData(token);
    const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET); // Verify JWT with your secret key

    // Fetch the user from the database using the decoded userId
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user object to the request for use in the route
    req.user = user;
    next(); // Continue to the next middleware or route handler
    
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

module.exports = verifyApiAccessToken;
