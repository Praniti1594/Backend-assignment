# Complete Implementation Guide

## Phase 1: Backend Setup (Day 1)

### Step 1: Initialize Project Structure
```bash
mkdir -p backend/src/{config,middleware,routes/v1,controllers,services,models,utils,swagger}
cd backend
npm init -y
npm install express pg jsonwebtoken bcryptjs express-validator helmet cors dotenv swagger-ui-express swagger-jsdoc
npm install --save-dev nodemon
```

### Step 2: Configure Environment (.env.example)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=taskflow
DB_PASSWORD=taskflow123
DB_NAME=taskflow_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_here
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### Step 3: Database Connection (src/config/database.js)
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

### Step 4: Database Schema (run these queries)
```sql
-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_task_user_id ON tasks(user_id);
CREATE INDEX idx_task_status ON tasks(status);
CREATE INDEX idx_task_due_date ON tasks(due_date);
CREATE INDEX idx_task_user_status ON tasks(user_id, status);
```

---

## Phase 2: Authentication Implementation (Day 1-2)

### Step 5: Password Hashing Utilities (src/utils/hashUtils.js)
```javascript
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plain text password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>}
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };
```

### Step 6: JWT Token Utilities (src/utils/tokenUtils.js)
```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate JWT access token
 * @param {object} user - User object
 * @returns {string} - JWT token
 */
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
}

/**
 * Generate JWT refresh token
 * @param {object} user - User object
 * @returns {string} - Refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }
  );
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
```

### Step 7: Input Validators (src/utils/validators.js)
```javascript
const { body, validationResult } = require('express-validator');

// Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateEmail = () => body('email').isEmail().normalizeEmail();

const validatePassword = () =>
  body('password')
    .matches(passwordRegex)
    .withMessage(
      'Password must be 8+ chars with uppercase, lowercase, number, and special char'
    );

const validateUsername = () =>
  body('username')
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
```

### Step 8: Authentication Middleware (src/middleware/auth.js)
```javascript
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
```

### Step 9: Authorization Middleware (src/middleware/authorize.js)
```javascript
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
```

### Step 10: Auth Service (src/services/authService.js)
```javascript
const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

/**
 * Register new user
 */
async function registerUser(email, username, password) {
  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    'INSERT INTO users (email, username, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role',
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
    'SELECT id, email, username, role, is_active, created_at FROM users WHERE id = $1',
    [userId]
  );

  return result.rows[0];
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
```

### Step 11: Auth Controller (src/controllers/authController.js)
```javascript
const authService = require('../services/authService');
const { generateAccessToken } = require('../utils/tokenUtils');

/**
 * Register a new user
 */
async function registerController(req, res) {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const pool = require('../config/database');
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
```

### Step 12: Auth Routes (src/routes/v1/auth.js)
```javascript
const express = require('express');
const authController = require('../../controllers/authController');
const { authenticateToken } = require('../../middleware/auth');
const {
  validateEmail,
  validatePassword,
  validateUsername,
  handleValidationErrors
} = require('../../utils/validators');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email: { type: string }
 *               username: { type: string }
 *               password: { type: string }
 */
router.post(
  '/register',
  validateEmail(),
  validateUsername(),
  validatePassword(),
  handleValidationErrors,
  authController.registerController
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 */
router.post(
  '/login',
  validateEmail(),
  validatePassword(),
  handleValidationErrors,
  authController.loginController
);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 */
router.get('/me', authenticateToken, authController.getMeController);

module.exports = router;
```

---

## Continue with Complete Code in Next Section...

This foundation covers:
✅ Database setup & schema
✅ Authentication flow (register/login)
✅ Password security (bcryptjs)
✅ JWT token management
✅ Input validation
✅ Error handling
✅ API documentation structure

**Next: Complete CRUD endpoints, Task management, Admin features, Frontend integration**

Would you like me to continue with:
1. Task CRUD endpoints
2. Admin endpoints
3. Frontend React components
4. Complete Swagger documentation
5. Docker setup

