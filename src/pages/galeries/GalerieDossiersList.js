import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import { useToast } from "../../context/ToastContext";
import { formatDateRelative } from "../../utils/formatDateRelative";
import { useDossiers } from "../../hooks/useDossiers";
import { useCrudUI } from "../../hooks/useCrudUI";
import CardWrapper from "../../components/Galerie/CardWrapper";

const GalerieDossiersList = () => {
  // ==================== HOOKS & INITIALISATION ====================

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Récupère les données des dossiers
  const { dossiers, loading, error, deleteDossier, toggleDossier } =
    useDossiers();

  // Gestion de l'UI CRUD (sélection, modals)
  const {
    selectedIds,
    setSelectedIds,
    resetSelection,
    toggleSelect,
    ui,
    close,
    openDelete,
    openBulkDelete,
    openToggle,
  } = useCrudUI();

  // ==================== STATES - FILTRAGE & TRI ====================

  const [sortOption, setSortOption] = useState("");
  const [sortedDossiers, setSortedDossiers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ==================== STATES - UI ====================

  const [openDropdownId, setOpenDropdownId] = useState(null);

  // ==================== HANDLERS - ACTIONS DOSSIERS ====================
  /**
   * Supprime un ou plusieurs dossiers après confirmation
   */
  const handleDelete = async () => {
    await deleteDossier(ui.variant === "single" ? ui.data.id : ui.data);
    resetSelection();
    showToast(
      ui.variant === "single" ? "Dossier supprimé" : "Dossier(s) supprimé(s)",
      "danger",
    );
    close();
  };

  /**
   * Bascule la visibilité d'un dossier
   */
  const handleToggle = async (dossier) => {
    await toggleDossier(dossier.id);
    close();
  };

  // ==================== DATA PROCESSING - FILTRAGE ====================

  /**
   * Filtre les dossiers en fonction de la recherche
   * Utilise les dossiers triés si disponibles, sinon les dossiers bruts
   */
  const filteredDossiers = sortedDossiers.length
    ? sortedDossiers.filter((d) =>
        d.nom.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : dossiers.filter((d) =>
        d.nom.toLowerCase().includes(searchQuery.toLowerCase()),
      );

  // ==================== RENDU JSX ====================
  const allIds = dossiers.map((d) => d.id);
  const handleSelectAll = () => {
    if (selectedIds.length === allIds.length) {
      setSelectedIds([]); // tout désélectionner
    } else {
      setSelectedIds(allIds); // tout sélectionner
    }
  };
  return (
    <Layout>
      <div className="container mt-3">
        {/* Affichage des erreurs */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* État de chargement */}
        {loading ? (
          <div
            className="d-flex justify-content-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            {/* SECTION HEADER - Recherche, Navigation et Filtres */}
            <SearchBar
              placeholder="Rechercher un dossier..."
              onSearch={setSearchQuery}
              delay={300}
            />

            <HeaderWithFilter
              allowedRoles={["dev", "super_admin"]}
              title2="Dossiers de la galerie"
              link="/admin-tdi/galerie/dossiers/create"
              linkText="Ajouter"
              main={dossiers.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={dossiers}
              setSortedList={setSortedDossiers}
              alphaField="nom"
              dateField="created_at"
            />

            {/* SECTION ACTIONS - Barre de sélection multiple */}
            {selectedIds.length >= 1 && (
              <div className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded bg-body">
                <div className="d-flex align-items-center gap-2">
                  {/* BTN TOUT */}
                  <Button
                    size="sm"
                    variant={
                      selectedIds.length === allIds.length
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={handleSelectAll}
                  >
                    <i className="far fa-square-check me-1"></i>
                    {selectedIds.length === allIds.length ? "Aucun" : "Tout"}
                  </Button>

                  {/* TEXTE */}
                  <span>
                    {selectedIds.length} dossier
                    {selectedIds.length > 1 ? "s" : ""} sélectionné
                    {selectedIds.length > 1 ? "s" : ""}
                  </span>
                </div>

                {/* DELETE */}
                {selectedIds.length > 0 && (
                  <Button
                    variant="danger"
                    onClick={openBulkDelete}
                    className="d-flex align-items-center"
                  >
                    <i className="fas fa-trash me-1"></i>{" "}
                    <span className="d-none d-md-block">Suppr.</span> (
                    {selectedIds.length})
                  </Button>
                )}
              </div>
            )}

            {/* SECTION GALERIE - Affichage des dossiers ou message vide */}
            <div
              className="d-flex flex-wrap gap-4 justify-content-center border p-2 rounded-4"
              style={{
                rowGap: "1.5rem",
                overflowY: "auto",
                maxHeight: "400px",
              }}
            >
              {filteredDossiers.length ? (
                filteredDossiers.map((d) => (
                  <CardWrapper
                    key={d.id}
                    item={d}
                    selectedIds={selectedIds}
                    onSelect={toggleSelect}
                    onDoubleClick={(item) =>
                      navigate(`/admin-tdi/galerie/dossiers/${item.id}`)
                    }
                    openDropdownId={openDropdownId}
                    setOpenDropdownId={setOpenDropdownId}
                    actions={[
                      {
                        label: "Voir",
                        icon: "fa fa-folder-open",
                        onClick: (item) =>
                          navigate(`/admin-tdi/galerie/dossiers/${item.id}`),
                      },
                      {
                        label: "Modifier",
                        icon: "fa fa-edit",
                        onClick: (item) =>
                          navigate(
                            `/admin-tdi/galerie/dossiers/${item.id}/edit`,
                          ),
                      },
                      {
                        label: d.is_visible ? "Masquer" : "Afficher",
                        icon: `fa fa-eye${!d.is_visible ? "" : "-slash text-secondary"}`,
                        onClick: () => openToggle(d),
                      },
                      {
                        label: "Supprimer",
                        icon: "fa fa-trash text-danger",
                        onClick: () => openDelete(d),
                      },
                    ]}
                  >
                    <div className="d-flex justify-content-between">
                      <h6 className="card-title mb-1 text-truncate fw-semibold">
                        {d.nom}
                      </h6>
                      <span className="badge rounded-pill border border-secondary text-muted small">
                        {d.images_count > 0
                          ? `${d.images_count} image${d.images_count > 1 ? "s" : ""}`
                          : "Vide"}
                      </span>
                    </div>
                    <div className="text-muted small">
                      Création : {formatDateRelative(d.created_at)}
                      {!d.is_visible && (
                        <span className="text-warning ms-2">- Masqué</span>
                      )}
                    </div>
                  </CardWrapper>
                ))
              ) : (
                <div className="text-center text-muted py-5 w-100">
                  <i className="fa fa-folder-open fa-3x mb-3"></i>
                  <p>Aucun dossier trouvé.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==================== MODALS & POPUPS ==================== */}

      {/* Modal de confirmation - Suppression d'un dossier */}
      <ConfirmPopup
        show={ui.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        btnClass="danger"
        body={
          ui.variant === "single" ? (
            <p>
              Supprimer le dossier <strong>{ui.data?.nom}</strong> ?
            </p>
          ) : (
            <p>
              Supprimer <strong>{ui.data?.length}</strong> dossier(s) ?
            </p>
          )
        }
      />

      {/* Modal de confirmation - Visibilité du dossier */}
      <ConfirmPopup
        show={ui.mode === "toggle"}
        onClose={close}
        onConfirm={() => {
          if (ui.data) handleToggle(ui.data);
        }}
        title="Confirmer l'action"
        btnClass="primary"
        body={
          <p>
            Voulez-vous{" "}
            <strong>{ui.data?.is_visible ? "masquer" : "afficher"}</strong> le
            dossier <strong>{ui.data?.nom}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default GalerieDossiersList;
