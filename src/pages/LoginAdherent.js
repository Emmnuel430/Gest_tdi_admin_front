import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/Layout/AuthLayout";

const LoginAdherent = () => {
  const { loginAdherent, logoutAdmin } = useAuth();

  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.reason === "inactive") {
      showToast(
        "Votre compte a été désactivé. Contactez l'administration si nécessaire.",
        "danger",
      );
    }

    if (sessionStorage.getItem("adherent-info")) {
      navigate("/adherent/home");
    }
  }, [location.state, navigate, showToast]);

  async function login(e) {
    e.preventDefault();
    if (!email || !password) {
      showToast("Le email et le mot de passe sont réquis", "info");
      return;
    }
    setLoading(true);

    try {
      let item = { email, password };
      let result = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/adherent/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(item),
        },
      );

      result = await result.json();

      if (result.error) {
        showToast(result.error, "danger");
        setLoading(false);
        return;
      }
      if (result.message) {
        showToast(result.message, "info");
        setLoading(false);
        return;
      }

      logoutAdmin(); // Pour éviter les conflits
      loginAdherent(result.adherent, result.token);

      setLoading(false);
      navigate("/adherent/home");
    } catch (e) {
      showToast("Une erreur inattendue s'est produite. Réessayez", "danger");
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Connexion - Adhérent"
      onSubmit={login}
      loading={loading}
      submitDisabled={loading || !email || !password}
    >
      <label htmlFor="email">Email</label>

      <input
        type="email"
        placeholder="Ex : abc@xyz.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

export default LoginAdherent;
