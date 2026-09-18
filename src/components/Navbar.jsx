import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(
      user?.role === "ADMIN"
        ? "/admin/login"
        : "/student/login"
    );
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link
          to={
            isAdmin
              ? "/admin/dashboard"
              : "/student/dashboard"
          }
        >
          SCMS
        </Link>

        <span>
          Student Course Management System
        </span>
      </div>

      <div className="navbar-right">
        <span className="welcome-text">
          Welcome, <strong>{user?.firstName}</strong>
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;