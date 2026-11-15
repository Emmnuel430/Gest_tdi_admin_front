import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Protected from "./components/Protected";
import ProtectedAdherent from "./components/ProtectedAdherent";
import AccessDenied from "./components/AccessDenied";
import ScrollToTop from "./components/ScrollToTop";

// Indicateur de chargement léger pour le lazy loading
const RouteFallback = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Chargement de la page...</span>
    </div>
  </div>
);

// ⚡ Code Splitting via React.lazy()
const Login = lazy(() => import("./pages/Login"));
const LoginAdherent = lazy(() => import("./pages/LoginAdherent"));
const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/users/Register"));
const UserList = lazy(() => import("./pages/users/UserList"));
const UserUpdate = lazy(() => import("./pages/users/UserUpdate"));

const Pages = lazy(() => import("./pages/makePage/Pages"));
const AddPage = lazy(() => import("./pages/makePage/AddPage"));
const EditPage = lazy(() => import("./pages/makePage/EditPage"));

const Ads = lazy(() => import("./pages/ads/Ads"));
const AddAds = lazy(() => import("./pages/ads/AddAds"));
const EditAds = lazy(() => import("./pages/ads/EditAds"));
const PlanList = lazy(() => import("./pages/abonnement/PlanList"));
const AddPlan = lazy(() => import("./pages/abonnement/AddPlan"));
const EditPlan = lazy(() => import("./pages/abonnement/EditPlan"));

const PrayerList = lazy(() => import("./pages/prayerRequest/PrayerList"));

const Adherents = lazy(() => import("./pages/adherents/Adherents"));
const HomeAdherent = lazy(() => import("./pages/adherents/HomeAdherent"));
const UpdateAdherents = lazy(() => import("./pages/adherents/UpdateAdherents"));
const AdherentValidate = lazy(() => import("./pages/adherents/AdherentValidate"));
const ProfilAdherent = lazy(() => import("./pages/adherents/ProfilAdherent"));

const ContenuList = lazy(() => import("./pages/contenu/ContenuList"));
const AddContent = lazy(() => import("./pages/contenu/AddContent"));
const UpdateContent = lazy(() => import("./pages/contenu/UpdateContent"));

const GalerieDossiersList = lazy(() => import("./pages/galeries/GalerieDossiersList"));
const AddDossier = lazy(() => import("./pages/galeries/AddDossier"));
const EditDossier = lazy(() => import("./pages/galeries/EditDossier"));
const GalerieDossierShow = lazy(() => import("./pages/galeries/GalerieDossierShow"));
const TransactionList = lazy(() => import("./pages/transactions/TransactionList"));
const OrderList = lazy(() => import("./pages/orders/OrderList"));
const TsedakaList = lazy(() => import("./pages/tsdakas/TsedakaList"));
const ContentManagerAdherent = lazy(() => import("./pages/adherents/ContentManagerAdherent"));
const PaymentCallback = lazy(() => import("./pages/payments/PaymentCallback"));
const PaymentSuccess = lazy(() => import("./pages/payments/PaymentSuccess"));

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        {/* Auth */}
        <Route path="/admin-tdi" element={<Login />} />
        <Route path="/adherent/login" element={<LoginAdherent />} />

        <Route
          path="/adherent/home"
          element={<ProtectedAdherent Cmp={HomeAdherent} />}
        />
        {/* Cours */}
        <Route
          path="/adherent/cours"
          element={
            <ProtectedAdherent
              Cmp={() => <ContentManagerAdherent type="cours" />}
            />
          }
        />

        {/* Formations */}
        <Route
          path="/adherent/formations"
          element={
            <ProtectedAdherent
              Cmp={() => <ContentManagerAdherent type="formation" />}
            />
          }
        />

        {/* Événements */}
        <Route
          path="/adherent/evenements"
          element={
            <ProtectedAdherent
              Cmp={() => <ContentManagerAdherent type="evenement" />}
            />
          }
        />

        {/* Compléter le profil */}
        <Route
          path="/adherent/validate"
          element={<ProtectedAdherent Cmp={AdherentValidate} />}
        />
        {/* Profil */}
        <Route
          path="/adherent/profil"
          element={<ProtectedAdherent Cmp={ProfilAdherent} />}
        />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        {/* ------------------------ */}
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
        <Route
          path="/admin-tdi/prayer-requests"
          element={<Protected Cmp={PrayerList} adminOnly />}
        />
        <Route
          path="/admin-tdi/adherents"
          element={<Protected Cmp={Adherents} adminOnly />}
        />
        <Route
          path="/admin-tdi/update/adherents/:id"
          element={<Protected Cmp={UpdateAdherents} adminOnly />}
        />
        <Route
          path="/admin-tdi/contenu/add"
          element={<Protected Cmp={AddContent} adminOnly />}
        />
        <Route
          path="/admin-tdi/update/contenu/:id"
          element={<Protected Cmp={UpdateContent} adminOnly />}
        />
        <Route
          path="/admin-tdi/contenu"
          element={<Protected Cmp={ContenuList} adminOnly />}
        />
        {/* ------------------------ */}
        <Route
          path="/admin-tdi/galerie/dossiers"
          element={<Protected Cmp={GalerieDossiersList} adminOnly />}
        />

        <Route
          path="/admin-tdi/galerie/dossiers/create"
          element={<Protected Cmp={AddDossier} adminOnly />}
        />

        <Route
          path="/admin-tdi/galerie/dossiers/:id/edit"
          element={<Protected Cmp={EditDossier} adminOnly />}
        />

        <Route
          path="/admin-tdi/galerie/dossiers/:id"
          element={<Protected Cmp={GalerieDossierShow} adminOnly />}
        />
        {/*
        <Route
          path="/admin-tdi/galerie/dossiers/:dossierId/images/create"
          element={<Protected Cmp={GalerieImageForm} adminOnly />}
        />

        <Route
          path="/admin-tdi/galerie/images/:id/edit"
          element={<Protected Cmp={GalerieImageForm} adminOnly />}
        /> */}
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
        {/* Liste des subscription-plans */}
        <Route
          path="/admin-tdi/subscription-plans"
          element={<PlanList />}
          adminOnly
        />

        {/* Ajout d'un nouveau plan */}
        <Route
          path="/admin-tdi/subscription-plans/add"
          element={<AddPlan />}
          adminOnly
        />

        {/* Modification d'un plan existant */}
        <Route
          path="/admin-tdi/subscription-plans/edit/:id"
          element={<EditPlan />}
        />
        {/* ------------------------ */}
        <Route
          path="/admin-tdi/transactions"
          element={<TransactionList />}
          adminOnly
        />
        {/* ------------------------ */}
        <Route path="/admin-tdi/orders" element={<OrderList />} adminOnly />
        <Route path="/admin-tdi/tsedakas" element={<TsedakaList />} adminOnly />

        {/* Logs */}
        {/* <Route path="/logs" element={<Protected Cmp={Logs} adminOnly />} /> */}

        {/* Si l'URL n'est pas définie, renvoyer l'utilisateur vers la page de connexion */}
        <Route path="*" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
      </Suspense>
    </>
  );
};

// Exportation du composant AppRoutes pour l'utiliser dans d'autres parties de l'application
export default AppRoutes;
