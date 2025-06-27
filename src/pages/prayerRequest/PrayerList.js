import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";
import ToastMessage from "../../components/Layout/ToastMessage";
import { format } from "date-fns";

const PrayerList = () => {
  // États
  const [prayers, setPrayers] = useState([]);
  const [sortedPrayers, setSortedPrayers] = useState([]);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [prayerToValidate, setPrayerToValidate] = useState(null);
  const [sortOption, setSortOption] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showPrayerDetails, setShowPrayerDetails] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🎯 Récupération des prières
  const fetchPrayers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/prayer-requests`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des demandes.");
      const data = await response.json();
      setPrayers(data);
      setSortedPrayers(data);
    } catch (err) {
      setError("Impossible de charger les données : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  // 🔍 Recherche
  const filteredPrayers = sortedPrayers.filter((prayer) =>
    prayer.objet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📌 Détails
  const handleShowPrayerDetails = (prayer) => {
    setSelectedPrayer(prayer);
    setShowPrayerDetails(true);
  };

  const handleClosePrayerDetails = () => {
    setSelectedPrayer(null);
    setShowPrayerDetails(false);
  };

  // ❌ Suppression
  const handleOpenModal = (prayer) => {
    setSelectedPrayer(prayer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrayer(null);
  };

  const handleDelete = async () => {
    if (!selectedPrayer) return;
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/prayer-requests/${selectedPrayer.id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.status === "deleted") {
        alert("Demande supprimée !");
        const updated = prayers.filter((p) => p.id !== selectedPrayer.id);
        setPrayers(updated);
        setSortedPrayers(updated);
      } else {
        alert("Échec de la suppression.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression.");
    } finally {
      handleCloseModal();
    }
  };

  // ✅ Validation
  const handleOpenValidationModal = (prayer) => {
    setPrayerToValidate(prayer);
    setShowValidationModal(true);
  };

  const handleCloseValidationModal = () => {
    setPrayerToValidate(null);
    setShowValidationModal(false);
  };

  const handleValidatePrayer = async () => {
    if (!prayerToValidate) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/prayer-requests/${prayerToValidate.id}/validate`,
        { method: "POST" }
      );

      const resData = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSuccessMsg(resData.message || "Demande de prière validée !");
        handleCloseValidationModal();
        fetchPrayers();
      } else {
        setErrorMsg(resData.message || "Erreur lors de la validation");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue lors de la validation");
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="Rechercher une demande de prière..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title2="Demandes de Prière"
              // link="/admin-tdi/prayer-request/add"
              // linkText="Ajouter"
              main={prayers.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={prayers}
              setSortedList={setSortedPrayers}
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
                  <th>Demandeur</th>
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
                {filteredPrayers.length > 0 ? (
                  filteredPrayers.map((prayer, index) => (
                    <tr key={prayer.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>{prayer.objet}</td>
                      <td>
                        <div className="fw-semibold">
                          {prayer.nom} {prayer.prenom}
                        </div>
                        {/* <div className="text-muted small">{prayer.email}</div> */}
                      </td>
                      <td className="text-capitalize">
                        {prayer.moyen_paiement.replace("_", " ")}
                      </td>
                      <td>
                        {prayer.preuve_paiement ? (
                          <a
                            href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${prayer.preuve_paiement}`}
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
                        {prayer.is_validated ? (
                          <span className="badge bg-success ms-2">Validée</span>
                        ) : (
                          <span className="badge bg-warning-outline border border-warning text-body ms-2">
                            En attente
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          {/* Valider l'inscription */}
                          {!prayer.is_validated && (
                            <button
                              onClick={() => handleOpenValidationModal(prayer)}
                              className="btn btn-success btn-sm me-2"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleShowPrayerDetails(prayer)}
                            className="btn btn-info btn-sm me-2"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenModal(prayer)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                          {/* Autres actions possibles ici */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Aucune demande trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>
      {/*  */}
      <Modal
        show={showPrayerDetails}
        onHide={handleClosePrayerDetails}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Demande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrayer && (
            <div className="container">
              <div className="mb-3">
                <div className="fw-bold text-secondary">Nom</div>
                <div>{selectedPrayer.nom}</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Prénom</div>
                <div>{selectedPrayer.prenom}</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Email</div>
                <div className="text-break">{selectedPrayer.email}</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Objet</div>
                <div>{selectedPrayer.objet}</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Message</div>
                <div>{selectedPrayer.message}</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Moyen de Paiement</div>
                <div className="text-capitalize">
                  {selectedPrayer.moyen_paiement.replace("_", " ")}
                </div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Preuve</div>
                <div>
                  {selectedPrayer.preuve_paiement ? (
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${selectedPrayer.preuve_paiement}`}
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
              <div className="mb-3">
                <div className="fw-bold text-secondary">Validation</div>
                <div>
                  {selectedPrayer.is_validated ? (
                    <span className="badge bg-success ms-2">Validée</span>
                  ) : (
                    <span className="badge bg-warning-outline border border-warning text-body ms-2">
                      En attente
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <div className="fw-bold text-secondary">Date de soumission</div>
                <div>
                  {format(
                    new Date(selectedPrayer.created_at),
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePrayerDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      {/*  */}
      <Modal
        centered
        show={showValidationModal}
        onHide={handleCloseValidationModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la validation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir valider cette demande de prière ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseValidationModal}>
            Annuler
          </Button>
          <Button
            variant="success"
            onClick={handleValidatePrayer}
            disabled={loading}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i> Chargement...
              </span>
            ) : (
              <span>Valider</span>
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
            Voulez-vous vraiment supprimer la demande de prière{" "}
            <strong>{selectedPrayer?.title || "Inconnue"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default PrayerList;
