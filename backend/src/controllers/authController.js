const authService = require('../services/authService');

/**
 * Register a new user
 */
async function registerController(req, res) {
  try {
    const { email, username, password } = req.body;
    const pool = require('../config/database');

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: 409,
        error: 'USER_EXISTS',
        message: 'Email or username already exists'
      });
    }

    const user = await authService.registerUser(email, username, password);

    res.status(201).json({
      success: true,
      status: 201,
      data: user,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'REGISTRATION_ERROR',
      message: error.message
    });
  }
}

/**
 * Login user
 */
async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      status: 200,
      data: result,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        success: false,
        status: 401,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    res.status(500).json({
      success: false,
      status: 500,
      error: 'LOGIN_ERROR',
      message: error.message
    });
  }
}

/**
 * Get current user profile
 */
async function getMeController(req, res) {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status: 404,
        error: 'NOT_FOUND',
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: user,
      message: 'User profile retrieved'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      status: 500,
      error: 'PROFILE_ERROR',
      message: error.message
    });
  }
}

module.exports = {
  registerController,
  loginController,
  getMeController
};
