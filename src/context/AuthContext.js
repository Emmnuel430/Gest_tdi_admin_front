import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adherent, setAdherent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("user-info");
    const storedAdherent = sessionStorage.getItem("adherent-info");

    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    if (storedAdherent) setAdherent(JSON.parse(storedAdherent));

    setLoading(false);
  }, []);

  // LOGIN ADMIN
  const loginAdmin = useCallback((userData, token) => {
    sessionStorage.setItem("user-info", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
    setAdmin(userData);
  }, []);

  // LOGIN ADHERENT
  const loginAdherent = useCallback((data, token) => {
    sessionStorage.setItem("adherent-info", JSON.stringify(data));
    sessionStorage.setItem("adherent-token", token);
    setAdherent(data);
  }, []);

  // LOGOUT ADMIN
  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem("user-info");
    sessionStorage.removeItem("token");
    setAdmin(null);
  }, []);

  // LOGOUT ADHERENT
  const logoutAdherent = useCallback(() => {
    sessionStorage.removeItem("adherent-info");
    sessionStorage.removeItem("adherent-token");
    setAdherent(null);
  }, []);

  // UPDATE ADHERENT (le plus important pour toi)
  const updateAdherent = useCallback((newData) => {
    setAdherent((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, ...newData };
      sessionStorage.setItem("adherent-info", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      admin,
      adherent,
      loading,
      loginAdmin,
      loginAdherent,
      logoutAdmin,
      logoutAdherent,
      updateAdherent,
    }),
    [
      admin,
      adherent,
      loading,
      loginAdmin,
      loginAdherent,
      logoutAdmin,
      logoutAdherent,
      updateAdherent,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
