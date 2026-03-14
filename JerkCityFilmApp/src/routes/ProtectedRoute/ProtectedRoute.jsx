import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation, Outlet } from "react-router-dom";
// Protected Route Component

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
