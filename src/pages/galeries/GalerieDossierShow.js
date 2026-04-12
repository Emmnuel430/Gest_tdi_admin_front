import { useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { useGalerieImages } from "../../hooks/useGalerieImages";
import { useToast } from "../../context/ToastContext";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Back from "../../components/Layout/Back";
import CardWrapper from "../../components/Galerie/CardWrapper";
import { Modal, Button } from "react-bootstrap";
import { formatDateRelative } from "../../utils/formatDateRelative";
import { useCrudUI } from "../../hooks/useCrudUI";
import MediaPicker from "./MediaPicker";
import ImagePreviewModal from "../../components/Galerie/ImagePreviewModal";

const GalerieDossierShow = () => {
  // ==================== HOOKS & INITIALISATION ====================

  const { id } = useParams();
  const { showToast } = useToast();

  // Récupère les données de la galerie (dossier et images)
  const {
    dossier,
    images,
    loading,
    error,
    deleteImage,
    toggleImage,
    fetchImages,
  } = useGalerieImages(id);

  // Gestion de l'UI CRUD (sélection, modals)
  const {
    selectedIds,
    setSelectedIds,
    resetSelection,
    toggleSelect,
    modal,
    openSingleDelete,
    openMultipleDelete,
    closeModal,
    toggleModal,
    selectedToggle,
    openToggle,
    closeToggle,
    confirmToggle,
  } = useCrudUI();

  // ==================== STATES - FILTRAGE & TRI ====================

  const [sortOption, setSortOption] = useState("");
  const [sortedImages, setSortedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ==================== STATES - UI & MODALS ====================

  const [loader, setLoader] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // ==================== HANDLERS - ACTIONS IMAGES ====================

  /**
   * Supprime une ou plusieurs images après confirmation
   */
  const handleDelete = async () => {
    await deleteImage(modal.type === "single" ? modal.data.id : modal.data);
    resetSelection();
    showToast(
      modal.type === "single" ? "Image supprimée" : "Image(s) supprimée(s)",
      "danger",
    );
    closeModal();
  };

  /**
   * Bascule la visibilité d'une image
   */
  const handleToggle = async (image) => {
    setLoader(true);
    await toggleImage(image.id);
    setLoader(false);
  };

  /**
   * Ferme le modal d'ajout d'images et rafraîchit la liste
   */
  const handleMediaModalClose = () => {
    setShowMediaModal(false);
    showToast("Image(s) ajoutée(s)", "success");
    fetchImages(id);
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Modal pour afficher une image
   */
  const openImageModal = (img) => {
    setSelectedImage(img);
    setShowModal(true);
  };

  const closeImageModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  // ==================== DATA PROCESSING - FILTRAGE ====================

  /**
   * Filtre les images en fonction de la recherche
   * Utilise les images triées si disponibles, sinon les images brutes
   */
  const filteredImages = sortedImages.length
    ? sortedImages.filter((d) =>
        d.titre.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : images.filter((d) =>
        d.titre.toLowerCase().includes(searchQuery.toLowerCase()),
      );

  // ==================== RENDU JSX ====================
  const allIds = images.map((img) => img.id);
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
              placeholder="Rechercher une image..."
              onSearch={setSearchQuery}
              delay={300}
            />
            <Back>/admin-tdi/galerie/dossiers</Back>
            <HeaderWithFilter
              allowedRoles={["dev", "super_admin"]}
              title2={`Images du dossier (${dossier?.nom})`}
              linkText="Ajouter"
              onLinkClick={() => setShowMediaModal(true)}
              main={images.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={images}
              setSortedList={setSortedImages}
              alphaField="titre"
              dateField="created_at"
            />

            {/* SECTION ACTIONS - Barre de sélection multiple */}
            <div className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded bg-body">
              <div className="d-flex align-items-center gap-2">
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

                <span>
                  {selectedIds.length} image
                  {selectedIds.length > 1 ? "s" : ""} sélectionnée
                  {selectedIds.length > 1 ? "s" : ""}
                </span>
              </div>

              {selectedIds.length > 0 && (
                <Button
                  variant="danger"
                  onClick={openMultipleDelete}
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-trash me-1"></i>{" "}
                  <span className="d-none d-md-block">Suppr.</span> (
                  {selectedIds.length})
                </Button>
              )}
            </div>

            {/* SECTION GALERIE - Affichage des images ou message vide */}
            <div
              className="d-flex flex-wrap gap-4 justify-content-center border p-2 rounded-4"
              style={{
                rowGap: "1.5rem",
                overflowY: "auto",
                maxHeight: "400px",
              }}
            >
              {filteredImages.length ? (
                filteredImages.map((img) => (
                  <CardWrapper
                    key={img.id}
                    item={img}
                    selectedIds={selectedIds}
                    onSelect={toggleSelect}
                    icon="fa-image"
                    openDropdownId={openDropdownId}
                    setOpenDropdownId={setOpenDropdownId}
                    onDoubleClick={openImageModal}
                    actions={[
                      {
                        label: "Voir",
                        icon: "fas fa-image",
                        onClick: openImageModal,
                      },
                      {
                        label:
                          loader && selectedToggle?.id === img.id
                            ? "Chargement..."
                            : img.is_visible
                              ? "Masquer"
                              : "Afficher",
                        icon:
                          loader && selectedToggle?.id === img.id
                            ? "fas fa-spinner fa-spin"
                            : `fas fa-eye${!img.is_visible ? "" : "-slash text-secondary"}`,
                        onClick: openToggle,
                      },
                      {
                        label: "Supprimer",
                        icon: "fas fa-trash text-danger",
                        onClick: openSingleDelete,
                      },
                    ]}
                  >
                    <div className="text-muted small">
                      Création : {formatDateRelative(img.created_at)}
                    </div>
                  </CardWrapper>
                ))
              ) : (
                <div className="text-center text-muted py-5 w-100">
                  <i className="fa fa-image fa-4x mb-3"></i>
                  <p>Aucune image trouvée.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==================== MODALS & POPUPS ==================== */}

      {/* Modal de confirmation - Suppression d'une image */}
      <ConfirmPopup
        show={modal.show}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        btnClass="danger"
        body={
          modal.type === "single" ? (
            <p>Supprimer cette image du dossier ?</p>
          ) : (
            <p>
              Supprimer <strong>{modal.data?.length}</strong> image(s) du
              dossier ?
            </p>
          )
        }
      />

      {/* Modal de confirmation - Visibilité de l'image */}
      <ConfirmPopup
        show={toggleModal}
        onClose={closeToggle}
        onConfirm={() => confirmToggle(handleToggle)}
        title="Confirmer l'action"
        btnClass="primary"
        body={
          <p>
            Voulez-vous{" "}
            <strong>
              {selectedToggle?.is_visible ? "masquer" : "afficher"}
            </strong>{" "}
            cette image ?
          </p>
        }
      />

      {/* Modal - Afficher une image */}
      <ImagePreviewModal
        show={showModal}
        onClose={closeImageModal}
        image={selectedImage}
      />

      {/* Modal - Ajouter des médias au dossier */}
      <Modal
        show={showMediaModal}
        onHide={() => setShowMediaModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un média</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <MediaPicker
            dossierId={dossier?.id}
            onSuccess={handleMediaModalClose}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMediaModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default GalerieDossierShow;
