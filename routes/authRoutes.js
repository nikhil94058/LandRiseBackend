// routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../mongo'); // Import your MongoDB User model
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'success', token, role: user.role });
        console.log("Login successful for user:", email);
      } else {
        res.json({ message: 'notexist' });
        console.log("Login failed for user:", email, " - Incorrect password");
      }
    } else {
      res.json({ message: 'notexist' });
      console.log("Login failed - User not found:", email);
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'fail' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.json({ message: 'exist' });
      console.log("Signup failed - User already exists:", email);
    } else {
      const newUser = new User({ email, password: hashedPassword, role: role || 'user' });
      await newUser.save();
      res.json({ message: 'success' });
      console.log("Signup successful for user:", email);
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'fail' });
  }
});


module.exports = router;
