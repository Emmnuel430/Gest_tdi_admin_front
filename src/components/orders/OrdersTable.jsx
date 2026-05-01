import { Button, Badge, Dropdown } from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice, StatusIndicator, truncate } from "../../utils/useful";

const OrdersTable = ({ orders, openStatus, openDetails }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle table-borderless shadow-sm bg-body rounded">
        <thead className="bg-body">
          <tr className="text-muted small text-uppercase">
            <th></th>
            <th>Montant</th>
            <th>Client</th>
            <th>Référence</th>
            <th>Articles</th>
            <th>Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="border-bottom">
                <td>
                  {" "}
                  <StatusIndicator status={order.status} />
                </td>
                <td>
                  <span className="fw-semibold">
                    {formatPrice(order?.transactions[0]?.amount)}{" "}
                    {order?.transactions[0]?.currency || "XOF"}
                  </span>
                </td>
                <td>
                  <div className="fw-semibold text-body text-uppercase">
                    {order.nom ? order.nom.trim().split(" ")[0] : "-"}
                  </div>
                  <div
                    className="small text-muted text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {order.email || "-"}
                  </div>
                </td>
                <td>
                  <span className="font-monospace small bg-body px-2 py-1 rounded border">
                    {truncate(order.reference || "-")}
                  </span>
                </td>
                <td>
                  <Badge
                    bg=""
                    text=""
                    className="border border-secondary text-body"
                  >
                    {order.total_items ||
                      order.metadata?.cart_details?.length ||
                      0}{" "}
                    article(s)
                  </Badge>
                </td>
                <td>
                  <span className="text-body small">
                    {order.created_at
                      ? format(new Date(order.created_at), "dd MMM yyyy", {
                          locale: fr,
                        })
                      : "-"}
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {order.status === "pending" && (
                      <Dropdown>
                        <Dropdown.Toggle
                          size="sm"
                          variant="outline-primary"
                          id={`dropdown-${order.id}`}
                          title="Changer le statut"
                        >
                          <i className="fas fa-exchange-alt"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => openStatus(order, "delivered")}
                          >
                            <i className="fas fa-check text-success me-2"></i>
                            Livrer
                          </Dropdown.Item>

                          <Dropdown.Item
                            onClick={() => openStatus(order, "canceled")}
                          >
                            <i className="fas fa-times text-danger me-2"></i>
                            Annuler
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}

                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => openDetails(order)}
                      title="Plus d'infos"
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-5">
                Aucune commande trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
