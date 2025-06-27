import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLinksAdherent = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar-nav w-100">
      {/* Tableau de bord */}
      <Link
        to="/adherent/home"
        className={`nav-item nav-link ${
          isActive("/adherent/home") ? "active bg-body-secondary fw-bold" : ""
        }`}
      >
        <i className="fa fa-home me-2"></i>
        <span className="text-body">Accueil</span>
      </Link>

      {/* Formations */}
      <Link
        to="/adherent/formations"
        className={`nav-item nav-link ${
          isActive("/adherent/formations")
            ? "active bg-body-secondary fw-bold"
            : ""
        }`}
      >
        <i className="fas fa-book-open me-2"></i>
        <span className="text-body">Formations</span>
      </Link>

      <Link
        to="/adherent/cours"
        className={`nav-item nav-link ${
          isActive("/adherent/cours") ? "active bg-body-secondary fw-bold" : ""
        }`}
      >
        <i className="fas fa-book me-2"></i>
        <span className="text-body">Cours</span>
      </Link>

      {/* Historique ou abonnement
      <Link
        to="/adherent/abonnement"
        className={`nav-item nav-link ${
          isActive("/adherent/abonnement")
            ? "active bg-body-secondary fw-bold"
            : ""
        }`}
      >
        <i className="fas fa-receipt me-2"></i>
        <span className="text-body">Mon abonnement</span>
      </Link> */}

      {/* Profil */}
      <Link
        to="/adherent/profil"
        className={`nav-item nav-link ${
          isActive("/adherent/profil") ? "active bg-body-secondary fw-bold" : ""
        }`}
      >
        <i className="fas fa-user-circle me-2"></i>
        <span className="text-body">Mon profil</span>
      </Link>
    </div>
  );
};

export default SidebarLinksAdherent;
