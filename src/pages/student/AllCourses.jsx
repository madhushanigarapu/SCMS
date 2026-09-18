import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getAllCourses, addCourse } from "../../services/courseService";
import { getStudentCourses } from "../../services/courseService";
import CourseCard from "../../components/CourseCard";
import Loading from "../../components/Loading";

const AllCourses = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses + student's existing enrollments in parallel
        const [allRes, enrolledRes] = await Promise.all([
          getAllCourses(),
          user?.studentId
            ? getStudentCourses(user.studentId)
            : Promise.resolve({ data: [] }),
        ]);
        setCourses(allRes.data || []);
        const ids = new Set(
          (enrolledRes.data || []).map((c) => c.courseId)
        );
        setEnrolledIds(ids);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.studentId]);

  // Client-side filter — no API call needed
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

  const handleEnroll = async (courseId) => {
    if (!user?.studentId) {
      toast.error("Student information not found.");
      return;
    }
    try {
      setEnrollingId(courseId);
      await addCourse(user.studentId, courseId);
      setEnrolledIds((prev) => new Set(prev).add(courseId));
      toast.success("Enrolled successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll in course.");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1>All Courses</h1>
            <p>Explore available courses and enroll in the ones you want to learn.</p>
          </div>
          {!loading && courses.length > 0 && (
            <span className="page-count-badge">
              {filtered.length} / {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"}
            </span>
          )}
        </div>
      </div>

      {/* Search bar */}
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
            <button
              className="search-bar-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Loading message="Loading courses..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{query ? "🔍" : "🎓"}</div>
          <h3>{query ? "No matches found" : "No Courses Available"}</h3>
          <p>
            {query
              ? `No courses match "${query}". Try a different search term.`
              : "There are no courses in the system yet. Check back soon!"}
          </p>
          {query && (
            <button
              className="secondary-button"
              style={{ marginTop: "16px" }}
              onClick={() => setQuery("")}
            >
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
              buttonText={enrolledIds.has(course.courseId) ? "Enrolled ✓" : "Enroll"}
              onButtonClick={enrolledIds.has(course.courseId) ? undefined : handleEnroll}
              disabled={enrollingId === course.courseId || enrolledIds.has(course.courseId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
