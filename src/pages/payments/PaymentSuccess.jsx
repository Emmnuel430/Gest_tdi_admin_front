import React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/LayoutAdherent";

const PaymentSuccess = () => {
  return (
    <Layout>
      <div
        className="d-flex align-items-center justify-content-center bg-body"
        style={{
          height: "90vh",
        }}
      >
        <div
          className="card shadow-sm p-5 text-center"
          style={{ maxWidth: "500px", borderRadius: "15px" }}
        >
          <div className="mb-4">
            <span className="display-1 text-success">✔️</span>
          </div>
          <h2 className="fw-bold mb-3">Opération réussie !</h2>
          <p className="text-muted mb-4">
            Le paiement a été traité avec succès. L'adhérent a été mis à jour et
            la transaction est enregistrée.
          </p>
          <div className="d-grid gap-2">
            <Link to="/adherent/profil" className="btn btn-success btn-lg">
              Retour à mon profil
            </Link>
            <Link to="/" className="btn btn-link text-decoration-none">
              Accueil
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
