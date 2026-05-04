import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Badge } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import SearchBar from "../../components/Layout/SearchBar";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { format } from "date-fns";
import { useToast } from "../../context/ToastContext";
import {
  formatPrenom,
  getStatusLabel,
  formatPrice,
  truncate,
} from "../../utils/useful";
import CopyableField from "../../components/ui/CopyableField";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useTheme } from "../../context/ThemeContext";

const TsedakaList = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const { ui, close, openDetails } = useCrudUI();
  const [tsedakas, setTsedakas] = useState([]);
  const [sortedTsedakas, setSortedTsedakas] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTsedakas = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/tsedakas`,
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des tsedakas.");
        }

        const data = await response.json();
        setTsedakas(data.data || []);
        setSortedTsedakas(data.data || []);
      } catch (err) {
        showToast("Impossible de charger les dons : " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTsedakas();
  }, [showToast]);

  const filteredTsedakas = sortedTsedakas.filter((donation) => {
    const normalized = (value) => (value || "").toString().toLowerCase();
    const query = searchQuery.toLowerCase();

    return [
      normalized(donation.nom),
      normalized(donation.prenom),
      normalized(donation.email),
      normalized(donation.reference),
      //   normalized(donation.message),
      //   normalized(donation.montant),
    ].some((field) => field.includes(query));
  });

  const openTsedakaDetails = (donation) => {
    openDetails(donation);
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
              placeholder="Rechercher un donateur, référence ou email..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />
            <HeaderWithFilter
              title2="Tsedakas"
              main={tsedakas.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={tsedakas}
              setSortedList={setSortedTsedakas}
              dateField="created_at"
              alphaField="nom"
            />

            <Table hover responsive className="align-middle shadow-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Donateur</th>
                  <th>Montant</th>
                  <th>Référence</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTsedakas.length > 0 ? (
                  filteredTsedakas.map((donation, index) => (
                    <tr key={donation.id || index}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        <div className="fw-semibold">
                          <>
                            <span className="text-capitalize">
                              {formatPrenom(donation.prenom)}
                            </span>{" "}
                            {donation.nom?.toUpperCase()}
                          </>
                        </div>
                        <div className="text-muted small">{donation.email}</div>
                      </td>
                      <td>
                        <span className="fw-semibold">
                          {formatPrice(donation?.transaction?.amount)}{" "}
                          {donation?.transaction?.currency || "XOF"}
                        </span>
                      </td>
                      <td>
                        {/* <CopyableField value={donation.reference || "-"} /> */}
                        <span className="font-monospace small bg-body px-2 py-1 rounded border">
                          {truncate(donation.reference || "-")}
                        </span>
                      </td>
                      <td>
                        {donation.created_at
                          ? format(
                              new Date(donation.created_at),
                              "dd/MM/yyyy HH:mm",
                            )
                          : "-"}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            onClick={() => openTsedakaDetails(donation)}
                            className="btn btn-info btn-sm"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Aucun don trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}

        <Modal show={ui.mode === "details"} onHide={close} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Détails du don</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {ui.data && (
              <div className="container">
                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Donateur</h6>
                    <div className="d-flex flex-wrap gap-4">
                      <div>
                        <div className="text-muted small">Nom complet</div>
                        <div className="fw-semibold">
                          {ui.data.anonymous ? (
                            <span className="text-uppercase">Anonyme</span>
                          ) : (
                            <>
                              <span className="text-uppercase">
                                {ui.data.nom}
                              </span>{" "}
                              <span className="text-capitalize">
                                {ui.data.prenom}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-muted small">Email</div>
                        <div className="text-break">{ui.data.email || "-"}</div>
                      </div>

                      <div>
                        <div>
                          {ui.data.anonymous && (
                            <Badge
                              bg={isDarkMode ? `primary-subtle` : "primary"}
                              className={`fs-6 border border-${
                                isDarkMode ? `primary-subtle` : "primary"
                              }`}
                            >
                              Don anonyme
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h6 className="text-muted mb-3">Don</h6>
                    <div className="mb-3">
                      <div className="text-muted small">Montant</div>
                      <div className="fw-semibold">
                        {formatPrice(ui.data.montant)} FCFA
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted small">Référence</div>
                      <div className="fw-semibold">
                        <CopyableField value={ui.data.reference || "-"} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-muted small">Date</div>
                      <div>
                        {ui.data.created_at
                          ? format(
                              new Date(ui.data.created_at),
                              "dd/MM/yyyy HH:mm",
                            )
                          : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted small mb-1">Message</div>
                      <div className="p-3 bg-body rounded border">
                        {ui.data.message || "Aucun message"}
                      </div>
                    </div>
                  </div>
                </div>

                {ui.data.transactions ? (
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h6 className="text-muted mb-3">Transaction</h6>
                      <div className="border rounded p-3 bg-body">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div>
                            <div className="text-muted small">Statut</div>
                            <span className="fw-semibold">
                              {getStatusLabel(ui.data.transactions.status)}
                            </span>
                          </div>
                          <div>
                            <div className="text-muted small">Montant</div>
                            <div className="fw-semibold">
                              {formatPrice(ui.data.transactions.amount)}{" "}
                              {ui.data.transactions.currency}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted small">Référence</div>
                            <CopyableField
                              value={ui.data.transactions.reference || "-"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={close}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default TsedakaList;
