const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

/**
 * AuthMiddleware
 * Check Login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // req.isAuthenticated = false;

  if (!token) {
    // return res.status(401).json({ message: 'Unauthorized' });
    return res.status(401).redirect('/login');
  }

  // if (token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    // req.isAuthenticated = true;
    next();
  } catch (error) {
    console.log(error);
  }
  // }
  // next();
};

module.exports = authMiddleware;
