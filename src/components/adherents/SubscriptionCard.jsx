import React from "react";

const SubscriptionCard = ({
  adherent,
  subscription,
  plan,
  isStudent,
  isLate,
  canPay,
  handlePay,
  formatPrice,
  getPlanPrice,
  loading,
  isProfileCompleted,
}) => {
  const buttonLabel = isStudent ? "Payer mensualité" : "Renouveler";
  const priceDisplay = `${formatPrice(getPlanPrice(plan.id))} XOF`;
  return (
    <div>
      <h6 className="text-muted text-uppercase small mb-3">Abonnement</h6>

      {isLate && (
        <div className="alert alert-danger py-2 small">Paiement en retard</div>
      )}

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
              subscription?.status === "active" ? "bg-success" : "bg-danger"
            }`}
          >
            {subscription?.status || "-"}
          </span>
        </div>
      </div>

      {/* DATE DE DÉBUT */}
      <div className="row mb-2">
        <div className="col-5 text-muted">Débuté le</div>
        <div className="col-7">
          {subscription?.starts_at
            ? new Date(subscription.starts_at).toLocaleDateString()
            : "-"}
        </div>
      </div>

      {/* FIN */}
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

      {/* NEXT PAYMENT */}
      {isStudent && subscription?.next_payment_at && (
        <div className="row mb-3">
          <div className="col-5 text-muted">Prochain paiement</div>
          <div className="col-7">
            {new Date(subscription.next_payment_at).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* PROGRESSION ETUDIANT */}
      {isStudent && subscription?.remaining_months !== null && (
        <div className="mb-3">
          <div className="small text-muted mb-1">
            {subscription.remaining_months} mensualité(s) restante(s)
          </div>

          <div className="progress" style={{ height: "6px" }}>
            <div
              className="progress-bar bg-success"
              style={{
                width: `${
                  ((plan.total_payments - subscription.remaining_months) /
                    plan.total_payments) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* DETAILS PLAN */}
      <div className="mt-3 p-3 bg-body border rounded">
        <div className="fw-semibold mb-2">📊 Détails du plan</div>

        {isStudent ? (
          <>
            <div className="row mb-1">
              <div className="col-6 text-muted">Inscription</div>
              <div className="col-6">
                {formatPrice(plan.registration_fee)} XOF
              </div>
            </div>

            <div className="row mb-1">
              <div className="col-6 text-muted">Mensualité</div>
              <div className="col-6">{formatPrice(plan.monthly_price)} XOF</div>
            </div>

            <div className="row">
              <div className="col-6 text-muted">Durée</div>
              <div className="col-6">{plan.total_payments} mois</div>
            </div>
          </>
        ) : (
          <>
            {plan?.duration && (
              <div className="row mb-1">
                <div className="col-6 text-muted">Durée</div>
                <div className="col-6">{plan.duration}</div>
              </div>
            )}

            <div className="row">
              <div className="col-6 text-muted">Facturation</div>
              <div className="col-6">
                <span className="badge bg-body text-body border text-uppercase">
                  {plan?.billing_type?.replace("_", " ")}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      {isProfileCompleted && canPay && (
        <div className="mt-4 d-grid">
          <button
            className="btn btn-primary"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Chargement...
              </>
            ) : (
              `${buttonLabel} - ${priceDisplay}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
