import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { format } from "date-fns";
import { useToast } from "../../context/ToastContext";
import { formatPrenom, getStatusLabel } from "../../utils/useful";
import CopyableField from "../../components/ui/CopyableField";
import { useCrudUI } from "../../hooks/useCrudUI";

const PrayerList = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();
  const { ui, close, openDetails, openDelete } = useCrudUI();
  // États
  const [prayers, setPrayers] = useState([]);
  const [sortedPrayers, setSortedPrayers] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        setPrayers(data.data);
        setSortedPrayers(data.data);
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
    openDetails(prayer);
  };

  // ❌ Suppression
  const handleOpenModal = (prayer) => {
    openDelete(prayer);
  };

  const handleDelete = async () => {
    if (!ui.data) return;
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/prayer-requests/${ui.data.id}`,
        { method: "DELETE" },
      );
      const result = await response.json();
      if (result.status === "deleted") {
        showToast("Demande supprimée !", "success");
        const updated = prayers.filter((p) => p.id !== ui.data.id);
        setPrayers(updated);
        setSortedPrayers(updated);
      } else {
        showToast("Échec de la suppression.", "error");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de la suppression.", "error");
    } finally {
      close();
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
              main={prayers.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={prayers}
              setSortedList={setSortedPrayers}
              dateField="created_at"
            />
            <Table hover responsive className="align-middle shadow-sm">
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
                          <span className="text-capitalize">
                            {" "}
                            {formatPrenom(prayer.prenom)}
                          </span>{" "}
                          {prayer.nom.toUpperCase()}
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
      <Modal show={ui.mode === "details"} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la Demande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ui.data && (
            <div className="container">
              {/* 👤 USER */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-3">Utilisateur</h6>

                  <div className="d-flex flex-wrap gap-4">
                    <div>
                      <div className="text-muted small">Nom complet</div>
                      <div className="fw-semibold">
                        <span className="text-uppercase">{ui.data.nom}</span>{" "}
                        <span className="text-capitalize">
                          {ui.data.prenom}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-muted small">Email</div>
                      <div className="text-break">{ui.data.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 📝 DEMANDE */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-3">Demande</h6>

                  <div className="mb-3">
                    <div className="text-muted small">Objet</div>
                    <div className="fw-semibold">{ui.data.objet}</div>
                  </div>

                  <div>
                    <div className="text-muted small mb-1">Message</div>
                    <div className="p-3 bg-body rounded border">
                      {ui.data.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* 📊 STATUT */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted mb-3">Statut</h6>

                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <div>
                      <div className="text-muted small">Validation</div>
                      {ui.data.is_validated ? (
                        <span className="badge bg-success">Validée</span>
                      ) : (
                        <span className="badge border border-warning text-warning">
                          En attente
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-muted small">Date</div>
                      <div>
                        {format(
                          new Date(ui.data.created_at),
                          "dd/MM/yyyy HH:mm",
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 💳 TRANSACTION */}
              {ui.data.transactions?.length > 0 && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Transaction</h6>

                    {ui.data.transactions.map((t) => (
                      <div
                        key={t.id}
                        className="border rounded p-3 mb-2 bg-body"
                      >
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <div className="text-muted small">Référence</div>
                            <CopyableField value={t.reference} />
                          </div>

                          <div>
                            <div className="text-muted small">Montant</div>
                            <div className="fw-semibold">
                              {parseFloat(t.amount).toLocaleString()}{" "}
                              {t.currency}
                            </div>
                          </div>

                          <div>
                            <div className="text-muted small">Statut</div>
                            <span
                              className={`badge bg-${
                                t.status === "success"
                                  ? "success"
                                  : t.status === "failed"
                                    ? "danger"
                                    : "warning"
                              }`}
                            >
                              {getStatusLabel(t.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
      {/*  */}
      <ConfirmPopup
        show={ui.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer la demande de prière{" "}
            <strong>{ui.data?.objet || "Inconnue"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default PrayerList;
