import { useContext } from "react";
import { AuthContext } from "../../components/LoginPage_temp/AuthContext";

export const useAuth = () => useContext(AuthContext);
