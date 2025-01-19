/* // server.js
const express = require('express');
const app = express();
const port = 3000;

// Set up the view engine (EJS, Pug, etc.)
app.set('view engine', 'ejs');

// Serve static files (like images, CSS, JS)
app.use(express.static('public'));

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a simple route
app.get('/', (req, res) => {
  res.render('index', { title: 'Express.js App' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// In server.js
const homeRouter = require('./src/controllers/routes/home');
app.use('/', homeRouter);
*/

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

// Initialize dotenv
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
