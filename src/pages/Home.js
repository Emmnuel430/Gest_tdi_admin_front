import React from "react";

import Layout from "../components/Layout/Layout";

const Home = () => {
  return (
    <div>
      <Layout>
        <div className="container mt-4 px-4">
          <h1 className="mb-3">Dashboard</h1>
          <h2 className="mb-4">Bienvenue sur votre tableau de bord !</h2>

          <div className="card">
            <div className="card-body">
              <p className="card-text">
                Cette interface d'administration vous permet de gérer l'ensemble
                du contenu et des utilisateurs de votre site web.
              </p>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  <strong>Gestion des utilisateurs :</strong> vous pouvez
                  ajouter, supprimer, rechercher et modifier les comptes des
                  utilisateurs.
                </li>
                <li className="list-group-item">
                  <strong>Gestion des pages :</strong> dans l’onglet{" "}
                  <em>"Pages"</em>, vous configurez le contenu visible sur le
                  site public, section par section, avec la possibilité
                  d’ajouter des sous-sections et du contenu enrichi.
                </li>
              </ul>
              <p className="card-text">
                Utilisez le menu pour naviguer entre les différentes
                fonctionnalités. Cette application a été conçue pour être
                simple, rapide et flexible.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
