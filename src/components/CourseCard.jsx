// Accent colors that cycle across cards based on their index
const ACCENT_COLORS = [
  { bar: "#2563eb", light: "#eff6ff", text: "#1d4ed8" }, // blue
  { bar: "#7c3aed", light: "#f5f3ff", text: "#6d28d9" }, // violet
  { bar: "#059669", light: "#ecfdf5", text: "#047857" }, // emerald
  { bar: "#ea580c", light: "#fff7ed", text: "#c2410c" }, // orange
  { bar: "#db2777", light: "#fdf2f8", text: "#be185d" }, // pink
  { bar: "#0891b2", light: "#ecfeff", text: "#0e7490" }, // cyan
];

const CourseCard = ({
  course,
  buttonText,
  onButtonClick,
  disabled = false,
  index = 0,
}) => {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  // Generate initials from course name (up to 2 letters)
  const initials = (course.courseName || "C")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

  const isDanger = buttonText === "Delete" || buttonText === "Remove";

  return (
    <div className="course-card">

      {/* Colored accent bar at the top */}
      <div
        className="course-card-accent"
        style={{ backgroundColor: accent.bar }}
      />

      {/* Header: avatar + name */}
      <div className="course-card-header">
        <div
          className="course-card-avatar"
          style={{
            backgroundColor: accent.light,
            color: accent.text,
          }}
        >
          {initials}
        </div>
        <h2 className="course-card-name">{course.courseName}</h2>
      </div>

      {/* Badges: cost + duration */}
      <div className="course-card-badges">
        <span className="course-badge course-badge--cost">
          ₹{course.cost}
        </span>
        <span className="course-badge course-badge--duration">
          🕐 {course.duration}
        </span>
      </div>

      {/* Details row */}
      <div className="course-card-body">
        <div className="course-detail">
          <span className="course-detail-label">Course ID</span>
          <span className="course-detail-value">#{course.courseId}</span>
        </div>
      </div>

      {/* Action button */}
      {onButtonClick && (
        <div className="course-card-footer">
          <button
            onClick={() => onButtonClick(course.courseId)}
            disabled={disabled}
            className={isDanger ? "course-danger-button" : "course-primary-button"}
            style={
              !isDanger && !disabled
                ? { backgroundColor: accent.bar }
                : undefined
            }
          >
            {disabled ? (
              <><span className="btn-spinner btn-spinner--sm" /> Processing...</>
            ) : (
              buttonText
            )}
          </button>
        </div>
      )}

    </div>
  );
};

export default CourseCard;
