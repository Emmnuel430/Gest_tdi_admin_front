import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken";

const UpdateAdherents = () => {
  const { id } = useParams();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [contact, setContact] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password] = useState("");
  const [statut, setStatut] = useState("");
  const [abonnementType, setAbonnementType] = useState("");
  const [abonnementExpiresAt, setAbonnementExpiresAt] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdherent = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/adherents/${id}`,
          { method: "GET" }
        );
        const result = await response.json();
        if (response.ok && result.data) {
          setNom(result.data.nom || "");
          setPrenom(result.data.prenom || "");
          setContact(result.data.contact || "");
          setPseudo(result.data.pseudo || "");
          setStatut(result.data.statut || "");
          setAbonnementType(result.data.abonnement_type || "");
          setAbonnementExpiresAt(result.data.abonnement_expires_at || "");
          setIsValidated(!!result.data.is_validated);
        } else {
          setError(result.message || "Erreur lors du chargement.");
        }
      } catch (err) {
        setError("Erreur lors du chargement de l'adhérent.");
      }
    };
    fetchAdherent();
  }, [id]);

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (!nom || !prenom || !statut) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            nom,
            prenom,
            contact,
            pseudo: pseudo || undefined,
            password: password || undefined,
            statut,
            abonnement_type: abonnementType || undefined,
            abonnement_expires_at: abonnementExpiresAt || undefined,
            is_validated: isValidated,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Erreur lors de la mise à jour.");
        setLoading(false);
        return;
      }

      alert("Adhérent mis à jour !");
      navigate("/admin-tdi/adherents");
    } catch (err) {
      setError("Une erreur s'est produite.");
      setLoading(false);
    }
  };

  // const generatePseudo = () => {
  //   const randomString = Math.random().toString(36).substring(2, 6); // 4 caractères aléatoires
  //   const slugifiedPrenom = prenom
  //     ? prenom
  //         .trim()
  //         .toLowerCase()
  //         .replace(/[^a-z0-9]+/g, "-")
  //     : "user";
  //   setPseudo(`${slugifiedPrenom}-${randomString}`);
  // };

  // const generatePassword = () => {
  //   const random = Math.random().toString(36).slice(-8); // 8 caractères
  // setPassword(random);
  // };

  return (
    <Layout>
      <Back>admin-tdi/adherents</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Modifier un adhérent</h1>
        <br />

        {error && <ToastMessage message={error} onClose={() => setError("")} />}

        <div className="mb-3">
          <label className="form-label">Nom *</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Prénom *</label>
          <input
            type="text"
            className="form-control"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact</label>
          <input
            type="text"
            className="form-control"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* <div className="mb-3">
          <label className="form-label">Pseudo</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={pseudo}
              placeholder="Généré automatiquement"
              readOnly
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={generatePseudo}
            >
              Générer
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={password}
              placeholder="Généré automatiquement"
              readOnly
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={generatePassword}
            >
              Générer
            </button>
          </div>
        </div> */}

        <div className="mb-3">
          <label className="form-label">Statut *</label>
          <select
            className="form-select"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            required
          >
            <option value="">-- Choisir un statut --</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Type d'abonnement</label>
          <select
            className="form-select"
            value={abonnementType}
            onChange={(e) => setAbonnementType(e.target.value)}
          >
            <option value="">-- Choisir un type --</option>
            <option value="hebdomadaire">Hebdomadaire</option>
            <option value="mensuel">Mensuel</option>
            <option value="annuel">Annuel</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Expiration abonnement</label>
          <input
            type="date"
            className="form-control"
            value={
              abonnementExpiresAt ? abonnementExpiresAt.substring(0, 10) : ""
            }
            onChange={(e) => setAbonnementExpiresAt(e.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isValidated}
            onChange={(e) => setIsValidated(e.target.checked)}
            id="isValidated"
          />
          <label className="form-check-label" htmlFor="isValidated">
            Adhérent validé
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
            <span>Mettre à jour l'adhérent</span>
          )}
        </button>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier cet adhérent ?</p>}
      />
    </Layout>
  );
};

export default UpdateAdherents;
