import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar-logo">
          TaskFlow
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">
              Welcome, {user.username}
            </span>

            {isAdmin && (
              <Link to="/admin" className="navbar-link">
                Users Data
              </Link>
            )}

            <Link to="/dashboard" className="navbar-link">
              My Dashboard
            </Link>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>

            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}