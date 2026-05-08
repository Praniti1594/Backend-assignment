# ⚡ Quick Start Guide - Get Running in 5 Minutes

## 🚀 Option 1: Docker Compose (Recommended - Fastest)

```bash
# Navigate to project
cd prime_ai

# Start everything with one command
docker-compose up

# Wait for services to start (~30 seconds)
# When you see "Server running on http://localhost:5000"
# The system is ready!
```

**Access:**
- Frontend UI: http://localhost:3000
- API Docs: http://localhost:5000/api-docs
- API: http://localhost:5000/api/v1

---

## 🔧 Option 2: Local Development Setup (Manual)

### Step 1: Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Create PostgreSQL database
# Windows: psql -U postgres
# Mac: psql (if installed)
createdb taskflow_db

# Import schema
psql taskflow_db < ../database-schema.sql

# Start backend
npm run dev
```

Backend running on: http://localhost:5000

### Step 2: Frontend Setup (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend running on: http://localhost:3000

---

## 📝 First Test - Create Account & Task

### 1. Open Frontend
Go to: http://localhost:3000

### 2. Register New Account
- Email: `test@example.com`
- Username: `testuser`
- Password: `TestPass@123` (must have: 8+ chars, uppercase, lowercase, number, special char)

### 3. Login
- Use credentials above
- You'll be redirected to dashboard

### 4. Create a Task
- Click "+ New Task"
- Title: "My First Task"
- Description: "Getting started with TaskFlow"
- Priority: High
- Click "Create Task"

### 5. Test More Features
- Edit task (click Edit)
- Change status to "In Progress"
- Filter tasks by status
- Delete a task

---

## 🧪 API Testing with Postman

### Import Collection
1. Download [TaskFlow.postman_collection.json](TaskFlow.postman_collection.json)
2. Open Postman
3. Click "Import" → Select file
4. Collection imported!

### Use the Collection
1. Set variables (right-click collection):
   - `base_url`: http://localhost:5000
   - `access_token`: (auto-populated after login)

2. Try endpoints:
   - Register → Login → Create Task → Update Task → Delete Task

---

## 📊 API Documentation

### Visit Swagger UI
http://localhost:5000/api-docs

Interactive documentation with "Try it out" feature for all endpoints.

---

## 🔐 Authentication Flow

1. **Register** → Create account
2. **Login** → Get JWT token
3. **Use Token** → Add to Authorization header: `Bearer YOUR_TOKEN`
4. **Protected Endpoints** → All task endpoints require token

---

## 🛠️ Common Commands

### Backend
```bash
cd backend

npm install              # Install dependencies
npm run dev            # Start with auto-reload
npm start              # Start (production)
npm test               # Run tests (if configured)
```

### Frontend
```bash
cd frontend

npm install             # Install dependencies
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

### Docker
```bash
# Start all services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose up --build
```

---

## 🔑 Test Accounts

### Admin Account
- Email: `admin@example.com`
- Username: `admin`
- Password: `AdminPass@123`
- Role: Admin (can manage all users & tasks)

### Regular User
- Email: `user@example.com`
- Username: `regularuser`
- Password: `UserPass@123`
- Role: User (can only manage own tasks)

---

## 📱 Project Features Checklist

✅ User Registration & Login
✅ JWT Authentication
✅ Role-Based Access Control
✅ Task CRUD Operations
✅ Task Filtering & Pagination
✅ Admin User Management
✅ Responsive UI
✅ Error Handling
✅ API Documentation (Swagger)
✅ Docker Support
✅ Database Schema
✅ Security (Hashing, Validation)

---

## 🐛 Troubleshooting

### Port 5000 Already in Use
```bash
# Change port in backend/.env
PORT=5001

# Update frontend/.env
VITE_API_URL=http://localhost:5001
```

### Port 3000 Already in Use
```bash
# In frontend, vite uses first available port
# Or change in vite.config.js: port: 3001
```

### PostgreSQL Not Running
```bash
# Mac with Homebrew
brew services start postgresql

# Windows (if installed)
# Start PostgreSQL from Services

# Or use Docker (no local installation needed)
docker-compose up postgres
```

### Database Connection Error
```bash
# Check database exists
psql -l | grep taskflow_db

# Create if missing
createdb taskflow_db

# Import schema
psql taskflow_db < database-schema.sql
```

### "Module not found" error
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

---

## 📚 Documentation Navigation

| Document | Purpose |
|----------|---------|
| **README.md** (root) | Overview & project structure |
| **PROJECT_DESIGN.md** | Architecture, design patterns, evaluation criteria |
| **SCALABILITY.md** | Deployment, scaling strategies, DevOps |
| **IMPLEMENTATION_GUIDE.md** | Code examples, detailed setup |
| **3DAY_ROADMAP.md** | Timeline, daily tasks, evaluation checklist |
| **backend/README.md** | Backend API documentation |
| **frontend/README.md** | Frontend setup & component guide |
| **database-schema.sql** | PostgreSQL schema |
| **TaskFlow.postman_collection.json** | API testing collection |

---

## ✨ Next Steps

1. **Run the project** (Docker recommended)
2. **Test the flows** (Register → Login → Create Task)
3. **Explore the code** (Start with backend/src/app.js)
4. **Read documentation** (PROJECT_DESIGN.md for architecture)
5. **Deploy** (See SCALABILITY.md for options)

---

## 🎯 Internship Evaluation Tips

✅ **Show these working:**
- Registration with validation
- Login with JWT tokens
- Create, read, update, delete tasks
- Admin endpoints
- Error handling
- API documentation

✅ **Highlight these features:**
- Secure password hashing
- Role-based access control
- Input validation
- Professional error messages
- Clean code structure
- Docker support
- Scalable architecture

✅ **Be ready to explain:**
- How JWT authentication works
- Why role-based access matters
- Database design decisions
- Security practices implemented
- Deployment strategies

---

## 💡 Pro Tips

1. **Save Postman collection** → Share with evaluators
2. **Screenshot successful tests** → Add to submission
3. **Keep git commits clean** → Meaningful commit messages
4. **Document your changes** → README with setup steps
5. **Test thoroughly** → All endpoints before submission
6. **Error messages** → User-friendly, not technical
7. **Code comments** → Explain complex logic
8. **Security first** → Never skip validation

---

## 🚀 Ready to Deploy?

See [SCALABILITY.md](SCALABILITY.md) for:
- Heroku deployment
- AWS deployment
- Docker production setup
- Kubernetes configuration
- Performance optimization
- Load balancing

---

## 🆘 Need Help?

1. Check relevant README files
2. Read IMPLEMENTATION_GUIDE.md
3. Look at code comments
4. Check API documentation: http://localhost:5000/api-docs
5. Review database schema: database-schema.sql

---

**Everything is ready to go! Start with `docker-compose up` and you'll have a fully functional task management system running in seconds.** 🎉

