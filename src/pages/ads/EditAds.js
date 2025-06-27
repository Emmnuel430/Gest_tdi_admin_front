import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken"; // Importation d'une fonction utilitaire pour les requêtes avec token

const EditAds = () => {
  const [afficheTitre, setAfficheTitre] = useState("");
  const [afficheLien, setAfficheLien] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [actif, setActif] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [pages, setPages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const LINK = process.env.REACT_APP_API_URL;

    fetchWithToken(`${LINK}/api/pages`)
      .then((res) => res.json())
      .then((data) => setPages(data))
      .catch((error) =>
        console.error("Erreur de chargement des pages:", error)
      );

    fetchWithToken(`${LINK}/api/ads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAfficheTitre(data.affiche_titre || "");
        setAfficheLien(data.affiche_lien || "");
        setCurrentImage(data.affiche_image);
        setActif(data.actif === 1);
      })
      .catch((error) => {
        console.error("Erreur de chargement de l'affiche:", error);
        setError("Impossible de charger l'affiche.");
      });
  }, [id]);

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("affiche_titre", afficheTitre);
    formData.append("affiche_lien", afficheLien);
    formData.append("actif", actif ? 1 : 0);
    if (mainImage) formData.append("main_image", mainImage);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/ads/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Erreur lors de la mise à jour.");
        setLoading(false);
        return;
      }

      alert("Affiche modifiée avec succès !");
      navigate("/admin-tdi/ads");
    } catch (err) {
      setError("Une erreur s'est produite.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/ads</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Modifier une affiche</h1>
        <br />

        {error && <ToastMessage message={error} onClose={() => setError("")} />}

        <div className="mb-3">
          <label className="form-label">Titre de l'affiche</label>
          <input
            type="text"
            className="form-control"
            value={afficheTitre}
            onChange={(e) => setAfficheTitre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Lien (slug)</label>
          <select
            className="form-select"
            value={afficheLien}
            onChange={(e) => setAfficheLien(e.target.value)}
          >
            <option value="">-- Choisir une page --</option>
            {pages.map((page) => (
              <option key={page.id} value={page.slug}>
                {page.title} ({page.slug})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          {currentImage && (
            <div className="mb-2 text-center">
              <span className="text-muted">Ancienne image :</span>
              <img
                src={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${currentImage}`}
                alt="Aperçu"
                className="mt-2 img-fluid rounded shadow-sm"
                style={{
                  maxHeight: "200px",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            onChange={(e) => setMainImage(e.target.files[0])}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="actif"
            checked={actif}
            onChange={(e) => setActif(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="actif">
            Actif (cochez pour afficher l'affiche sur le site public)
          </label>
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Mettre à jour</span>
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier cette affiche ?</p>}
      />
    </Layout>
  );
};

export default EditAds;
