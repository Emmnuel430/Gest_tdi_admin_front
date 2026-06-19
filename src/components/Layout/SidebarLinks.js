import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarLinks = ({ user }) => {
  const location = useLocation();

  const activeLinkRef = useRef(null);
  // Déclenche le scroll automatique vers l'élément actif au chargement initial ou changement d'URL
  useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth", // "smooth" pour une animation fluide, "auto" pour un saut instantané
        block: "nearest", // Aligne l'élément seulement s'il n'est pas déjà visible dans la zone de scroll
      });
    }
  }, [location.pathname]); // S'exécute à chaque changement de page

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
        const isCurrentActive = isActive(link);

        return (
          <Link
            key={index}
            to={link.to}
            // Attribution de la ref uniquement au lien actif
            ref={isCurrentActive ? activeLinkRef : null}
            className={`nav-link d-flex align-items-center ${
              isCurrentActive ? "active bg-body-secondary fw-bold" : ""
            }`}
            style={{
              scrollMarginBottom: "50px",
            }}
          >
            <i className={`fas fa-${link.icon} me-2`}></i>
            <div className="text-body position-relative">{link.label}</div>
          </Link>
        );
      })}

      {/* 🔽 SECTION */}
      <hr />
      <h6 className="text-uppercase text-muted ps-3 mt-3">Contenu du site</h6>

      {/* CONTENT LINKS */}
      {publicLinks.map((link, index) => {
        const isCurrentActive = location.pathname === link.to;

        return (
          <Link
            key={index}
            to={link.to}
            // Attribution de la ref uniquement au lien actif
            ref={isCurrentActive ? activeLinkRef : null}
            className={`nav-link d-flex align-items-center ${
              isCurrentActive ? "active bg-body-secondary fw-bold" : ""
            }`}
            style={{
              scrollMarginBottom: "50px",
            }}
          >
            <i className={`fas fa-${link.icon} me-2`}></i>
            <div className="text-body position-relative">{link.label}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarLinks;
