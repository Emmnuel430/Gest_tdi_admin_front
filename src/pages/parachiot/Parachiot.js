import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Modal } from "react-bootstrap";

const Parachiot = () => {
  const [parachiotList, setParachiotList] = useState([]);

  const [newParacha, setNewParacha] = useState({
    titre: "",
    resume: "",
    contenu: "",
    date_lecture: "",
    fichier: null,
  });

  const [previewFileName, setPreviewFileName] = useState(null);

  const [editParacha, setEditParacha] = useState(null);
  const [selectedParacha, setSelectedParacha] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;
  const LINK = process.env.REACT_APP_API_URL;

  // Charger les conseillers
  const fetchParachiot = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_paracha`);
      const data = await res.json();
      setParachiotList(data);
      setPreviewFileName(null);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParachiot();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (paracha) => {
    setSelectedParacha(paracha); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
    setPreviewFileName(null);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedParacha(null); // Réinitialiser l'utilisateur sélectionné
    setPreviewFileName(null);
  };

  // Ajouter une paracha
  const handleAddParacha = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("titre", newParacha.titre);
      formData.append("resume", newParacha.resume);
      formData.append("contenu", newParacha.contenu);
      formData.append("date_lecture", newParacha.date_lecture);
      if (newParacha.fichier) {
        formData.append("fichier", newParacha.fichier);
      }

      const res = await fetch(`${API}/add_paracha`, {
        method: "POST",
        body: formData, // Pas de headers pour FormData
      });

      const result = await res.json();

      if (res.ok) {
        alert("Paracha ajoutée !");
        fetchParachiot();
        setNewParacha({
          titre: "",
          resume: "",
          contenu: "",
          date_lecture: "",
          fichier: null,
        });
        setModalVisible(false);
        setPreviewFileName(null);
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une paracha
  const handleDeleteParacha = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/delete_paracha/${selectedParacha.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Paracha supprimée !");
        setParachiotList(
          parachiotList.filter((p) => p.id !== selectedParacha.id)
        );
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

  // Modifier une paracha
  const handleUpdateParacha = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("titre", editParacha.titre);
      formData.append("resume", editParacha.resume);
      formData.append("contenu", editParacha.contenu);
      formData.append("date_lecture", editParacha.date_lecture);

      // Si un nouveau fichier a été sélectionné
      if (editParacha.fichier instanceof File) {
        formData.append("fichier", editParacha.fichier);
      }

      const res = await fetch(`${API}/update_paracha/${editParacha.id}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Mise à jour effectuée !");
        fetchParachiot();
        setEditParacha(null);
        setPreviewFileName(null);
      } else {
        alert("Erreur : " + result.message);
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
            <HeaderWithFilter title2="Parachiot" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {parachiotList.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                parachiotList
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((paracha) => (
                    <div key={paracha.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm bg-body">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title mb-0">• {paracha.titre}</h5>
                          <h6 className="text-muted">
                            Lecture prévue le :{" "}
                            {new Date(
                              paracha.date_lecture
                            ).toLocaleDateString()}
                          </h6>
                          <hr />
                          <p className="card-text">
                            {paracha.contenu.split(" ").length > 30
                              ? paracha.contenu
                                  .split(" ")
                                  .slice(0, 30)
                                  .join(" ") + "..."
                              : paracha.contenu}
                          </p>
                          {paracha.resume && paracha.resume.trim() !== "" ? (
                            <p
                              className="card-text"
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.95rem",
                              }}
                            >
                              Résumé :{" "}
                              {paracha.resume.length > 40
                                ? paracha.resume.substring(0, 40) + "..."
                                : paracha.resume}
                            </p>
                          ) : (
                            <p
                              className="card-text text-muted"
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.95rem",
                              }}
                            >
                              Aucun résumé fourni
                            </p>
                          )}

                          {paracha.fichier && (
                            <div className="mt-auto">
                              {/\.(mp4|mov|avi)$/i.test(paracha.fichier) ? (
                                <video
                                  controls
                                  src={LINK + paracha.fichier}
                                  style={{
                                    width: "100%",
                                    maxHeight: "300px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  Votre navigateur ne prend pas en charge la
                                  vidéo.
                                </video>
                              ) : (
                                <div className="text-end w-100">
                                  <a
                                    href={LINK + paracha.fichier}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm"
                                    style={{ alignSelf: "flex-start" }}
                                  >
                                    📄 Voir le fichier
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="text-muted mt-auto text-end w-100">
                            <small>
                              Création :{" "}
                              {formatDateRelative(paracha.created_at)}
                            </small>
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditParacha(paracha)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(paracha)}
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
                  <Modal.Title>Nouveau Paracha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="titre"
                      placeholder="Titre"
                      value={newParacha.titre}
                      onChange={(e) =>
                        setNewParacha({
                          ...newParacha,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="titre">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]}
                      id="date_lecture"
                      placeholder="Date de lecture"
                      value={newParacha.date_lecture}
                      onChange={(e) =>
                        setNewParacha({
                          ...newParacha,
                          date_lecture: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="date_lecture">Date de lecture</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="contenu"
                      placeholder="Contenu"
                      style={{ height: "250px" }}
                      value={newParacha.contenu}
                      onChange={(e) =>
                        setNewParacha({
                          ...newParacha,
                          contenu: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="contenu">Contenu</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="resume"
                      placeholder="Résumé"
                      style={{ height: "150px" }}
                      value={newParacha.resume}
                      onChange={(e) =>
                        setNewParacha({
                          ...newParacha,
                          resume: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="resume">Résumé</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fichier (PDF, DOC...)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.mp4,.mov,.avi"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNewParacha({ ...newParacha, fichier: file });

                        // Afficher le nom du fichier sélectionné
                        if (file) {
                          setPreviewFileName(file.name);
                        } else {
                          setPreviewFileName(null);
                        }
                      }}
                    />
                  </div>

                  {previewFileName && (
                    <div className="mb-4 text-center">
                      <h6 className="text-muted mb-2">Fichier sélectionné</h6>
                      <div
                        className="border"
                        style={{
                          display: "inline-block",
                          padding: "10px 15px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          fontWeight: "500",
                          userSelect: "none",
                        }}
                      >
                        {previewFileName}
                      </div>
                    </div>
                  )}
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
                    onClick={handleAddParacha}
                    disabled={
                      !newParacha.titre ||
                      !newParacha.contenu ||
                      !newParacha.date_lecture
                    }
                  >
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editParacha && (
              <Modal
                show={!!editParacha}
                onHide={() => setEditParacha(null)}
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
                      id="editTitre"
                      placeholder="Titre"
                      value={editParacha?.titre || ""}
                      onChange={(e) =>
                        setEditParacha({
                          ...editParacha,
                          titre: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editTitre">Titre</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="date"
                      className="form-control"
                      min={new Date().toISOString().split("T")[0]}
                      id="editDateLecture"
                      placeholder="Date de lecture"
                      value={editParacha?.date_lecture || ""}
                      onChange={(e) =>
                        setEditParacha({
                          ...editParacha,
                          date_lecture: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editDateLecture">Date de lecture</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editResume"
                      placeholder="Résumé"
                      style={{ height: "250px" }}
                      value={editParacha?.resume || ""}
                      onChange={(e) =>
                        setEditParacha({
                          ...editParacha,
                          resume: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editResume">Résumé</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fichier (PDF, DOC...)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.mp4,.mov,.avi"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setEditParacha({ ...editParacha, fichier: file });

                        if (file) {
                          setPreviewFileName(file.name);
                        } else {
                          setPreviewFileName(null);
                        }
                      }}
                    />
                  </div>

                  {previewFileName && (
                    <div
                      className="mb-4 text-center"
                      style={{ position: "relative" }}
                    >
                      <h6 className="text-muted mb-2">Fichier sélectionné</h6>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "10px 15px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          fontWeight: "500",
                          userSelect: "none",
                          position: "relative",
                        }}
                        className="hover-scale"
                      >
                        {previewFileName}
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFileName(null);
                            setEditParacha({
                              ...editParacha,
                              fichier: null,
                            });
                          }}
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            lineHeight: "20px",
                          }}
                          title="Supprimer le fichier"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  )}
                </Modal.Body>

                <Modal.Footer>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditParacha(null)}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleUpdateParacha}
                  >
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
        onConfirm={handleDeleteParacha}
        title="Confirmer la suppression"
        body={<p>Voulez-vous vraiment supprimer ce paracha ?</p>}
      />
    </Layout>
  );
};

export default Parachiot;
