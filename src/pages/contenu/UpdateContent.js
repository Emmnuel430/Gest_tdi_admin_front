import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const UpdateContent = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [accessLevel, setAccessLevel] = useState("");
  const [content, setContent] = useState("");
  const [lien, setLien] = useState("");
  const [publishAt, setPublishAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/contents/${id}`
        );
        const result = await response.json();
        if (response.ok && result.data) {
          setTitle(result.data.title || "");
          setType(result.data.type || "");
          setAccessLevel(result.data.access_level || "");
          setContent(result.data.content || "");
          setLien(result.data.lien || "");
          setPublishAt(
            result.data.publish_at
              ? new Date(result.data.publish_at).toISOString().slice(0, 16)
              : ""
          );
        } else {
          setError(result.message || "Erreur lors du chargement.");
        }
      } catch (err) {
        setError("Erreur lors du chargement du contenu.");
      }
    };
    fetchContent();
  }, [id]);

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
    if (publishAt) {
      const chosenDate = new Date(publishAt);
      const minDate = new Date(Date.now() + 5 * 60 * 1000);
      if (chosenDate < minDate) {
        setError(
          "La date de publication doit être au moins 5 minutes après maintenant."
        );
        return;
      }
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/contents/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            title,
            type,
            access_level: accessLevel,
            content,
            lien,
            publish_at: publishAt,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Erreur lors de la mise à jour.");
        setLoading(false);
        return;
      }

      alert("Contenu mis à jour !");
      navigate("/admin-tdi/contenu");
    } catch (err) {
      setError("Une erreur s'est produite.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/contenu</Back>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 mt-5">
            <h1>Modifier le contenu</h1>
            <br />

            {error && (
              <ToastMessage
                message={error}
                duration={5000}
                onClose={() => setError("")}
              />
            )}

            <div className="mb-3">
              <label className="form-label">Titre *</label>
              <textarea
                rows={2}
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
                rows={8}
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

            <div className="mb-3">
              <label className="form-label">Date de publication</label>
              <input
                type="datetime-local"
                min={new Date(Date.now() + 5 * 60 * 1000)
                  .toISOString()
                  .slice(0, 16)}
                className="form-control"
                value={publishAt}
                onChange={(e) => setPublishAt(e.target.value)}
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
                <span>Mettre à jour le contenu</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier ce contenu ?</p>}
      />
    </Layout>
  );
};

export default UpdateContent;
