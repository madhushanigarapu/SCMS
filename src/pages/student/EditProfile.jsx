import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getStudentById, updateStudent } from "../../services/studentService";
import Loading from "../../components/Loading";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    mobileNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user?.studentId) {
        toast.error("Student information not found.");
        setLoading(false);
        return;
      }
      try {
        const response = await getStudentById(user.studentId);
        const s = response.data;
        setFormData({
          firstName:    s.firstName    || "",
          lastName:     s.lastName     || "",
          email:        s.email        || "",
          password:     "",
          address:      s.address      || "",
          mobileNumber: s.mobileNumber || "",
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [user?.studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToUpdate = {
        firstName:    formData.firstName,
        lastName:     formData.lastName,
        email:        formData.email,
        address:      formData.address,
        mobileNumber: Number(formData.mobileNumber),
      };
      if (formData.password.trim() !== "") {
        dataToUpdate.password = formData.password;
      }
      await updateStudent(user.studentId, dataToUpdate);
      updateUser({
        firstName: dataToUpdate.firstName,
        lastName:  dataToUpdate.lastName,
        email:     dataToUpdate.email,
      });
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/student/profile"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div>
      <div className="form-page-header">
        <h1>Edit Profile</h1>
        <p>Update your personal information.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                autoComplete="given-name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <small>Leave this field empty to keep your current password.</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                id="mobileNumber"
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? (
                <><span className="btn-spinner btn-spinner--sm" /> Saving...</>
              ) : (
                "Save Changes"
              )}
            </button>
            <Link to="/student/profile" className="secondary-button">
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
