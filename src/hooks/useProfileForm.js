import { useState, useEffect } from "react";
import { useFetchWithToken } from "./useFetchWithToken";

const STORAGE_KEY = "adherent_profile_form";

export function useProfileForm(initialData = {}) {
  const { fetchWithToken } = useFetchWithToken();

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= PERSISTENCE =================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // ================= UPDATE FIELD =================
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= API SAVE =================
  const saveStep = async (extraData = {}) => {
    setLoading(true);
    setErrors({});

    try {
      await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/validate`,
        {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            ...extraData,
          }),
        },
      );
    } catch (err) {
      if (err.type === "validation") {
        setErrors(err.errors);
        throw err;
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= NAVIGATION =================
  const nextStep = async () => {
    try {
      await saveStep(); // autosave backend
      setCurrentStep((prev) => prev + 1);
    } catch {
      // stop si erreur
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // ================= FINAL SUBMIT =================
  const submitFinal = async () => {
    try {
      await saveStep({ is_final_step: true });

      // nettoyage localStorage après succès
      localStorage.removeItem(STORAGE_KEY);

      return true;
    } catch {
      return false;
    }
  };

  // ================= HELPERS =================
  const getError = (field) => errors[field]?.[0];

  return {
    formData,
    setFormData,
    updateField,

    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,

    submitFinal,

    errors,
    getError,
    loading,
  };
}
