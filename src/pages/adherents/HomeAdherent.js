import React from "react";
import Layout from "../../components/Layout/LayoutAdherent";

const HomeAdherent = () => {
  const adherent = JSON.parse(localStorage.getItem("adherent-info"));
  return (
    <div>
      <Layout>
        <div className="container mt-4 px-4">
          <h1 className="mb-3">Accueil</h1>
          <div className="card">
            <div className="card-body">
              <p className="card-text">
                Bonjour <strong>{adherent.prenom}</strong> 👋, bienvenue sur
                votre espace membre !
              </p>

              <p className="card-text">
                En tant qu’adhérent{" "}
                <span className="badge bg-success text-uppercase">
                  {adherent.statut === "standard" ? "Externe" : `Premium`}
                </span>
                , vous avez accès à :
              </p>

              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  🎓 <strong>Formations & Cours :</strong> suivez les contenus
                  selon votre abonnement (
                  <span className="badge bg-primary text-uppercase">
                    {adherent.abonnement_type}
                  </span>
                  , dans votre cas) : vidéos, documents, modules guidés, etc.
                </li>
                <li className="list-group-item">
                  🧾 <strong>Profil :</strong> visualisez la durée de votre
                  accès et recevez des rappels avant expiration.
                </li>
              </ul>

              <p className="card-text">
                Utilisez le menu à gauche pour accéder aux différentes sections.
                Profitez pleinement de votre expérience sur{" "}
                <strong>Gest</strong> 🤝
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default HomeAdherent;
