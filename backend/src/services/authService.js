const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

/**
 * Register new user
 */
async function registerUser(email, username, password) {
  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    'INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role, created_at',
    [email, username, hashedPassword, 'user']
  );

  return result.rows[0];
}

/**
 * Login user and return tokens
 */
async function loginUser(email, password) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = result.rows[0];
  const isValidPassword = await comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    accessToken,
    refreshToken
  };
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const result = await pool.query(
    'SELECT id, email, username, role, is_active, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  return result.rows[0];
}

/**
 * Get all users (admin)
 */
async function getAllUsers(limit = 10, offset = 0) {
  const result = await pool.query(
    'SELECT id, email, username, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const countResult = await pool.query('SELECT COUNT(*) FROM users');
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    users: result.rows,
    total,
    limit,
    offset
  };
}

/**
 * Update user role (admin)
 */
async function updateUserRole(userId, role) {
  const result = await pool.query(
    'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, username, role',
    [role, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

/**
 * Delete user (admin)
 */
async function deleteUser(userId) {
  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id, email, username',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUserRole,
  deleteUser
};
