import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLinks = ({ user }) => {
  const location = useLocation();
  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const hasRole = (allowedRoles) => allowedRoles.includes(user?.role);

  return (
    <div className="navbar-nav w-100">
      {/* Dashboard - accessible à tous */}
      {hasRole(["super_admin"]) && (
        <>
          <Link
            to="/admin-tdi/home"
            className={`nav-item nav-link ${
              isActive("/admin-tdi/home")
                ? "active bg-body-secondary fw-bold"
                : ""
            }`}
          >
            <div>
              <i className="fa fa-home me-2"></i>
              <span className="text-body">Dashboard</span>
            </div>
          </Link>

          <Link
            to="/admin-tdi/utilisateurs"
            className={`nav-link d-flex align-items-center ${
              isActive("/admin-tdi/utilisateurs")
                ? "active bg-body-secondary fw-bold"
                : ""
            }`}
          >
            <i className="fa fa-users me-2"></i>
            <span className="text-body">Utilisateurs</span>
          </Link>
        </>
      )}
      <>
        <hr />
        <h6 className="text-uppercase text-muted ps-3 mt-3">Contenu du site</h6>

        <Link
          to="/admin-tdi/produits"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/produits")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-tag me-2"></i>

          <span className="text-body">Produit</span>
        </Link>
        <Link
          to="/admin-tdi/mot"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/mot") ? "active bg-body-secondary fw-bold" : ""
          }`}
        >
          <i className="fa fa-quote-left me-2"></i>
          <span className="text-body">Mot</span>
        </Link>

        <Link
          to="/admin-tdi/actualites"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/actualites")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-newspaper me-2"></i>
          <span className="text-body">Actualités</span>
        </Link>

        <Link
          to="/admin-tdi/evenements"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/evenements")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-calendar-alt me-2"></i>
          <span className="text-body">Événements</span>
        </Link>

        <Link
          to="/admin-tdi/conseillers"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/conseillers")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-handshake me-2"></i>
          <span className="text-body">Conseillers</span>
        </Link>

        <Link
          to="/admin-tdi/synagogues"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/synagogues")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-church me-2"></i>
          <span className="text-body">Synagogues</span>
        </Link>

        <Link
          to="/admin-tdi/fondements"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/fondements")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-book me-2"></i>
          <span className="text-body">Fondements</span>
        </Link>

        <Link
          to="/admin-tdi/etudes"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/etudes")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-graduation-cap me-2"></i>
          <span className="text-body">Études</span>
        </Link>

        <Link
          to="/admin-tdi/parachiot"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/parachiot")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-scroll me-2"></i>
          <span className="text-body">Parachiot</span>
        </Link>
      </>
    </div>
  );
};

export default SidebarLinks;
