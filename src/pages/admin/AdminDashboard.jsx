import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getAllCourses } from "../../services/courseService";
import { getAllStudents } from "../../services/adminService";
import Loading from "../../components/Loading";

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState({ courses: null, students: null });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch both in parallel — single loading state
        const [coursesRes, studentsRes] = await Promise.all([
          getAllCourses(),
          getAllStudents(),
        ]);
        setStats({
          courses:  coursesRes.data?.length  ?? 0,
          students: studentsRes.data?.length ?? 0,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load stats.");
        setStats({ courses: 0, students: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage courses and monitor your Student Course Management System.</p>
      </div>

      <div className="welcome-card">
        <h2>Welcome, {user?.firstName} {user?.lastName}! 👋</h2>
        <p>Welcome back to the administration dashboard.</p>
      </div>

      {/* Stats — 2 cards, 2-column grid */}
      <div className="stats-grid stats-grid--2">
        <div className="stat-card">
          <h3>Total Courses</h3>
          {loadingStats ? <Loading message="" /> : <h2>{stats.courses}</h2>}
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          {loadingStats ? <Loading message="" /> : <h2>{stats.students}</h2>}
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Admin Information</h3>
          <p><strong>Admin ID</strong> {user?.adminId}</p>
          <p><strong>Name</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email</strong> {user?.email}</p>
        </div>
        <div className="info-card">
          <h3>Contact Information</h3>
          <p><strong>Mobile</strong> {user?.mobileNumber}</p>
          <p><strong>Address</strong> {user?.address}</p>
        </div>
      </div>

      <div className="welcome-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <Link to="/admin/courses" className="primary-button">
            Manage Courses
          </Link>
          <Link to="/admin/courses/add" className="secondary-button">
            Add Course
          </Link>
          <Link to="/admin/students" className="secondary-button">
            Manage Students
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
