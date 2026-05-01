import React from "react";
import { format } from "date-fns";

const AdhModalComponent = ({ selectedAdherent }) => {
  return (
    <>
      <div className="container py-2">
        {/* ================= INFOS UTILISATEUR ================= */}
        <div className="mb-4">
          <h6 className="fw-bold border-bottom pb-2 mb-3">Infos utilisateur</h6>

          <div className="row mb-2">
            <div className="col-5 text-muted">Nom</div>
            <div className="col-7 fw-semibold text-uppercase">
              {selectedAdherent.nom}
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-5 text-muted">Prénom</div>
            <div className="col-7 fw-semibold text-capitalize">
              {selectedAdherent.prenom}
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-5 text-muted">Email</div>
            <div className="col-7 text-break">{selectedAdherent.email}</div>
          </div>

          <div className="row mb-2">
            <div className="col-5 text-muted">Contact</div>
            <div className="col-7">{selectedAdherent.contact}</div>
          </div>
        </div>

        {/* ================= STATUT GLOBAL ================= */}
        <div className="mb-4">
          <h6 className="fw-bold border-bottom pb-2 mb-3">Statut global</h6>

          <div className="row mb-2">
            <div className="col-5 text-muted">Abonnement</div>
            <div className="col-7">
              {selectedAdherent.active_subscription ? (
                <span className="badge bg-success">Actif</span>
              ) : (
                <span className="badge bg-secondary">Aucun</span>
              )}
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-5 text-muted">Statut du compte</div>
            <div className="col-7">
              {selectedAdherent.is_active ? (
                <span className="badge bg-success">Activé</span>
              ) : (
                <span className="badge bg-danger text-dark">Desactivé</span>
              )}
            </div>
          </div>
        </div>

        {/* ================= ABONNEMENT ================= */}
        {selectedAdherent.active_subscription && (
          <div className="mb-3">
            <h6 className="fw-bold border-bottom pb-2 mb-3">Abonnement</h6>

            {(() => {
              const sub = selectedAdherent?.active_subscription;
              const plan = sub?.plan;

              const transactions = sub?.transactions || [];

              const isStudent = plan?.is_student_plan;

              // paiement inscription
              const hasRegistration = transactions.some(
                (t) => t.payment_step === "registration",
              );

              // mensualités payées
              const paidMonths = transactions
                .filter((t) => t.payment_step === "monthly")
                .map((t) => t.payment_index);

              return (
                <>
                  {/* PLAN */}
                  <div className="row mb-2">
                    <div className="col-5 text-muted">Plan</div>
                    <div className="col-7 fw-semibold">{plan?.name || "-"}</div>
                  </div>

                  {/* DATES */}
                  <div className="row mb-2">
                    <div className="col-5 text-muted">Début</div>
                    <div className="col-7">
                      {sub.starts_at
                        ? format(new Date(sub.starts_at), "dd/MM/yyyy")
                        : "-"}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-5 text-muted">
                      {isStudent ? "Fin" : "Renouvelement le"}
                    </div>
                    <div className="col-7">
                      {sub.ends_at
                        ? format(new Date(sub.ends_at), "dd/MM/yyyy")
                        : "-"}
                    </div>
                  </div>

                  {/* MOIS RESTANTS */}
                  {sub.remaining_months && isStudent && (
                    <div className="row my-3">
                      <div className="col-5 text-muted">
                        <span>Progression des paiements</span>
                        {/* Infos restantes */}
                        {sub.remaining_months && (
                          <div className="small text-muted">
                            {sub.remaining_months} mensualité(s) restante(s)
                          </div>
                        )}
                      </div>

                      <div className="col-7">
                        <div className="d-flex flex-wrap gap-2">
                          {/* Inscription */}
                          <span
                            className={`badge ${
                              hasRegistration
                                ? "bg-success"
                                : "bg-light text-dark border"
                            }`}
                          >
                            Inscription
                          </span>

                          {/* Mensualités */}
                          {[...Array(plan.total_payments || 0)].map((_, i) => {
                            const index = i + 1;
                            const isPaid = paidMonths.includes(index);

                            return (
                              <span
                                key={index}
                                className={`badge ${
                                  isPaid
                                    ? "bg-success"
                                    : "bg-body text-body border"
                                }`}
                              >
                                M{index}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= CAS ETUDIANT ================= */}
                  <div className="mt-3 p-3 bg-body border rounded">
                    <div className="fw-semibold mb-2">
                      Rappel abonnement "{plan.name}"
                    </div>

                    {isStudent ? (
                      <>
                        <div className="row mb-1">
                          <div className="col-6 text-muted">Inscription</div>
                          <div className="col-6">
                            {plan.registration_fee} XOF
                          </div>
                        </div>

                        <div className="row mb-1">
                          <div className="col-6 text-muted">Mensualité</div>
                          <div className="col-6">{plan.monthly_price} XOF</div>
                        </div>

                        <div className="row">
                          <div className="col-6 text-muted">Durée</div>
                          <div className="col-6">
                            {plan.total_payments} mois
                          </div>
                        </div>
                      </>
                    ) : (
                      /* ================= CAS NORMAL ================= */
                      <>
                        <div className="row mb-1">
                          <div className="col-6 text-muted">Prix</div>
                          <div className="col-6">
                            {plan?.price ? `${plan.price} XOF` : "-"}
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-6 text-muted">Facturation</div>
                          <div className="col-6 text-capitalize">
                            {plan?.billing_type || "-"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default AdhModalComponent;
