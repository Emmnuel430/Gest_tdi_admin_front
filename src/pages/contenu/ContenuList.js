import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { formatDateRelative } from "../../utils/formatDateRelative";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useToast } from "../../context/ToastContext";
import ContentDetailModal from "../../components/contents/ContentDetailModal";
import { useTheme } from "../../context/ThemeContext";

const ContenuList = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();

  const [contenus, setContenus] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortOption, setSortOption] = useState("");
  const [sortedContenus, setSortedContenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu basé sur le temps

  const { ui, close, openDetails, openDelete } = useCrudUI();
  useEffect(() => {
    const fetchContenus = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/contents`,
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des contenus.");
        const data = await response.json();
        setContenus(data);
        setSortedContenus(data);
      } catch (err) {
        showToast(
          "Impossible de charger les données : " + err.message,
          "danger",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchContenus();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval); // Nettoie l'intervalle lors du démontage
  }, [showToast]);

  const handleDelete = async () => {
    if (!ui.data) return;
    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/contents/${ui.data.id}`,
        { method: "DELETE" },
      );
      const result = await response.json();
      if (result.status === "deleted") {
        showToast("Contenu supprimé !", "success");
        setContenus(contenus.filter((c) => c.id !== ui.data.id));
        setSortedContenus(sortedContenus.filter((c) => c.id !== ui.data.id));
      } else {
        showToast("Échec de la suppression.", "danger");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de la suppression.", "danger");
    } finally {
      close();
    }
  };

  const filteredContenus = sortedContenus.filter((contenu) =>
    `${contenu.title} ${contenu.type} ${contenu.access_level}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

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
              className="align-middle table-striped shadow-sm"
            >
              <thead className="table-body">
                <tr className="text-center">
                  <th>#</th>
                  <th className="text-start">Contenu</th>
                  <th>Type</th>
                  <th>Accès</th>
                  <th>Publication</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredContenus.length > 0 ? (
                  filteredContenus.map((contenu, index) => {
                    // 🎯 LOGIQUE ACCÈS PROPRE
                    let accessLabel = "Public";
                    let accessClass = isDarkMode
                      ? "bg-success-subtle text-success border border-success"
                      : "bg-success";

                    if (contenu.is_student_only) {
                      accessLabel = "Étudiants";
                      accessClass = isDarkMode
                        ? "bg-primary-subtle text-primary border border-primary"
                        : "bg-primary";
                    }

                    if (contenu.plans?.length > 0) {
                      accessLabel = "Plans";
                      accessClass = isDarkMode
                        ? "bg-warning-subtle text-warning border border-warning"
                        : "bg-warning text-dark";
                    }

                    return (
                      <tr key={contenu.id || index}>
                        <td className="fw-bold text-center">{index + 1}</td>

                        {/* CONTENU */}
                        <td className="text-start">
                          <div className="fw-semibold">{contenu.title}</div>

                          <div
                            className="text-muted small text-truncate"
                            style={{ maxWidth: 250 }}
                          >
                            {contenu.content || "Aucune description"}
                          </div>
                        </td>

                        {/* TYPE */}
                        <td className="text-center">
                          <span
                            className={`badge ${isDarkMode ? "bg-info-subtle border border-info" : "bg-info"} text-body text-capitalize px-3 py-2`}
                          >
                            {contenu.type === "formation" && "🎓 Formation"}
                            {contenu.type === "cours" && "📘 Cours"}
                            {contenu.type === "evenement" && "📅 Événement"}
                          </span>
                        </td>

                        {/* ACCÈS */}
                        <td className="text-center">
                          {!contenu.plans?.length && (
                            <span
                              className={`badge ${accessClass} px-3 py-2 mb-1`}
                            >
                              {accessLabel}
                            </span>
                          )}

                          {/* Plans preview */}
                          {contenu.plans?.length > 0 && (
                            <div className="small text-muted mt-1">
                              {contenu.plans.slice(0, 2).map((p, index) => (
                                <>
                                  <span
                                    key={index}
                                    className={`badge ${accessClass} px-3 py-2 mb-1`}
                                  >
                                    {p.name}
                                  </span>
                                  <br />
                                </>
                              ))}
                              {contenu.plans.length > 2 && " ..."}
                            </div>
                          )}
                        </td>

                        {/* PUBLICATION */}
                        <td className="text-center">
                          {contenu.publish_at &&
                          new Date(contenu.publish_at) > new Date() ? (
                            <span className="text-muted text-capitalize">
                              {formatDateRelative(contenu.publish_at, true)}
                            </span>
                          ) : (
                            <span className="text-muted fst-italic">
                              Publié
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="d-flex flex-wrap justify-content-center gap-2">
                            {[
                              {
                                el: (
                                  <button
                                    onClick={() => openDetails(contenu)}
                                    className="btn btn-outline-info btn-sm w-100"
                                    title="Voir"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                ),
                              },
                              {
                                el: (
                                  <Link
                                    to={`/admin-tdi/update/contenu/${contenu.id}`}
                                    className="btn btn-outline-warning btn-sm w-100"
                                    title="Modifier"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </Link>
                                ),
                              },
                              contenu.lien && {
                                el: (
                                  <a
                                    href={contenu.lien}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm w-100"
                                    title="Ouvrir lien"
                                  >
                                    <i className="fas fa-link"></i>
                                  </a>
                                ),
                              },
                              {
                                el: (
                                  <button
                                    onClick={() => openDelete(contenu)}
                                    className="btn btn-outline-danger btn-sm w-100"
                                    title="Supprimer"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                ),
                              },
                            ]
                              .filter(Boolean)
                              .map((item, i) => (
                                <div
                                  key={i}
                                  style={{ flex: "1 1 calc(50% - 0.5rem)" }}
                                >
                                  {item.el}
                                </div>
                              ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <div>
                        <i className="fas fa-inbox fa-2x mb-2"></i>
                        <div>Aucun contenu trouvé</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>
      <Modal show={ui.mode === "details"} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du Contenu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ui.data && (
            <ContentDetailModal
              selectedContent={ui.data}
              isDarkMode={isDarkMode}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={ui.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le contenu{" "}
            <strong>{ui.data?.title}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default ContenuList;
