import React from "react";

import Layout from "../components/Layout/Layout";

const Home = () => {
  return (
    <div>
      <Layout>
        <div className="container mt-2 px-4">
          <h1>Dashboard</h1>
          <h2>Bienvenue sur votre tableau de bord !</h2>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
