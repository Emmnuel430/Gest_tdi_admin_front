// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import HeaderWithFilter from "../../components/Layout/HeaderWithFilter";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import SearchBar from "../../components/Layout/SearchBar";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { formatDateRelative } from "../../utils/formatDateRelative";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/useful";

const PlanList = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [sortedPlans, setSortedPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/subscription-plans`,
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des plans.");
        }

        const responseData = await response.json();
        setPlans(responseData.data || responseData || []);
      } catch (err) {
        showToast(
          "Impossible de charger les données : " + err.message,
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [showToast]);

  useEffect(() => {
    if (plans.length > 0) {
      setSortedPlans(plans);
    }
  }, [plans]);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  const handleDelete = async () => {
    if (!selectedPlan) return;

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/subscription-plans/${selectedPlan.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Échec de la suppression.");
      }

      const result = await response.json();

      if (result.status === "deleted" || response.status === 200) {
        showToast("Plan supprimé !", "success");
        setPlans(plans.filter((plan) => plan.id !== selectedPlan.id));
      } else {
        showToast("Échec de la suppression.", "danger");
      }
    } catch (err) {
      showToast("Une erreur est survenue lors de la suppression.", "error");
    } finally {
      handleCloseModal();
    }
  };

  const normalizedSearch = searchQuery.toLowerCase().trim();
  const filteredPlans = sortedPlans.filter((plan) => {
    const nameMatch = plan.name?.toLowerCase().includes(normalizedSearch);
    const billingMatch = plan.billing_type
      ?.toLowerCase()
      .includes(normalizedSearch);
    return nameMatch || billingMatch;
  });

  return (
    <Layout>
      <div className="container mt-2">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <Loader />
          </div>
        ) : (
          <>
            <SearchBar
              placeholder="Rechercher un plan..."
              onSearch={(query) => setSearchQuery(query)}
              delay={300}
            />

            <HeaderWithFilter
              title="plans"
              link="/admin-tdi/subscription-plans/add"
              linkText="Ajouter"
              main={plans.length || null}
              sortOption={sortOption}
              setSortOption={setSortOption}
              dataList={plans}
              setSortedList={setSortedPlans}
              alphaField="name"
              dateField="created_at"
            />

            <div className="row justify-content-center">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <div className="col-md-6 col-lg-4 mb-4 " key={plan.id}>
                    <Card className="h-100 shadow-sm border rounded-4">
                      <Card.Body className="d-flex flex-column">
                        {/* HEADER */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <Card.Title className="fw-bold text-body mb-1">
                              {plan.name}
                            </Card.Title>

                            <span className="badge bg-outline-info text-body border small text-uppercase">
                              {plan.billing_type.replace("_", " ")}
                            </span>
                          </div>

                          {plan.is_student_plan && (
                            <span className="badge bg-success rounded-pill">
                              🎓 Étudiant
                            </span>
                          )}
                        </div>

                        {/* PRICE BLOCK */}
                        <div className="mb-3">
                          {plan.billing_type === "monthly" && (
                            <h4 className="fw-bold text-primary mb-0">
                              {formatPrice(plan.price)} XOF{" "}
                              <small className="text-muted">/ mois</small>
                            </h4>
                          )}

                          {plan.billing_type === "one_time" && (
                            <>
                              <h4 className="fw-bold text-primary mb-0">
                                {formatPrice(plan.price)} XOF
                              </h4>
                              {plan.duration_months && (
                                <small className="text-muted">
                                  {plan.duration_months} mois d'accès
                                </small>
                              )}
                            </>
                          )}

                          {plan.billing_type === "hybrid" && (
                            <>
                              <div className="fw-bold text-body">
                                Inscription :{" "}
                                {formatPrice(plan.registration_fee)} XOF
                              </div>
                              <div className="text-primary fw-semibold">
                                Puis {formatPrice(plan.monthly_price)} XOF /
                                mois
                              </div>
                              <small className="text-muted">
                                {plan.total_payments} mensualités
                              </small>
                            </>
                          )}
                        </div>

                        {/* AVANTAGES */}
                        <div className="mb-3">
                          <strong className="small text-muted">
                            Avantages :
                          </strong>
                          <br />
                          {plan.advantages?.length > 0 ? (
                            <>
                              <ul className="mt-2 ps-3 small">
                                {plan.advantages?.slice(0, 3).map((adv, i) => (
                                  <li key={i}>{adv}</li>
                                ))}
                              </ul>

                              {plan.advantages?.length > 3 && (
                                <small className="text-muted">
                                  +{plan.advantages.length - 3} autres...
                                </small>
                              )}
                            </>
                          ) : (
                            <small className="text-muted">
                              Aucun avantage défini
                            </small>
                          )}
                        </div>

                        {/* FOOTER META */}
                        <div className="mt-auto pt-3 border-top small text-muted">
                          <div>
                            Créé : {formatDateRelative(plan.created_at, true)}
                          </div>
                          {plan.updated_at !== plan.created_at && (
                            <div>
                              MAJ : {formatDateRelative(plan.updated_at, true)}
                            </div>
                          )}
                        </div>
                      </Card.Body>

                      {/* ACTIONS */}
                      <Card.Footer className="bg-body border-0 d-flex justify-content-between rounded-4">
                        <Link
                          to={`/admin-tdi/subscription-plans/edit/${plan.id}`}
                          className="btn btn-sm btn-outline-warning"
                        >
                          <i className="fas fa fa-edit me-1"></i> Modifier
                        </Link>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleOpenModal(plan)}
                        >
                          <i className="fas fa-trash me-1"></i> Supprimer
                        </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                ))
              ) : (
                <div className="text-center mt-4">
                  <p>Aucun plan trouvé.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmPopup
        btnClass="danger"
        show={showModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        body={
          <p>
            Voulez-vous vraiment supprimer le plan{" "}
            <strong>{selectedPlan?.name || "Inconnu"}</strong> ?
          </p>
        }
      />
    </Layout>
  );
};

export default PlanList;
