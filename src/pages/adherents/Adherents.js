import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import Layout from "../../components/Layout/Layout";
import Loader from "../../components/Layout/Loader";
import SearchBar from "../../components/Layout/SearchBar";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";

import AdhModalComponent from "../../components/adherents/AdhModalComponent";

import { useToast } from "../../context/ToastContext";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useAdherents } from "../../hooks/useAdherents";
import AdherentsTable from "../../components/adherents/AdherentsTable";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";

const AdherentsPage = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();

  const {
    adherents,
    sortedAdherents,
    setSortedAdherents,
    loading,
    handleToggleValidate,
  } = useAdherents(showToast);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { ui, setUi, close, openDetails, openToggle } = useCrudUI();

  const [sortOption, setSortOption] = useState("");

  // 🔍 filtre
  const filtered = sortedAdherents
    .sort((a, b) => {
      return b.is_active - a.is_active;
    })
    .filter((a) =>
      `${a.nom} ${a.prenom} ${a.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

  const handleToggle = async () => {
    if (!ui.data) return;
    await handleToggleValidate(ui.data);
    close();
  };

  const handleShowDetails = async (adherent) => {
    // 1. On ouvre tout de suite avec les infos qu'on a déjà
    openDetails(adherent);

    try {
      // 2. On lance le fetch en arrière-plan
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${adherent.id}`,
      );

      if (!response.ok) throw new Error("Erreur profil");

      const data = await response.json();
      const fullData = data.data;

      // 3. On enrichit ui.data manuellement
      // On garde l'adherent actuel et on lui injecte le profile reçu
      setUi((prev) => ({
        ...prev,
        data: {
          // On met à jour 'data'
          ...prev.data, // On garde les infos de base (nom, id, etc.)
          profile: fullData.profile, // On ajoute le profil
        },
      }));

      // console.log(ui.data);
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      // Optionnel : ne pas bloquer l'utilisateur si le profil échoue
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-2">
        {loading ? (
          <div
            className="d-flex justify-content-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <SearchBar
              placeholder="Rechercher par : nom, prenom, email"
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />

            <HeaderWithFilter
              title="Adhérents"
              main={adherents.length}
              dataList={adherents}
              sortOption={sortOption}
              setSortOption={setSortOption}
              setSortedList={setSortedAdherents}
              alphaField="nom"
              dateField="created_at"
            />

            <AdherentsTable
              adherents={filtered}
              onShowDetails={handleShowDetails}
              onToggleValidate={openToggle} // Ouvre le mode 'toggle' avec l'objet
            />
          </>
        )}
      </div>

      {/* DETAILS */}
      <Modal show={ui.mode === "details"} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ui.data && (
            <AdhModalComponent
              selectedAdherent={ui.data}
              loading={loadingProfile}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      {/* handleToggle */}
      <ConfirmPopup
        show={ui.mode === "toggle"}
        onClose={close}
        onConfirm={handleToggle}
        title={ui.data?.is_active ? "Désactivation" : "Activation"}
        btnClass={ui.data?.is_active ? "danger" : "success"}
        body={
          <p>
            {ui.data?.is_active ? "Désactiver" : "Activer"} le compte de{" "}
            <strong>
              {ui.data?.nom} {ui.data?.prenom}
            </strong>{" "}
            ?
          </p>
        }
      />
    </Layout>
  );
};

export default AdherentsPage;
