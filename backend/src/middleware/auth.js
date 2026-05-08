const { verifyAccessToken } = require('../utils/tokenUtils');

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      status: 401,
      error: 'AUTHENTICATION_ERROR',
      message: 'Access token is required'
    });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      status: 401,
      error: 'INVALID_TOKEN',
      message: 'Invalid or expired token'
    });
  }

  req.user = decoded; // Attach decoded user to request
  next();
};

module.exports = { authenticateToken };
