import React, { useEffect, useRef } from "react";
import Layout from "../../components/Layout/LayoutAdherent";
import { useProfileForm } from "../../hooks/useProfileForm";
import { useToast } from "../../context/ToastContext";
import { STEPS } from "../../constants/auth";
import Back from "../../components/Layout/Back";

const AdherentValidate = () => {
  // ================= STATE =================
  const {
    formData,
    updateField,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    submitFinal,
    errors,
    getError,
    loading,
  } = useProfileForm();

  const formRef = useRef(null);

  // ================= ÉTAPES DU FORMULAIRE =================
  const step = STEPS[currentStep];
  const hasSavedProfileForm = (() => {
    const saved = localStorage.getItem("adherent_profile_form");
    if (!saved) return false;

    try {
      const parsed = JSON.parse(saved);
      return parsed && Object.keys(parsed).length > 0;
    } catch {
      return false;
    }
  })();

  // ================= SCROLL AUTOMATIQUE VERS ERREUR =================
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [errors]);

  // ================= AFFICHER TOAST =================
  const { showToast } = useToast();

  // ================= HANDLE NEXT =================
  const handleNext = async () => {
    try {
      await nextStep();
    } catch (err) {
      showToast("Veuillez corriger les erreurs avant de continuer", "danger");
    }
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    try {
      const success = await submitFinal();
      if (success) {
        showToast("Profil complété avec succès!", "success");
        setTimeout(() => {
          window.location.href = "/adherent/profil";
        }, 2000);
      } else {
        showToast("Erreur lors de la sauvegarde du profil", "danger");
      }
    } catch (err) {
      showToast("Veuillez corriger les erreurs", "danger");
    }
  };

  // ================= RENDER FIELD =================
  const passwordsMatch =
    !formData.new_password ||
    formData.new_password === formData.confirm_password;

  const isFieldRequired = (field) => {
    if (field.name === "institution_religieuse") {
      return (
        formData.etude_religieuse === true ||
        formData.etude_religieuse === "true"
      );
    }

    if (field.name === "confirm_password") {
      return Boolean(formData.new_password);
    }

    return field.required;
  };

  const getFieldErrorMessage = (field) => {
    if (field.name === "confirm_password" && !passwordsMatch) {
      return "Les nouveaux mots de passe ne correspondent pas.";
    }
    return getError(field.name);
  };

  const renderField = (field) => {
    const fieldRequired = isFieldRequired(field);
    const fieldErrorMessage = getFieldErrorMessage(field);
    const hasError = Boolean(fieldErrorMessage);
    const value = formData[field.name] || "";

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.name} className="mb-3">
            <label htmlFor={field.name} className="form-label fw-semibold">
              {field.label}{" "}
              {fieldRequired && <span className="text-danger">*</span>}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              className={`form-control ${hasError ? "is-invalid" : ""}`}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              value={value}
              required={fieldRequired}
              onChange={(e) => updateField(field.name, e.target.value)}
            />
            {hasError && (
              <div className="invalid-feedback d-block">
                {fieldErrorMessage}
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.name} className="mb-3">
            <label htmlFor={field.name} className="form-label fw-semibold">
              {field.label}{" "}
              {fieldRequired && <span className="text-danger">*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              className={`form-select ${hasError ? "is-invalid" : ""}`}
              value={value}
              required={fieldRequired}
              onChange={(e) => updateField(field.name, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {hasError && (
              <div className="invalid-feedback d-block">
                {fieldErrorMessage}
              </div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.name} className="mb-3 form-check">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              className={`form-check-input ${hasError ? "is-invalid" : ""}`}
              checked={value === true || value === "true"}
              onChange={(e) => updateField(field.name, e.target.checked)}
            />
            <label htmlFor={field.name} className="form-check-label">
              {field.label}
            </label>
            {hasError && (
              <div className="invalid-feedback d-block">
                {fieldErrorMessage}
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <div key={field.name} className="mb-3">
            <label htmlFor={field.name} className="form-label fw-semibold">
              {field.label}{" "}
              {fieldRequired && <span className="text-danger">*</span>}
            </label>
            <input
              type="number"
              id={field.name}
              name={field.name}
              className={`form-control ${hasError ? "is-invalid" : ""}`}
              placeholder={field.placeholder}
              value={value}
              required={fieldRequired}
              onChange={(e) =>
                updateField(
                  field.name,
                  e.target.value ? parseInt(e.target.value) : "",
                )
              }
              min="0"
            />
            {hasError && (
              <div className="invalid-feedback d-block">
                {fieldErrorMessage}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-3">
            <label htmlFor={field.name} className="form-label fw-semibold">
              {field.label}{" "}
              {fieldRequired && <span className="text-danger">*</span>}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              className={`form-control ${hasError ? "is-invalid" : ""}`}
              placeholder={field.placeholder}
              required={fieldRequired}
              value={value}
              onChange={(e) => updateField(field.name, e.target.value)}
            />
            {hasError && (
              <div className="invalid-feedback d-block">
                {fieldErrorMessage}
              </div>
            )}
          </div>
        );
    }
  };

  const isStepInvalid = () => {
    const currentStepFields = STEPS[currentStep].fields;
    const hasPasswordInput =
      formData.old_password ||
      formData.new_password ||
      formData.confirm_password;

    if (currentStep === STEPS.length - 1 && hasPasswordInput) {
      return (
        !formData.old_password ||
        !formData.new_password ||
        !formData.confirm_password ||
        !passwordsMatch
      );
    }

    return currentStepFields.some((field) => {
      if (!isFieldRequired(field)) return false;
      const val = formData[field.name];
      return val === undefined || val === null || val === "" || val === false;
    });
  };

  return (
    <Layout>
      <Back>adherent/profil</Back>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              {/* HEADER */}
              <div className="card-header bg-primary text-white p-4">
                <h4 className="mb-0">
                  {step.icon} {step.title}
                </h4>
                <small className="text-white-50">
                  Étape {currentStep + 1} sur {STEPS.length}
                </small>
              </div>

              {/* PROGRESS BAR */}
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                  }}
                  aria-valuenow={currentStep + 1}
                  aria-valuemin="0"
                  aria-valuemax={STEPS.length}
                />
              </div>

              {/* STEPPER HORIZONTAL */}
              <div className="card-body border-bottom">
                <div className="row g-2 mb-4">
                  {STEPS.map((s, idx) => (
                    <div key={s.id} className="col">
                      <button
                        type="button"
                        className={`btn w-100 py-2 text-center small fw-semibold ${
                          idx === currentStep
                            ? "btn-primary"
                            : idx < currentStep
                              ? "btn-success"
                              : "btn-outline-secondary"
                        }`}
                        onClick={() => {
                          if (idx <= currentStep || hasSavedProfileForm) {
                            setCurrentStep(idx);
                          }
                        }}
                        disabled={idx > currentStep && !hasSavedProfileForm}
                        title={`Étape ${idx + 1}: ${s.title}`}
                      >
                        <span className="d-block">{s.icon}</span>
                        <span
                          className="d-block text-truncate"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {s.title}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* <div className="text-center text-muted small">
                  {hasSavedProfileForm
                    ? "Vous pouvez naviguer entre les étapes."
                    : "Veuillez compléter les étapes dans l'ordre."}
                </div> */}
                {step.description && (
                  <>
                    {/* <hr /> */}
                    <div>
                      <p className="text-muted text-center small mb-0">
                        {step.description}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* FORM FIELDS */}
              <div className="card-body" ref={formRef}>
                <form>{step.fields.map((field) => renderField(field))}</form>
              </div>

              {/* FOOTER NAVIGATION */}
              <div className="card-footer bg-body border-top d-flex justify-content-between align-items-center p-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={prevStep}
                  disabled={currentStep === 0 || loading}
                >
                  ← Précédent
                </button>

                <div className="text-muted small">
                  {currentStep + 1} / {STEPS.length}
                </div>

                {currentStep === STEPS.length - 1 ? (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={loading || isStepInvalid()}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-1"></i>Terminer
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={loading || isStepInvalid()}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Sauvegarde...
                      </>
                    ) : (
                      "Suivant →"
                    )}
                  </button>
                )}
              </div>

              {/* INFO MESSAGE */}
              <div className="card-footer bg-body-tertiary text-center p-3">
                <small className="text-muted">
                  💾 Vos données sont automatiquement sauvegardées à chaque
                  étape
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdherentValidate;
