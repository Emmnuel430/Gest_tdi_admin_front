import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";

const Synagogue = () => {
  const [synagogues, setSynagogues] = useState([]);
  const [newSynagogues, setNewSynagogues] = useState({
    nom: "",
    localisation: "",
    horaires: "",
  });
  const [editSynagogue, setEditSynagogue] = useState(null);
  const [selectedSynagogue, setSelectedSynagogue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;

  // Charger les synagogues
  const fetchSynagogue = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_synagogue`);
      const data = await res.json();
      setSynagogues(data);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchSynagogue();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (syn) => {
    setSelectedSynagogue(syn); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedSynagogue(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter une syn
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/add_synagogue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSynagogues),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Effectuée !");
        fetchSynagogue();
        setNewSynagogues({ nom: "", localisation: "", horaires: "" });
        setModalVisible(false);
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Supprimer une syn
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${API}/delete_synagogue/${selectedSynagogue.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }, // Headers
        }
      );

      if (res.ok) {
        alert("Effectuée !");
        setSynagogues(synagogues.filter((m) => m.id !== selectedSynagogue.id));
      } else {
        const data = await res.json();
        setError(data.message || "Erreur de suppression");
      }
    } catch (error) {
      setError("Erreur de connexion : " + error.message);
    } finally {
      handleCloseModal();
      setLoading(false);
    }
  };

  // Modifier une syn
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/update_synagogue/${editSynagogue.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editSynagogue),
      });

      if (res.ok) {
        alert("Effectuée !");
        fetchSynagogue();
        setEditSynagogue(null);
      } else {
        alert("Erreur de mise à jour");
      }
    } catch (error) {
      setError("Erreur de connexion : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRelative = (date) => {
    const formatted = formatDistanceToNow(new Date(date), {
      addSuffix: false, // Pas de suffixe (ex. "il y a")
      locale: fr, // Locale française
    });

    if (/moins d.?une minute/i.test(formatted)) {
      return "À l'instant"; // Cas particulier pour "moins d'une minute"
    }

    // Remplacements pour abréger les unités de temps
    const abbreviations = [
      { regex: /environ /i, replacement: "≈" },
      { regex: / heures?/i, replacement: "h" },
      { regex: / minutes?/i, replacement: "min" },
      { regex: / secondes?/i, replacement: "s" },
      { regex: / jours?/i, replacement: "j" },
      { regex: / semaines?/i, replacement: "sem" },
      { regex: / mois?/i, replacement: "mois" },
      { regex: / ans?/i, replacement: "an" },
    ];

    let shortened = formatted;
    abbreviations.forEach(({ regex, replacement }) => {
      shortened = shortened.replace(regex, replacement); // Applique les remplacements
    });

    return shortened; // Retourne la version abrégée
  };

  return (
    <Layout>
      {/* Affichage des erreurs s'il y en a */}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }} // Centrer Loader au milieu de l'écran
        >
          <Loader />
        </div>
      ) : (
        <>
          <div className="container mt-4">
            <HeaderWithFilter title2="Synagogues" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {synagogues.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                synagogues
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((syn) => (
                    <div key={syn.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm bg-body">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">• {syn.nom}</h5>
                          <hr />
                          <span className="italic text-muted">
                            {syn.localisation}
                          </span>
                          <p className="card-text">
                            {syn.horaires.split(" ").length > 30
                              ? syn.horaires.split(" ").slice(0, 50).join(" ") +
                                "..."
                              : syn.horaires}
                          </p>
                          <div className="text-muted text-end w-100 mt-auto">
                            <small>
                              Création : {formatDateRelative(syn.created_at)}
                            </small>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditSynagogue(syn)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(syn)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Modal d'ajout */}
            {modalVisible && (
              <Modal
                show={modalVisible}
                onHide={() => setModalVisible(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Nouvelle Synagogue</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingNom"
                      placeholder="Nom"
                      value={newSynagogues.nom}
                      onChange={(e) =>
                        setNewSynagogues({
                          ...newSynagogues,
                          nom: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="floatingNom">Nom</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingLocalisation"
                      placeholder="Localisation"
                      value={newSynagogues.localisation}
                      onChange={(e) =>
                        setNewSynagogues({
                          ...newSynagogues,
                          localisation: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="floatingLocalisation">Localisation</label>
                  </div>

                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Horaires..."
                      id="floatingHoraires"
                      style={{ height: "150px" }}
                      value={newSynagogues.horaires}
                      onChange={(e) =>
                        setNewSynagogues({
                          ...newSynagogues,
                          horaires: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="floatingHoraires">Horaires</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAdd}
                    disabled={!newSynagogues.nom || !newSynagogues.horaires}
                  >
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editSynagogue && (
              <Modal
                show={!!editSynagogue}
                onHide={() => setEditSynagogue(null)}
                centered
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Modifier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="editNom"
                      placeholder="Nom"
                      value={editSynagogue?.nom || ""}
                      onChange={(e) =>
                        setEditSynagogue({
                          ...editSynagogue,
                          nom: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editNom">Nom</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="editLocalisation"
                      placeholder="Localisation"
                      value={editSynagogue?.localisation || ""}
                      onChange={(e) =>
                        setEditSynagogue({
                          ...editSynagogue,
                          localisation: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editLocalisation">Localisation</label>
                  </div>

                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Ecrivez ici ..."
                      id="editHoraires"
                      style={{ height: "150px" }}
                      value={editSynagogue?.horaires || ""}
                      onChange={(e) =>
                        setEditSynagogue({
                          ...editSynagogue,
                          horaires: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editHoraires">Horaires</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditSynagogue(null)}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Sauvegarder
                  </button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
        </>
      )}

      {/* Modal de confirmation pour la suppression d'un utilisateur */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={<p>Voulez-vous vraiment supprimer cette synagogue ?</p>}
      />
    </Layout>
  );
};

export default Synagogue;
