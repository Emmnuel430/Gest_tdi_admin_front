import React from "react";
import { Row, Col, Badge, Table } from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  formatPrice,
  getStatusColor,
  getStatusLabel,
  UserName,
} from "../../utils/useful";
import CopyableField from "../ui/CopyableField";
import { useTheme } from "../../context/ThemeContext";

const OrderDetailsModal = ({ order }) => {
  const { isDarkMode } = useTheme();
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return format(date, "dd MMMM yyyy HH:mm", { locale: fr });
  };

  const metadata = order.metadata || {};
  const cartDetails = Array.isArray(metadata.cart_details)
    ? metadata.cart_details
    : [];
  const otherMetaKeys = Object.keys(metadata).filter(
    (key) => key !== "cart_details",
  );

  const orderAmount = order.transactions?.[0]?.amount || "-";
  const orderCurrency = order.transactions?.[0]?.currency || "XOF";

  return (
    <div className="transaction-details">
      <Row className="mb-3">
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Référence
            </label>
            <div>
              <CopyableField value={order.reference} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Statut
            </label>
            <div className="pt-2">
              <Badge
                bg={
                  isDarkMode
                    ? `${getStatusColor(order.status)}-subtle`
                    : getStatusColor(order.status)
                }
                className={`fs-6 border border-${
                  isDarkMode
                    ? `${getStatusColor(order.status)}-subtle`
                    : getStatusColor(order.status)
                }`}
              >
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Montant
            </label>
            <div className="fs-5 fw-bold">
              {orderAmount !== "-"
                ? `${formatPrice(orderAmount)} ${orderCurrency}`
                : "-"}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Articles
            </label>
            <div className="pt-2">
              <Badge
                bg={isDarkMode ? "info-subtle" : "info"}
                className="border border-info-subtle fs-6 text-body"
              >
                {order.total_items || cartDetails.length || 0} article(s)
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Nom
            </label>
            <div className="text-body">
              <UserName name={order.nom} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Email
            </label>
            <div className="text-body text-truncate" title={order.email || ""}>
              {order.email || "-"}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Numéro
            </label>
            <div className="text-body font-monospace">
              {order.numero || "-"}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Date
            </label>
            <div className="text-body">{formatDate(order.created_at)}</div>
          </div>
        </Col>
      </Row>

      {order.commune && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Commune
              </label>
              <div className="text-body text-capitalize">{order.commune}</div>
            </div>
          </Col>
        </Row>
      )}

      {cartDetails.length > 0 && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Panier
              </label>
              <div className="table-responsive rounded border bg-body">
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mb-0 align-middle"
                >
                  <thead className="bg-light">
                    <tr>
                      <th>Produit</th>
                      <th>Provenance</th>
                      <th className="text-end">Prix</th>
                      <th className="text-end">Quantité</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartDetails.map((item, index) => {
                      const price = parseFloat(item.price) || 0;
                      const quantity = parseInt(item.quantity, 10) || 0;
                      return (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  width={50}
                                  height={50}
                                  className="rounded"
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                              <span>{item.title || "-"}</span>
                            </div>
                          </td>
                          <td className="text-capitalize">
                            {item.itemFrom || "-"}
                          </td>
                          <td className="text-end">{formatPrice(price)}</td>
                          <td className="text-end">{quantity}</td>
                          <td className="text-end">
                            {formatPrice(price * quantity)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {otherMetaKeys.length > 0 && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Autres métadonnées
              </label>
              <div
                className="bg-body p-3 rounded"
                style={{ fontSize: "0.9rem" }}
              >
                <Table striped bordered size="sm" className="mb-0">
                  <tbody>
                    {otherMetaKeys.map((key) => (
                      <tr key={key}>
                        <th
                          className="text-capitalize"
                          style={{ width: "30%" }}
                        >
                          {key}
                        </th>
                        <td>
                          {typeof metadata[key] === "object"
                            ? JSON.stringify(metadata[key], null, 2)
                            : metadata[key]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {!cartDetails.length && otherMetaKeys.length === 0 && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="bg-body p-3 rounded" style={{ fontSize: "0.9rem" }}>
              <pre className="m-0" style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          </Col>
        </Row>
      )}

      {order.created_at !== order.updated_at && order.updated_at && (
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Mis à jour le
              </label>
              <div className="text-body small">
                {formatDate(order.updated_at)}
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default OrderDetailsModal;
