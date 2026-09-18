import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStudentById } from "../../services/studentService";
import { getStudentCourses } from "../../services/courseService";
import Loading from "../../components/Loading";

const StudentDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [student, setStudent] = useState(user);
  const [courseCount, setCourseCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentId) {
        setLoading(false);
        return;
      }
      try {
        const [studentRes, coursesRes] = await Promise.all([
          getStudentById(user.studentId),
          getStudentCourses(user.studentId),
        ]);
        setStudent(studentRes.data);
        setCourseCount(coursesRes.data?.length ?? 0);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.studentId]);

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Manage your profile, courses, and enrollments.</p>
      </div>

      <div className="welcome-card">
        <h2>Welcome, {student?.firstName} {student?.lastName}! 👋</h2>
        <p>Welcome back to your Student Course Management System.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid--sm">
        <div className="stat-card">
          <h3>Enrolled Courses</h3>
          <h2>{courseCount ?? "—"}</h2>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Student Information</h3>
          <p><strong>Student ID</strong> {student?.studentId}</p>
          <p><strong>Name</strong> {student?.firstName} {student?.lastName}</p>
          <p><strong>Email</strong> {student?.email}</p>
        </div>
        <div className="info-card">
          <h3>Contact Information</h3>
          <p><strong>Mobile</strong> {student?.mobileNumber}</p>
          <p><strong>Address</strong> {student?.address}</p>
        </div>
      </div>

      <div className="welcome-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <Link to="/student/profile" className="primary-button">
            My Profile
          </Link>
          <Link to="/student/courses" className="primary-button">
            Browse Courses
          </Link>
          <Link to="/student/my-courses" className="secondary-button">
            My Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
