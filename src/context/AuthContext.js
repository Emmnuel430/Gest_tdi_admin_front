import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adherent, setAdherent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialisation au chargement de l'app
    const storedAdmin = sessionStorage.getItem("user-info");
    const storedAdherent = sessionStorage.getItem("adherent-info");

    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    if (storedAdherent) setAdherent(JSON.parse(storedAdherent));

    setLoading(false);
  }, []);

  // Fonctions pour mettre à jour l'état lors du login
  const loginAdmin = (userData, token) => {
    sessionStorage.setItem("user-info", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
    setAdmin(userData);
  };

  const loginAdherent = (data, token) => {
    sessionStorage.setItem("adherent-info", JSON.stringify(data));
    sessionStorage.setItem("adherent-token", token);
    setAdherent(data);
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem("user-info");
    sessionStorage.removeItem("token");
    setAdmin(null);
  };

  const logoutAdherent = () => {
    sessionStorage.removeItem("adherent-info");
    sessionStorage.removeItem("adherent-token");
    setAdherent(null);
  };

  const updateAdherent = (newData) => {
    setAdherent((prev) => {
      if (!prev) return prev;

      const updated = { ...prev, ...newData };
      sessionStorage.setItem("adherent-info", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        adherent,
        loading,
        loginAdmin,
        loginAdherent,
        logoutAdmin,
        logoutAdherent,
        updateAdherent,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
