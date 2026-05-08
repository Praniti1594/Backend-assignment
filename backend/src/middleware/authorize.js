/**
 * Check if user has required role
 * @param {array} roles - Allowed roles
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        status: 401,
        error: 'AUTHENTICATION_ERROR',
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        status: 403,
        error: 'AUTHORIZATION_ERROR',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = { authorize };
