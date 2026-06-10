import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="screen-center">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
