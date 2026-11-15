import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const AuthContext = createContext();

/**
 * Dette #23 : Stockage des jetons exclusivement en mémoire vive (closure JS)
 * couplé au cookie HttpOnly (SameSite=Lax) géré par le backend Laravel Sanctum.
 * Aucun jeton d'authentification n'est exposé dans sessionStorage ou localStorage.
 */
const inMemoryTokenStore = {
  admin: null,
  adherent: null,
};

export const getAuthToken = (type = "admin") => inMemoryTokenStore[type] || null;
export const setAuthToken = (type, token) => {
  inMemoryTokenStore[type] = token || null;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adherent, setAdherent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nettoyage défensif d'anciens tokens éventuellement présents en sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adherent-token");

    const storedAdmin = sessionStorage.getItem("user-info");
    const storedAdherent = sessionStorage.getItem("adherent-info");

    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    if (storedAdherent) setAdherent(JSON.parse(storedAdherent));

    setLoading(false);
  }, []);

  // LOGIN ADMIN
  const loginAdmin = useCallback((userData, token) => {
    sessionStorage.setItem("user-info", JSON.stringify(userData));
    sessionStorage.removeItem("token");
    setAuthToken("admin", token);
    setAdmin(userData);
  }, []);

  // LOGIN ADHERENT
  const loginAdherent = useCallback((data, token) => {
    sessionStorage.setItem("adherent-info", JSON.stringify(data));
    sessionStorage.removeItem("adherent-token");
    setAuthToken("adherent", token);
    setAdherent(data);
  }, []);

  // LOGOUT ADMIN
  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem("user-info");
    sessionStorage.removeItem("token");
    setAuthToken("admin", null);
    setAdmin(null);
  }, []);

  // LOGOUT ADHERENT
  const logoutAdherent = useCallback(() => {
    sessionStorage.removeItem("adherent-info");
    sessionStorage.removeItem("adherent-token");
    setAuthToken("adherent", null);
    setAdherent(null);
  }, []);

  // UPDATE ADHERENT
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
