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
import Pages from "./pages/makePage/Pages";
import AddPage from "./pages/makePage/AddPage";
import EditPage from "./pages/makePage/EditPage";

// ----
import Ads from "./pages/ads/Ads";
import AddAds from "./pages/ads/AddAds";
import EditAds from "./pages/ads/EditAds";

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

        {/* ------------------------ */}

        {/* Liste des pages */}
        <Route path="/admin-tdi/pages" element={<Pages />} />

        {/* Ajout d'une nouvelle page */}
        <Route path="/admin-tdi/pages/add" element={<AddPage />} />

        {/* Modification d'une page existante */}
        <Route path="/admin-tdi/pages/edit/:id" element={<EditPage />} />

        {/* ------------------------ */}
        {/* Liste des ads */}
        <Route path="/admin-tdi/ads" element={<Ads />} />

        {/* Ajout d'une nouvelle page */}
        <Route path="/admin-tdi/ads/add" element={<AddAds />} />

        {/* Modification d'une page existante */}
        <Route path="/admin-tdi/ads/edit/:id" element={<EditAds />} />
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
