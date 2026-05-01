import React from "react";

const ContentDetailModal = ({ selectedContent, isDarkMode }) => {
  return (
    <div className="container py-3">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          {/* HEADER */}
          <div className="mb-4">
            <h4 className="fw-bold mb-1">{selectedContent.title}</h4>

            <div className="d-flex flex-wrap gap-2">
              {/* TYPE */}
              <span
                className={`badge ${isDarkMode ? "bg-info-subtle border border-info" : "bg-info"} px-3 py-2`}
              >
                {selectedContent.type === "formation" && "🎓 Formation"}
                {selectedContent.type === "cours" && "📘 Cours"}
                {selectedContent.type === "evenement" && "📅 Événement"}
              </span>

              {/* ACCÈS */}
              {(() => {
                let label = "Public";
                let cls = isDarkMode
                  ? "bg-success-subtle text-success border border-success"
                  : "bg-success";

                if (selectedContent.is_student_only) {
                  label = "Étudiants";
                  cls = isDarkMode
                    ? "bg-primary-subtle text-primary border border-primary"
                    : "bg-primary";
                }

                if (selectedContent.plans?.length > 0) {
                  label = "Plans spécifiques";
                  cls = isDarkMode
                    ? "bg-warning-subtle text-warning border border-warning"
                    : "bg-warning text-dark";
                }

                return (
                  <span className={`badge ${cls} px-3 py-2`}>{label}</span>
                );
              })()}
            </div>
          </div>

          {/* INFOS */}
          <div className="mb-4">
            <h6 className="fw-semibold text-muted mb-2">Accès</h6>

            <div className="d-flex flex-column gap-2">
              {selectedContent.lien && (
                <div>
                  <span className="fw-medium">Lien :</span>{" "}
                  {selectedContent.lien ? (
                    <a
                      href={selectedContent.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-success ms-2"
                    >
                      <i className="fas fa-link"></i> Ouvrir
                    </a>
                  ) : (
                    <span className="text-muted">Aucun</span>
                  )}
                </div>
              )}

              {selectedContent.plans?.length > 0 && (
                <div>
                  <span className="fw-medium">Plans :</span>{" "}
                  <span className="text-muted">
                    {selectedContent.plans.map((p) => p.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CONTENU */}
          <div>
            <h6 className="fw-semibold text-muted mb-2">Contenu</h6>

            <div
              className="border rounded p-3 bg-body"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                whiteSpace: "pre-line",
              }}
            >
              {selectedContent.content || (
                <span className="text-muted">Aucun contenu</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;
