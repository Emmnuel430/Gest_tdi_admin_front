import { Table, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { format } from "date-fns";
import { formatPrenom } from "../../utils/useful";

const AdherentsTable = ({ adherents, onShowDetails, onToggleValidate }) => {
  return (
    <Table
      hover
      responsive
      className="align-middle table-borderless shadow-sm rounded"
    >
      <thead className="bg-body">
        <tr className="text-muted small text-uppercase">
          <th>#</th>
          <th>Utilisateur</th>
          <th>Abonnement</th>
          <th>Expiration</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {adherents.length > 0 ? (
          adherents.map((a, index) => {
            const sub = a.active_subscription;

            return (
              <tr
                key={a.id}
                className={`border-bottom ${
                  a.is_active ? "bg-body" : "bg-secondary text-muted"
                }`}
                style={{
                  filter: a.is_active ? "none" : "blur(2px)",
                }}
              >
                {/* INDEX */}
                <td className="fw-bold text-muted">{index + 1}</td>

                {/* USER */}
                <td>
                  <div className="fw-semibold text-body" title={a.prenom}>
                    <span className="text-capitalize">
                      {" "}
                      {formatPrenom(a.prenom)}
                    </span>{" "}
                    {a.nom.toUpperCase()}
                  </div>
                  <div className="small text-muted">{a.email}</div>
                </td>

                {/* SUBSCRIPTION */}
                <td>
                  {sub ? (
                    <div>
                      <div className="fw-semibold">{sub.plan?.name}</div>

                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        Actif
                      </span>
                    </div>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary">
                      Aucun abonnement
                    </span>
                  )}
                </td>

                {/* EXPIRATION */}
                <td>
                  {sub?.ends_at ? (
                    <span className="text-body">
                      {format(new Date(sub.ends_at), "dd/MM/yyyy")}
                    </span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    {/* TOGGLE VALIDATION */}
                    <Button
                      size="sm"
                      variant={
                        !a.is_active ? "outline-danger" : "outline-success"
                      }
                      onClick={() => onToggleValidate(a)}
                      title={a.is_active ? "Désactiver" : "Valider"}
                    >
                      <i
                        className={`fas fa-toggle-${
                          a.is_active ? "on" : "off"
                        }`}
                      ></i>
                    </Button>

                    {/* DETAILS */}
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => onShowDetails(a)}
                      title="Plus d'infos"
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="text-center text-muted py-5">
              Aucun adhérent trouvé
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default AdherentsTable;
