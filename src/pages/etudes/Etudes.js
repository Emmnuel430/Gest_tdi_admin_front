import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";

const Etudes = () => {
  const [etudes, setEtudes] = useState([]);
  const [newEtudes, setNewEtudes] = useState({
    titre: "",
    verset: "",
    texte: "",
  });
  const [editEtudes, setEditEtudes] = useState(null);
  const [selectedEtudes, setSelectedEtudes] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;

  // Charger les etudes
  const fetchEtudes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_etude`);
      const data = await res.json();
      setEtudes(data);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchEtudes();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (etude) => {
    setSelectedEtudes(etude); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedEtudes(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter une etude
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/add_etude`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEtudes),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Effectuée !");
        fetchEtudes();
        setNewEtudes({ titre: "", verset: "", texte: "" });
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

  // Supprimer une etude
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/delete_etude/${selectedEtudes.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }, // Headers
      });

      if (res.ok) {
        alert("Effectuée !");
        setEtudes(etudes.filter((m) => m.id !== selectedEtudes.id));
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

  // Modifier une etude
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/update_etude/${editEtudes.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editEtudes),
      });

      if (res.ok) {
        alert("Effectuée !");
        fetchEtudes();
        setEditEtudes(null);
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
            <HeaderWithFilter title2="Etudes" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {etudes.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                etudes
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((etude) => (
                    <div key={etude.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm bg-body">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{etude.titre}</h5>
                          <hr />
                          <span className="italic text-muted">
                            {etude.verset}
                          </span>
                          <p className="card-text fst-italic">
                            {etude.texte.split(" ").length > 30
                              ? etude.texte.split(" ").slice(0, 30).join(" ") +
                                "..."
                              : etude.texte}
                          </p>
                          <div className="text-muted text-end w-100 mt-auto">
                            <small>
                              Création : {formatDateRelative(etude.created_at)}
                            </small>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditEtudes(etude)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(etude)}
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
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Nouvelle Etude</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="titreEtude"
                      placeholder="Titre"
                      value={newEtudes.titre}
                      onChange={(e) =>
                        setNewEtudes({
                          ...newEtudes,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="titreEtude">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="versetEtude"
                      placeholder="Verset"
                      value={newEtudes.verset}
                      onChange={(e) =>
                        setNewEtudes({
                          ...newEtudes,
                          verset: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="versetEtude">Verset</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="texteEtude"
                      placeholder="Texte de l'étude"
                      style={{ height: "250px" }}
                      value={newEtudes.texte}
                      onChange={(e) =>
                        setNewEtudes({
                          ...newEtudes,
                          texte: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="texteEtude">Texte</label>
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
                    disabled={!newEtudes.titre || !newEtudes.texte}
                  >
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editEtudes && (
              <Modal
                show={!!editEtudes}
                onHide={() => setEditEtudes(null)}
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
                      id="editTitreEtude"
                      placeholder="Titre"
                      value={editEtudes?.titre || ""}
                      onChange={(e) =>
                        setEditEtudes({
                          ...editEtudes,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editTitreEtude">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="editVersetEtude"
                      placeholder="Verset"
                      value={editEtudes?.verset || ""}
                      onChange={(e) =>
                        setEditEtudes({
                          ...editEtudes,
                          verset: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editVersetEtude">Verset</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editTexteEtude"
                      placeholder="Texte de l'étude"
                      style={{ height: "250px" }}
                      value={editEtudes?.texte || ""}
                      onChange={(e) =>
                        setEditEtudes({
                          ...editEtudes,
                          texte: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editTexteEtude">Texte</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditEtudes(null)}
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
        body={<p>Voulez-vous vraiment supprimer cette étude ?</p>}
      />
    </Layout>
  );
};

export default Etudes;
