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
  const { ui, open, close, openDetails } = useCrudUI();
  const { orders, pagination, loading, fetchOrders, changeStatus, goToPage } =
    useOrders(showToast);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const openStatusModal = (order, status) => {
    if (status === "delivered") {
      const deliveryDetails = order.metadata?.delivery_details || [];

      const details =
        order.metadata?.cart_details?.map((item) => {
          const delivery = deliveryDetails.find(
            (d) => Number(d.product_id) === Number(item.product_id),
          );

          return {
            product_id: Number(item.product_id),
            title: item.title,
            ordered_quantity: Number(item.quantity),
            delivered_quantity:
              delivery?.delivered_quantity ?? Number(item.quantity),
          };
        }) || [];

      setDeliveryDetails(details);
    }

    open("status", { order, status });
  };

  const increaseDeliveredQty = (productId) => {
    setDeliveryDetails((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              delivered_quantity: Math.min(
                item.ordered_quantity,
                item.delivered_quantity + 1,
              ),
            }
          : item,
      ),
    );
  };

  const decreaseDeliveredQty = (productId) => {
    setDeliveryDetails((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              delivered_quantity: Math.max(0, item.delivered_quantity - 1),
            }
          : item,
      ),
    );
  };

  const QuantityControl = ({ item }) => (
    <div className="d-inline-flex align-items-center bg-body rounded-pill px-2 py-1 gap-2">
      <button
        type="button"
        className="btn btn-sm btn-body border rounded-circle shadow-sm"
        disabled={item.delivered_quantity <= 0}
        onClick={() => decreaseDeliveredQty(item.product_id)}
        style={{ width: 32, height: 32 }}
      >
        −
      </button>

      <span className="fw-semibold text-center" style={{ minWidth: 30 }}>
        {item.delivered_quantity}
      </span>

      <button
        type="button"
        className="btn btn-sm btn-body border rounded-circle shadow-sm"
        onClick={() => increaseDeliveredQty(item.product_id)}
        style={{ width: 32, height: 32 }}
      >
        +
      </button>
    </div>
  );

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

    const payload = {
      status,
    };

    if (status === "delivered") {
      payload.delivery_details = deliveryDetails.map((item) => ({
        product_id: item.product_id,
        delivered_quantity: item.delivered_quantity,
      }));
    }

    await changeStatus(order.id, payload);

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
            openStatus={openStatusModal}
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
        modalSize={ui.data?.status === "delivered" ? "lg" : "md"}
        title={
          ui.data?.status === "delivered"
            ? "Confirmer la livraison"
            : "Annuler la commande"
        }
        btnClass={ui.data?.status === "delivered" ? "success" : "danger"}
        body={
          ui.data?.status === "delivered" ? (
            <>
              <p>
                Confirmer la livraison de <strong>{ui.data?.order?.nom}</strong>
              </p>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Qté commandée</th>
                      <th>Qté livrée</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deliveryDetails.map((item) => (
                      <tr key={item.product_id}>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "150px" }}
                          title={item.title}
                        >
                          {item.title}
                        </td>

                        <td>{item.ordered_quantity}</td>

                        <td>
                          <QuantityControl item={item} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>
              Annuler la commande de <strong>{ui.data?.order?.nom}</strong> ?
            </p>
          )
        }
      />
    </>
  );
};

export default OrdersListComponent;
