import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";

const Actus = () => {
  const [actus, setActus] = useState([]);
  const [newActus, setNewActus] = useState({ titre: "", description: "" });
  const [editActus, setEditActus] = useState(null);
  const [selectedActus, setSelectedActus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;

  // Charger les actus
  const fetchActus = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_actualite`);
      const data = await res.json();
      setActus(data);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchActus();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (actu) => {
    setSelectedActus(actu); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedActus(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter une actu
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/add_actualite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newActus),
      });

      const result = await res.json();
      if (res.ok) {
        fetchActus();
        setNewActus({ titre: "", description: "" });
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

  // Supprimer une actu
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/delete_actualite/${selectedActus.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }, // Headers
      });

      if (res.ok) {
        setActus(actus.filter((m) => m.id !== selectedActus.id));
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

  // Modifier une actu
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/update_actualite/${editActus.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editActus),
      });
      if (res.ok) {
        fetchActus();
        setEditActus(null);
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
            <HeaderWithFilter title2="Actualités" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter une actu
            </button>

            <div className="row justify-content-center">
              {actus.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                actus
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((actu) => (
                    <div key={actu.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm bg-body">
                        <div className="card-body">
                          <h5 className="card-title">Titre : {actu.titre}</h5>
                          <hr />
                          <p className="card-text fst-italic">
                            {actu.description.split(" ").length > 30
                              ? actu.description
                                  .split(" ")
                                  .slice(0, 30)
                                  .join(" ") + "..."
                              : actu.description}
                          </p>
                          <div className="text-muted text-end w-100">
                            Création : {formatDateRelative(actu.created_at)}
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditActus(actu)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(actu)}
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
                  <Modal.Title>Nouvelle Actualité</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="titreActu"
                      placeholder="Titre"
                      value={newActus.titre}
                      onChange={(e) =>
                        setNewActus({ ...newActus, titre: e.target.value })
                      }
                    />
                    <label htmlFor="titreActu">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="descriptionActu"
                      placeholder="Description de l'actu ..."
                      style={{ height: "200px" }}
                      value={newActus.description}
                      onChange={(e) =>
                        setNewActus({
                          ...newActus,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="descriptionActu">Description</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalVisible(false)}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-primary" onClick={handleAdd}>
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editActus && (
              <Modal
                show={!!editActus}
                onHide={() => setEditActus(null)}
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
                      id="editTitreActu"
                      placeholder="Titre"
                      value={editActus?.titre || ""}
                      onChange={(e) =>
                        setEditActus({ ...editActus, titre: e.target.value })
                      }
                    />
                    <label htmlFor="editTitreActu">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editDescriptionActu"
                      placeholder="Description"
                      style={{ height: "200px" }}
                      value={editActus?.description || ""}
                      onChange={(e) =>
                        setEditActus({
                          ...editActus,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editDescriptionActu">Description</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditActus(null)}
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
        body={<p>Voulez-vous vraiment supprimer cette actu ?</p>}
      />
    </Layout>
  );
};

export default Actus;
