const { body, validationResult } = require('express-validator');

// Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmail = () => 
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format');

const validatePassword = () =>
  body('password')
    .matches(passwordRegex)
    .withMessage(
      'Password must be 8+ chars with uppercase, lowercase, number, and special char (@$!%*?&)'
    );

const validateUsername = () =>
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3-50 characters');

const validateTaskTitle = () =>
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters');

const validateTaskDescription = () =>
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters');

const validateTaskStatus = () =>
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Invalid task status');

const validateTaskPriority = () =>
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority level');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateTaskTitle,
  validateTaskDescription,
  validateTaskStatus,
  validateTaskPriority,
  handleValidationErrors
};
