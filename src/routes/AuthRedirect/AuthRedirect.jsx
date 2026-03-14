import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function AuthRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
