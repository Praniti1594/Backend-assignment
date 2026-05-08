# Scalable REST API with Authentication & Role-Based Access
## Internship Project Design

---

## 📋 Project Overview

**Project Name**: TaskFlow - A Collaborative Task Management System

**Tech Stack**:
- **Backend**: Node.js + Express.js + PostgreSQL
- **Frontend**: React 18 + Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL (relational, scalable)
- **API Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs, helmet, express-validator
- **Deployment**: Docker-ready
- **Time Duration**: 3 days

---

## 🏗️ Project Architecture

```
prime_ai/
├── backend/                          # Main backend directory
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.js           # PostgreSQL connection
│   │   │   ├── environment.js        # Environment variables
│   │   │   └── constants.js          # App constants
│   │   │
│   │   ├── middleware/               # Express middlewares
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── authorize.js         # Role-based access control
│   │   │   ├── validation.js        # Input validation
│   │   │   ├── errorHandler.js      # Global error handling
│   │   │   └── requestLogger.js     # Request logging
│   │   │
│   │   ├── routes/
│   │   │   ├── v1/                  # API v1
│   │   │   │   ├── auth.js          # Auth endpoints
│   │   │   │   ├── tasks.js         # Task CRUD endpoints
│   │   │   │   └── users.js         # User management
│   │   │   └── v2/                  # API v2 (future scalability)
│   │   │
│   │   ├── controllers/             # Business logic
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── taskController.js    # Task logic
│   │   │   └── userController.js    # User management logic
│   │   │
│   │   ├── services/                # Database services
│   │   │   ├── authService.js
│   │   │   ├── taskService.js
│   │   │   └── userService.js
│   │   │
│   │   ├── models/                  # Database models/schemas
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   │
│   │   ├── utils/
│   │   │   ├── tokenUtils.js        # JWT utilities
│   │   │   ├── hashUtils.js         # Password hashing
│   │   │   ├── validators.js        # Input validators
│   │   │   └── response.js          # Standard response format
│   │   │
│   │   ├── swagger/
│   │   │   └── swagger.js           # Swagger/OpenAPI config
│   │   │
│   │   └── app.js                   # Express app setup
│   │
│   ├── .env.example                 # Environment template
│   ├── package.json
│   ├── server.js                    # Entry point
│   ├── Dockerfile
│   ├── .dockerignore
│   └── README.md
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Auth.css
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── TaskList.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   └── Dashboard.css
│   │   │   └── Common/
│   │   │       ├── NavBar.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       └── Toast.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance & interceptors
│   │   │   └── taskService.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── docker-compose.yml               # Multi-container setup
├── SCALABILITY.md                   # Scalability & deployment notes
└── README.md                         # Project root README
```

---

## 🔐 Database Schema (PostgreSQL)

### User Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM ('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Task Table
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM ('pending', 'in_progress', 'completed') DEFAULT 'pending',
    priority ENUM ('low', 'medium', 'high') DEFAULT 'medium',
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Activity Log Table (for audit trail)
```sql
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
```

---

## 🔑 API Endpoints

### Authentication Endpoints (v1)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | - | Register new user |
| POST | `/api/v1/auth/login` | ❌ | - | Login user, return JWT |
| POST | `/api/v1/auth/refresh` | ✅ | User | Refresh token |
| POST | `/api/v1/auth/logout` | ✅ | User | Logout user |
| GET | `/api/v1/auth/me` | ✅ | User | Get current user profile |

### Task Endpoints (v1)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/v1/tasks` | ✅ | User | Get all tasks (own tasks) |
| GET | `/api/v1/tasks/:id` | ✅ | User | Get single task |
| POST | `/api/v1/tasks` | ✅ | User | Create new task |
| PUT | `/api/v1/tasks/:id` | ✅ | User | Update task |
| DELETE | `/api/v1/tasks/:id` | ✅ | User | Delete task |
| GET | `/api/v1/admin/tasks` | ✅ | Admin | Get all tasks (all users) |

