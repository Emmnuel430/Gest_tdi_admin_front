import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import Layout from "../../components/Layout/LayoutAdherent";
import Loader from "../../components/Layout/Loader";
import { useToast } from "../../context/ToastContext";
import { useCrudUI } from "../../hooks/useCrudUI";
import { formatDateRelative } from "../../utils/formatDateRelative";

const ContentManagerAdherent = ({ type }) => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();
  const { ui, close, openDetails } = useCrudUI();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Titres dynamiques selon le type
  const titles = {
    cours: "Vos cours disponibles",
    formation: "Vos formations",
    evenement: "Événements à découvrir",
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/contents?type=${type}`,
      );
      if (!response.ok)
        throw new Error(`Erreur lors du chargement des ${type}s`);

      const data = await response.json();
      setItems(data);
    } catch (err) {
      showToast(err.message || "Erreur inconnue", "danger");
    } finally {
      setLoading(false);
    }
  }, [type, showToast]); // Refetch dès que le "type" change

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout>
      <div className="container mt-2">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-capitalize">{titles[type]}</h2>

            {items.length === 0 ? (
              <div className="alert alert-warning">
                Aucun contenu de type "{type}" disponible pour votre niveau.
              </div>
            ) : (
              <div className="row">
                {items.map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                    <div
                      className="card h-100 border shadow-sm rounded-3 hover-shadow transition"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDetails(item)}
                    >
                      <div className="card-body d-flex flex-column">
                        {/* HEADER */}

                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0 me-2 text-uppercase">
                            {item.title}
                          </h6>
                        </div>

                        {/* DATE */}
                        {item.publish_at &&
                          new Date(item.publish_at) > new Date() && (
                            <small className="text-muted mb-2">
                              {formatDateRelative(item.publish_at, true)}
                            </small>
                          )}

                        {/* CONTENT */}
                        <p
                          className="text-muted small flex-grow-1 mb-3"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.content || "Pas de description disponible"}
                        </p>

                        {/* CTA */}
                        {item.lien && (
                          <a
                            href={item.lien}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Accéder au {item.type}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal identique, juste le texte s'adapte via "type" */}
      <Modal show={ui.mode === "details"} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="text-uppercase">
            {ui.data?.title || `Détails du ${type}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ui.data && (
            <div className="container py-4">
              <div className="row justify-content-center">
                <div className="col-lg-9">
                  {/* HEADER */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-primary text-uppercase">
                        {ui.data.type}
                      </span>

                      {ui.data.publish_at &&
                        new Date(ui.data.publish_at) > new Date() && (
                          <small className="text-muted">
                            {formatDateRelative(ui.data.publish_at, true)}
                          </small>
                        )}
                    </div>

                    <h3 className="fw-bold mb-0 text-uppercase">
                      {ui.data.title}
                    </h3>
                  </div>

                  {/* CONTENT */}
                  <div
                    className="text-muted lh-lg"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {ui.data.content}
                  </div>

                  {/* CTA */}
                  {ui.data.lien && (
                    <div className="mt-4 text-center">
                      <a
                        href={ui.data.lien}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary px-4"
                      >
                        Ouvrir le lien
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default ContentManagerAdherent;
