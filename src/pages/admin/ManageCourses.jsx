import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { getAllCourses } from "../../services/courseService";
import { deleteCourse } from "../../services/adminService";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";

const ManageCourses = () => {
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [query, setQuery] = useState("");

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.courseName?.toLowerCase().includes(q) ||
        String(c.courseId).includes(q) ||
        c.duration?.toLowerCase().includes(q)
    );
  }, [courses, query]);

  const handleDeleteRequest = (courseId) => {
    setPendingDeleteId(courseId);
  };

  const handleDeleteConfirm = async () => {
    const courseId = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      setDeletingId(courseId);
      await deleteCourse(courseId);
      toast.success("Course deleted successfully!");
      await fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCourse = courses.find((c) => c.courseId === pendingDeleteId);

  return (
    <div>
      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Delete this course?"
        message={
          pendingCourse
            ? `"${pendingCourse.courseName}" will be permanently removed. This cannot be undone.`
            : "This course will be permanently removed."
        }
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1>Manage Courses</h1>
            <p>View and manage all courses available in the system.</p>
          </div>
          {!loading && courses.length > 0 && (
            <span className="page-count-badge">
              {filtered.length} / {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"}
            </span>
          )}
        </div>
      </div>

      {!loading && courses.length > 0 && (
        <div className="search-bar-wrapper">
          <span className="search-bar-icon">🔍</span>
          <input
            className="search-bar-input"
            type="search"
            placeholder="Search by name, ID or duration..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search courses"
          />
          {query && (
            <button className="search-bar-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Loading message="Loading courses..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{query ? "🔍" : "📚"}</div>
          <h3>{query ? "No matches found" : "No Courses Found"}</h3>
          <p>
            {query
              ? `No courses match "${query}". Try a different search term.`
              : "There are no courses in the system yet. Add one to get started."}
          </p>
          {query && (
            <button className="secondary-button" style={{ marginTop: "16px" }} onClick={() => setQuery("")}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="course-grid">
          {filtered.map((course, index) => (
            <CourseCard
              key={course.courseId}
              course={course}
              index={index}
              buttonText="Delete"
              onButtonClick={handleDeleteRequest}
              disabled={deletingId === course.courseId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
