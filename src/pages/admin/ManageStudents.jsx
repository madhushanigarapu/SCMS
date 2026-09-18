import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { getAllStudents, deleteStudent } from "../../services/adminService";
import StudentCard from "../../components/StudentCard";
import Loading from "../../components/Loading";
import ConfirmModal from "../../components/ConfirmModal";

const ManageStudents = () => {
  const toast = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [query, setQuery] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.firstName?.toLowerCase().includes(q) ||
        s.lastName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        String(s.studentId).includes(q)
    );
  }, [students, query]);

  const handleDeleteRequest = (studentId) => {
    setPendingDeleteId(studentId);
  };

  const handleDeleteConfirm = async () => {
    const studentId = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      setDeletingId(studentId);
      await deleteStudent(studentId);
      toast.success("Student deleted successfully!");
      await fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  const pendingStudent = students.find((s) => s.studentId === pendingDeleteId);

  return (
    <div>
      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Delete this student?"
        message={
          pendingStudent
            ? `${pendingStudent.firstName} ${pendingStudent.lastName}'s account will be permanently deleted. This cannot be undone.`
            : "This student account will be permanently deleted."
        }
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />

      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <h1>Manage Students</h1>
            <p>View and manage all registered students.</p>
          </div>
          {!loading && students.length > 0 && (
            <span className="page-count-badge">
              {filtered.length} / {students.length}{" "}
              {students.length === 1 ? "student" : "students"}
            </span>
          )}
        </div>
      </div>

      {!loading && students.length > 0 && (
        <div className="search-bar-wrapper">
          <span className="search-bar-icon">🔍</span>
          <input
            className="search-bar-input"
            type="search"
            placeholder="Search by name, ID or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />
          {query && (
            <button className="search-bar-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Loading message="Loading students..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{query ? "🔍" : "🧑‍🎓"}</div>
          <h3>{query ? "No matches found" : "No Students Found"}</h3>
          <p>
            {query
              ? `No students match "${query}". Try a different search term.`
              : "There are no registered students yet."}
          </p>
          {query && (
            <button className="secondary-button" style={{ marginTop: "16px" }} onClick={() => setQuery("")}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="student-grid">
          {filtered.map((student, index) => (
            <StudentCard
              key={student.studentId}
              student={student}
              index={index}
              onDelete={handleDeleteRequest}
              deleting={deletingId === student.studentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
