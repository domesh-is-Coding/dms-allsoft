import { Navigate } from "react-router";
import { useAuthStore } from "../store/auth";

export default function PublicRoute({ children }) {
  const { token } = useAuthStore();

  // If authenticated, redirect to admin-user (dashboard)
  if (token) {
    return <Navigate to="/admin-user" replace />;
  }

  // If not authenticated, show the public content (login page)
  return children;
}
