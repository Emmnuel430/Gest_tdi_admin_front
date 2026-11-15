import React, { useEffect, useState } from "react";
import { useAuth, getAuthToken, setAuthToken } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function ProtectedAdherent({ Cmp }) {
  const navigate = useNavigate();
  const { updateAdherent } = useAuth();
  const { showToast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const excludedPaths = ["/adherent/login", "/logout"];
    if (excludedPaths.includes(window.location.pathname)) return;

    const token = getAuthToken("adherent");
    const adherentInfo = sessionStorage.getItem("adherent-info");
    const adherent = adherentInfo ? JSON.parse(adherentInfo) : null;

    if (!adherent) {
      setAuthToken("adherent", null);
      sessionStorage.removeItem("adherent-info");
      window.location.href = process.env.REACT_APP_VITRINE_URL;
      return;
    }

    const checkAdherent = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/adherent/me`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );
        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        if (data.adherent.id !== adherent.id) throw new Error("Invalid");
        if (data.adherent.is_active !== "true") {
          showToast(
            "Votre compte a été désactivé. Vous êtes déconnecté.",
            "danger",
          );
          throw new Error("Inactive");
        }

        updateAdherent(data.adherent);
        setIsAuthorized(true);
      } catch (error) {
        setAuthToken("adherent", null);
        sessionStorage.removeItem("adherent-info");

        navigate("/adherent/login", {
          state: {
            reason: error.message === "Inactive" ? "inactive" : "unauthorized",
          },
        });
      }
    };

    checkAdherent();
  }, [updateAdherent, navigate, showToast]);

  return <>{isAuthorized ? <Cmp /> : null}</>;
}
