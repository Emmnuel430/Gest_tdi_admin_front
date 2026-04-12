import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";
import { useToast } from "../../context/ToastContext";

const AddDossier = () => {
  const maxLength = 200;
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { showToast } = useToast();

  const navigate = useNavigate();

  const handleConfirm = () => {
    setShowModal(false);
    addDossier();
  };

  const handleCancel = () => setShowModal(false);

  const addDossier = async () => {
    if (!nom) {
      setError("Le nom du dossier est requis.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let result = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers`,
        {
          method: "POST",
          body: JSON.stringify({
            nom,
            description,
          }),
        },
      );

      result = await result.json();

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);

      // UX clean
      setNom("");
      setDescription("");
      showToast("Dossier créé avec succès !");

      navigate("/admin-tdi/galerie/dossiers");
      // navigate(`/admin-tdi/galerie/dossiers/${result.data.id}`);
    } catch (e) {
      setError("Une erreur inattendue s'est produite.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>/admin-tdi/galerie/dossiers</Back>

      <div className="col-sm-6 offset-sm-3 mt-5">
        <h2>Créer un dossier</h2>

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
          className="btn btn-primary w-100"
          disabled={!nom || loading || description.length >= maxLength}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Chargement...
            </>
          ) : (
            "Créer le dossier"
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la création"
        btnClass="primary"
        body={<p>Voulez-vous créer ce dossier ?</p>}
        btnColor="primary"
      />
    </Layout>
  );
};

export default AddDossier;
