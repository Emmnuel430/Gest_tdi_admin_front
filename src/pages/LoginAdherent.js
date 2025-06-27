import React, { useState, useEffect } from "react";
import "../assets/css/Login.css";
import loginImage from "../assets/img/login.png";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import ToastMessage from "../components/Layout/ToastMessage";

const LoginAdherent = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adherent-info")) {
      navigate("/adherent/home");
    }
  }, [navigate]);

  async function login(e) {
    e.preventDefault();
    if (!pseudo || !password) {
      setError("Le pseudo et le mot de passe sont réquis");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let item = { pseudo, password };
      let result = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/adherent/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(item),
        }
      );

      // console.log(JSON.stringify());

      result = await result.json();

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      if (result.message) {
        setError(result.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("adherent-info", JSON.stringify(result.adherent));
      localStorage.setItem("adherent-token", result.token);

      setLoading(false);
      navigate("/adherent/home");
    } catch (e) {
      setError("Une erreur inattendue s'est produite. Réessayez");
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
              {error && (
                <ToastMessage message={error} onClose={() => setError("")} />
              )}
              <img src={logo} alt="Logo" />
              <form onSubmit={login}>
                <h2 className="h2 text-primary">Connexion Adhérent</h2>
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
