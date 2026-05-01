import { Dropdown } from "react-bootstrap";
import { useRef } from "react";

export default function CardWrapper({
  item,
  selectedIds = [],
  onSelect,
  children,
  icon = "fa-folder",
  onDoubleClick,
  actions = [],
  openDropdownId,
  setOpenDropdownId,
}) {
  const isSelected = selectedIds.includes(item.id);

  const clickTimeout = useRef(null);

  const handleClick = () => {
    if (clickTimeout.current) return;

    clickTimeout.current = setTimeout(() => {
      onSelect(item.id);
      clickTimeout.current = null;
    }, 200); // délai court
  };

  const handleDoubleClick = () => {
    clearTimeout(clickTimeout.current);
    clickTimeout.current = null;
    onDoubleClick?.(item);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`position-relative border z-1 ${
        isSelected ? "border-primary border-3" : ""
      }
      ${!item.is_visible ? "opacity-50 border border-warning" : ""}  `}
      style={{
        width: "260px",
        borderRadius: "12px",
        cursor: "pointer",
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Overlay sélection */}
      {isSelected && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(13,110,253,0.1)",
            zIndex: 1,
          }}
        />
      )}

      {/* MENU ... */}
      <div
        className="position-absolute top-0 end-0 p-2 z-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown
          show={openDropdownId === item.id}
          onToggle={(isOpen) => setOpenDropdownId(isOpen ? item.id : null)}
        >
          <Dropdown.Toggle
            size="sm"
            className="border-0 shadow-sm bg-body text-body"
          >
            <i className="fas fa-ellipsis-v"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {actions.map((action, index) => (
              <Dropdown.Item
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(item);
                }}
              >
                <i className={`me-2 ${action.icon}`}></i>
                {action.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* IMAGE / ICON */}
      {item.media?.url ? (
        <img
          src={item.media.url}
          alt={item.titre || "image"}
          className="w-100"
          style={{
            height: "200px",
            // objectFit: "cover",
            objectFit: "contain",
          }}
        />
      ) : (
        <div
          className="d-flex align-items-center justify-content-center bg-body"
          style={{ height: "100px" }}
        >
          <i className={`fa ${icon} fa-4x text-secondary`}></i>
        </div>
      )}

      {/* BODY */}
      <div className="p-1">{children}</div>
    </div>
  );
}
