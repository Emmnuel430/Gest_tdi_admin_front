import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { fetchWithToken } from "../../utils/fetchWithToken2";
import Layout from "../../components/Layout/LayoutAdherent";
import Loader from "../../components/Layout/Loader";

const FormationsAdherents = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedContenu, setSelectedContenu] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/adherent/contents?type=formation`
        );

        if (!response.ok)
          throw new Error("Erreur lors du chargement des formations");

        const data = await response.json();
        setFormations(data);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleShowDetails = (contenu) => {
    setSelectedContenu(contenu);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedContenu(null);
  };

  //   if (loading) return <p>Chargement...</p>;
  //   if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Layout>
      <div className="container mt-2">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <div>
            <h2 className="mb-4">Vos formations disponibles</h2>

            {formations.length === 0 ? (
              <div className="alert alert-warning">
                Aucun contenu disponible pour votre niveau.
              </div>
            ) : (
              <div className="row">
                {formations.map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                    <div
                      className="card h-100 border shadow-sm hover-effect"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShowDetails(item)}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title d-flex justify-content-between align-items-center mb-3">
                          {item.title.length > 50
                            ? item.title.slice(0, 50) + "..."
                            : item.title}
                          <span
                            className={`badge
                                bg-success
                             text-capitalize`}
                          >
                            {item.type}
                          </span>
                        </h5>

                        <p className="card-text text-muted small mb-3 flex-grow-1">
                          {item.content?.length > 100
                            ? item.content.slice(0, 100) + "..."
                            : item.content || (
                                <span className="fst-italic">
                                  Pas de description
                                </span>
                              )}
                        </p>

                        <div>
                          {item.lien ? (
                            <a
                              href={item.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-success w-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-external-link-alt me-2"></i>
                              Accéder au contenu
                            </a>
                          ) : (
                            <span className="text-muted small fst-italic">
                              Pas de lien disponible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Modal show={showDetails} onHide={handleCloseDetails} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedContenu?.title || "Détails du contenu"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContenu && (
            <div className="container">
              <div className="row mb-3">
                <div className="col-4 fw-bold text-secondary">Contenu :</div>
                <div className="text-justify">
                  {selectedContenu.content || (
                    <span className="text-muted fst-italic">
                      Pas de contenu
                    </span>
                  )}
                </div>
              </div>

              {selectedContenu.lien && (
                <div className="d-flex justify-content-center mt-3">
                  <a
                    href={selectedContenu.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-lg btn-success"
                  >
                    Accéder au cours
                  </a>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default FormationsAdherents;
