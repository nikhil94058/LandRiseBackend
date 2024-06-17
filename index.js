// index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const nftRoutes = require('./routes/nftRoutes'); // Import nftRoutes
const authRoutes = require('./routes/authRoutes'); // Import authRoutes
const genRoutes = require('./routes/genRoutes');
const { authenticateToken, authorizeRole } = require('./middleware/auth'); // Import middleware
const path = require("path");
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', nftRoutes); // Use nftRoutes under /api
app.use('/auth', authRoutes); // Use authRoutes under /auth
app.use('/general', genRoutes); // use General Purpose like review etc;


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


//connecting frontend
app.get("/", (req, res) => {
  res.send("Welcome to LandSol API\n Listening...");

});




// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
