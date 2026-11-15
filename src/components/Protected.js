import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, setAuthToken } from "../context/AuthContext";

const Protected = ({ Cmp, adminOnly = false }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const excludedPaths = ["/", "/logout"];
    if (excludedPaths.includes(window.location.pathname)) return;

    const token = getAuthToken("admin");
    const userInfo = sessionStorage.getItem("user-info");
    const user = userInfo ? JSON.parse(userInfo) : null;

    if (!user) {
      sessionStorage.removeItem("user-info");
      setAuthToken("admin", null);
      navigate("/");
      return;
    }

    const checkUserInDB = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/user`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        const currentUser = data.user;

        if (
          !currentUser ||
          currentUser.id !== user.id ||
          currentUser.pseudo !== user.pseudo
        ) {
          throw new Error("Invalid user data");
        }

        // Vérification adminOnly
        if (adminOnly && currentUser.role !== "super_admin") {
          navigate("/access-denied");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        sessionStorage.removeItem("user-info");
        setAuthToken("admin", null);
        navigate("/");
      }
    };

    checkUserInDB();
  }, [adminOnly, navigate]);

  return <>{isAuthorized ? <Cmp /> : null}</>;
};

export default Protected;
