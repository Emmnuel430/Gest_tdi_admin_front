import React from "react";

const ContentForm = ({
  text,
  form,
  setForm,
  plans,
  loading,
  handleChange,
  handlePlanChange,
  onSubmit,
  buttonText,
}) => {
  const now = new Date().toISOString().slice(0, 16);
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* HEADER */}
          <div className="mb-4 text-center">
            <h2 className="fw-bold">{text}</h2>
          </div>

          {/* CARD */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* SECTION INFOS */}
              <h5 className="mb-3 fw-semibold">Informations principales</h5>

              <div className="mb-3">
                <label className="form-label">Titre *</label>
                <input
                  disabled={loading}
                  type="text"
                  name="title"
                  className="form-control form-control-lg"
                  placeholder="Ex: Formation avancée"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Type *</label>
                <select
                  disabled={loading}
                  name="type"
                  className="form-select"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choisir un type --</option>
                  <option value="formation">🎓 Formation</option>
                  <option value="cours">📘 Cours</option>
                  <option value="evenement">📅 Événement</option>
                </select>
              </div>

              {/* SECTION CONTENU */}
              <h5 className="mb-3 fw-semibold">Contenu *</h5>

              <div className="mb-3">
                <textarea
                  disabled={loading}
                  name="content"
                  className="form-control"
                  rows={5}
                  placeholder="Ajoutez une description détaillée..."
                  value={form.content}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <h5 className="mb-3 fw-semibold">Lien d'accès</h5>
                <input
                  disabled={loading}
                  type="url"
                  name="lien"
                  className="form-control"
                  placeholder="🔗 https://exemple.com"
                  value={form.lien}
                  onChange={handleChange}
                />
              </div>

              {/* SECTION PUBLICATION */}
              <h5 className="mb-3 fw-semibold">Publication</h5>

              <div className="mb-4">
                <input
                  disabled={loading}
                  type="datetime-local"
                  min={now}
                  name="publish_at"
                  className="form-control"
                  value={form.publish_at}
                  onChange={handleChange}
                />
              </div>

              {/* SECTION VISIBILITÉ */}
              <h5 className="mb-3 fw-semibold">Visibilité</h5>

              <div className="d-flex flex-column gap-2 mb-4">
                {/* PUBLIC */}
                <label
                  className={`border rounded p-3 ${
                    form.visibility === "public" ? "border-primary bg-body" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    disabled={loading}
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={form.visibility === "public"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        visibility: e.target.value,
                        plan_ids: [],
                      })
                    }
                    className="form-check-input me-2"
                  />
                  🌍 <strong>Public</strong>
                  <div className="text-muted small">
                    Visible par tout le monde
                  </div>
                </label>

                {/* STUDENTS */}
                <label
                  className={`border rounded p-3 ${
                    form.visibility === "students"
                      ? "border-primary bg-body"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    disabled={loading}
                    type="radio"
                    name="visibility"
                    value="students"
                    checked={form.visibility === "students"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        visibility: e.target.value,
                        plan_ids: [],
                      })
                    }
                    className="form-check-input me-2"
                  />
                  🎓 <strong>Étudiants uniquement</strong>
                  <div className="text-muted small">
                    Accessible aux utilisateurs inscrits en tant qu'étudiant
                  </div>
                </label>

                {/* PLANS */}
                <label
                  className={`border rounded p-3 ${
                    form.visibility === "plans" ? "border-primary bg-body" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    disabled={loading}
                    type="radio"
                    name="visibility"
                    value="plans"
                    checked={form.visibility === "plans"}
                    onChange={(e) =>
                      setForm({ ...form, visibility: e.target.value })
                    }
                    className="form-check-input me-2"
                  />
                  💳 <strong>Choisir des plans</strong>
                  <div className="text-muted small">
                    Limiter à certains abonnements
                  </div>
                </label>
              </div>

              {form.visibility === "plans" && (
                <>
                  <h6 className="mb-3 fw-semibold">Plans d'abonnement</h6>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {plans.map((plan) => (
                      <label
                        key={plan.id}
                        className={`border rounded px-3 py-2 ${
                          form.plan_ids.includes(plan.id)
                            ? "bg-primary text-white"
                            : "bg-body"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          disabled={loading}
                          type="checkbox"
                          className="d-none"
                          checked={form.plan_ids.includes(plan.id)}
                          onChange={() => handlePlanChange(plan.id)}
                        />
                        {plan.name}
                      </label>
                    ))}
                  </div>
                </>
              )}
              {/* ACTION */}
              <button
                className="btn btn-primary w-100 py-2 "
                onClick={onSubmit}
                disabled={
                  loading ||
                  !form.title ||
                  !form.type ||
                  !form.content ||
                  !form.visibility
                }
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer le contenu"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
