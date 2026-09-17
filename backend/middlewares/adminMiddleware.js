const AppError = require('../utils/AppError');

/**
 * Restrict access to admin users only.
 * Must be used AFTER the protect middleware.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new AppError('Access denied. Admin privileges required.', 403));
};

module.exports = { adminOnly };
