import { Navigate } from "react-router";
import { useAuthStore } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
}
