import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  formatPrice,
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
  UserName,
} from "../../utils/useful";
import CopyableField from "../ui/CopyableField";
import { useTheme } from "../../context/ThemeContext";

const TransactionDetailsModal = ({ transaction }) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="transaction-details">
      <Row className="mb-3">
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Référence
            </label>
            <CopyableField value={transaction.reference} />
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
                    ? `${getStatusColor(transaction.status)}-subtle`
                    : getStatusColor(transaction.status)
                }
                className={`fs-6 border border-${
                  isDarkMode
                    ? `${getStatusColor(transaction.status)}-subtle`
                    : getStatusColor(transaction.status)
                }`}
              >
                {getStatusLabel(transaction.status)}
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
              {formatPrice(transaction.amount)}{" "}
              <span className="text-muted">
                {transaction.currency || "XOF"}
              </span>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Type
            </label>
            <div className="pt-2">
              <Badge
                bg={isDarkMode ? "info-subtle" : "info"}
                className={`border ${isDarkMode ? "border-info-subtle" : "border-info"} fs-6 text-body`}
              >
                {getTypeLabel(transaction.type)}
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
              <UserName name={transaction.nom} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Email
            </label>
            <div className="text-body text-truncate" title={transaction.email}>
              {transaction.email}
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
              {transaction.numero || "-"}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <label className="text-muted small text-uppercase fw-bold">
              Date
            </label>
            <div className="text-body">
              {format(new Date(transaction.created_at), "dd MMMM yyyy HH:mm", {
                locale: fr,
              })}
            </div>
          </div>
        </Col>
      </Row>

      {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Métadonnées
              </label>
              <div
                className="bg-body p-3 rounded"
                style={{ fontSize: "0.85rem" }}
              >
                <pre className="m-0" style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {transaction.created_at !== transaction.updated_at && (
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Mis à jour le
              </label>
              <div className="text-body small">
                {format(
                  new Date(transaction.updated_at),
                  "dd MMMM yyyy HH:mm",
                  {
                    locale: fr,
                  },
                )}
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default TransactionDetailsModal;
