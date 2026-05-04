import { useState, useEffect } from "react";
import { useFetchWithToken } from "./useFetchWithToken";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "adherent_profile_form";

export function useProfileForm(initialData = {}) {
  const { adherent, updateAdherent } = useAuth();
  const { fetchWithToken } = useFetchWithToken();

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [loadingInit, setLoadingInit] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!adherent?.profile_completed) {
        setLoadingInit(false);
        return;
      }

      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/adherent/me`,
        );
        const data = await res.json();
        const profile = data.profile || {};

        // ✅ Nettoyage des données pour les inputs HTML
        const cleanProfile = { ...profile };
        if (profile.date_naissance) {
          cleanProfile.date_naissance = profile.date_naissance.split("T")[0]; // Garde YYYY-MM-DD
        }

        setFormData(cleanProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProfile));
      } catch (e) {
        console.error("Erreur API", e);
      } finally {
        setLoadingInit(false);
      }
    };

    if (adherent) loadProfile();
  }, [adherent]);

  // ================= PERSISTENCE =================
  useEffect(() => {
    if (!loadingInit) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, loadingInit]);

  // ================= UPDATE FIELD =================
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      updateAdherent({ profile_completed: true });

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
