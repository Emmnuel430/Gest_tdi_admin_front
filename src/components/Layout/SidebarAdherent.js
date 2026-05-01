import React from "react"; // Importation de React pour utiliser JSX et les fonctionnalités React.
import { Link } from "react-router-dom"; // Importation de Link pour la navigation.
import userImg from "../../assets/img/user.png"; // Importation de l'image de profil par défaut.
import logo from "../../assets/img/logo.png"; // Importation du logo de l'application.
import SidebarLinksAdherent from "./SidebarLinksAdherent"; // Importation du composant SidebarLinks qui contient les liens de la barre latérale.

const Sidebar = ({ user }) => {
  return (
    <div className="sidebar b-bar d-flex pb-3 bg-body">
      <div className="navbar bg-body navbar-body">
        {/* Partie logo et nom de l'application */}
        <Link
          to="/home"
          className="navbar-brand mx-4 mb-3 d-flex align-items-end"
        >
          <img
            src={logo} // Affichage du logo de l'application
            alt="Logo"
            className="bg-body"
            width="40"
            height="40"
          />
          <h3 className="m-0 ps-2 text-primary">
            {" "}
            {/* Affichage du titre "Gest v1.2" */}
            <strong>Gest v2</strong>
          </h3>
        </Link>
        {/* Section profil utilisateur */}
        <div className="d-flex align-items-center gap-3 px-3 py-2 rounded">
          {/* Avatar */}
          <div className="position-relative">
            <img
              src={userImg}
              alt="Profile"
              className="rounded-circle border"
              width="45"
              height="45"
            />

            {/* Online status */}
            <span className="position-absolute bottom-0 end-0 translate-middle p-1 bg-success border border-2 border-white rounded-circle"></span>
          </div>

          {/* Infos utilisateur */}
          {user && (
            <div className="d-flex flex-column">
              {/* Nom */}
              <span className="fw-semibold lh-sm">
                {user.prenom} <strong>{user.nom}</strong>
              </span>

              {/* Plan */}
              <span className="text-muted small">
                {user?.subscription?.plan?.name || "Abonné"}
              </span>

              {/* Type abonnement */}
              <div className="mt-1">
                <span className="badge bg-outline-info text-body border text-uppercase small">
                  {user?.subscription?.plan?.billing_type?.replace("_", " ") ||
                    "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Inclure les liens de navigation */}
        <SidebarLinksAdherent />{" "}
        {/* Affichage des liens en fonction de l'utilisateur */}
      </div>
    </div>
  );
};

export default Sidebar; // Exportation du composant Sidebar pour qu'il soit utilisé ailleurs dans l'application.
