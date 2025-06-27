import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../../utils/fetchWithToken2";
import Layout from "../../components/Layout/LayoutAdherent";
import Loader from "../../components/Layout/Loader";

const FormationsAdherents = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/adherent/contents?type=formation`
        );

        if (!response.ok)
          throw new Error("Erreur lors du chargement des formations");

        const data = await response.json();
        setFormations(data);
      } catch (err) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  //   if (loading) return <p>Chargement...</p>;
  //   if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Layout>
      <div className="container mt-2">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <div>
            <h2 className="mb-4">Vos formations disponibles</h2>

            {formations.length === 0 ? (
              <div className="alert alert-warning">
                Aucun contenu disponible pour votre niveau.
              </div>
            ) : (
              <div className="row">
                {formations.map((item) => (
                  <div key={item.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 border shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title d-flex justify-content-between align-items-center">
                          {item.title}
                          <span className="badge bg-secondary text-capitalize">
                            {item.type}
                          </span>
                        </h5>

                        <p
                          className="card-text text-muted small mb-2"
                          style={{ minHeight: "60px" }}
                        >
                          {item.content?.length > 100
                            ? item.content.slice(0, 100) + "..."
                            : item.content}
                        </p>

                        <div className="mt-auto">
                          {item.lien ? (
                            <a
                              href={item.lien}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary w-100"
                            >
                              <i className="fas fa-external-link-alt me-2"></i>
                              Accéder au contenu
                            </a>
                          ) : (
                            <span className="text-muted small fst-italic">
                              Pas de lien disponible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FormationsAdherents;
