import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/Layout/AuthLayout";

const Login = () => {
  const { loginAdmin, logoutAdherent } = useAuth();

  const { showToast } = useToast();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user-info")) {
      navigate("/admin-tdi/home");
    }
  }, [navigate]);

  async function login(e) {
    e.preventDefault();
    if (!pseudo || !password) {
      showToast("Le pseudo et le mot de passe sont réquis", "info");
      return;
    }

    setLoading(true);

    try {
      let item = { pseudo, password };
      let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      if (response.status === 429) {
        showToast("Trop de tentatives. Veuillez patienter une minute.", "danger");
        setLoading(false);
        return;
      }

      let result = await response.json();

      if (result.error) {
        showToast(result.error, "danger");
        setLoading(false);
        return;
      }
      logoutAdherent();
      loginAdmin(result.user, result.token);

      setLoading(false);
      navigate("/admin-tdi/home");
    } catch (e) {
      showToast("Une erreur inatendue s'est produite. Réessayez", "danger");
      setLoading(false);
    }
  }
  return (
    <AuthLayout
      title="Connexion - ADMIN"
      onSubmit={login}
      loading={loading}
      submitDisabled={loading || !pseudo || !password}
    >
      <label htmlFor="pseudo">Pseudo</label>

      <input
        type="text"
        placeholder="Pseudo"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
      />

      <br />
      <br />

      <label htmlFor="password">Mot de passe</label>

      <input
        type="password"
        placeholder="Mot de Passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </AuthLayout>
  );
};

export default Login;
