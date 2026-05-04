import React, { useState } from "react";
// import Loader from "../../components/Layout/Loader";
import Layout from "../../components/Layout/LayoutAdherent";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/useful";
import SubscriptionCard from "../../components/adherents/SubscriptionCard";

const ProfilAdherent = () => {
  const navigate = useNavigate();
  const { adherent } = useAuth();

  const isProfileCompleted =
    adherent?.profile_completed === true ||
    adherent?.profile_completed === "true";

  const subscription = adherent?.subscription;
  const plan = subscription?.plan;
  const isStudent = plan?.is_student_plan === "true";
  const isLate =
    subscription?.next_payment_at &&
    new Date(subscription.next_payment_at) < new Date();

  const [loading, setLoading] = useState(false);

  const getPaymentStep = () => {
    if (!subscription) return "registration";

    if (isStudent) {
      if (subscription.remaining_months > 0) {
        return "installment";
      }
      return null; // plus rien à payer
    }

    return "monthly";
  };

  const getPlanPrice = (planId) => {
    if (!plan) return 0;

    if (plan.billing_type === "monthly") return plan.price;

    if (plan.billing_type === "one_time") return plan.price;

    if (plan.billing_type === "hybrid") {
      if (subscription.remaining_months > 0) {
        return plan.monthly_price;
      }
      return plan.registration_fee; // premier paiement
    }

    return 0;
  };

  const paymentStep = getPaymentStep();

  const canPay =
    subscription && subscription.status !== "completed" && paymentStep !== null;

  const handlePay = async () => {
    setLoading(true);

    try {
      if (!paymentStep) {
        alert("Aucun paiement nécessaire");
        return;
      }

      const payload = {
        nom: adherent.nom,
        prenom: adherent.prenom,
        email: adherent.email,
        numero: adherent.contact,
        password: "null",

        subscription_plan_id: plan.id,

        totalPrice: getPlanPrice(plan.id),
        type: "subscription",

        payment_step: paymentStep,
        payment_index: null,
        callback_url: window.location.origin + "/payment/callback",
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/payments/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur paiement");
      }

      // redirection Paystack
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                <SubscriptionCard
                  adherent={adherent}
                  subscription={subscription}
                  plan={plan}
                  isStudent={isStudent}
                  isLate={isLate}
                  canPay={canPay}
                  handlePay={handlePay}
                  formatPrice={formatPrice}
                  getPlanPrice={getPlanPrice}
                  loading={loading}
                  isProfileCompleted={isProfileCompleted}
                />
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
