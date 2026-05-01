import React from "react";

export default function SubscriptionPlanForm({
  formData,
  setFormData,
  loading,
  onSubmit,
  submitLabel = "Valider",
}) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdvantageChange = (index, value) => {
    const updated = [...formData.advantages];
    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      advantages: updated,
    }));
  };

  const addAdvantage = () => {
    setFormData((prev) => ({
      ...prev,
      advantages: [...(prev.advantages || []), ""],
    }));
  };

  const removeAdvantage = (index) => {
    const updated = formData.advantages.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      advantages: updated,
    }));
  };

  return (
    <>
      {/* Nom */}
      <div className="mb-3">
        <label className="form-label">Nom du plan</label>
        <input
          disabled={loading}
          type="text"
          className="form-control"
          value={formData.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ex: Plan classique, Plan étudiant..."
        />
      </div>

      {/* Type */}
      <div className="mb-3">
        <label className="form-label">Type de facturation</label>
        <select
          disabled={loading}
          className="form-select"
          value={formData.billing_type || "monthly"}
          onChange={(e) => handleChange("billing_type", e.target.value)}
        >
          <option value="monthly">Mensuel</option>
          <option value="one_time">Paiement unique</option>
          <option value="hybrid">Hybride</option>
        </select>
      </div>

      {/* PRICE */}
      {(formData.billing_type === "monthly" ||
        formData.billing_type === "one_time") && (
        <div className="mb-3">
          <label className="form-label">Prix total</label>
          <input
            disabled={loading}
            type="number"
            className="form-control"
            min="0"
            value={formData.price || ""}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="Ex: 15000"
          />
        </div>
      )}

      {/* DURATION */}
      {/* {formData.billing_type === "one_time" && (
            <div className="mb-3">
            <label className="form-label">Durée de la formation en mois</label>
            <input
            disabled={loading}
                type="number"
                className="form-control"
                min="1"
                value={formData.duration_months || ""}
                onChange={(e) => handleChange("duration_months", e.target.value)}
                placeholder="Ex: 12"
            />
            </div>
        )} */}

      {/* HYBRID */}
      {formData.billing_type === "hybrid" && (
        <>
          <div className="mb-3">
            <label className="form-label">Frais d'inscription</label>
            <input
              disabled={loading}
              type="number"
              className="form-control"
              min="0"
              value={formData.registration_fee || ""}
              onChange={(e) => handleChange("registration_fee", e.target.value)}
              placeholder="Ex: 10000"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Prix mensuel</label>
            <input
              disabled={loading}
              type="number"
              className="form-control"
              min="0"
              value={formData.monthly_price || ""}
              onChange={(e) => handleChange("monthly_price", e.target.value)}
              placeholder="Ex: 5000"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre de paiements</label>
            <input
              disabled={loading}
              type="number"
              className="form-control"
              min="1"
              value={formData.total_payments || ""}
              onChange={(e) => handleChange("total_payments", e.target.value)}
              placeholder="Ex: 12"
            />
          </div>
        </>
      )}

      {/* ADVANTAGES */}
      <div className="mb-3 d-flex flex-column">
        <label className="form-label">Avantages</label>

        {(formData.advantages || []).map((adv, idx) => (
          <div key={idx} className="border rounded p-2 mb-2">
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Ex: Accès illimité"
                disabled={loading}
                value={adv}
                onChange={(e) => handleAdvantageChange(idx, e.target.value)}
              />

              <button
                type="button"
                className="btn btn-outline-danger"
                disabled={loading}
                onClick={() => removeAdvantage(idx)}
              >
                <i className="fa fa-trash" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addAdvantage}
          disabled={loading}
        >
          <i className="fa fa-plus" /> Ajouter un avantage
        </button>
      </div>

      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="isStudentPlanSwitch"
          checked={formData.is_student_plan || false}
          onChange={(e) => handleChange("is_student_plan", e.target.checked)}
          disabled={loading}
        />
        <label className="form-check-label" htmlFor="isStudentPlanSwitch">
          Plan étudiant
        </label>
      </div>

      {/* SUBMIT */}
      <button
        className="btn btn-primary w-100"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i> Chargement...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </>
  );
}
