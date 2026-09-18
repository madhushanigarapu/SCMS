import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { createCourse } from "../../services/adminService";

const AddCourse = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseName: "",
    cost: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse({
        courseName: formData.courseName,
        cost: Number(formData.cost),
        duration: formData.duration,
      });
      toast.success("Course added successfully!");
      setTimeout(() => navigate("/admin/courses"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-page-header">
        <h1>Add Course</h1>
        <p>Create a new course for students to enroll in.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseName">Course Name</label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. Introduction to React"
              maxLength={120}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cost">Course Cost (₹)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="e.g. 4999"
              min="1"
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 3 Months"
              maxLength={60}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner btn-spinner--sm" /> Adding...</>
              ) : (
                "Add Course"
              )}
            </button>
            <Link to="/admin/courses" className="secondary-button">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
