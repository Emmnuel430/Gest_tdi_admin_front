// Importation des dépendances React et des composants nécessaires de React Router
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protected from "./components/Protected"; // Composant pour protéger les routes
// Importation des pages et composants utilisés dans les routes
import AccessDenied from "./components/AccessDenied";
import Login from "./pages/Login";
import Home from "./pages/Home";
// ----
import Register from "./pages/users/Register";
import UserList from "./pages/users/UserList";
import UserUpdate from "./pages/users/UserUpdate";

// ----
import Produits from "./pages/produits/Produits";
// ----
import Mot from "./pages/mot/Mot";
// ----
import Actus from "./pages/actus/Actus";
// ----
import Events from "./pages/events/Events";
// ----
import Conseillers from "./pages/conseillers/Conseillers";
// ----
import Fondements from "./pages/fondements/Fondements";
// ----
import Etudes from "./pages/etudes/Etudes";
// ----
import Synagogue from "./pages/synagogue/Synagogue";
// ----
import Parachiot from "./pages/parachiot/Parachiot";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/admin-tdi" element={<Login />} />

        <Route
          path="/admin-tdi/home"
          element={<Protected Cmp={Home} adminOnly />}
        />

        {/* Utilisateurs (Super Admin uniquement) */}
        <Route
          path="/admin-tdi/register"
          element={<Protected Cmp={Register} adminOnly />}
        />
        <Route
          path="/admin-tdi/utilisateurs"
          element={<Protected Cmp={UserList} adminOnly />}
        />
        <Route
          path="/admin-tdi/update/user/:id"
          element={<Protected Cmp={UserUpdate} adminOnly />}
        />
        {/* ------------------------ */}
        {/* Produits */}
        <Route
          path="/admin-tdi/produits"
          element={<Protected Cmp={Produits} />}
        />
        {/* ------------------------ */}
        {/* Mot */}
        <Route path="/admin-tdi/mot" element={<Protected Cmp={Mot} />} />
        {/* ------------------------ */}
        {/* Actus */}
        <Route
          path="/admin-tdi/actualites"
          element={<Protected Cmp={Actus} />}
        />
        {/* ------------------------ */}
        {/* Events */}
        <Route
          path="/admin-tdi/evenements"
          element={<Protected Cmp={Events} />}
        />
        {/* ------------------------ */}
        {/* Conseillers */}
        <Route
          path="/admin-tdi/conseillers"
          element={<Protected Cmp={Conseillers} />}
        />
        {/* ------------------------ */}
        {/* Fondements */}
        <Route
          path="/admin-tdi/fondements"
          element={<Protected Cmp={Fondements} />}
        />
        {/* ------------------------ */}
        {/* Etudes */}
        <Route path="/admin-tdi/etudes" element={<Protected Cmp={Etudes} />} />
        {/* Synagogue */}
        <Route
          path="/admin-tdi/synagogues"
          element={<Protected Cmp={Synagogue} />}
        />
        {/* Parachiot */}
        <Route
          path="/admin-tdi/parachiot"
          element={<Protected Cmp={Parachiot} />}
        />

        {/* ------------------------ */}

        {/* Logs */}
        {/* <Route path="/logs" element={<Protected Cmp={Logs} adminOnly />} /> */}

        {/* Si l'URL n'est pas définie, renvoyer l'utilisateur vers la page de connexion */}
        <Route path="*" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
};

// Exportation du composant AppRoutes pour l'utiliser dans d'autres parties de l'application
export default AppRoutes;
