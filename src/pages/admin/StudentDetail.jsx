import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { getStudentById } from "../../services/studentService";
import { getStudentCourses } from "../../services/courseService";
import Loading from "../../components/Loading";
import CourseCard from "../../components/CourseCard";

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Both services return response.data directly — no double .data needed
        const [studentRes, coursesRes] = await Promise.all([
          getStudentById(studentId),
          getStudentCourses(studentId),
        ]);
        // getStudentById returns response.data from Axios — the backend wraps the
        // student in { data: {...} }, so we need .data to get the actual student object.
        // This matches how StudentProfile, EditProfile, and StudentDashboard use it.
        setStudent(studentRes.data);
        setCourses(coursesRes.data || []);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load student details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [studentId]);

  if (loading) return <Loading message="Loading student details..." />;

  if (!student) {
    return (
      <div>
        <h2>Student not found</h2>
        <button
          className="secondary-button"
          onClick={() => navigate("/admin/students")}
          style={{ marginTop: "12px" }}
        >
          ← Back to Students
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1>
              {student.firstName} {student.lastName}
            </h1>
            <p>Student details and enrolled courses.</p>
          </div>
          <button
            className="secondary-button"
            onClick={() => navigate("/admin/students")}
          >
            ← Back to Students
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Student Information</h3>
          <p><strong>Student ID</strong> {student.studentId}</p>
          <p><strong>Name</strong> {student.firstName} {student.lastName}</p>
          <p><strong>Email</strong> {student.email}</p>
        </div>
        <div className="info-card">
          <h3>Contact Information</h3>
          <p><strong>Mobile</strong> {student.mobileNumber}</p>
          <p><strong>Address</strong> {student.address}</p>
        </div>
      </div>

      <div className="page-header" style={{ marginTop: "8px" }}>
        <div className="page-header-inner">
          <div>
            <h2 style={{ fontSize: "20px" }}>
              Enrolled Courses
            </h2>
            <p>Courses this student is currently enrolled in.</p>
          </div>
          <span className="page-count-badge page-count-badge--enrolled">
            {courses.length} enrolled
          </span>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Enrolled Courses</h3>
          <p>This student is not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course, index) => (
            <CourseCard key={course.courseId} course={course} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDetail;
