import { Link } from "react-router-dom";

const ACCENT_COLORS = [
  { bar: "#2563eb", light: "#eff6ff", text: "#1d4ed8" },
  { bar: "#7c3aed", light: "#f5f3ff", text: "#6d28d9" },
  { bar: "#059669", light: "#ecfdf5", text: "#047857" },
  { bar: "#ea580c", light: "#fff7ed", text: "#c2410c" },
  { bar: "#db2777", light: "#fdf2f8", text: "#be185d" },
  { bar: "#0891b2", light: "#ecfeff", text: "#0e7490" },
];

const StudentCard = ({ student, index = 0, onDelete, deleting = false }) => {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="student-card">
      <div className="student-card-accent" style={{ backgroundColor: accent.bar }} />

      <div className="student-card-header">
        <div
          className="student-card-avatar"
          style={{ backgroundColor: accent.light, color: accent.text }}
        >
          {initials || "?"}
        </div>
        <h2 className="student-card-name">
          {student.firstName} {student.lastName}
        </h2>
      </div>

      <div className="student-card-badges">
        <span className="student-badge">#{student.studentId}</span>
        <span className="student-badge">{student.courses?.length ?? 0} courses</span>
      </div>

      <div className="student-card-body">
        <div className="student-detail">
          <span className="student-detail-label">Email</span>
          <span className="student-detail-value">{student.email}</span>
        </div>
        <div className="student-detail">
          <span className="student-detail-label">Mobile</span>
          <span className="student-detail-value">{student.mobileNumber}</span>
        </div>
      </div>

      <div className="student-card-footer">
        <Link to={`/admin/students/${student.studentId}`} className="secondary-button">
          View
        </Link>
        <button
          onClick={() => onDelete(student.studentId)}
          disabled={deleting}
          className="course-danger-button"
        >
          {deleting ? (
            <><span className="btn-spinner btn-spinner--sm" /> Deleting...</>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
};

export default StudentCard;