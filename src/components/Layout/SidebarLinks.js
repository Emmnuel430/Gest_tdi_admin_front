import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLinks = ({ user }) => {
  const location = useLocation();
  if (!user) return null;

  const isActive = (link) => {
    if (link.match) {
      return link.match.includes(location.pathname);
    }
    return location.pathname === link.to;
  };

  const hasRole = (roles) => {
    if (!roles) return true;
    return roles.includes(user?.role);
  };

  const privateLinks = [
    // 1. Vue globale
    {
      label: "Dashboard",
      to: "/admin-tdi/home",
      icon: "chart-line",
      roles: ["super_admin"],
    },

    // 2. Utilisateurs
    {
      label: "Adhérents",
      to: "/admin-tdi/adherents",
      icon: "user-check",
      roles: ["super_admin"],
    },
    {
      label: "Utilisateurs",
      to: "/admin-tdi/utilisateurs",
      icon: "users-cog",
      roles: ["super_admin"],
    },

    // 3. Activité métier
    {
      label: (
        <>
          Demandes <br /> de prières
        </>
      ),
      to: "/admin-tdi/prayer-requests",
      icon: "hands-praying",
      roles: ["super_admin"],
    },
    {
      label: "Tsedakas",
      to: "/admin-tdi/tsedakas",
      icon: "hand-holding-heart",
      roles: ["super_admin"],
      new: true,
    },
    {
      label: "Formations / Cours",
      to: "/admin-tdi/contenu",
      icon: "graduation-cap",
      roles: ["super_admin"],
      match: ["/admin-tdi/contenu", "/admin-tdi/contenu/add"],
    },

    // 4. Business / paiement
    {
      label: "Abonnements",
      to: "/admin-tdi/subscription-plans",
      icon: "id-card",
      roles: ["super_admin"],
      new: true,
    },
    {
      label: "Transactions",
      to: "/admin-tdi/transactions",
      icon: "receipt",
      roles: ["super_admin"],
      new: true,
    },

    {
      label: "Commandes",
      to: "/admin-tdi/orders",
      icon: "boxes-packing",
      new: true,
    },
  ];

  const publicLinks = [
    {
      label: "Pages",
      to: "/admin-tdi/pages",
      icon: "file",
    },

    // Assets
    {
      label: "Galerie",
      to: "/admin-tdi/galerie/dossiers",
      icon: "photo-film",
      new: true,
    },
    {
      label: "Affiches",
      to: "/admin-tdi/ads",
      icon: "image",
    },
  ];

  return (
    <div className="navbar-nav w-100">
      {/* ADMIN LINKS */}
      {privateLinks.map((link, index) => {
        if (!hasRole(link.roles)) return null;

        return (
          <Link
            key={index}
            to={link.to}
            className={`nav-link d-flex align-items-center ${
              isActive(link) ? "active bg-body-secondary fw-bold" : ""
            }`}
          >
            <i className={`fas fa-${link.icon} me-2`}></i>
            <div className="text-body position-relative">
              {link.label}
              {link.new && (
                <span className="position-absolute small top-0 translate-middle rounded-pill badge text-bg-success ms-3">
                  New
                </span>
              )}
            </div>
          </Link>
        );
      })}

      {/* 🔽 SECTION */}
      <hr />
      <h6 className="text-uppercase text-muted ps-3 mt-3">Contenu du site</h6>

      {/* CONTENT LINKS */}
      {publicLinks.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className={`nav-link d-flex align-items-center ${
            location.pathname === link.to
              ? "active bg-body-secondary fw-bold"
              : ""
          }`}
        >
          <i className={`fas fa-${link.icon} me-2`}></i>
          <div className="text-body position-relative">
            {link.label}
            {link.new && (
              <span className="position-absolute small top-0 start-100 translate-middle rounded-pill badge text-bg-success ms-2">
                New
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SidebarLinks;
