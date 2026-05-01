import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ Cmp, type = "ADMIN", adminOnly = false }) => {
  const { admin, adherent } = useAuth();

  if (type === "ADMIN") {
    if (!admin) return <Navigate to="/" />;
    if (adminOnly && admin.role !== "super_admin")
      return <Navigate to="/access-denied" />;
    return <Cmp />;
  }

  if (type === "ADHERENT") {
    if (!adherent) {
      window.location.href = process.env.REACT_APP_VITRINE_URL;
      return null;
    }
    return <Cmp />;
  }

  return <Navigate to="/" />;
};
