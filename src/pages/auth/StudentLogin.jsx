import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { studentLogin, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in — send to the right dashboard
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
      await studentLogin(formData);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">

      {/* Left branding panel */}
      <div className="auth-panel auth-panel--student">
        <div className="auth-panel-content">
          <div className="auth-panel-logo">SCMS</div>
          <h2 className="auth-panel-title">Learn at your own pace</h2>
          <p className="auth-panel-sub">
            Access hundreds of courses, track your progress, and manage your
            learning journey — all in one place.
          </p>
          <ul className="auth-panel-features">
            <li><span className="auth-panel-check">✓</span> Browse all available courses</li>
            <li><span className="auth-panel-check">✓</span> Enroll and manage your courses</li>
            <li><span className="auth-panel-check">✓</span> View and update your profile</li>
          </ul>
        </div>
        <div className="auth-panel-footer">Student Course Management System</div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <div className="auth-form-icon auth-form-icon--student">🎓</div>
            <h1>Welcome back</h1>
            <p>Sign in to your student account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com" autoComplete="email" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"} id="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" autoComplete="current-password" required
                />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="auth-submit-button" disabled={loading}>
              {loading ? <><span className="btn-spinner" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>Don't have an account? <Link to="/student/register">Create one</Link></p>
            <p>Are you an admin? <Link to="/admin/login">Admin login →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
