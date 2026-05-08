/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Default error
  let status = err.status || 500;
  let error = err.error || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';

  res.status(status).json({
    success: false,
    status,
    error,
    message
  });
};

module.exports = { errorHandler };
