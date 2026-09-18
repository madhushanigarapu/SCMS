import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { registerAdmin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const AdminRegister = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", address: "", mobileNumber: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // All hooks declared above — safe to early return now
  if (isAuthenticated) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerAdmin({ ...formData, mobileNumber: Number(formData.mobileNumber) });
      setSuccess("Admin account created! Redirecting to login...");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page auth-split-page--wide">
      <div className="auth-panel auth-panel--admin">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">SCMS</div>
          <h2 className="auth-panel-title">Set up your admin account</h2>
          <p className="auth-panel-sub">
            Get full control of the Student Course Management System.
            Manage courses, track enrollments, and more.
          </p>
          <ul className="auth-panel-features">
            <li><span className="auth-panel-check">✓</span> Create and delete courses</li>
            <li><span className="auth-panel-check">✓</span> Full platform visibility</li>
            <li><span className="auth-panel-check">✓</span> Dedicated admin dashboard</li>
            <li><span className="auth-panel-check">✓</span> Secure admin-only access</li>
          </ul>
        </div>
        <div className="auth-panel-footer">
          Already have an admin account?{" "}
          <Link to="/admin/login" className="auth-panel-link">Sign in →</Link>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card auth-form-card--wide">
          <div className="auth-form-header">
            <div className="auth-form-icon auth-form-icon--admin">🛡️</div>
            <h1>Create admin account</h1>
            <p>Fill in your details to get started</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName}
                  onChange={handleChange} placeholder="John" autoComplete="given-name" required />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName}
                  onChange={handleChange} placeholder="Doe" autoComplete="family-name" required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="admin@example.com" autoComplete="email" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-password-wrapper">
                  <input type={showPassword ? "text" : "password"} id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="Create a password" autoComplete="new-password" required />
                  <button type="button" className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-password-wrapper">
                  <input type={showConfirm ? "text" : "password"} id="confirmPassword"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password" autoComplete="new-password" required />
                  <button type="button" className="password-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}>
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber}
                  onChange={handleChange} placeholder="+91 98765 43210" autoComplete="tel" required />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={formData.address}
                  onChange={handleChange} placeholder="Your full address" rows="3" required />
              </div>
            </div>

            <button type="submit" className="auth-submit-button auth-submit-button--admin" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Creating account...</> : "Create Admin Account"}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>Already have an admin account? <Link to="/admin/login">Sign in here</Link></p>
            <p>Are you a student? <Link to="/student/login">Student login →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
