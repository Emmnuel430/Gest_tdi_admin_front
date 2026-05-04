import React, { useEffect, useState } from "react";
import { Modal, Button, Pagination } from "react-bootstrap";

import Loader from "../Layout/Loader";
import SearchBar from "../Layout/SearchBar";
import HeaderWithFilter from "../Layout/HeaderWithFilter";

import OrdersTable from "./OrdersTable";
import { useToast } from "../../context/ToastContext";
import { useOrders } from "../../hooks/useOrders";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmPopup from "../Layout/ConfirmPopup";
import { useCrudUI } from "../../hooks/useCrudUI";

const OrdersListComponent = () => {
  const { showToast } = useToast();
  const { ui, close, openStatus, openDetails } = useCrudUI();
  const { orders, pagination, loading, fetchOrders, changeStatus, goToPage } =
    useOrders(showToast);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [fetchOrders, statusFilter]);

  const filtered = orders.filter((order) =>
    `${order.reference || ""} ${order.nom || ""} ${order.email || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const handleConfirmStatus = async () => {
    if (!ui.data) return;

    const { order, status } = ui.data;

    await changeStatus(order.id, status);

    close();
  };

  const handleFilterChange = async (status = "") => {
    setStatusFilter(status);
    await fetchOrders(1, status);
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

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={current_page === 1}
        onClick={() => goToPage(current_page - 1)}
      />,
    );

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

          <HeaderWithFilter
            title2="Dernières commandes"
            main={pagination.total}
            filter={statusFilter}
            setFilter={handleFilterChange}
            filterOptions={[
              { label: "Tous les statuts", value: "" },
              { label: "En attente", value: "pending" },
              { label: "Livrée", value: "delivered" },
              { label: "Annulée", value: "canceled" },
            ]}
            dataList={orders}
            sortOption=""
            setSortOption={() => {}}
            setSortedList={() => {}}
            alphaField="reference"
            dateField="created_at"
          />

          <OrdersTable
            orders={filtered}
            openStatus={openStatus}
            openDetails={openDetails}
          />

          {filtered.length > 0 && renderPagination()}
        </>
      )}

      <Modal show={ui.mode === "details"} onHide={close} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ui.data && <OrderDetailsModal order={ui.data} />}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      <ConfirmPopup
        show={ui.mode === "status"}
        onClose={close}
        onConfirm={handleConfirmStatus}
        title={
          ui.data?.status === "delivered"
            ? "Confirmer la livraison"
            : "Annuler la commande"
        }
        btnClass={ui.data?.status === "delivered" ? "success" : "danger"}
        body={
          <p>
            {ui.data?.status === "delivered"
              ? "Marquer comme livrée la commande de"
              : "Annuler la commande de"}{" "}
            <strong>{ui.data?.order?.nom}</strong> ?
          </p>
        }
      />
    </>
  );
};

export default OrdersListComponent;
