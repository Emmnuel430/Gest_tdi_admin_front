import {
  // Table, Dropdown,
  Button,
  Badge,
} from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  formatPrice,
  getTypeLabel,
  StatusIndicator,
  truncate,
} from "../../utils/useful";

const TransactionsTable = ({ transactions, onChangeStatus, onShowDetails }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle table-borderless shadow-sm bg-body rounded">
        <thead className="bg-body">
          <tr className="text-muted small text-uppercase">
            <th></th>
            <th>Montant</th>
            <th>Client</th>
            <th>Référence</th>
            <th>Type</th>
            <th>Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length > 0 ? (
            transactions.map((t, index) => (
              <tr key={t.id} className="border-bottom">
                {/* STATUT */}
                <td>
                  {" "}
                  <StatusIndicator status={t.status} />
                </td>
                {/* MONTANT */}
                <td>
                  <span className="fw-semibold">
                    {formatPrice(t.amount)} {t.currency || "XOF"}
                  </span>
                </td>
                {/* Client */}
                <td>
                  <div className="fw-semibold text-body text-uppercase">
                    {t.nom.trim().split(" ")[0]}
                  </div>
                  <div
                    className="small text-muted text-truncate"
                    style={{
                      maxWidth: "150px",
                    }}
                  >
                    {t.email}
                  </div>
                </td>
                {/* REFERENCE */}
                <td>
                  <span className="font-monospace small bg-body px-2 py-1 rounded border">
                    {truncate(t.reference)}{" "}
                  </span>
                </td>

                {/* TYPE */}
                <td>
                  <Badge
                    bg=""
                    text=""
                    className="border border-secondary text-body"
                  >
                    {getTypeLabel(t.type)}
                  </Badge>
                </td>

                {/* DATE */}
                <td>
                  <span className="text-body small">
                    {format(new Date(t.created_at), "dd MMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                </td>

                {/* ACTIONS */}
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* CHANGE STATUS */}
                    {/* {t.status !== "refunded" && (
                      <Dropdown>
                        <Dropdown.Toggle
                          size="sm"
                          variant="outline-primary"
                          id={`dropdown-${t.id}`}
                          title="Changer le statut"
                        >
                          <i className="fas fa-exchange-alt"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {t.status !== "success" && (
                            <Dropdown.Item
                              onClick={() => onChangeStatus(t.id, "success")}
                            >
                              <i className="fas fa-check text-success me-2"></i>
                              Valider
                            </Dropdown.Item>
                          )}
                          {t.status !== "failed" && (
                            <Dropdown.Item
                              onClick={() => onChangeStatus(t.id, "failed")}
                            >
                              <i className="fas fa-times text-danger me-2"></i>
                              Annuler
                            </Dropdown.Item>
                          )}
                          {t.status === "success" && (
                            <>
                              <Dropdown.Divider />
                            </>
                          )}
                          {t.status === "success" && (
                            <Dropdown.Item
                              onClick={() => onChangeStatus(t.id, "refunded")}
                              className="text-warning"
                            >
                              <i className="fas fa-undo text-warning me-2"></i>
                              Rembourser
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )} */}

                    {/* DETAILS */}
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => onShowDetails(t)}
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
              <td colSpan="8" className="text-center text-muted py-5">
                Aucune transaction trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
