import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../context/ToastContext";

const EditDossier = () => {
  const { id } = useParams();
  const maxLength = 200;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Si dossier pas dans state → on peut récupérer depuis API (optionnel)
  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers/${id}`,
        );
        const data = await res.json();
        setNom(data.nom);
        setDescription(data.description || "");
      } catch (e) {
        setError("Impossible de récupérer le dossier");
      }
    };
    fetchDossier();
  }, [id]);

  const handleConfirm = () => {
    setShowModal(false);
    updateDossier();
  };

  const handleCancel = () => setShowModal(false);

  const updateDossier = async () => {
    if (!nom) {
      setError("Le nom du dossier est requis.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ nom, description }),
        },
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      showToast("Dossier mis à jour avec succès !", "success");
      navigate("/admin-tdi/galerie/dossiers");
    } catch (e) {
      setError("Une erreur inattendue s'est produite.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>/admin-tdi/galerie/dossiers</Back>

      <div className="col-sm-6 offset-sm-3 mt-5">
        <h2>Modifier le dossier</h2>

        {error && <ToastMessage message={error} onClose={() => setError("")} />}

        {/* NOM */}
        <label className="form-label">Nom du dossier *</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Mariage, Voyage..."
          value={nom}
          required
          onChange={(e) => setNom(e.target.value)}
        />
        <br />

        {/* DESCRIPTION */}
        <label className="form-label d-flex justify-content-between">
          <span>Description</span>
          <small
            className={`${
              description.length >= maxLength
                ? "text-danger"
                : description.length > maxLength * 0.8
                  ? "text-warning"
                  : "text-muted"
            }`}
          >
            {description.length}/{maxLength}
          </small>
        </label>

        <textarea
          className={`form-control ${
            description.length > maxLength ? "is-invalid" : ""
          }`}
          placeholder="Optionnel"
          value={description}
          maxLength={maxLength}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />

        {description.length > maxLength && (
          <div className="invalid-feedback">
            La description ne doit pas dépasser {maxLength} caractères.
          </div>
        )}
        <br />

        <button
          onClick={() => setShowModal(true)}
          className="btn btn-warning w-100"
          disabled={!nom || loading || description.length >= maxLength}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Chargement...
            </>
          ) : (
            "Mettre à jour le dossier"
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la mise à jour"
        btnClass="warning"
        body={<p>Voulez-vous vraiment mettre à jour ce dossier ?</p>}
        btnColor="warning"
      />
    </Layout>
  );
};

export default EditDossier;
