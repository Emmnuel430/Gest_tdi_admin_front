import React from "react";
// import Loader from "../../components/Layout/Loader";
import Layout from "../../components/Layout/LayoutAdherent";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilAdherent = () => {
  const { adherent } = useAuth();
  const navigate = useNavigate();
  const isProfileCompleted = adherent?.profile_completed === "true";
  const subscription = adherent?.subscription;
  const plan = subscription?.plan;
  const isStudent = plan?.is_student_plan === "true";

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
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-sm border p-2">
              {/* HEADER */}
              <div className="card-header bg-body border border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">👤 Mon Profil</h5>

                {/* CTA */}
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => navigate("/adherent/validate")}
                >
                  {isProfileCompleted
                    ? "Modifier mes infos"
                    : "Compléter le profil"}
                </button>
              </div>

              <div className="card-body">
                {/* INFO PRINCIPALE */}
                <div className="mb-4">
                  <h6 className="text-muted text-uppercase small mb-3">
                    Informations personnelles
                  </h6>

                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Nom</span>
                    <span className="fw-medium">{adherent.nom}</span>
                  </div>

                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Prénom</span>
                    <span className="fw-medium">{adherent.prenom}</span>
                  </div>

                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Email</span>
                    <span className="fw-medium">{adherent.email}</span>
                  </div>

                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Contact</span>
                    <span className="fw-medium">
                      {adherent.contact || (
                        <span className="text-danger small">Non fourni</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* ABONNEMENT */}
                <div>
                  <h6 className="text-muted text-uppercase small mb-3">
                    Abonnement
                  </h6>

                  {/* INFOS PRINCIPALES */}
                  <div className="row mb-2">
                    <div className="col-5 text-muted">Plan</div>
                    <div className="col-7 fw-semibold">{plan?.name || "-"}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-5 text-muted">Statut</div>
                    <div className="col-7">
                      <span
                        className={`badge text-uppercase ${
                          subscription?.status === "active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {subscription?.status || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-5 text-muted">
                      {isStudent ? "Fin" : "Expire le"}
                    </div>
                    <div className="col-7">
                      {subscription?.expires_at
                        ? new Date(subscription.expires_at).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>

                  {/* CAS ETUDIANT : PROGRESSION */}
                  {isStudent && subscription?.remaining_months !== null && (
                    <div className="mb-3">
                      <div className="small text-muted mb-1">
                        {subscription.remaining_months} mensualité(s)
                        restante(s)
                      </div>

                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${
                              ((plan.total_payments -
                                subscription.remaining_months) /
                                plan.total_payments) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* RÉSUMÉ PLAN */}
                  <div className="mt-3 p-3 bg-body border rounded">
                    <div className="fw-semibold mb-2">📊 Détails du plan</div>

                    {isStudent ? (
                      <>
                        <div className="row mb-1">
                          <div className="col-6 text-muted">Inscription</div>
                          <div className="col-6">
                            {plan.registration_fee || "-"} XOF
                          </div>
                        </div>

                        <div className="row mb-1">
                          <div className="col-6 text-muted">Mensualité</div>
                          <div className="col-6">
                            {plan.monthly_price || "-"} XOF
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6 text-muted">Durée</div>
                          <div className="col-6">
                            {plan.total_payments || "-"} mois
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {plan?.duration && (
                          <div className="row mb-1">
                            <div className="col-6 text-muted">Durée</div>
                            <div className="col-6">{plan?.duration || "-"}</div>
                          </div>
                        )}

                        <div className="row">
                          <div className="col-6 text-muted">Facturation</div>
                          <div className="col-6">
                            <span className="badge bg-body text-body border text-uppercase">
                              {plan?.billing_type?.replace("_", " ") || "-"}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* FOOTER UX */}
              {!isProfileCompleted && (
                <div className="card-footer bg-body border border-warning text-center">
                  <small className="text-muted">
                    ⚠️ Complétez votre profil pour une meilleure expérience
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilAdherent;
