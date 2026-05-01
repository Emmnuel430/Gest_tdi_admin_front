import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Importation du modal de confirmation
import ToastMessage from "../../components/Layout/ToastMessage"; // Importation du composant de message toast
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { fetchWithToken } = useFetchWithToken(); // Importation d'une fonction utilitaire pour les requêtes avec token
  // États pour stocker les données du formulaire et d'autres informations d'état
  const [nom, setNom] = useState(""); // Nom de l'utilisateur
  const [pseudo, setPseudo] = useState(""); // Pseudo de l'utilisateur
  const [password, setPassword] = useState(""); // Mot de passe de l'utilisateur
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(""); // Rôle de l'utilisateur
  const [loading, setLoading] = useState(false); // Indicateur de chargement lors de la soumission
  const [error, setError] = useState(""); // Message d'erreur en cas de problème
  const { ui, close, openConfirm } = useCrudUI();
  const navigate = useNavigate(); // Hook pour la navigation

  // Récupération de l'utilisateur actuellement connecté depuis le sessionStorage
  const { admin } = useAuth();
  const userInfo = admin;
  const userId = userInfo ? userInfo.id : null;

  // Si aucun utilisateur n'est authentifié, on redirige vers la page de connexion
  if (!userId) {
    alert("Utilisateur non authentifié. Veuillez vous connecter.");
    navigate("/admin-tdi");
    return;
  }

  const roles = [
    { value: "super_admin", label: "Super Admin" },
    { value: "staff", label: "Staff" },
  ];

  // Fonction pour confirmer l'inscription
  const handleConfirm = async () => {
    close();
    await signUp();
  };

  // Fonction pour envoyer les données du formulaire au backend
  const signUp = async () => {
    // Vérification que tous les champs sont remplis
    if (!nom || !role || !pseudo || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    setError(""); // Réinitialise l'erreur
    setLoading(true); // Active le chargement

    try {
      // Données à envoyer au serveur
      const item = { nom, pseudo, password, role, admin_id: userId };

      // Envoi des données au backend avec une requête POST
      let result = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/add_user`,
        {
          method: "POST",
          body: JSON.stringify(item),
        },
      );

      result = await result.json();

      // Si une erreur est retournée par le serveur, on l'affiche et on désactive le chargement
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false); // Désactive le chargement
      alert("Utilisateur enregistré"); // Message de confirmation
      setNom(""); // Réinitialise les champs du formulaire
      setPseudo("");
      setPassword("");
      setRole("");
      navigate("/admin-tdi/utilisateurs"); // Redirige vers la liste des utilisateurs
    } catch (e) {
      setError("Une erreur inattendue s'est produite. Veuillez réessayer."); // En cas d'erreur serveur
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/utilisateurs</Back>
      <div className="col-sm-6 offset-sm-3 mt-5">
        <h1>Création d'un nouvel utilisateur</h1>

        {/* Affichage d'un message d'erreur si nécessaire */}
        {error && (
          <ToastMessage
            message={error}
            onClose={() => {
              setError(null);
            }}
          />
        )}

        {/* Formulaire d'inscription */}
        <label htmlFor="nom" className="form-label">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          className="form-control"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)} // Mise à jour de l'état pour le champ nom
        />
        <br />

        <label htmlFor="pseudo" className="form-label">
          Pseudo
        </label>
        <input
          type="text"
          id="pseudo"
          className="form-control"
          placeholder="Pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)} // Mise à jour de l'état pour le champ pseudo
        />
        <br />

        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-outline-secondary"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
        </div>

        {/* Sélecteur du rôle de l'utilisateur (Admin ou Staff) */}
        <div className="mb-4">
          <label htmlFor="role" className="form-label font-semibold">
            Rôle de l'utilisateur :
          </label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Sélectionner un rôle --</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton pour soumettre le formulaire avec un modal de confirmation */}
        <button
          onClick={() => openConfirm()} // Ouvre le modal de confirmation
          className="btn btn-primary w-100"
          disabled={!nom || !role || !pseudo || !password || loading}
        >
          {loading ? (
            <span>
              <i className="fas fa-spinner fa-spin"></i> Chargement...
            </span>
          ) : (
            <span>Ajouter</span>
          )}
        </button>
      </div>

      {/* Modal de confirmation avant de soumettre l'inscription */}
      <ConfirmPopup
        show={ui.mode === "confirm"}
        onClose={close}
        onConfirm={handleConfirm}
        title="Confirmer l'inscription"
        body={<p>Voulez-vous vraiment ajouter cet utilisateur ?</p>}
      />
    </Layout>
  );
};

export default Register;
