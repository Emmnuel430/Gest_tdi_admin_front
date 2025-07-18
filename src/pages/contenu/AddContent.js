import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const AddContent = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [content, setContent] = useState("");
  const [lien, setLien] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (!title || !type || !accessLevel) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/contents`,
        {
          method: "POST",
          body: JSON.stringify({
            title,
            type,
            access_level: accessLevel,
            content,
            lien,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Erreur lors de l'ajout.");
        setLoading(false);
        return;
      }

      alert("Contenu ajouté !");
      navigate("/admin-tdi/contenu");
    } catch (err) {
      setError("Une erreur s'est produite.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/contenu</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Ajouter un contenu</h1>
        <br />

        {error && <ToastMessage message={error} onClose={() => setError("")} />}

        <div className="mb-3">
          <label className="form-label">Titre *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Titre du contenu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type *</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">-- Choisir un type --</option>
            <option value="formation">Formation</option>
            <option value="cours">Cours</option>
            {/* <option value="evenement">Événement</option> */}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Niveau d'accès *</label>
          <select
            className="form-select"
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            required
          >
            <option value="">-- Choisir un niveau --</option>
            <option value="standard">Tous</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Contenu (texte)</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Contenu détaillé (optionnel)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Lien (URL)</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://exemple.com (optionnel)"
            value={lien}
            onChange={(e) => setLien(e.target.value)}
          />
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
            <span>Ajouter le contenu</span>
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer l'ajout"
        body={<p>Voulez-vous vraiment ajouter ce contenu ?</p>}
      />
    </Layout>
  );
};

export default AddContent;
