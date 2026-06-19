import React, { useEffect, useState } from "react";
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
import { useToast } from "../../context/ToastContext";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import ConfirmPopup from "../Layout/ConfirmPopup";

const OrderDetailsModal = ({ order }) => {
  // console.log(order.metadata);

  /**************************************************************************
   * HOOKS
   **************************************************************************/

  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const { fetchWithToken } = useFetchWithToken();

  /**************************************************************************
   * ETATS
   **************************************************************************/

  // Popup de modification des quantités livrées
  const [showEditDeliveryPopup, setShowEditDeliveryPopup] = useState(false);

  // Données en cours d'édition dans la popup
  const [editableDeliveryDetails, setEditableDeliveryDetails] = useState([]);

  // Données réellement enregistrées en base
  const [currentDeliveryDetails, setCurrentDeliveryDetails] = useState(
    order.metadata?.delivery_details || [],
  );

  /**************************************************************************
   * SYNCHRONISATION
   **************************************************************************/

  // Lorsque la commande change,
  // on recharge les delivery_details depuis les metadata
  useEffect(() => {
    setCurrentDeliveryDetails(order.metadata?.delivery_details || []);
  }, [order.metadata]);

  /**************************************************************************
   * FORMATAGE
   **************************************************************************/

  const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return format(date, "dd MMMM yyyy HH:mm", {
      locale: fr,
    });
  };

  /**************************************************************************
   * EXTRACTION DES METADATA
   **************************************************************************/

  const metadata = order.metadata || {};

  // Produits commandés
  const cartDetails = Array.isArray(metadata.cart_details)
    ? metadata.cart_details
    : [];

  // Produits réellement livrés
  const deliveryDetails = currentDeliveryDetails;

  // Autres clés metadata
  const otherMetaKeys = Object.keys(metadata).filter(
    (key) => key !== "cart_details" && key !== "delivery_details",
  );

  /**************************************************************************
   * TABLEAU DE SYNTHÈSE COMMANDE / LIVRAISON
   **************************************************************************/

  /*
   * Fusionne :
   *
   * cart_details
   * +
   * delivery_details
   *
   * pour obtenir :
   *
   * Produit
   * Quantité commandée
   * Quantité livrée
   */
  const deliveredItems = cartDetails.map((item) => {
    const delivery = deliveryDetails.find(
      (d) => Number(d.product_id) === Number(item.product_id),
    );

    return {
      ...item,

      orderedQuantity: Number(item.quantity),

      deliveredQuantity: delivery?.delivered_quantity ?? 0,
    };
  });

  /**************************************************************************
   * INFORMATIONS DE PAIEMENT
   **************************************************************************/

  const orderAmount = order.transactions?.[0]?.amount || "-";

  const orderCurrency = order.transactions?.[0]?.currency || "XOF";

  /**************************************************************************
   * CONSTRUCTION DES DONNÉES ÉDITABLES
   **************************************************************************/

  /*
   * Prépare les données qui seront affichées
   * dans la popup de modification.
   *
   * On ne conserve que les produits dont
   * la quantité livrée est différente
   * de la quantité commandée.
   */
  const buildEditableDeliveryDetails = () =>
    cartDetails
      .map((item) => {
        const delivery = deliveryDetails.find(
          (d) => Number(d.product_id) === Number(item.product_id),
        );

        const orderedQuantity = Number(item.quantity);

        return {
          product_id: Number(item.product_id),
          title: item.title,
          ordered_quantity: orderedQuantity,
          delivered_quantity: delivery?.delivered_quantity ?? 0,
        };
      })
      .filter((item) => item.delivered_quantity < item.ordered_quantity);

  /**************************************************************************
   * OUVERTURE POPUP MODIFICATION
   **************************************************************************/

  const openEditDeliveryPopup = () => {
    const items = buildEditableDeliveryDetails();

    if (items.length === 0) return;

    setEditableDeliveryDetails(items);

    setShowEditDeliveryPopup(true);
  };

  /*
   * Utilisé pour afficher ou non
   * le bouton "Modifier les livraisons"
   */
  const editableDeliveryItems = buildEditableDeliveryDetails();

  /**************************************************************************
   * GESTION DES QUANTITÉS
   **************************************************************************/

  /*
   * Met à jour la quantité livrée
   *
   * Contraintes :
   *
   * 0 <= livré <= commandé
   */
  const updateDeliveredQuantity = (productId, delta) => {
    setEditableDeliveryDetails((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,

              delivered_quantity: Math.min(
                item.ordered_quantity,

                Math.max(0, item.delivered_quantity + delta),
              ),
            }
          : item,
      ),
    );
  };

  const increaseDeliveredQty = (productId) => {
    updateDeliveredQuantity(productId, 1);
  };

  const decreaseDeliveredQty = (productId) => {
    updateDeliveredQuantity(productId, -1);
  };

  /**************************************************************************
   * SAUVEGARDE API
   **************************************************************************/

  const handleConfirmDeliveryUpdate = async () => {
    const deliveryMap = new Map(
      deliveryDetails.map((item) => [Number(item.product_id), item]),
    );

    editableDeliveryDetails.forEach((item) => {
      deliveryMap.set(Number(item.product_id), {
        product_id: item.product_id,
        delivered_quantity: item.delivered_quantity,
      });
    });

    const payload = {
      delivery_details: Array.from(deliveryMap.values()),
    };

    const response = await fetchWithToken(
      `${process.env.REACT_APP_API_BASE_URL}/orders/${order.id}/delivery-details`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la mise à jour");
    }

    // Mise à jour locale avec les données fusionnées
    setCurrentDeliveryDetails(Array.from(deliveryMap.values()));

    setShowEditDeliveryPopup(false);

    showToast(data.message || "Détails de livraison mis à jour", "success");
  };

  /**************************************************************************
   * COMPOSANT QUANTITÉ
   **************************************************************************/

  const QuantityControl = ({ item }) => (
    <div className="d-inline-flex align-items-center bg-body rounded-pill px-2 py-1 gap-2">
      <button
        type="button"
        className="btn btn-sm btn-body border rounded-circle shadow-sm"
        disabled={item.delivered_quantity <= 0}
        onClick={() => decreaseDeliveredQty(item.product_id)}
        style={{
          width: 32,
          height: 32,
        }}
      >
        −
      </button>

      <span className="fw-semibold text-center" style={{ minWidth: 40 }}>
        {item.delivered_quantity}/{item.ordered_quantity}
      </span>

      <button
        type="button"
        className="btn btn-sm btn-body border rounded-circle shadow-sm"
        disabled={item.delivered_quantity >= item.ordered_quantity}
        onClick={() => increaseDeliveredQty(item.product_id)}
        style={{
          width: 32,
          height: 32,
        }}
      >
        +
      </button>
    </div>
  );

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
                Produits commandés
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

      {deliveryDetails.length > 0 && (
        <Row className="mb-3">
          <Col md={12}>
            <div className="mb-3">
              <label className="text-muted small text-uppercase fw-bold">
                Livraison
              </label>

              <div className="table-responsive rounded border bg-body">
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  className="mb-0 align-middle"
                >
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th className="text-center">Commandé</th>
                      <th className="text-center">Livré</th>
                      <th className="text-center">État</th>
                    </tr>
                  </thead>

                  <tbody>
                    {deliveredItems.map((item) => {
                      const complete =
                        item.deliveredQuantity === item.orderedQuantity;

                      const partial =
                        item.deliveredQuantity > 0 &&
                        item.deliveredQuantity < item.orderedQuantity;

                      return (
                        <tr key={item.product_id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  width={40}
                                  height={40}
                                  className="rounded"
                                  style={{ objectFit: "cover" }}
                                />
                              )}

                              <span>{item.title}</span>
                            </div>
                          </td>

                          <td className="text-center">
                            {item.orderedQuantity}
                          </td>

                          <td className="text-center">
                            {item.deliveredQuantity}
                          </td>

                          <td className="text-center">
                            {complete ? (
                              <span className="badge bg-success">Livré</span>
                            ) : partial ? (
                              <span className="badge bg-warning text-dark">
                                Partiel
                              </span>
                            ) : (
                              <span className="badge bg-danger">Non livré</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {editableDeliveryItems.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={openEditDeliveryPopup}
                  >
                    Modifier
                  </button>
                </div>
              )}
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

      <ConfirmPopup
        show={showEditDeliveryPopup}
        onClose={() => setShowEditDeliveryPopup(false)}
        onConfirm={handleConfirmDeliveryUpdate}
        modalSize="lg"
        title="Modifier les détails de livraison"
        btnClass="success"
        confirmText="Enregistrer"
        body={
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
                {editableDeliveryDetails.map((item) => (
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
        }
      />
    </div>
  );
};

export default OrderDetailsModal;
