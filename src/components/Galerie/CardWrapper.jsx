import React, { useRef, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { formatDateRelative } from "../../utils/formatDateRelative";

// --- SOUS-COMPOSANT : DOSSIER ---
const FolderCard = ({ item, icon }) => (
  <div className="d-flex flex-column justify-content-between h-100 p-3">
    {/* Centre : Grosse icône de dossier stylisée */}
    <div className="d-flex align-items-center justify-content-center flex-grow-1 my-2">
      <div className="folder-icon-wrapper p-3 rounded-circle bg-body text-primary">
        <i className={`fas ${icon || "fa-folder"} fa-3x`} />
      </div>
    </div>
    {/* Bas : Infos Dossier */}
    <div className="mt-2">
      <div className="d-flex justify-content-between align-items-center text-truncate">
        <h6 className="mb-0 text-truncate fw-semibold text-body">
          {item.nom || "Dossier sans nom"}
        </h6>
        <small className="text-muted flex-shrink-0 ms-2">
          {item.images_count || "0"} fichiers
        </small>
      </div>
      <div className="text-muted mt-1" style={{ fontSize: "0.75rem" }}>
        Créé il y a {formatDateRelative(item.created_at) || "3 jours"}
      </div>
    </div>
  </div>
);

// --- SOUS-COMPOSANT : IMAGE / MEDIA ---
const MediaCard = ({ item }) => (
  <div className="d-flex flex-column h-100">
    {/* L'image prend le maximum de place visuelle */}
    <div
      className="position-relative flex-grow-1 bg-body overflow-hidden"
      style={{ height: "150px" }}
    >
      {item.media?.url ? (
        <img
          src={item.media.url}
          alt={item.titre}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
          loading="lazy"
        />
      ) : (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
          <i className="fas fa-image fa-2x" />
        </div>
      )}
    </div>
    {/* Bas : Infos légères pour laisser l'image respirer */}
    <div className="p-2 border-top bg-body">
      <div className="text-muted" style={{ fontSize: "0.72rem" }}>
        Créé il y a {item.date_relative || "3 jours"}
      </div>
    </div>
  </div>
);

// --- WRAPPER PRINCIPAL (Logique & Conteneur) ---
export default function CardWrapper({
  item,
  type = "media", // "folder" ou "media"
  selectedIds = [],
  onSelect,
  icon,
  onDoubleClick,
  actions = [],
  openDropdownId,
  setOpenDropdownId,
  draggable = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  style = {},
}) {
  const isSelected = selectedIds.includes(item.id);
  const clickTimeout = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    // Évite le déclenchement si on clique sur le menu dropdown
    if (
      e.target.closest(".dropdown-toggle") ||
      e.target.closest(".dropdown-menu")
    )
      return;

    if (clickTimeout.current) return;
    clickTimeout.current = setTimeout(() => {
      onSelect?.(item.id);
      clickTimeout.current = null;
    }, 220);
  };

  const handleDoubleClick = (e) => {
    if (
      e.target.closest(".dropdown-toggle") ||
      e.target.closest(".dropdown-menu")
    )
      return;

    clearTimeout(clickTimeout.current);
    clickTimeout.current = null;
    onDoubleClick?.(item);
  };

  // Styles dynamiques gérés proprement en CSS-in-JS (plus fluide que les modifs d'attributs directs)
  const cardStyle = {
    width: type === "folder" ? "240px" : "180px", // Plus petit pour les images (top pour le dnd mobile)
    height: type === "folder" ? "180px" : "210px",
    borderRadius: "12px",
    cursor: draggable ? "grab" : "pointer",
    transition:
      "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease",
    transform: isHovered ? "translateY(-4px)" : "translateY(0)",
    boxShadow: isHovered
      ? "0 12px 20px -8px rgba(0, 0, 0, 0.15)"
      : "0 2px 4px rgba(0, 0, 0, 0.04)",
    ...style,
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
      className={`position-relative border bg-body overflow-hidden select-none
        ${isSelected ? "border-primary border-2 shadow-sm" : "border-body-subtle"} 
        ${!item.is_visible ? "opacity-50" : ""}
      `}
    >
      {/* Overlay de Sélection Propre */}
      {isSelected && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 border border-primary border-2 rounded-3"
          style={{
            background: "rgba(13, 110, 253, 0.04)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Bouton Menu Actions (Subtil, n'apparaît pleinement qu'au survol sur desktop) */}
      {actions.length > 0 && (
        <div
          className="position-absolute top-0 end-0 p-2"
          style={{ zIndex: 10 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            show={openDropdownId === item.id}
            onToggle={(isOpen) => setOpenDropdownId(isOpen ? item.id : null)}
          >
            <Dropdown.Toggle
              size="sm"
              className="btn-action-trigger border-0 rounded-circle d-flex align-items-center justify-content-center bg-body shadow-sm text-secondary"
              style={{
                width: "28px",
                height: "28px",
                padding: 0,
                opacity: isHovered || openDropdownId === item.id ? 1 : 0.7,
              }}
            >
              <i
                className="fas fa-ellipsis-v"
                style={{ fontSize: "0.8rem" }}
              ></i>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="shadow border-0">
              {actions.map((action, index) => (
                <Dropdown.Item
                  key={index}
                  className={`d-flex align-items-center ${action.className || ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(null);
                    action.onClick(item);
                  }}
                >
                  <i
                    className={`me-2 text-muted ${action.icon}`}
                    style={{ width: "16px" }}
                  ></i>
                  <span style={{ fontSize: "0.9rem" }}>{action.label}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Affichage du layout selon le type */}
      {type === "folder" ? (
        <FolderCard item={item} icon={icon} />
      ) : (
        <MediaCard item={item} />
      )}
    </div>
  );
}
