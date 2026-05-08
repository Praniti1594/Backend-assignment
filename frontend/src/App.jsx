import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import NavBar from './components/Common/NavBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminRoute from './components/Common/AdminRoute';
import './App.css';
import './components/Admin/admin.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <>
                  <NavBar />
                  <AdminDashboard />
                </>
              </AdminRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <NavBar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to={window.localStorage.getItem('user') && JSON.parse(window.localStorage.getItem('user')).role === 'admin' ? '/admin' : '/dashboard'} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
