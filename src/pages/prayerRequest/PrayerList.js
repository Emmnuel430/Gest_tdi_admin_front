import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { format } from "date-fns";
import { useToast } from "../../context/ToastContext";

const PrayerList = () => {
  const { showToast } = useToast();
  // États
  const [prayers, setPrayers] = useState([]);
  const [sortedPrayers, setSortedPrayers] = useState([]);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [sortOption, setSortOption] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showPrayerDetails, setShowPrayerDetails] = useState(false);

  // 🎯 Récupération des prières
  useEffect(() => {
    const fetchPrayers = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/prayer-requests`,
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des demandes.");
        const data = await response.json();
        setPrayers(data);
        setSortedPrayers(data);
      } catch (err) {
        showToast(
          "Impossible de charger les données : " + err.message,
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, [showToast]);

  // 🔍 Recherche
  const filteredPrayers = sortedPrayers.filter((prayer) =>
    prayer.objet.toLowerCase().includes(searchQuery.toLowerCase()),
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
        { method: "DELETE" },
      );
      const result = await response.json();
      if (result.status === "deleted") {
        showToast("Demande supprimée !", "success");
        const updated = prayers.filter((p) => p.id !== selectedPrayer.id);
        setPrayers(updated);
        setSortedPrayers(updated);
      } else {
        showToast("Échec de la suppression.", "error");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de la suppression.", "error");
    } finally {
      handleCloseModal();
    }
  };

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
                  <th>Demandeur</th>
                  <th>Objet</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrayers.length > 0 ? (
                  filteredPrayers.map((prayer, index) => (
                    <tr key={prayer.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        <div className="fw-semibold">
                          {prayer.nom} {prayer.prenom}
                        </div>
                        <div className="text-muted small">{prayer.email}</div>
                      </td>
                      <td>{prayer.objet}</td>
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
                    <td colSpan="7" className="text-center text-muted py-4">
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
                    "dd/MM/yyyy HH:mm:ss",
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
