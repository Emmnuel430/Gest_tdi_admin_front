import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Loader from "../Layout/Loader";

const AdhModalComponent = ({ selectedAdherent, loading }) => {
  const formatDate = (date) =>
    date ? format(new Date(date), "dd MMM yyyy", { locale: fr }) : "-";

  const formatBool = (val) => (val ? "Oui" : "Non");

  const formatText = (val) =>
    val ? val : <span className="text-muted small">Non renseigné</span>;

  const InfoRow = ({
    label,
    value,
    // icon,
    truncate = false,
    capitalize = false,
    uppercase = false,
    textEnd = false,
  }) => (
    <div className="row mb-2 align-items-center">
      <div className="col-5 text-muted small text-uppercase fw-medium">
        {/* {icon && <i className={`bi bi-${icon} me-2`}></i>} */}
        {label}
      </div>
      <div
        className={`col-7 ${truncate ? "text-truncate" : ""} ${textEnd ? "text-end" : ""} ${capitalize ? "text-capitalize" : uppercase ? "text-uppercase" : ""} fw-semibold`}
      >
        {value || "-"}
      </div>
    </div>
  );

  return (
    <>
      <div className="container py-2">
        {/* ================= INFOS UTILISATEUR ================= */}
        <div className="mb-4">
          <h6 className="fw-bold border-bottom pb-2 mb-3">Infos utilisateur</h6>

          <InfoRow label="Nom" value={selectedAdherent?.nom} uppercase={true} />
          <InfoRow
            label="Prénom"
            value={selectedAdherent?.prenom}
            capitalize={true}
          />
          <InfoRow label="Email" value={selectedAdherent?.email} truncate />
          <InfoRow label="Contact" value={selectedAdherent?.contact} />
        </div>

        <div
          className="pe-2 border rounded p-2 my-2"
          style={{
            height: "25rem",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center h-100"
              // style={{ height: "20vh" }}
            >
              <Loader />
            </div>
          ) : selectedAdherent?.profile ? (
            <div>
              {/* ================= INFOS PERSONNELLES ================= */}
              <div className="mb-4">
                <h6 className="text-primary fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Informations Personnelles
                </h6>

                <InfoRow
                  label="Adresse"
                  value={formatText(selectedAdherent.profile.adresse)}
                  icon="geo-alt"
                />
                <InfoRow
                  label="Naissance"
                  value={formatDate(selectedAdherent.profile.date_naissance)}
                  icon="calendar-event"
                />
                <InfoRow
                  label="Profession"
                  value={formatText(selectedAdherent.profile.profession)}
                  icon="briefcase"
                  capitalize
                />
                <InfoRow
                  label="Situation"
                  value={formatText(
                    selectedAdherent.profile.situation_matrimoniale,
                  )}
                  icon="heart"
                  capitalize
                />
                <InfoRow
                  label="Enfants"
                  value={selectedAdherent.profile.nombre_enfants ?? "-"}
                  icon="people"
                />
              </div>

              {/* ================= CONTACT ================= */}
              <div className="mb-4">
                <h6 className="text-primary fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-telephone-plus me-2"></i>
                  Contacts
                </h6>

                <InfoRow
                  label="WhatsApp"
                  value={formatText(
                    selectedAdherent.profile.telephone_whatsapp,
                  )}
                  icon="whatsapp"
                />
                <InfoRow
                  label="Téléphone secondaire"
                  value={formatText(
                    selectedAdherent.profile.telephone_secondaire,
                  )}
                  icon="phone"
                />
              </div>

              {/* ================= URGENCE ================= */}
              <div className="mb-4">
                <h6 className="text-danger fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Contact d'Urgence
                </h6>

                <div className="p-2 bg-body rounded">
                  <InfoRow
                    label="Nom"
                    value={formatText(selectedAdherent.profile.urgence_nom)}
                  />
                  <InfoRow
                    label="Numéro"
                    value={formatText(selectedAdherent.profile.urgence_numero)}
                  />
                  <InfoRow
                    label="Lien"
                    value={formatText(selectedAdherent.profile.urgence_lien)}
                  />
                </div>
              </div>

              {/* ================= EDUCATION ================= */}
              <div className="mb-4">
                <h6 className="text-success fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-mortarboard me-2"></i>
                  Éducation & Formation
                </h6>

                <InfoRow
                  label="Niveau d'études"
                  value={formatText(selectedAdherent.profile.niveau_etudes)}
                  capitalize
                />
                <InfoRow
                  label="Dernier diplôme"
                  value={formatText(selectedAdherent.profile.dernier_diplome)}
                />
              </div>

              {/* ================= RELIGIEUX ================= */}
              <div className="mb-4">
                <h6 className="text-warning fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-stars me-2"></i>
                  Parcours Spirituel
                </h6>

                <InfoRow
                  label="Étude religieuse"
                  value={formatBool(selectedAdherent.profile.etude_religieuse)}
                />
                <InfoRow
                  label="Institution"
                  value={formatText(
                    selectedAdherent.profile.institution_religieuse,
                  )}
                />
                <InfoRow
                  label="Niveau judaïsme"
                  value={formatText(selectedAdherent.profile.niveau_juif)}
                  capitalize
                />
              </div>

              {/* ================= LANGUES ================= */}
              <div className="mb-4">
                <h6 className="text-info fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-translate me-2"></i>
                  Langues
                </h6>

                <InfoRow
                  label="Français"
                  value={formatText(selectedAdherent.profile.niveau_francais)}
                  capitalize
                />
                <InfoRow
                  label="Hébreu"
                  value={formatText(selectedAdherent.profile.niveau_hebreu)}
                  capitalize
                />
                <InfoRow
                  label="Autres langues"
                  value={formatText(selectedAdherent.profile.autres_langues)}
                />
              </div>

              {/* ================= MOTIVATION ================= */}
              <div className="mb-4">
                <h6 className="text-dark fw-bold border-bottom pb-2 mb-3">
                  <i className="bi bi-chat-left-text me-2"></i>
                  Motivation & Objectifs
                </h6>

                <div className="mb-2">
                  <div className="small text-muted">Motivation</div>
                  <div className="p-2 border rounded bg-body">
                    {formatText(selectedAdherent.profile.motivation)}
                  </div>
                </div>

                <div>
                  <div className="small text-muted">Objectifs</div>
                  <div className="p-2 border rounded bg-body">
                    {formatText(selectedAdherent.profile.objectifs)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100">
              <p className="text-center fs-6">Pas encore de data</p>
            </div>
          )}
        </div>

        {/* ================= STATUT GLOBAL ================= */}
        <div className="my-4">
          <h6 className="fw-bold border-bottom pb-2 mb-3">Statut global</h6>

          <InfoRow
            label="Abonnement"
            value={
              selectedAdherent?.active_subscription ? (
                <span className="badge bg-success">Actif</span>
              ) : (
                <span className="badge bg-secondary">Aucun</span>
              )
            }
          />
          <InfoRow
            label="Statut du compte"
            value={
              selectedAdherent?.is_active ? (
                <span className="badge bg-success">Activé</span>
              ) : (
                <span className="badge bg-danger text-body">Desactivé</span>
              )
            }
          />
        </div>

        {/* ================= ABONNEMENT ================= */}
        {selectedAdherent.active_subscription && (
          <div className="mb-3">
            <h6 className="fw-bold border-bottom pb-2 mb-3">Abonnement</h6>

            {(() => {
              const sub = selectedAdherent?.active_subscription;
              const plan = sub?.plan;
              const transactions = sub?.transactions || [];
              const isStudent = plan?.is_student_plan;

              const hasRegistration = transactions.some(
                (t) => t.payment_step === "registration",
              );
              const paidMonths = transactions
                .filter((t) =>
                  [
                    // "monthly",
                    "installment",
                  ].includes(t.payment_step),
                )
                .map((t) => t.payment_index);

              return (
                <div className="subscription-details">
                  {/* HEADER PLAN */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold">{plan?.name}</h5>
                    <span
                      className={`text-uppercase badge ${sub.status === "active" ? "bg-success" : "bg-warning"}`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <InfoRow
                    capitalize
                    label="Début"
                    value={formatDate(sub.starts_at)}
                    textEnd
                  />

                  <InfoRow
                    capitalize
                    label={isStudent ? "Fin prévue" : "Renouvellement"}
                    value={formatDate(sub.ends_at)}
                    textEnd
                  />

                  {/* PROGRESSION ÉTUDIANT */}
                  {isStudent && (
                    <div className="card border-0 bg-body my-3 p-3">
                      <label className="small fw-bold text-muted mb-2 text-uppercase">
                        Suivi des règlements
                      </label>

                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <span
                          className={`badge rounded-pill p-2 ${hasRegistration ? "bg-success" : "bg-body text-body border"}`}
                        >
                          <i
                            className={`bi bi-${hasRegistration ? "check-circle" : "circle"} me-1`}
                          ></i>{" "}
                          Inscription
                        </span>

                        {[...Array(plan.total_payments)].map((_, i) => {
                          const idx = i + 1;
                          // On allume si l'index est inférieur ou égal au nombre total de mois payés
                          const isPaidStep = idx <= paidMonths.length;

                          return (
                            <span
                              key={idx}
                              className={`badge rounded-pill border p-2 ${
                                isPaidStep
                                  ? "bg-success shadow-sm"
                                  : "bg-body text-muted"
                              }`}
                              style={{
                                minWidth: "45px",
                                transition: "all 0.3s ease", // Petit effet fluide
                                opacity: isPaidStep ? 1 : 0.6,
                              }}
                            >
                              {isPaidStep ? (
                                <i className="bi bi-check-lg mr-1"></i>
                              ) : (
                                ""
                              )}{" "}
                              M{idx}
                            </span>
                          );
                        })}
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${(paidMonths.length / plan.total_payments) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <small className="mt-2 text-muted">
                        {sub.remaining_months} mensualité(s) restante(s)
                      </small>
                    </div>
                  )}

                  {/* RAPPEL FINANCIER */}
                  <div className="mt-3 p-3 border-start border-4 border-primary bg-body rounded-end">
                    <div className="small fw-bold text-primary mb-2">
                      TARIFICATION "{plan.name}"
                    </div>
                    {isStudent ? (
                      <div className="row g-0">
                        <div className="col-4 border-end text-center">
                          <div className="small text-muted">Inscrip.</div>
                          <div className="fw-bold">{plan.registration_fee}</div>
                        </div>
                        <div className="col-4 border-end text-center">
                          <div className="small text-muted">Mois</div>
                          <div className="fw-bold">{plan.monthly_price}</div>
                        </div>
                        <div className="col-4 text-center">
                          <div className="small text-muted">Total</div>
                          <div className="fw-bold">{plan.total_payments} m</div>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between">
                        <span>
                          Prix : <strong>{plan?.price} XOF</strong>
                        </span>
                        <span className="text-capitalize">
                          Type : <strong>{plan?.billing_type}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default AdhModalComponent;
