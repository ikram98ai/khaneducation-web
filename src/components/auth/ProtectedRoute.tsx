import { useAuthStore } from "@/stores/authStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, profile, isLoading } = useAuthStore();


  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner, or null
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!profile) {
    return <Navigate to="/profile-setup" replace />;
  }

  // If user is logged in and has a profile, allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;