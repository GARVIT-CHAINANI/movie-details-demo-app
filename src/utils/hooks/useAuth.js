import { useContext } from "react";
import { AuthContext } from "../../components/LoginPage/AuthContext";

export const useAuth = () => useContext(AuthContext);
