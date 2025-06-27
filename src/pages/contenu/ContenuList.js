import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";

const ContenuList = () => {
  const [contenus, setContenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContenu, setSelectedContenu] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedContenus, setSortedContenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchContenus = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/contents`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des contenus.");
        const data = await response.json();
        setContenus(data);
        setSortedContenus(data);
      } catch (err) {
        setError("Impossible de charger les données : " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContenus();
  }, []);

  const handleShowDetails = (contenu) => {
    setSelectedContenu(contenu);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedContenu(null);
  };

  const handleOpenModal = (contenu) => {
    setSelectedContenu(contenu);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContenu(null);
  };

  const handleDelete = async () => {
    if (!selectedContenu) return;
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/contents/${selectedContenu.id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.status === "deleted") {
        alert("Contenu supprimé !");
        setContenus(contenus.filter((c) => c.id !== selectedContenu.id));
        setSortedContenus(
          sortedContenus.filter((c) => c.id !== selectedContenu.id)
        );
      } else {
        alert("Échec de la suppression.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      handleCloseModal();
    }
  };

  const filteredContenus = sortedContenus.filter((contenu) =>
    `${contenu.title} ${contenu.type} ${contenu.access_level}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
          <>
            <SearchBar
              placeholder="Rechercher un contenu..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title="Contenus"
              link="/admin-tdi/contenu/add"
              linkText="Ajouter"
              main={contenus.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={contenus}
              setSortedList={setSortedContenus}
              dateField="created_at"
            />
            <Table
              hover
              responsive
              className="align-middle text-center table-striped shadow-sm"
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Niveau d'accès</th>
                  <th>Lien</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContenus.length > 0 ? (
                  filteredContenus.map((contenu, index) => (
                    <tr key={contenu.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>{contenu.title}</td>
                      <td className="text-capitalize">{contenu.type}</td>
                      <td>
                        {contenu.access_level === "standard"
                          ? "Tous"
                          : "Premium"}
                      </td>
                      <td>
                        {contenu.lien ? (
                          <a
                            href={contenu.lien}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-success btn-sm"
                          >
                            Voir
                          </a>
                        ) : (
                          <span className="text-muted">Aucun</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            onClick={() => handleShowDetails(contenu)}
                            className="btn btn-info btn-sm me-2"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <Link
                            to={`/admin-tdi/update/contenu/${contenu.id}`}
                            className="btn btn-warning btn-sm me-2"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenModal(contenu)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Aucun contenu trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>
      <Modal show={showDetails} onHide={handleCloseDetails} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du Contenu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContenu && (
            <div className="container">
              <div className="row mb-2">
                <div className="col-6 fw-bold">Titre :</div>
                <div className="col-6">{selectedContenu.title}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Type :</div>
                <div className="col-6">{selectedContenu.type}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Niveau d'accès :</div>
                <div className="col-6">{selectedContenu.access_level}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Lien :</div>
                <div className="col-6">
                  {selectedContenu.lien ? (
                    <a
                      href={selectedContenu.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm"
                    >
                      Voir le lien
                    </a>
                  ) : (
                    <span className="text-muted">Aucun</span>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Contenu :</div>
                <div className="col-6">{selectedContenu.content}</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le contenu{" "}
            <strong>{selectedContenu?.title}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default ContenuList;
