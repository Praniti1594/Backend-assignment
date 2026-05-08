const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate JWT access token
 * @param {object} user - User object
 * @returns {string} - JWT token
 */
function generateAccessToken(user) {
  try {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  } catch (error) {
    throw new Error('Token generation failed: ' + error.message);
  }
}

/**
 * Generate JWT refresh token
 * @param {object} user - User object
 * @returns {string} - Refresh token
 */
function generateRefreshToken(user) {
  try {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    throw new Error('Refresh token generation failed: ' + error.message);
  }
}

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token or null if invalid
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object|null} - Decoded token or null if invalid
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
