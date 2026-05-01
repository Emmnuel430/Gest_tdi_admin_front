import React from "react";

import Layout from "../components/Layout/Layout";
import VisitsChart from "../components/others/VisitsChart";
import { useAuth } from "../context/AuthContext";
// Récupérer l'ID de l'utilisateur connecté à partir du sessionStorage

const Home = () => {
  const { admin } = useAuth();
  const userInfo = admin;
  return (
    <div>
      <Layout>
        <div className="container mt-4 px-4">
          <h1 className="mb-3">Dashboard</h1>
          <h2 className="mb-4">
            Bienvenue, <strong>{userInfo ? userInfo.name : "Invité"}</strong> !
          </h2>

          <VisitsChart />

          <div className="card mt-5 shadow-sm border-0">
            <div className="card-body p-4">
              <p className="card-text fs-5">
                Bienvenue sur <strong>Gest Admin V2</strong>, votre plateforme
                d’administration centralisée pour piloter l’ensemble de votre
                écosystème digital TDI.
              </p>

              <p className="text-muted">
                Conçue pour être à la fois puissante et intuitive, cette
                interface vous permet de gérer vos contenus, vos utilisateurs et
                vos activités en temps réel, depuis un seul endroit.
              </p>

              <ul className="list-group list-group-flush mb-4 mt-3">
                <li className="list-group-item">
                  <strong>Utilisateurs :</strong> gérez les accès avec un
                  système de rôles sécurisé, créez et administrez vos comptes
                  facilement.
                </li>

                <li className="list-group-item">
                  <strong>Pages & contenus :</strong> construisez dynamiquement
                  votre site grâce à un système flexible de sections et
                  sous-sections, avec éditeur enrichi intégré.
                </li>

                <li className="list-group-item">
                  <strong>Transactions & commandes :</strong> suivez les
                  paiements, les commandes et les abonnements avec des
                  statistiques détaillées.
                </li>

                <li className="list-group-item">
                  <strong>Dons (Tsedaka) :</strong> visualisez et analysez les
                  dons reçus, avec un suivi clair et structuré.
                </li>

                <li className="list-group-item">
                  <strong>Galeries & médias :</strong> organisez vos images et
                  contenus visuels pour enrichir l’expérience utilisateur.
                </li>

                <li className="list-group-item">
                  <strong>Demandes de prière :</strong> consultez et traitez les
                  demandes en toute simplicité.
                </li>
              </ul>

              <p className="card-text">
                Utilisez le menu de navigation pour accéder à chaque module.
                <strong> Gest Admin</strong> a été conçu pour vous offrir une
                expérience fluide, rapide et évolutive, adaptée à vos besoins.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
