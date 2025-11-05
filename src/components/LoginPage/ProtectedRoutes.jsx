import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../utils/hooks/useAuth";

const ProtectedRoutes = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // 👈 Redirect to login if not logged in
    return <Navigate to="/auth?mode=login" replace />;
  }

  // 👇 Otherwise, render child route (e.g. Dashboard)
  return <Outlet />;
};

export default ProtectedRoutes;
