import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvents, setNewEvents] = useState({
    titre: "",
    description: "",
    date: "",
  });
  const [editEvents, setEditEvents] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;

  // Charger les events
  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_evenement`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (evenement) => {
    setSelectedEvents(evenement); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedEvents(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter une evenement
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/add_evenement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvents),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Effectuée !");
        fetchEvents();
        setNewEvents({ titre: "", description: "", date: "" });
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

  // Supprimer une evenement
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/delete_evenement/${selectedEvents.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }, // Headers
      });

      if (res.ok) {
        alert("Effectuée !");
        setEvents(events.filter((m) => m.id !== selectedEvents.id));
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

  // Modifier une evenement
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/update_evenement/${editEvents.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editEvents),
      });

      if (res.ok) {
        alert("Effectuée !");
        fetchEvents();
        setEditEvents(null);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formatted = date.toLocaleDateString("fr-FR", options);

    // Séparer les parties et capitaliser le mois
    const [jour, mois, annee] = formatted.split(" ");
    const moisMaj = mois.charAt(0).toUpperCase() + mois.slice(1);

    return `${jour} ${moisMaj} ${annee}`;
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
            <HeaderWithFilter title2="Events" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {events.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                events
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((evenement) => (
                    <div key={evenement.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm bg-body">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title mb-0">
                            <strong>{evenement.titre}</strong>
                          </h5>
                          <hr />
                          <span className="italic text-muted">
                            Date : {formatDate(evenement.date)}
                          </span>
                          <p className="card-text fst-italic">
                            {evenement.description.split(" ").length > 30
                              ? evenement.description
                                  .split(" ")
                                  .slice(0, 30)
                                  .join(" ") + "..."
                              : evenement.description}
                          </p>
                          <div className="text-muted text-end w-100 mt-auto">
                            <small>
                              Création :{" "}
                              {formatDateRelative(evenement.created_at)}
                            </small>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditEvents(evenement)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(evenement)}
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
                  <Modal.Title>Nouvel Evenement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="titreevenement"
                      placeholder="Titre"
                      value={newEvents.titre}
                      onChange={(e) =>
                        setNewEvents({
                          ...newEvents,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="titreevenement">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className="form-control"
                      id="dateevenement"
                      min={new Date().toISOString().split("T")[0]}
                      placeholder="date"
                      value={newEvents.date}
                      onChange={(e) =>
                        setNewEvents({
                          ...newEvents,
                          date: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="dateevenement">Date</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="texteevenement"
                      placeholder="Description de l'évènement"
                      style={{ height: "250px" }}
                      value={newEvents.description}
                      onChange={(e) =>
                        setNewEvents({
                          ...newEvents,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="texteevenement">Description</label>
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
                    disabled={!newEvents.titre || !newEvents.description}
                  >
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editEvents && (
              <Modal
                show={!!editEvents}
                onHide={() => setEditEvents(null)}
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
                      id="editTitreevenement"
                      placeholder="Titre"
                      value={editEvents?.titre || ""}
                      onChange={(e) =>
                        setEditEvents({
                          ...editEvents,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editTitreevenement">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className="form-control"
                      id="editDateevenement"
                      placeholder="date"
                      value={editEvents?.date || ""}
                      onChange={(e) =>
                        setEditEvents({
                          ...editEvents,
                          date: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editDateevenement">Date</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editTexteevenement"
                      placeholder="Description de l'évènement"
                      style={{ height: "250px" }}
                      value={editEvents?.description || ""}
                      onChange={(e) =>
                        setEditEvents({
                          ...editEvents,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editTexteevenement">Description</label>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditEvents(null)}
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
        body={<p>Voulez-vous vraiment supprimer cet évènement ?</p>}
      />
    </Layout>
  );
};

export default Events;
