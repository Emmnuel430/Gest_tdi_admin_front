import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'utilisateur

import { Modal } from "react-bootstrap";

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [newProduit, setNewProduit] = useState({
    nom: "",
    description: "",
    prix: "",
    stock: "",
    image: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [editProduit, setEditProduit] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTimeState] = useState(Date.now()); // État pour forcer le re-rendu
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = process.env.REACT_APP_API_BASE_URL;
  const LINK = process.env.REACT_APP_API_URL;

  // Charger les produits
  const fetchProduits = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/liste_produits`);
      const data = await res.json();
      setProduits(data);
    } catch (error) {
      setError("Impossible de charger les produits : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
    const interval = setInterval(() => {
      setTimeState(Date.now()); // Met à jour l'état pour forcer un re-rendu
    }, 59000); // Intervalle de 59 secondes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ouvrir le modal de confirmation de suppression avec l'utilisateur sélectionné
  const handleOpenModal = (produit) => {
    setSelectedProduit(produit); // On définit le sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setPreviewPhoto(null);
    setShowModal(false); // Cacher le modal
    setSelectedProduit(null); // Réinitialiser l'utilisateur sélectionné
  };

  // Ajouter un produit
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("nom", newProduit.nom);
      formData.append("description", newProduit.description);
      formData.append("prix", newProduit.prix);
      formData.append("stock", newProduit.stock);
      if (newProduit.image) {
        formData.append("image", newProduit.image);
      }

      const res = await fetch(`${API}/add_produit`, {
        method: "POST",
        body: formData,
      });
      console.log(formData);

      const result = await res.json();

      if (res.ok) {
        alert("Produit ajouté !");
        fetchProduits();
        setNewProduit({
          nom: "",
          description: "",
          prix: "",
          stock: "",
          image: null,
        });
        setPreviewPhoto(null);
        setModalVisible(false);
      } else {
        alert("Erreur : " + result.message);
      }
    } catch (error) {
      setError("Erreur de connexion : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/delete_produit/${selectedProduit.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Produit supprimé !");
        setProduits(produits.filter((p) => p.id !== selectedProduit.id));
      } else {
        const data = await res.json();
        setError(data.message || "Erreur de suppression");
      }
    } catch (error) {
      setError("Erreur : " + error.message);
    } finally {
      setShowModal(false);
      setSelectedProduit(null);
      setLoading(false);
    }
  };

  // Modifier un produit
  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("nom", editProduit.nom);
      formData.append("description", editProduit.description);
      formData.append("prix", editProduit.prix);
      formData.append("stock", editProduit.stock);
      if (editProduit.image instanceof File) {
        formData.append("image", editProduit.image);
      }

      const res = await fetch(`${API}/update_produit/${editProduit.id}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Produit modifié !");
        fetchProduits();
        setEditProduit(null);
        setPreviewPhoto(null);
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
            <HeaderWithFilter title2="Produits" />

            <button
              onClick={() => setModalVisible(true)}
              className="btn btn-primary mb-3 "
            >
              + Ajouter
            </button>

            <div className="row justify-content-center">
              {produits.length === 0 ? (
                <div className="text-center">Vide pour le moment.</div>
              ) : (
                produits
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((produit) => (
                    <div key={produit.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-lg border-0 rounded-4">
                        {produit.image && (
                          <img
                            src={LINK + produit.image}
                            alt={produit.nom}
                            className="card-img-top rounded-top-4"
                            style={{ height: "240px", objectFit: "contain" }}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title fw-bold text-primary">
                            {produit.nom}
                          </h5>
                          <h6>
                            <span className="badge bg-success">
                              {Number(produit.prix).toLocaleString("fr-FR")}{" "}
                              FCFA
                            </span>
                          </h6>
                          <h6>
                            <span>
                              Restant :{" "}
                              {Number(produit.stock).toLocaleString("fr-FR")}{" "}
                            </span>
                          </h6>
                          <hr />
                          {produit.description &&
                          produit.description.trim() !== "" ? (
                            <p
                              className="card-text"
                              style={{
                                fontStyle: "italic",
                                fontSize: "0.95rem",
                              }}
                            >
                              {produit.description.length > 160
                                ? produit.description.substring(0, 160) + "..."
                                : produit.description}
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
                        </div>
                        <div className="card-footer d-flex justify-content-end gap-2 bg-body">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditProduit(produit)}
                          >
                            Éditer
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleOpenModal(produit)}
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
                  <Modal.Title>Nouveau produit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nom"
                      placeholder="Nom du produit"
                      value={newProduit.nom}
                      onChange={(e) =>
                        setNewProduit({ ...newProduit, nom: e.target.value })
                      }
                    />
                    <label htmlFor="nom">Nom du produit</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="prix"
                      placeholder="Prix"
                      value={newProduit.prix}
                      onChange={(e) =>
                        setNewProduit({ ...newProduit, prix: e.target.value })
                      }
                    />
                    <label htmlFor="prix">Prix (FCFA)</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="stock"
                      placeholder="Quantité"
                      value={newProduit.stock}
                      onChange={(e) =>
                        setNewProduit({
                          ...newProduit,
                          stock: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="stock">Quantité en stock</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="description"
                      placeholder="Description"
                      style={{ height: "200px" }}
                      value={newProduit.description}
                      onChange={(e) =>
                        setNewProduit({
                          ...newProduit,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="description">Description</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">image du produit</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNewProduit({ ...newProduit, image: file });

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
                      !newProduit.nom || !newProduit.prix || !newProduit.stock
                    }
                  >
                    Enregistrer
                  </button>
                </Modal.Footer>
              </Modal>
            )}

            {/* Modal d'édition */}
            {editProduit && (
              <Modal
                show={!!editProduit}
                onHide={() => setEditProduit(null)}
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
                      value={editProduit?.nom || ""}
                      onChange={(e) =>
                        setEditProduit({ ...editProduit, nom: e.target.value })
                      }
                    />
                    <label htmlFor="editNom">Nom</label>
                  </div>

                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="editDescription"
                      placeholder="Description"
                      style={{ height: "150px" }}
                      value={editProduit?.description || ""}
                      onChange={(e) =>
                        setEditProduit({
                          ...editProduit,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                    <label htmlFor="editDescription">Description</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="editPrix"
                      placeholder="Prix"
                      value={editProduit?.prix || ""}
                      onChange={(e) =>
                        setEditProduit({ ...editProduit, prix: e.target.value })
                      }
                    />
                    <label htmlFor="editPrix">Prix</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="editStock"
                      placeholder="Stock"
                      value={editProduit?.stock || ""}
                      onChange={(e) =>
                        setEditProduit({
                          ...editProduit,
                          stock: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="editStock">Stock</label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setEditProduit({ ...editProduit, image: file });

                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setPreviewPhoto(reader.result);
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
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewPhoto(null);
                            setEditProduit({ ...editProduit, image: null });
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
                    onClick={() => setEditProduit(null)}
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
        body={<p>Voulez-vous vraiment supprimer ce produit ?</p>}
      />
    </Layout>
  );
};

export default Produits;
