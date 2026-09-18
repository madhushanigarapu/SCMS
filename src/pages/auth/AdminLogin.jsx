import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in — send to the right dashboard (hooks declared above, safe)
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
    setLoading(true);
    try {
      await adminLogin(formData);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">
      <div className="auth-panel auth-panel--admin">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">SCMS</div>
          <h2 className="auth-panel-title">Admin Control Panel</h2>
          <p className="auth-panel-sub">
            Manage courses, monitor enrollments, and keep your platform
            running smoothly from one powerful dashboard.
          </p>
          <ul className="auth-panel-features">
            <li><span className="auth-panel-check">✓</span> Create and manage all courses</li>
            <li><span className="auth-panel-check">✓</span> Monitor course enrollments</li>
            <li><span className="auth-panel-check">✓</span> Full platform administration</li>
          </ul>
        </div>
        <div className="auth-panel-footer">Student Course Management System</div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <div className="auth-form-icon auth-form-icon--admin">🛡️</div>
            <h1>Admin Sign In</h1>
            <p>Sign in to your administrator account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="admin@example.com" autoComplete="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-password-wrapper">
                <input type={showPassword ? "text" : "password"} id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" autoComplete="current-password" required />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-submit-button auth-submit-button--admin" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>Don't have an admin account? <Link to="/admin/register">Register here</Link></p>
            <p>Are you a student? <Link to="/student/login">Student login →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
