const jwt = require('jsonwebtoken');
const User = require('../mongo'); // Ensure this path is correct

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.sendStatus(401); // Unauthorized if no token is provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
};

// Middleware to authorize based on role
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role || 'user'; // Default role to 'user' if not defined

    if (userRole !== requiredRole) {
      return res.sendStatus(403); // Forbidden if role doesn't match
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
