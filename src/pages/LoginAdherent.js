import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import loginImage from "../assets/img/login.png";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const LoginAdherent = () => {
  const { loginAdherent, logoutAdmin } = useAuth();

  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("adherent-info")) {
      navigate("/adherent/home");
    }
  }, [navigate]);

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
                <h2 className="h2 text-primary">Connexion Adhérent</h2>
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
                <div className="d-flex align-items-center mt-3">
                  <input
                    type="submit"
                    className="btn btn-primary m-0"
                    value={loading ? "Connexion ..." : "Connexion"}
                    disabled={loading || !email || !password}
                  />
                  &nbsp;&nbsp;
                  {loading ? (
                    <Spinner animation="border" size="sm" className="my-auto" />
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

export default LoginAdherent;
