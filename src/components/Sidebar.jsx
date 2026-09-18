import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const getLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>{isAdmin ? "Admin Menu" : "Student Menu"}</h3>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={getLinkClass}>
              <span className="sidebar-link-icon">🏠</span>
              Dashboard
            </NavLink>
            <NavLink to="/admin/courses" className={getLinkClass}>
              <span className="sidebar-link-icon">📚</span>
              Manage Courses
            </NavLink>
            {/* Add Course grouped with Courses, before Students */}
            <NavLink to="/admin/courses/add" className={getLinkClass}>
              <span className="sidebar-link-icon">➕</span>
              Add Course
            </NavLink>
            <NavLink to="/admin/students" className={getLinkClass}>
              <span className="sidebar-link-icon">🧑‍🎓</span>
              Manage Students
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/student/dashboard" className={getLinkClass}>
              <span className="sidebar-link-icon">🏠</span>
              Dashboard
            </NavLink>
            <NavLink to="/student/profile" className={getLinkClass}>
              <span className="sidebar-link-icon">👤</span>
              My Profile
            </NavLink>
            <NavLink to="/student/edit-profile" className={getLinkClass}>
              <span className="sidebar-link-icon">✏️</span>
              Edit Profile
            </NavLink>
            <NavLink to="/student/courses" className={getLinkClass}>
              <span className="sidebar-link-icon">🎓</span>
              All Courses
            </NavLink>
            <NavLink to="/student/my-courses" className={getLinkClass}>
              <span className="sidebar-link-icon">📋</span>
              My Courses
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
