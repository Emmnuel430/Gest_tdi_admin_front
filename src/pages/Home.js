import React from "react";

import Layout from "../components/Layout/Layout";
import AnalyticsIframe from "../components/others/AnalyticsIframe";
// Récupérer l'ID de l'utilisateur connecté à partir du localStorage
const userInfo = JSON.parse(localStorage.getItem("user-info"));

const Home = () => {
  return (
    <div>
      <Layout>
        <div className="container mt-4 px-4">
          <h1 className="mb-3">Dashboard</h1>
          <h2 className="mb-4">
            Bienvenue, <strong>{userInfo ? userInfo.name : "Invité"}</strong> !
          </h2>

          <AnalyticsIframe />

          <div className="card mt-4">
            <div className="card-body">
              <p className="card-text">
                Bienvenue sur <strong>Gest</strong>, votre interface
                d'administration centralisée. Cette application vous permet de
                gérer efficacement le contenu et les utilisateurs de votre site
                web.
              </p>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  <strong>Utilisateurs :</strong> ajoutez, modifiez, recherchez
                  ou supprimez des comptes en quelques clics.
                </li>
                <li className="list-group-item">
                  <strong>Pages :</strong> configurez le contenu public du site
                  depuis l’onglet <em>"Pages"</em>, avec une structure souple
                  par sections et sous-sections, et un éditeur de texte enrichi.
                </li>
                <li className="list-group-item">
                  <strong>Affiches :</strong> mettez en avant des événements,
                  campagnes ou annonces importantes grâce à des visuels
                  dynamiques affichés sur la page d’accueil.
                </li>
              </ul>
              <p className="card-text">
                Utilisez le menu de navigation pour accéder à chaque module.{" "}
                <strong>Gest</strong> a été conçu pour vous offrir une
                expérience simple, rapide et intuitive.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
