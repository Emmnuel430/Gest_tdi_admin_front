import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import loginImage from "../assets/img/login.png";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { loginAdmin, logoutAdherent } = useAuth();

  const { showToast } = useToast();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // État pour indiquer le chargement
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user-info")) {
      navigate("/admin-tdi/home"); // Redirige si l'utilisateur est déjà connecté
    }
  }, [navigate]);

  async function login(e) {
    e.preventDefault(); // Empêche le rafraîchissement de la page
    // Validation des entrées utilisateur
    if (!pseudo || !password) {
      showToast("Le pseudo et le mot de passe sont réquis", "info");
      return;
    }

    setLoading(true); // Active l'état de chargement

    // Appel à l'API pour tenter la connexion
    try {
      let item = { pseudo, password };
      let result = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(item),
      });

      result = await result.json();

      // Gère une réponse d'erreur de l'API
      if (result.error) {
        showToast(result.error, "danger"); // Affiche un message d'erreur provenant de l'API
        setLoading(false); // Désactive l'état de chargement
        return;
      }
      logoutAdherent(); // Pour éviter les conflits
      loginAdmin(result.user, result.token);

      setLoading(false); // Désactive l'état de chargement
      navigate("/admin-tdi/home");
    } catch (e) {
      showToast("Une erreur inatendue s'est produite. Réessayez");
      setLoading(false); // Désactive l'état de chargement
    }
  }
  return (
    <div>
      <section>
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx bg-body">
              <img src={loginImage} alt="Login Illustration" />
            </div>
            <div className="formBx bg-body">
              <img src={logo} alt="Logo" />
              <form onSubmit={login}>
                <h2 className="h2 text-primary">Connexion</h2>
                <label htmlFor="Pseudo">Pseudo</label>
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
                <div className="d-flex align-items-center mt-3">
                  <input
                    type="submit"
                    className="btn btn-primary m-0"
                    value={loading ? "Connexion ..." : "Connexion"}
                    disabled={loading}
                  />
                  &nbsp;&nbsp;
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="my-auto"
                      />
                    </>
                  ) : null}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
