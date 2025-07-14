import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";
import ToastMessage from "../../components/Layout/ToastMessage";
import { format } from "date-fns";

const Adherents = () => {
  const [adherents, setAdherents] = useState([]);
  const [sortedAdherents, setSortedAdherents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Ciblage
  const [selectedAdherent, setSelectedAdherent] = useState(null);
  const [adherentToValidate, setAdherentToValidate] = useState(null);

  // Recherche
  const [searchQuery, setSearchQuery] = useState("");

  // === Récupération des adhérents ===
  const fetchAdherents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des adhérents.");
      const data = await response.json();
      setAdherents(data);
      setSortedAdherents(data);
    } catch (err) {
      setError("Impossible de charger les données : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdherents();
  }, []);

  useEffect(() => {
    if (adherents.length > 0) {
      setSortedAdherents(adherents);
    }
  }, [adherents]);

  // === Validation d’un adhérent ===
  const handleOpenValidationModal = (adherent) => {
    setAdherentToValidate(adherent);
    setShowValidationModal(true);
  };

  const handleCloseValidationModal = () => {
    setAdherentToValidate(null);
    setShowValidationModal(false);
  };

  const handleValidateAdherent = async () => {
    if (!adherentToValidate) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${adherentToValidate.id}/validate`,
        { method: "POST" }
      );

      if (response.ok) {
        const resData = await response.json();
        setSuccess(true);
        setSuccessMsg(resData.message || "Inscription validée !");
        handleCloseValidationModal();
        fetchAdherents();
      } else {
        const resData = await response.json();
        setErrorMsg(resData.message || "Erreur lors de la validation");
      }
    } catch (error) {
      console.error(error);
      setError("Erreur inattendue lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  // === Affichage / Suppression ===
  const handleShowDetails = (adherent) => {
    setSelectedAdherent(adherent);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAdherent(null);
  };

  const handleOpenModal = (adherent) => {
    setSelectedAdherent(adherent);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAdherent(null);
  };

  const handleDelete = async () => {
    if (!selectedAdherent) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${selectedAdherent.id}`,
        { method: "DELETE" }
      );
      const result = await response.json();

      if (result.status === "deleted") {
        alert("Adhérent supprimé !");
        const filtered = adherents.filter((a) => a.id !== selectedAdherent.id);
        setAdherents(filtered);
        setSortedAdherents(filtered);
      } else {
        alert("Échec de la suppression.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      handleCloseModal();
    }
  };

  // === Filtrage ===
  const filteredAdherents = sortedAdherents.filter((adherent) =>
    `${adherent.nom} ${adherent.prenom} ${adherent.email} ${adherent.pseudo}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-2">
        {error && <div className="alert alert-danger">{error}</div>}
        {errorMsg && (
          <ToastMessage message={errorMsg} onClose={() => setErrorMsg("")} />
        )}

        {success && (
          <ToastMessage
            message={successMsg}
            onClose={() => setSuccess(false)}
            success={true}
          />
        )}
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
              placeholder="Rechercher un adhérent : nom, email, pseudo..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title="Adhérents"
              main={adherents.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={adherents}
              setSortedList={setSortedAdherents}
              alphaField="nom"
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
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Abonnée</th>
                  <th>
                    Moyen de <br /> Paiement
                  </th>
                  <th>
                    Preuve de <br /> Paiement
                  </th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdherents.length > 0 ? (
                  filteredAdherents.map((adherent, index) => (
                    <tr key={adherent.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>{adherent.nom}</td>
                      <td>{adherent.prenom}</td>
                      <td className="text-capitalize">
                        {adherent.statut === "standard" ? "Externe" : "Premium"}
                      </td>
                      <td className="text-capitalize">
                        {adherent.moyen_paiement?.replace("_", " ")}
                      </td>
                      <td>
                        {adherent.preuve_paiement ? (
                          <a
                            href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${adherent.preuve_paiement}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-success btn-sm"
                          >
                            Voir
                          </a>
                        ) : (
                          <span className="text-muted">Aucune</span>
                        )}
                      </td>
                      <td>
                        {adherent.is_validated ? (
                          <span className="badge bg-success ms-2">Validé</span>
                        ) : (
                          <span className="badge bg-warning-outline border border-warning text-body ms-2">
                            En attente
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          {/* Valider l'inscription */}
                          {!adherent.is_validated && (
                            <button
                              onClick={() =>
                                handleOpenValidationModal(adherent)
                              }
                              className="btn btn-success btn-sm me-2"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleShowDetails(adherent)}
                            className="btn btn-info btn-sm me-2"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <Link
                            to={`/admin-tdi/update/adherents/${adherent.id}`}
                            className="btn btn-warning btn-sm me-2"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenModal(adherent)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-muted py-4">
                      Aucun adhérent trouvé.
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
          <Modal.Title>Détails de l'Adhérent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdherent && (
            <div className="container">
              <div className="row mb-2">
                <div className="col-6 fw-bold">Nom :</div>
                <div className="col-6">{selectedAdherent.nom}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Prénom :</div>
                <div className="col-6">{selectedAdherent.prenom}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Email :</div>
                <div className="col-6 text-break">{selectedAdherent.email}</div>
              </div>
              {selectedAdherent.pseudo && (
                <div className="row mb-2">
                  <div className="col-6 fw-bold">Pseudo :</div>
                  <div className="col-6">{selectedAdherent.pseudo}</div>
                </div>
              )}
              {selectedAdherent.password && (
                <div className="row mb-2">
                  <div className="col-6 fw-bold">MDP :</div>
                  <div className="col-6">{selectedAdherent.password}</div>
                </div>
              )}
              <div className="row mb-2">
                <div className="col-6 fw-bold">Contact :</div>
                <div className="col-6">{selectedAdherent.contact}</div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Moyen de Paiement :</div>
                <div className="col-6 text-capitalize">
                  {selectedAdherent.moyen_paiement?.replace("_", " ")}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Preuve :</div>
                <div className="col-6">
                  {selectedAdherent.preuve_paiement ? (
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedAdherent.preuve_paiement}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm"
                    >
                      Voir la preuve
                    </a>
                  ) : (
                    <span className="text-muted">Aucune</span>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Abonnée :</div>
                <div className="col-6 text-capitalize">
                  {selectedAdherent.statut === "standard"
                    ? "Externe"
                    : "Premium"}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6 fw-bold">Période :</div>
                <div className="col-6 text-capitalize">
                  {selectedAdherent.abonnement_type || "Non spécifié"}
                </div>
              </div>
              {selectedAdherent.abonnement_expires_at && (
                <div className="row mb-2">
                  <div className="col-6 fw-bold">Fin d'abonnement :</div>
                  <div className="col-6">
                    {format(
                      new Date(selectedAdherent.abonnement_expires_at),
                      "dd/MM/yyyy"
                    )}
                  </div>
                </div>
              )}
              <div className="row mb-2">
                <div className="col-6 fw-bold">Validation :</div>
                <div className="col-6">
                  {selectedAdherent.is_validated ? (
                    <span className="badge bg-success">Validé</span>
                  ) : (
                    <span className="badge bg-warning-outline border border-warning text-body">
                      En attente
                    </span>
                  )}
                </div>
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

      {/*  */}
      <Modal
        show={showValidationModal}
        onHide={handleCloseValidationModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la validation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Voulez-vous vraiment valider l'inscription de{" "}
          <strong>
            {adherentToValidate?.prenom} {adherentToValidate?.nom}
          </strong>{" "}
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseValidationModal}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleValidateAdherent}>
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Chargement...
              </span>
            ) : (
              <span>Valider l'inscription</span>
            )}
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
            Voulez-vous vraiment supprimer l'adhérent{" "}
            <strong>
              {selectedAdherent?.nom} {selectedAdherent?.prenom}
            </strong>{" "}
            ?
          </p>
        }
      />
    </Layout>
  );
};

export default Adherents;