### User Management (Admin Only)
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/v1/admin/users` | ✅ | Admin | Get all users |
| GET | `/api/v1/admin/users/:id` | ✅ | Admin | Get user details |
| PUT | `/api/v1/admin/users/:id/role` | ✅ | Admin | Update user role |
| DELETE | `/api/v1/admin/users/:id` | ✅ | Admin | Delete user |

---

## 🛡️ Security Implementation

### 1. **Password Security**
- bcryptjs with salt rounds: 12
- Minimum requirements: 8 chars, uppercase, lowercase, number, special char
- Never return password in responses
- Hash stored in database, never plain text

### 2. **JWT Token Handling**
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Tokens stored in httpOnly cookies (frontend uses localStorage)
- Signed with strong secret (minimum 32 characters)

### 3. **Input Validation & Sanitization**
- express-validator for server-side validation
- Validate all inputs (email format, username length, etc.)
- Sanitize inputs to prevent XSS attacks
- Rate limiting on auth endpoints (5 requests/15 min)

### 4. **Authorization**
- Middleware to verify JWT on protected routes
- Role-based access control (RBAC) middleware
- Users can only access their own data
- Admin bypass for administrative tasks

### 5. **HTTP Security Headers**
- helmet.js for security headers (CSP, HSTS, X-Frame-Options)
- CORS configuration (only allow frontend URL)
- Content-Type validation

### 6. **Logging & Monitoring**
- Log all auth events
- Log all admin actions
- Sanitize logs (never log passwords/tokens)
- Audit trail for CRUD operations

---

## 📊 Response Standard Format

### Success Response (200, 201)
```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "message": "Operation successful"
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Email is required",
  "details": [
    {
      "field": "email",
      "message": "Must be valid email"
    }
  ]
}
```

---

## 🚀 Implementation Timeline (3 Days)

### Day 1: Backend Foundation
- ✅ Project setup & database schema
- ✅ User authentication (register, login, JWT)
- ✅ Password hashing & validation
- ✅ JWT middleware & token refresh

### Day 2: API Development & Security
- ✅ Task CRUD APIs
- ✅ Role-based access control
- ✅ Input validation & error handling
- ✅ Admin endpoints
- ✅ Swagger documentation

### Day 3: Frontend & Integration
- ✅ React components (Login, Register, Dashboard)
- ✅ API integration & error handling
- ✅ Protected routes
- ✅ Testing & deployment preparation

---

## 📚 Evaluation Criteria Alignment

### ✅ API Design (REST Principles, Status Codes, Modularity)
- **Implementation**:
  - Proper HTTP status codes (201 for create, 204 for delete, 400/401/403 for errors)
  - RESTful endpoint naming (resources as nouns, actions as HTTP verbs)
  - Modular controller/service/route separation
  - API versioning (v1, v2 structure)
  - Standard response format for all endpoints

### ✅ Database Schema Design & Management
- **Implementation**:
  - Normalized PostgreSQL schema
  - Foreign key relationships (users ↔ tasks)
  - Indexes on frequently queried columns (email, user_id)
  - UUID for primary keys (scalable, secure)
  - Soft deletes or proper cascade deletions
  - Audit trail (activity_logs table)

### ✅ Security Practices
- **Implementation**:
  - bcryptjs for password hashing (12 salt rounds)
  - JWT for stateless authentication
  - httpOnly cookies for token storage
  - Role-based access control (RBAC)
  - Input validation & sanitization
  - Security headers (helmet.js)
  - Rate limiting on sensitive endpoints
  - SQL injection prevention (parameterized queries)

### ✅ Functional Frontend Integration
- **Implementation**:
  - React components for auth flow
  - Protected routes (JWT verification)
  - CRUD UI for tasks
  - Error/success messages from API
  - Responsive design
  - Token management (localStorage/cookies)

### ✅ Scalability & Deployment Readiness
- **Implementation**:
  - Docker & docker-compose configuration
  - Environment-based configuration
  - Structured logging (console & file)
  - Connection pooling for database
  - Microservices-ready architecture
  - Load balancing notes (reverse proxy setup)
  - Caching layer documentation (Redis ready)

---

## 📦 Dependencies

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.0",
    "express-validator": "^7.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.19.0"
  }
}
```

---

## 🎯 Key Features Demonstration

### 1. User Registration & Authentication
- Email validation & uniqueness check
- Strong password requirements
- JWT token generation on successful login
- Token refresh mechanism

### 2. Role-Based Access Control
- Admin dashboard (view all tasks/users)
- User dashboard (view own tasks)
- Admin-only deletion/modification
- Transparent access denied messages

### 3. Task Management CRUD
- Create tasks with title, description, priority, due date
- Read tasks with filtering & pagination
- Update task status & details
- Delete tasks (with admin override)

### 4. API Versioning
- v1 endpoints with clear separation
- Easy migration path for v2 (new features)
- Backward compatibility

### 5. Error Handling & Validation
- Request validation with error details
- Global error handler for all exceptions
- Proper HTTP status codes
- User-friendly error messages

---

## 📖 Documentation

### Generated by: Swagger/OpenAPI
- Interactive endpoint testing
- Request/response schema documentation
- Authentication flow documentation
- Try-it-out functionality

### Additional Documentation
- README with setup instructions
- Postman collection export
- SCALABILITY.md with deployment notes

---

## 🔄 Version 2 Readiness (Future Scalability)

- Microservices separation (auth service, task service)
- Message queue integration (RabbitMQ/Kafka)
- Caching layer (Redis)
- GraphQL alternative endpoint
- WebSocket support for real-time updates
- Advanced reporting & analytics

---

