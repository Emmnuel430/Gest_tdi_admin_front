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

const AdherentsPage = () => {
  const { showToast } = useToast();

  const {
    adherents,
    sortedAdherents,
    setSortedAdherents,
    loading,
    handleToggleValidate,
  } = useAdherents(showToast);
  const [searchQuery, setSearchQuery] = useState("");

  const { ui, close, openDetails, openToggle } = useCrudUI();

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
              onShowDetails={openDetails} // Ouvre le mode 'details' avec l'objet
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
          {ui.data && <AdhModalComponent selectedAdherent={ui.data} />}
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
