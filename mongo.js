// mongo.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const atlasUri = process.env.MONGODB_URI;

mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1); // Exit the process with failure
  });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensure emails are unique
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'], // Only allow these roles
    default: 'user' // Default role
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
