import React, { useState } from "react";
// import { fetchWithToken } from "../../utils/fetchWithToken2";
// import Loader from "../../components/Layout/Loader";
import Layout from "../../components/Layout/LayoutAdherent";
import { useEffect } from "react";

const ProfilAdherent = () => {
  const [adherent, setAdherent] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");

  useEffect(() => {
    const storedAdherent = localStorage.getItem("adherent-info");
    if (storedAdherent) {
      setAdherent(JSON.parse(storedAdherent));
    }
  }, []);
  // const id = storedAdherent ? storedAdherent.id : null;

  // useEffect(() => {
  //   const fetchAdherent = async () => {
  //     try {
  //       const response = await fetchWithToken(
  //         `${process.env.REACT_APP_API_BASE_URL}/adherents-public/${id}`,
  //         { method: "GET" }
  //       );
  //       if (!response.ok) throw new Error("Échec de la récupération");

  //       const data = await response.json();
  //       setAdherent(data.data);
  //     } catch (error) {
  //       console.error("Erreur :", error);
  //       setError("Erreur lors de la récupération du profil.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) fetchAdherent();
  // }, [id]);

  if (!adherent) {
    return (
      <Layout>
        <div className="container my-4 text-center">
          Chargement du profil...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* {error && <div className="alert alert-danger">{error}</div>} */}

      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary-subtle text-white text-center py-3">
                <h4 className="mb-0">Mon Profil</h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong>Nom :</strong> {adherent.nom}
                </div>
                <div className="mb-3">
                  <strong>Prénom :</strong> {adherent.prenom}
                </div>
                <div className="mb-3">
                  <strong>Email :</strong> {adherent.email}
                </div>
                <div className="mb-3">
                  <strong>Contact :</strong> {adherent.contact || "Non fourni"}
                </div>
                {/* <div className="mb-3">
                    <strong>Pseudo :</strong> {adherent.pseudo}
                  </div> */}
                <div className="mb-3">
                  <strong>Statut :</strong>{" "}
                  <span className="badge bg-success text-uppercase">
                    {adherent.statut === "standard" ? "Externe" : "Premium"}
                  </span>
                </div>
                <div className="mb-3">
                  <strong>Abonnement :</strong>{" "}
                  <span className="badge bg-info text-dark text-uppercase">
                    {adherent.abonnement_type}
                  </span>
                </div>
                <div className="mb-3">
                  <strong>Expire le :</strong>{" "}
                  {adherent.abonnement_expires_at
                    ? new Date(
                        adherent.abonnement_expires_at
                      ).toLocaleDateString()
                    : "Non défini"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilAdherent;
