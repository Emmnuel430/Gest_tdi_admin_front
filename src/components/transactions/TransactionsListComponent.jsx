import React, { useEffect, useState } from "react";
import { Modal, Button, Pagination } from "react-bootstrap";

import Loader from "../Layout/Loader";
import SearchBar from "../Layout/SearchBar";
import HeaderWithFilter from "../Layout/HeaderWithFilter";

import TransactionsTable from "./TransactionsTable";

import { useToast } from "../../context/ToastContext";
import { useTransactions } from "../../hooks/useTransactions";
import TransactionDetailsModal from "./TransactionDetailsModal";
import { useCrudUI } from "../../hooks/useCrudUI";

const TransactionsListComponent = () => {
  const { showToast } = useToast();
  const { ui, close, openDetails } = useCrudUI();

  const {
    transactions,
    pagination,
    loading,
    fetchTransactions,
    changeStatus,
    goToPage,
  } = useTransactions(showToast);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Charger les transactions au mount
  useEffect(() => {
    fetchTransactions(1, statusFilter, typeFilter);
  }, [fetchTransactions, statusFilter, typeFilter]);

  // Filtrer localement les transactions par recherche
  const filtered = transactions.filter((t) =>
    `${t.reference} ${t.nom} ${t.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleStatusChange = async (id, newStatus) => {
    await changeStatus(id, newStatus);
  };

  const handleFilterChange = async (status = "", type = "") => {
    setStatusFilter(status);
    setTypeFilter(type);
    await fetchTransactions(1, status, type);
  };

  const renderPagination = () => {
    if (pagination.last_page <= 1) return null;

    const items = [];
    const { current_page, last_page } = pagination;
    const maxShow = 5;
    let start = Math.max(1, current_page - Math.floor(maxShow / 2));
    let end = Math.min(last_page, start + maxShow - 1);

    if (end - start < maxShow - 1) {
      start = Math.max(1, end - maxShow + 1);
    }

    // Previous
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={current_page === 1}
        onClick={() => goToPage(current_page - 1)}
      />,
    );

    // First page
    if (start > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => goToPage(1)}>
          1
        </Pagination.Item>,
      );
      if (start > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === current_page}
          onClick={() => goToPage(i)}
        >
          {i}
        </Pagination.Item>,
      );
    }

    // Last page
    if (end < last_page) {
      if (end < last_page - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item key={last_page} onClick={() => goToPage(last_page)}>
          {last_page}
        </Pagination.Item>,
      );
    }

    // Next
    items.push(
      <Pagination.Next
        key="next"
        disabled={current_page === last_page}
        onClick={() => goToPage(current_page + 1)}
      />,
    );

    return <Pagination className="mt-4 mb-3">{items}</Pagination>;
  };

  return (
    <>
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
            placeholder="Rechercher par : référence, nom, email"
            onSearch={(query) => setSearchQuery(query)}
            delay={300}
          />

          <div className="d-flex flex-column mb-3">
            {/* Filtre pour les Statuts de transaction */}
            <HeaderWithFilter
              title2="Dernières transactions"
              main={pagination.total}
              dataList={transactions}
              // Configuration du premier filtre : Status
              filter={statusFilter}
              setFilter={(value) => handleFilterChange(value, typeFilter)}
              filterOptions={[
                { label: "Tous les statuts", value: "" },
                { label: "En attente", value: "pending" },
                { label: "Succès", value: "success" },
                { label: "Échouée", value: "failed" },
                { label: "Remboursée", value: "refunded" },
              ]}
              // On désactive le tri local JS (on laisse faire Laravel 'latest()')
              sortOption=""
              setSortOption={() => {}}
              setSortedList={() => {}}
              alphaField="reference"
              // dateField="created_at"
            />

            {/* Filtre secondaire pour les Types (Placé juste en dessous ou géré manuellement) */}
            <div
              className="row g-2 justify-content-end px-3"
              style={{ marginTop: "-20px" }}
            >
              <div className="col-12 col-sm-auto">
                <select
                  className="form-select bg-body border"
                  value={typeFilter}
                  onChange={(e) =>
                    handleFilterChange(statusFilter, e.target.value)
                  }
                  aria-label="Filtrer par type"
                >
                  <option value="">Tous les types</option>
                  <option value="cart">Panier (Cart)</option>
                  <option value="prayer-request">Demande de prière</option>
                  <option value="subscription">Abonnement</option>
                  <option value="tsedaka">Tsedaka</option>
                </select>
              </div>
            </div>
          </div>

          <TransactionsTable
            transactions={filtered}
            onChangeStatus={handleStatusChange}
            onShowDetails={openDetails}
          />

          {/* PAGINATION */}
          <div className="d-flex justify-content-center">
            {filtered.length > 0 && renderPagination()}
          </div>
        </>
      )}

      {/* DETAILS MODAL */}
      <Modal show={ui.mode === "details"} onHide={close} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ui.data && <TransactionDetailsModal transaction={ui.data} />}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransactionsListComponent;
