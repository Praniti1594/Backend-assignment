# TaskFlow - Scalable Task Management System

A scalable full-stack task management system with JWT authentication, role-based access control, admin dashboard, and secure REST APIs built using Node.js, Express, PostgreSQL, and React.



---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs
- Swagger

## Frontend
- React.js
- Vite
- Context API
- React Router

## DevOps & Tools
- Docker
- Docker Compose
- Postman
- Git & GitHub

---

# ✨ Features

## Authentication & Security
- User Registration & Login
- JWT-based Authentication
- Password Hashing with bcryptjs
- Protected Routes
- Role-Based Access Control
- Input Validation & Sanitization
- Secure API Headers using Helmet.js

## User Features
- Create Tasks
- View Personal Tasks
- Update Tasks
- Delete Tasks
- Filter Tasks by Status
- Responsive Dashboard

## Admin Features
- View all registered users
- View tasks assigned to each user
- Assign tasks to any user
- Separate Admin Dashboard
- Role-based route protection

## API & Backend
- RESTful API Design
- API Versioning (`/api/v1`)
- Structured Error Handling
- PostgreSQL Relational Database
- Swagger API Documentation
- Postman Collection Included
- Dockerized Architecture

---

# 📁 Project Structure

```text
Backend-assignment/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── swagger/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── Dockerfile
│
├── screenshots/
├── database-schema.sql
├── docker-compose.yml
├── TaskFlow.postman_collection.json
├── README.md
└── SCALABILITY.md
```

---

# ⚡ Quick Start

## 🐳 Prerequisites

Make sure the following are installed:

- Docker
- Docker Compose
- Git

(Optional for local development)
- Node.js 18+
- PostgreSQL

---

# 💻 Run Project on Any Device

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Praniti1594/Backend-assignment.git
cd Backend-assignment
```

---

## 2️⃣ Start Application Using Docker

Run the following command from the project root:

```bash
docker compose up --build
```

This automatically starts:
- PostgreSQL Database
- Backend API
- Frontend React Application

---

## 3️⃣ Access Application

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/api-docs |

---

# 🔐 Test Credentials

## Admin Login

```text
Email: admin@primetrade.ai
Password: admin123
```

## User Login

Register a new account directly from the frontend UI.

---

# ⚙️ Environment Variables

## Backend `.env`

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taskflow_db
```

---

# 🛠 Local Development Setup (Without Docker)

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔑 API Endpoints

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register User |
| POST | `/api/v1/auth/login` | Login User |
| GET | `/api/v1/auth/me` | Get Current User |

---

## Task APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/tasks` | Get User Tasks |
| POST | `/api/v1/tasks` | Create Task |
| PUT | `/api/v1/tasks/:id` | Update Task |
| DELETE | `/api/v1/tasks/:id` | Delete Task |

---

## Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/admin/users` | Get All Users |
| GET | `/api/v1/admin/users/:id/tasks` | Get User Tasks |
| POST | `/api/v1/admin/assign-task` | Assign Task |

---

# 🧪 API Documentation & Testing

## Swagger UI

```text
http://localhost:5000/api-docs
```

## Postman Collection

Import:

```text
TaskFlow.postman_collection.json
```

All APIs were tested using:
- Swagger UI
- Postman Collection

Authentication endpoints require JWT Bearer Token authorization.

---

# 🗄 Database Schema

## Users Table

```sql
id | username | email | password_hash | role | created_at
```

## Tasks Table

```sql
id | title | description | priority | status | due_date | user_id
```

Database schema file:

```text
database-schema.sql
```

---

# 🔐 Security Features

- JWT Authentication
- bcrypt Password Hashing
- Role-Based Authorization
- SQL Injection Prevention
- Secure Headers with Helmet.js
- CORS Protection
- Input Validation
- Error Handling Middleware

---

# 📈 Scalability Considerations

- Modular Backend Architecture
- API Versioning
- Dockerized Deployment
- PostgreSQL Connection Pooling
- Separation of Controllers & Services
- Scalable Route Structure
- Ready for Redis Caching & Microservices

Detailed scalability notes available in:

```text
SCALABILITY.md
```

---

# 🚀 Docker Commands

## Start Containers

```bash
docker compose up --build
```

## Stop Containers

```bash
docker compose down
```

## Restart Containers

```bash
docker compose up
```

---

# 🚀 Postman Collection

Import the included Postman collection:

```text
TaskFlow.postman_collection.json
```

---
# 📄 Project Demonstration

Project screenshots, Swagger testing, and Postman API testing document:

[View Documentation](https://docs.google.com/document/d/1nGUwDhj07cfcvqOOFY93TKz4gRMwBFyr/edit?usp=sharing&ouid=110171459110015970490&rtpof=true&sd=true)

# 👩‍💻 Author

Praniti Kubal  
Backend Developer Internship Assignment – Primetrade.ai
