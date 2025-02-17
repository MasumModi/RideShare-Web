const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const ridelistRoutes = require('./routes/ridelistRoutes');
const myridesRoutes = require('./routes/myridesRoutes.js');

// Initialize dotenv
dotenv.config();
const app = express();
// Middleware
app.use(express.json()); // To parse JSON bodies
// Routes
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/rideslist', ridelistRoutes);
app.use('/api/myride', myridesRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB',process.env.MONGO_URI))

  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process on database connection failure
  });
// Export the app (important for Vercel)
module.exports = app;


// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes.js');
// const rideRoutes = require('./routes/rideRoutes');
// const ridelistRoutes = require('./routes/ridelistRoutes');
// const myridesRoutes = require('./routes/myridesRoutes.js');



// // Initialize dotenv
// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json()); // To parse JSON bodies

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/rides', rideRoutes);
// app.use('/api/rideslist', ridelistRoutes);
// app.use('/api/myride', myridesRoutes);


// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => {
//     console.error('Failed to connect to MongoDB:', error);
//     process.exit(1); // Exit process on database connection failure
//   });

// // **Add the app.listen here** 
// const PORT = process.env.PORT || 5000; // Use the PORT environment variable or default to 3000
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// // Export the app (important for Vercel)
// module.exports = app;
