import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SidebarLinksAdherent = () => {
  const location = useLocation();
  const { adherent } = useAuth();
  const isProfileCompleted =
    adherent?.profile_completed === true ||
    adherent?.profile_completed === "true";

  const links = [
    {
      label: "Accueil",
      to: "/adherent/home",
      icon: "home",
    },
    {
      label: "Formations",
      to: "/adherent/formations",
      icon: "book-open",
      requiresProfile: true,
    },
    {
      label: "Cours",
      to: "/adherent/cours",
      icon: "book",
      requiresProfile: true,
    },
    {
      label: "Événements",
      to: "/adherent/evenements",
      icon: "calendar",
      requiresProfile: true,
    },
    {
      label: "Mon profil",
      to: "/adherent/profil",
      icon: "user-circle",
    },
  ];

  const isActive = (link) => {
    if (link.match) {
      return link.match.some((path) => location.pathname.startsWith(path));
    }
    return location.pathname === link.to;
  };

  return (
    <div className="navbar-nav w-100">
      {links.map((link, index) => {
        const isDisabled = link.requiresProfile && !isProfileCompleted;

        return (
          <Link
            key={index}
            to={isDisabled ? "#" : link.to}
            onClick={(e) => {
              if (isDisabled) {
                e.preventDefault();
                alert(
                  "Completez votre profil afin de pouvoir accéder à cette page.",
                );
              }
            }}
            className={`nav-item nav-link ${
              isActive(link) ? "active bg-body-secondary fw-bold" : ""
            } ${isDisabled ? "opacity-50" : ""}`}
            // style={{ pointerEvents: isDisabled ? "none" : "auto" }}
          >
            <i className={`fas fa-${link.icon} me-2`}></i>
            <span className="text-body">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarLinksAdherent;
