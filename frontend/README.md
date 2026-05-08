# TaskFlow Frontend

React-based user interface for TaskFlow Task Management System

## Features

✅ **User Authentication**
- Registration with password validation
- Login with JWT tokens
- Protected routes

✅ **Task Management UI**
- Create, read, update, delete tasks
- Filter tasks by status
- View task details
- Responsive card layout

✅ **User Dashboard**
- View all tasks
- Task status and priority indicators
- Quick task filtering
- Admin badge for admin users

✅ **Security**
- JWT token management
- Protected routes
- Secure logout
- Token refresh on API errors

✅ **Responsive Design**
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly buttons

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Setup**
```bash
cd frontend
npm install
```

2. **Configure**
```bash
cp .env.example .env
# Update API_URL if backend is on different host
```

3. **Run Development**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
npm run preview
```

## API Integration

All API calls go through `src/services/api.js` with:
- Automatic JWT token injection
- Error handling with redirect on auth failure
- Centralized API configuration

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/           # Login & Register
│   │   ├── Dashboard/      # Task management UI
│   │   └── Common/         # Shared components
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   ├── services/
│   │   ├── api.js          # Axios configuration
│   │   └── taskService.js  # API calls
│   ├── App.jsx             # Main app
│   └── main.jsx            # Entry point
├── index.html
├── vite.config.js
├── package.json
└── Dockerfile
```

## Component Overview

### Auth Components
- **Login.jsx**: User login form with validation
- **Register.jsx**: User registration with password requirements

### Dashboard Components
- **Dashboard.jsx**: Main dashboard container
- **TaskList.jsx**: Displays tasks with filtering
- **TaskForm.jsx**: Create/edit tasks modal

### Common Components
- **NavBar.jsx**: Navigation with user info
- **ProtectedRoute.jsx**: Route guard for authenticated pages

### Services
- **api.js**: Axios instance with JWT interceptors
- **taskService.js**: Task API endpoints

## State Management

Uses React Context API for authentication state:
- `user`: Current logged-in user
- `accessToken`: JWT token
- `isAuthenticated`: Auth status
- `login()`, `register()`, `logout()` methods

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT tokens (access & refresh)
3. Frontend stores token in localStorage
4. Token automatically added to all API requests
5. On 401, token cleared and user redirected to login

## Error Handling

- API errors displayed as toasts/messages
- Form validation errors shown inline
- Network errors handled gracefully
- Auth errors trigger logout

## Styling

Uses CSS modules and global styles:
- Consistent color scheme (#667eea primary)
- Responsive grid layouts
- Smooth transitions
- Mobile-first approach

## Testing

Manual testing checklist:
1. Register new user
2. Login with credentials
3. Create task
4. Edit task
5. Delete task
6. Filter tasks
7. Logout

## Docker

Build and run with Docker:
```bash
docker build -t taskflow-frontend .
docker run -p 3000:3000 taskflow-frontend
```

## Environment Variables

```
VITE_API_URL=http://localhost:5000
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

**Built with**: React 18, Vite, Axios
**State Management**: React Context API
**Styling**: CSS3
