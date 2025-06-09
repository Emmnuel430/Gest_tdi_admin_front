import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur

import { Modal } from "react-bootstrap";

const Conseillers = () => {
  const [conseillers, setConseillers] = useState([]);
  const [newConseillers, setNewConseillers] = useState({
    nom: "",
    prenom: "",
    description: "",
    role: "",
    photo: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [editConseillers, setEditConseillers] = useState(null);
  const [selectedConseillers, setSelectedConseillers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu

  const API = process.env.REACT_APP_API_BASE_URL;
  const LINK = process.env.REACT_APP_API_URL;

  // Charger les conseillers
  const fetchConseillers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_conseiller`);
      const data = await res.json();
      setConseillers(data);
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchConseillers();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (conseiller) => {
    setSelectedConseillers(conseiller); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setPreviewPhoto(null);
    setShowModal(false); // Cacher le modal
    setSelectedConseillers(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter une conseiller
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("nom", newConseillers.nom);
      formData.append("prenom", newConseillers.prenom);
      formData.append("role", newConseillers.role);
      formData.append("description", newConseillers.description);
      if (newConseillers.photo) {
        formData.append("photo", newConseillers.photo);
      }

      const res = await fetch(`${API}/add_conseiller`, {
        method: "POST",
        body: formData, // Pas besoin d'ajouter de header, sinon ça casse le boundary
      });

      const result = await res.json();

      if (res.ok) {
        alert("Effectuée !");
        fetchConseillers();
        setNewConseillers({
          nom: "",
          prenom: "",
          photo: null,
          role: "",
          description: "",
        });
        setPreviewPhoto(null);
        setModalVisible(false);
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      setError("Impossible de charger les données : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une conseiller
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${API}/delete_conseiller/${selectedConseillers.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }, // Headers
        }
      );

      if (res.ok) {
        alert("Effectuée !");
        setConseillers(
          conseillers.filter((m) => m.id !== selectedConseillers.id)
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

  // Modifier une conseiller
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("nom", editConseillers.nom);
      formData.append("prenom", editConseillers.prenom);
      formData.append("role", editConseillers.role);
      formData.append("description", editConseillers.description);

      // Si une nouvelle photo a été sélectionnée
      if (editConseillers.photo instanceof File) {
        formData.append("photo", editConseillers.photo);
      }

      const res = await fetch(
        `${API}/update_conseiller/${editConseillers.id}`,
        {
          method: "POST",
          body: formData, // Ne pas mettre de headers ici
        }
      );

      const result = await res.json();

      if (res.ok) {
        alert("Mise à jour effectuée !");
        fetchConseillers();
        setPreviewPhoto(null);
        setEditConseillers(null);
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      setError("Erreur de connexion : " + error.message);
    } finally {
      setLoading(false);
    }
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
            <HeaderWithFilter title2="Conseillers" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {conseillers.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                conseillers
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((conseiller) => (
                    <div key={conseiller.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-lg border-0 rounded-4">
                        {conseiller.photo && (
                          <img
                            src={LINK + conseiller.photo}
                            alt={`${conseiller.nom} ${conseiller.prenom}`}
                            className="card-img-top rounded-top-4"
                            style={{ height: "240px", objectFit: "contain" }}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title fw-bold text-primary">
                            {conseiller.nom} {conseiller.prenom}
                          </h5>
                          <h6 className="text-muted">- {conseiller.role}</h6>
                          <hr />
                          {conseiller.description &&
                          conseiller.description.trim() !== "" ? (
                            <p
                              className="card-text"
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.95rem",
                              }}
                            >
                              {conseiller.description.length > 160
                                ? conseiller.description.substring(0, 160) +
                                  "..."
                                : conseiller.description}
                            </p>
                          ) : (
                            <p
                              className="card-text text-muted"
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.95rem",
                              }}
                            >
                              Aucune description fournie
                            </p>
                          )}

                          {/* <div className="mt-auto text-end">
                            <small className="text-muted">
                              Créé le :{" "}
                              {formatDateRelative(conseiller.created_at)}
                            </small>
                          </div> */}
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditConseillers(conseiller)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(conseiller)}
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
                  <Modal.Title>Nouveau Conseiller</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nom"
                      placeholder="Nom"
                      value={newConseillers.nom}
                      onChange={(e) =>
                        setNewConseillers({
                          ...newConseillers,
                          nom: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="nom">Nom</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="prenom"
                      placeholder="Prénom"
                      value={newConseillers.prenom}
                      onChange={(e) =>
                        setNewConseillers({
                          ...newConseillers,
                          prenom: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="prenom">Prénom</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      placeholder="Rôle"
                      value={newConseillers.role}
                      onChange={(e) =>
                        setNewConseillers({
                          ...newConseillers,
                          role: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="role">Rôle</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="description"
                      placeholder="Description"
                      style={{ height: "250px" }}
                      value={newConseillers.description}
                      onChange={(e) =>
                        setNewConseillers({
                          ...newConseillers,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="description">Description</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNewConseillers({ ...newConseillers, photo: file });

                        // pour la preview
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewPhoto(reader.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setPreviewPhoto(null);
                        }
                      }}
                    />
                  </div>

                  {previewPhoto && (
                    <div className="mb-4 text-center">
                      <h6 className="text-muted mb-2">Aperçu</h6>
                      <div
                        style={{
                          display: "inline-block",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          transition: "transform 0.3s ease",
                        }}
                        className="hover-scale"
                      >
                        <img
                          src={previewPhoto}
                          alt="Aperçu"
                          className="w-100 h-100"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                            borderRadius: "12px",
                          }}
                        />
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
                    onClick={handleAdd}
                    disabled={
                      !newConseillers.nom ||
                      !newConseillers.prenom ||
                      !newConseillers.role
                    }
                  >
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editConseillers && (
              <Modal
                show={!!editConseillers}
                onHide={() => setEditConseillers(null)}
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
                      value={editConseillers?.nom || ""}
                      onChange={(e) =>
                        setEditConseillers({
                          ...editConseillers,
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
                      id="editPrenom"
                      placeholder="Prénom"
                      value={editConseillers?.prenom || ""}
                      onChange={(e) =>
                        setEditConseillers({
                          ...editConseillers,
                          prenom: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editPrenom">Prénom</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="editRole"
                      placeholder="Rôle"
                      value={editConseillers?.role || ""}
                      onChange={(e) =>
                        setEditConseillers({
                          ...editConseillers,
                          role: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editRole">Rôle</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editDescription"
                      placeholder="Description"
                      style={{ height: "250px" }}
                      value={editConseillers?.description || ""}
                      onChange={(e) =>
                        setEditConseillers({
                          ...editConseillers,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editDescription">Description</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setEditConseillers({ ...editConseillers, photo: file });

                        // Aperçu
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewPhoto(reader.result);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setPreviewPhoto(null);
                        }
                      }}
                    />
                  </div>

                  {previewPhoto && (
                    <div className="mb-4 text-center">
                      <h6 className="text-muted mb-2">Aperçu</h6>
                      <div
                        style={{
                          display: "inline-block",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          transition: "transform 0.3s ease",
                          position: "relative",
                        }}
                        className="hover-scale"
                      >
                        <img
                          src={previewPhoto}
                          alt="Aperçu"
                          className="w-100 h-100"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                            borderRadius: "12px",
                          }}
                        />

                        {/* Bouton pour supprimer */}
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewPhoto(null);
                            setEditConseillers({
                              ...editConseillers,
                              photo: null,
                            });
                          }}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            fontSize: "1.2rem",
                            cursor: "pointer",
                          }}
                          title="Supprimer l’aperçu"
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
                    onClick={() => setEditConseillers(null)}
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
        body={<p>Voulez-vous vraiment supprimer ce conseiller ?</p>}
      />
    </Layout>
  );
};

export default Conseillers;
