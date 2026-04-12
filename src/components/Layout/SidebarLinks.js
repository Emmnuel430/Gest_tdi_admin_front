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
    {
      label: "Dashboard",
      to: "/admin-tdi/home",
      icon: "fa fa-home",
      roles: ["super_admin"],
    },
    {
      label: "Utilisateurs",
      to: "/admin-tdi/utilisateurs",
      icon: "fa fa-users",
      roles: ["super_admin"],
    },
    {
      label: "Demandes de prières",
      to: "/admin-tdi/prayer-requests",
      icon: "fas fa-praying-hands",
      roles: ["super_admin"],
    },
    {
      label: "Adherents",
      to: "/admin-tdi/adherents",
      icon: "fas fa-user-friends",
      roles: ["super_admin"],
    },
    {
      label: "Contenu",
      to: "/admin-tdi/contenu",
      icon: "fas fa-file-alt",
      roles: ["super_admin"],
      match: ["/admin-tdi/contenu", "/admin-tdi/contenu/add"],
    },
    {
      label: "Galerie",
      to: "/admin-tdi/galerie/dossiers",
      icon: "fa fa-images",
      new: true,
    },
  ];

  const publicLinks = [
    {
      label: "Pages",
      to: "/admin-tdi/pages",
      icon: "fa fa-file",
    },
    {
      label: "Affiches",
      to: "/admin-tdi/ads",
      icon: "fa fa-image",
    },
  ];

  return (
    <div className="navbar-nav w-100">
      {/* 🔥 ADMIN LINKS */}
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
            <i className={`${link.icon} me-2`}></i>
            <span className="text-body">{link.label}</span>
            {link.new && (
              <span className="badge text-bg-success ms-2">New</span>
            )}
          </Link>
        );
      })}

      {/* 🔽 SECTION */}
      <hr />
      <h6 className="text-uppercase text-muted ps-3 mt-3">Contenu du site</h6>

      {/* 🔥 CONTENT LINKS */}
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
          <i className={`${link.icon} me-2`}></i>
          <span className="text-body">{link.label}</span>
          {link.new && <span className="badge text-bg-success ms-2">New</span>}
        </Link>
      ))}
    </div>
  );
};

export default SidebarLinks;
