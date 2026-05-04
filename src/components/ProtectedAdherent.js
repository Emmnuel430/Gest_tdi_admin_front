import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

const ProtectedAdherent = ({ Cmp }) => {
  const { updateAdherent } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const excludedPaths = ["/adherent/login", "/logout"];
    if (excludedPaths.includes(window.location.pathname)) return;

    const token = sessionStorage.getItem("adherent-token");
    const adherentInfo = sessionStorage.getItem("adherent-info");
    const adherent = adherentInfo ? JSON.parse(adherentInfo) : null;

    if (!token || !adherent) {
      sessionStorage.removeItem("adherent-token");
      sessionStorage.removeItem("adherent-info");
      window.location.href = process.env.REACT_APP_VITRINE_URL;

      return;
    }

    const checkAdherent = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/adherent/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        if (data.adherent.id !== adherent.id) throw new Error("Invalid");

        // 3. MISE À JOUR DU CONTEXTE :
        // Si ton useAuth a une fonction updateAdherent, appelle-la ici
        updateAdherent(data.adherent);

        setIsAuthorized(true);
      } catch (error) {
        sessionStorage.removeItem("adherent-token");
        sessionStorage.removeItem("adherent-info");

        window.location.href = process.env.REACT_APP_VITRINE_URL;
      }
    };

    checkAdherent();
  }, []);

  return <>{isAuthorized ? <Cmp /> : null}</>;
};

export default ProtectedAdherent;
