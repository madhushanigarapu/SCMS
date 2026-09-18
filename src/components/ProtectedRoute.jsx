import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, user } = useAuth();

  // User is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is logged in but doesn't have the required role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;