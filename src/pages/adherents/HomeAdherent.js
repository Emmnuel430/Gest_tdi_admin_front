import React from "react";
import Layout from "../../components/Layout/LayoutAdherent";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const HomeAdherent = () => {
  const { adherent } = useAuth();
  const { isDarkMode } = useTheme();
  return (
    <div>
      <Layout>
        <div className="container py-4">
          {/* HEADER */}
          <div className="mb-4">
            <h2 className="fw-bold">Bonjour {adherent?.prenom} 👋</h2>
            <p className="text-muted mb-0">Bienvenue sur votre espace membre</p>
          </div>

          <div className="row g-4">
            {/* PROFIL */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3">👤 Profil</h6>

                  <p className="mb-1">
                    <strong>Nom :</strong> {adherent?.nom} {adherent?.prenom}{" "}
                    {adherent?.pseudo && "(" + adherent?.pseudo + ")"}
                  </p>
                  <p className="mb-1">
                    <strong>Email :</strong> {adherent?.email}
                  </p>

                  <span className="badge bg-success mt-2">Compte Actif</span>
                </div>
              </div>
            </div>

            {/* ABONNEMENT */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3">
                    💳 Abonnement
                  </h6>

                  <p className="mb-2">
                    <strong>Plan :</strong>{" "}
                    <span className="badge bg-primary">
                      {adherent?.subscription?.plan?.name}
                    </span>
                  </p>

                  <p className="mb-2">
                    <strong>Type :</strong>{" "}
                    <span
                      className={`badge ${isDarkMode ? "bg-info-subtle border border-info" : "bg-info"} text-body border small text-uppercase`}
                    >
                      {adherent?.subscription?.plan?.billing_type.replace(
                        "_",
                        " ",
                      )}{" "}
                    </span>
                  </p>

                  <p className="mb-0">
                    <strong>Statut :</strong>{" "}
                    <span
                      className={`text-capitalize badge ${
                        adherent?.subscription?.status === "active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {adherent?.subscription?.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ACCÈS */}
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3">🎯 Accès</h6>

                  {!adherent?.subscription?.plan?.advantages ? (
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        🎓 <strong>Formations</strong>
                        <div className="text-muted small">
                          Vidéos, documents et modules guidés
                        </div>
                      </li>

                      <li>
                        🧾 <strong>Suivi</strong>
                        <div className="text-muted small">
                          Gestion de votre abonnement et notifications
                        </div>
                      </li>
                    </ul>
                  ) : (
                    <ul className="mt-2 ps-3 small">
                      {adherent?.subscription?.plan?.advantages.map(
                        (adv, i) => (
                          <li key={i}>{adv}</li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="alert alert-light border mt-4">
            Utilisez le menu pour naviguer dans votre espace. Profitez
            pleinement de votre expérience sur <strong>Gest</strong> 🤝
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default HomeAdherent;
