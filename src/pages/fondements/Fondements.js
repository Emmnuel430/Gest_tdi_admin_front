import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";

const Fondements = () => {
  const [fondements, setFondements] = useState([]);
  const [newFondements, setNewFondements] = useState({
    titre: "",
    texte: "",
  });
  const [editFondements, setEditFondements] = useState(null);
  const [selectedFondements, setSelectedFondements] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;

  // Charger les fondements
  const fetchFondements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_fondement`);
      const data = await res.json();
      setFondements(data);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchFondements();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (fondement) => {
    setSelectedFondements(fondement); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedFondements(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter une fondement
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/add_fondement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFondements),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Effectuée !");
        fetchFondements();
        setNewFondements({ titre: "", texte: "" });
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

  // Supprimer une fondement
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${API}/delete_fondement/${selectedFondements.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }, // Headers
        }
      );

      if (res.ok) {
        alert("Effectuée !");
        setFondements(fondements.filter((m) => m.id !== selectedFondements.id));
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

  // Modifier une fondement
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/update_fondement/${editFondements.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFondements),
      });
      if (res.ok) {
        alert("Effectuée !");
        fetchFondements();
        setEditFondements(null);
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
            <HeaderWithFilter title2="Fondements" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {fondements.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                fondements
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((fondement) => (
                    <div key={fondement.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm bg-body">
                        <div className="card-body">
                          <h5 className="card-title">• {fondement.titre}</h5>
                          <hr />
                          <p className="card-text fst-italic">
                            {fondement.texte.split(" ").length > 30
                              ? fondement.texte
                                  .split(" ")
                                  .slice(0, 50)
                                  .join(" ") + "..."
                              : fondement.texte}
                          </p>
                          <div className="text-muted text-end w-100">
                            Création :{" "}
                            {formatDateRelative(fondement.created_at)}
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditFondements(fondement)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(fondement)}
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
                  <Modal.Title>Nouveau Fondement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="newTitreFondement"
                      placeholder="Titre"
                      value={newFondements.titre}
                      onChange={(e) =>
                        setNewFondements({
                          ...newFondements,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="newTitreFondement">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="newTexteFondement"
                      placeholder="Texte"
                      style={{ height: "250px" }}
                      value={newFondements.texte}
                      onChange={(e) =>
                        setNewFondements({
                          ...newFondements,
                          texte: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="newTexteFondement">Texte</label>
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
            {editFondements && (
              <Modal
                show={!!editFondements}
                onHide={() => setEditFondements(null)}
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
                      id="editTitreFondement"
                      placeholder="Titre"
                      value={editFondements?.titre || ""}
                      onChange={(e) =>
                        setEditFondements({
                          ...editFondements,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editTitreFondement">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editTexteFondement"
                      placeholder="Texte"
                      style={{ height: "250px" }}
                      value={editFondements?.texte || ""}
                      onChange={(e) =>
                        setEditFondements({
                          ...editFondements,
                          texte: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editTexteFondement">Texte</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditFondements(null)}
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
        body={<p>Voulez-vous vraiment supprimer ce fondement ?</p>}
      />
    </Layout>
  );
};

export default Fondements;
