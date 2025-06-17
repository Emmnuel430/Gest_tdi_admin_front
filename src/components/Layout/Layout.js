// LayoutAdmin.jsx
import "bootstrap/dist/css/bootstrap.min.css";
// Importation des dépendances nécessaires
import React, { useState } from "react";
import "../../assets/css/Home.css"; // Importation du fichier CSS pour la mise en page
import HomeScript from "../../assets/js/HomeScript"; // Importation d'un script personnalisé pour la page
import loginImage from "../../assets/img/user.png"; // Importation d'une image pour le profil utilisateur
import { useNavigate, Link } from "react-router-dom"; // Importation de 'useNavigate' et 'Link' pour la navigation
import logo from "../../assets/img/logo.png"; // Importation du logo de l'application.
import Sidebar from "./Sidebar"; // Importation du composant Sidebar
import ThemeSwitcher from "../others/ThemeSwitcher"; // Importation du composant ThemeSwitcher

// Définition du composant Layout qui sera utilisé comme un modèle de page (avec du contenu dynamique via 'children')
const Layout = ({ children }) => {
  // Récupération des informations de l'utilisateur depuis le localStorage (si elles existent)
  let user = JSON.parse(localStorage.getItem("user-info"));
  const [load, setLoad] = useState(false);

  // Utilisation de 'useNavigate' pour effectuer des redirections dans l'application
  const navigate = useNavigate();

  // Fonction de déconnexion qui efface les informations de l'utilisateur du localStorage et redirige vers la page de connexion
  async function logOut() {
    const token = localStorage.getItem("token");

    try {
      setLoad(true);
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    } finally {
      setLoad(false);
    }
    // Redirection
    navigate("/");
    // Nettoyage du localStorage
    localStorage.clear();
  }

  return (
    <div className="container-fluid position-relative bg-body d-flex p-0">
      {/* Sidebar affichée sur le côté gauche */}
      <Sidebar user={user} />

      {/* Main content - Contenu principal de la page */}
      <div className="content shifted bg-body">
        {/* Navbar en haut de la page */}
        <nav className="navbar navbar-expand bg-body navbar-body sticky-top px-4 py-0">
          {/* Logo ou icône en version mobile */}
          <Link to="/home" className="navbar-brand d-flex d-lg-none me-4">
            <img
              src={logo} // Affichage du logo de l'application
              alt="Logo"
              width="40"
              height="40"
            />
          </Link>
          {/* Bouton pour basculer l'affichage de la sidebar */}
          <button
            className="sidebar-toggle flex-shrink-0 text-primary"
            style={{
              border: "none",
              zIndex: 1000,
              background: "none",
              fontSize: "1.5rem",
            }}
          >
            <i className="fa fa-bars"></i>
          </button>

          {/* Section de la barre de navigation avec notifications et messages */}
          <div className="navbar-nav align-items-center ms-auto">
            {/* Changement de thème */}
            <ThemeSwitcher />

            {/* Section pour afficher l'image de profil et permettre la déconnexion */}
            {user && (
              <div className="nav-item dropdown">
                <Link href="#" className="nav-link dropdown-toggle">
                  {/* Affichage de l'image de profil */}
                  <img
                    src={loginImage} // Remplacez 'loginImage' par l'image appropriée si nécessaire
                    alt="Profile"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                  <span className="d-none d-lg-inline items text-body">
                    {/* {user && user.first_name}{" "} */}
                    {/* <strong>{user && user.name}</strong> */}
                  </span>
                </Link>
                {/* Menu déroulant avec l'option de déconnexion */}
                <div className="dropdown-menu dropdown-menu-end bg-body border-0 rounded-bottom m-0">
                  <button
                    type="button"
                    className="dropdown-item text-body"
                    onClick={logOut}
                  >
                    {load ? (
                      <span>
                        <i className="fas fa-spinner fa-spin"></i> Chargement...
                      </span>
                    ) : (
                      <span>Déconnexion</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Contenu dynamique de la page, qui sera fourni par le parent (via 'children') */}
        <div className="p-2 min-vh-100">{children}</div>
        <div class="footer px-4 pt-4 mt-5">
          <div class="bg-body">
            <div class="row small">
              <div class="col-12 col-sm-6 text-center text-sm-start">
                &copy; {new Date().getFullYear()} <Link to="/">Gest</Link>,
                AsNumeric - J/E. Tous droits réservés.
              </div>
              <div class="col-12 col-sm-6 text-center text-sm-end text-muted ">
                Designed By <Link to="/">Joel E. Daho</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de retour en haut de la page */}
      <button className="btn btn-lg btn-primary btn-lg-square back-to-top hide">
        <i className="bi bi-arrow-up"></i>
      </button>

      {/* Script spécifique à la page Home */}
      <HomeScript />
    </div>
  );
};

export default Layout;
