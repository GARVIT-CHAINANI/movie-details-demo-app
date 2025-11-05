import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth";

const AuthRedirect = () => {
  const { currentUser } = useAuth();
  return currentUser ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/auth?mode=login" replace />
  );
};

export default AuthRedirect;
