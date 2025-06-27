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
          <Link
            to="/admin-tdi/prayer-requests"
            className={`nav-link d-flex align-items-center ${
              isActive("/admin-tdi/prayer-requests")
                ? "active bg-body-secondary fw-bold"
                : ""
            }`}
          >
            <i className="fas fa-praying-hands me-2"></i>

            <span className="text-body">
              Demandes de <br /> prières
            </span>
          </Link>
          <Link
            to="/admin-tdi/adherents"
            className={`nav-link d-flex align-items-center ${
              isActive("/admin-tdi/adherents")
                ? "active bg-body-secondary fw-bold"
                : ""
            }`}
          >
            <i className="fas fa-user-friends me-2"></i>

            <span className="text-body">Adherents</span>
          </Link>
          <Link
            to="/admin-tdi/contenu"
            className={`nav-link d-flex align-items-center ${
              isActive("/admin-tdi/contenu")
                ? "active bg-body-secondary fw-bold"
                : ""
            }`}
          >
            <i className="fas fa-file-alt me-2"></i>

            <span className="text-body">Contenu</span>
          </Link>
        </>
      )}
      <>
        <hr />
        <h6 className="text-uppercase text-muted ps-3 mt-3">Contenu du site</h6>

        <Link
          to="/admin-tdi/pages"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/pages")
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className="fa fa-file me-2"></i>
          <span className="text-body">Pages</span>
        </Link>
        <Link
          to="/admin-tdi/ads"
          className={`nav-link d-flex align-items-center ${
            isActive("/admin-tdi/ads") ? "active bg-body-secondary fw-bold" : ""
          }`}
        >
          <i className="fa fa-image me-2"></i>
          <span className="text-body">Affiches</span>
        </Link>
      </>
    </div>
  );
};

export default SidebarLinks;
