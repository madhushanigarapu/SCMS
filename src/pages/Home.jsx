import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  // Already logged in — send to dashboard
  if (isAuthenticated) {
    return <Navigate to={user?.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }

  return (
    <div className="home-page">

      {/* Navigation */}
      <header className="home-navbar">
        <div className="home-brand">
          <Link to="/">SCMS</Link>
          <span>Student Course Management System</span>
        </div>

        <nav className="home-nav-links">
          <a href="#about">About</a>
          <a href="#features">Features</a>

          <Link to="/student/login">
            Student Login
          </Link>

          <Link to="/admin/login">
            Admin Login
          </Link>
        </nav>
      </header>


      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">

          <span className="hero-badge">
            Student Course Management System
          </span>

          <h1>
            Learn. Manage. Grow.
          </h1>

          <p>
            A simple and efficient platform for students to manage
            their profiles, explore courses, and keep track of their
            enrollments.
          </p>

          <div className="hero-buttons">
            <Link
              to="/student/login"
              className="home-primary-button"
            >
              Student Login
            </Link>

            <Link
              to="/admin/login"
              className="home-secondary-button"
            >
              Admin Login
            </Link>
          </div>

          <div className="hero-register-links">
            <span>New to SCMS?</span>

            <Link to="/student/register">
              Register as Student
            </Link>

            <span>•</span>

            <Link to="/admin/register">
              Register as Admin
            </Link>
          </div>

        </div>
      </section>


      {/* About Section */}
      <section
        id="about"
        className="home-section about-section"
      >
        <div className="section-heading">
          <h2>About SCMS</h2>

          <p>
            SCMS provides a centralized platform for managing
            students, courses, and enrollments.
          </p>
        </div>

        <div className="about-content">

          <div className="about-card">
            <h3>For Students</h3>

            <p>
              Create and manage your profile, view available courses,
              enroll in courses, and manage your enrolled courses
              from one dashboard.
            </p>
          </div>

          <div className="about-card">
            <h3>For Administrators</h3>

            <p>
              Manage available courses, add new courses, remove
              courses, and monitor course information through the
              administrator dashboard.
            </p>
          </div>

        </div>
      </section>


      {/* Features */}
      <section
        id="features"
        className="home-section features-section"
      >
        <div className="section-heading">
          <h2>Key Features</h2>

          <p>
            Everything you need to manage courses in one place.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Course Management</h3>
            <p>
              Browse, add, and manage courses efficiently.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>Student Profile</h3>
            <p>
              Manage personal information and profile images.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>
              Separate authentication and protected access for
              students and administrators.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Course Enrollment</h3>
            <p>
              Students can enroll in and remove courses easily.
            </p>
          </div>

        </div>
      </section>


      {/* How It Works */}
      <section className="home-section">

        <div className="section-heading">
          <h2>How It Works</h2>

          <p>
            Get started with SCMS in a few simple steps.
          </p>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <span>01</span>
            <h3>Register</h3>
            <p>
              Create your student or administrator account.
            </p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>Login</h3>
            <p>
              Access your personalized dashboard.
            </p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Explore</h3>
            <p>
              Browse available courses and information.
            </p>
          </div>

          <div className="step-card">
            <span>04</span>
            <h3>Manage</h3>
            <p>
              Enroll in courses or manage courses as an admin.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>Ready to get started?</h2>

        <p>
          Join SCMS and manage your courses with ease.
        </p>

        <div className="hero-buttons">

          <Link
            to="/student/register"
            className="home-primary-button"
          >
            Register as Student
          </Link>

          <Link
            to="/admin/register"
            className="home-secondary-button"
          >
            Register as Admin
          </Link>

        </div>

      </section>


      {/* Footer */}
      <footer className="home-footer">
        <div>
          <strong>SCMS</strong>
          <span>
            Student Course Management System
          </span>
        </div>

        <p>
          © {new Date().getFullYear()} Student Course Management System
        </p>
      </footer>

    </div>
  );
};

export default Home;