import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStudentCourses, removeCourse } from "../../services/courseService";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";

const MyCourses = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchMyCourses = async () => {
    if (!user?.studentId) {
      toast.error("Student information not found.");
      setLoading(false);
      return;
    }
    try {
      const response = await getStudentCourses(user.studentId);
      setCourses(response.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, [user?.studentId]);

  const handleRemove = async (courseId) => {
    if (!user?.studentId) return;
    try {
      setRemovingId(courseId);
      await removeCourse(user.studentId, courseId);
      toast.success("Course removed successfully!");
      await fetchMyCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove course.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1>My Courses</h1>
            <p>View and manage the courses you are currently enrolled in.</p>
          </div>
          {!loading && courses.length > 0 && (
            <span className="page-count-badge page-count-badge--enrolled">
              {courses.length} enrolled
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <Loading message="Loading your courses..." />
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Enrolled Courses</h3>
          <p>You haven't enrolled in any courses yet. Head to All Courses to get started.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course, index) => (
            <CourseCard
              key={course.courseId}
              course={course}
              index={index}
              buttonText="Remove"
              onButtonClick={handleRemove}
              disabled={removingId === course.courseId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
