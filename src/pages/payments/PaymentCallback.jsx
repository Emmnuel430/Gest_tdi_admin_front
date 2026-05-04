import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/LayoutAdherent";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, failed, error

  const verifyPayment = async () => {
    const reference = searchParams.get("reference");
    if (!reference) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/payments/verify/${reference}`,
      );
      if (!res.ok) {
        setStatus("failed");
        return;
      }
      setStatus("success");
      // Redirection vers la page success du back-office après 1.5s
      setTimeout(() => navigate("/payment/success"), 1500);
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <Layout>
      <div
        className="d-flex align-items-center justify-content-center bg-body"
        style={{
          height: "90vh",
        }}
      >
        <div
          className="card shadow-sm p-4 text-center"
          style={{ maxWidth: "400px", borderRadius: "15px" }}
        >
          {status === "loading" && (
            <div>
              <div
                className="spinner-border text-primary mb-3"
                role="status"
              ></div>
              <h4>Vérification du paiement...</h4>
              <p className="text-muted">
                Veuillez patienter quelques instants.
              </p>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="display-4 text-success mb-3">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h4 className="text-success">Paiement Validé !</h4>
              <p>Redirection en cours...</p>
            </div>
          )}

          {(status === "failed" || status === "error") && (
            <div>
              <div className="display-4 text-danger mb-3">
                <i className="bi bi-x-circle-fill"></i> ❌
              </div>
              <h4>Échec de vérification</h4>
              <p className="text-muted">
                Nous n'avons pas pu confirmer la transaction.
              </p>
              <button
                onClick={verifyPayment}
                className="btn btn-outline-primary mt-3"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCallback;
