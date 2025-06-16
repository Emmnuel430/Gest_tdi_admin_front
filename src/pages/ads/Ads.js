import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout"; // Composant Layout qui contient la structure générale de la affiche
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter"; // Composant Layout qui contient la structure générale de la affiche
import Loader from "../../components/Layout/Loader"; // Composant pour le loader
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Composant de modal de confirmation pour la suppression d'affiche

const Ads = () => {
  // États locaux pour gérer les ads, l'état de chargement, les erreurs et les modals
  const [ads, setAds] = useState([]); // Liste des ads
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(""); // État pour les erreurs
  const [showModal, setShowModal] = useState(false); // État pour afficher ou cacher le modal de confirmation
  const [selectedAds, setSelectedAds] = useState(null); // Page sélectionné pour suppression
  const [sortOption, setSortOption] = useState(""); // État pour l'option de tri
  const [sortedAds, setSortedAds] = useState([]); // Liste des ads triés

  // Récupérer l'ID de l'affiche connecté à partir du localStorage

  // Récupérer la liste des ads lors du premier rendu
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true); // On commence par définir l'état de chargement à true
      setError(""); // Réinitialiser l'erreur

      try {
        // Requête pour récupérer la liste des ads
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/ads`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des ads.");
        }
        const data = await response.json(); // Convertir la réponse en JSON
        setAds(data); // Mettre à jour l'état ads avec les données récupérées
      } catch (err) {
        setError("Impossible de charger les données : " + err.message); // Si erreur, la définir dans l'état
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchAds(); // Appel de la fonction pour récupérer les ads
  }, []); // Dépendances vides, donc ce code est exécuté au premier rendu seulement

  // Ouvrir le modal de confirmation de suppression avec l'affiche sélectionné
  const handleOpenModal = (affiche) => {
    setSelectedAds(affiche); // On définit l'affiche sélectionné
    setShowModal(true); // On affiche le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false); // Cacher le modal
    setSelectedAds(null); // Réinitialiser l'affiche sélectionné
  };

  // Fonction pour supprimer l'affiche sélectionné
  const handleDelete = async () => {
    if (!selectedAds) return; // Si aucun affiche sélectionné, on ne fait rien

    try {
      // Requête DELETE pour supprimer l'affiche
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/ads/${selectedAds.id}`,
        {
          method: "DELETE", // Méthode de suppression
          headers: { "Content-Type": "application/json" }, // Headers
        }
      );

      const result = await response.json(); // Convertir la réponse en JSON

      // Si l'affiche a été supprimé
      if (result.status === "deleted") {
        alert("Page supprimé !"); // Afficher un message de succès
        setAds(ads.filter((ad) => ad.id !== selectedAds.id)); // Mettre à jour la liste des ads
      } else {
        alert("Échec de la suppression."); // Si l'échec
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la suppression."); // En cas d'erreur
    } finally {
      handleCloseModal(); // Fermer le modal après la suppression
    }
  };

  return (
    <Layout>
      <div className="container mt-2">
        {/* Affichage des erreurs s'il y en a */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Affichage du loader si on est en train de charger les données */}
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }} // Centrer Loader au milieu de l'écran
          >
            <Loader />
          </div>
        ) : (
          <>
            {/* Affichage de l'en-tête avec filtre et le bouton pour ajouter un affiche */}
            <HeaderWithFilter
              title="Affiches"
              link="/admin-tdi/ads/add"
              linkText="Ajouter"
              main={ads.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={ads}
              setSortedList={setSortedAds}
              alphaField="title"
              dateField="created_at"
            />
            {/* Affichage de la liste des ads dans un tableau */}
            <div className="row">
              {sortedAds.length > 0 ? (
                sortedAds
                  .sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                  )
                  .map((ad) => (
                    <div className="col-md-6 col-lg-4 mb-4" key={ad.id}>
                      <Card className="h-100 shadow border">
                        <Card.Img
                          variant="top"
                          src={`${process.env.REACT_APP_API_BASE_URL_STORAGE}/${ad.affiche_image}`}
                          alt={ad.affiche_titre}
                          style={{ height: "200px", objectFit: "cover" }}
                        />

                        <Card.Body className="d-flex flex-column justify-content-between">
                          {/* Titre */}
                          <Card.Title className="fw-bold text-primary">
                            {ad.affiche_titre}
                          </Card.Title>

                          {/* Lien s'il existe */}
                          {ad.affiche_lien ? (
                            <div className="my-2">
                              <Card.Subtitle className="text-muted small">
                                Lien : {ad.affiche_lien || "Aucun sous-titre"}
                              </Card.Subtitle>
                            </div>
                          ) : (
                            <div className="small text-muted my-2">
                              Aucun lien associé
                            </div>
                          )}

                          {/* Statut actif */}
                          <div className="mt-auto pt-2 border-top text-end">
                            <span
                              className={`badge ${
                                ad.actif ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {ad.actif ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </Card.Body>

                        <Card.Footer className="bg-body border-top d-flex justify-content-between align-items-center">
                          <Link
                            to={`/admin-tdi/ads/edit/${ad.id}`}
                            className="btn btn-sm btn-warning"
                          >
                            Modifier
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenModal(ad)}
                          >
                            Supprimer
                          </Button>
                        </Card.Footer>
                      </Card>
                    </div>
                  ))
              ) : (
                <div className="text-center mt-4">
                  <p>Aucune affiche trouvée.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmation pour la suppression d'un affiche */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer{" "}
            <strong>{selectedAds?.affiche_titre || "Inconnu"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default Ads;
