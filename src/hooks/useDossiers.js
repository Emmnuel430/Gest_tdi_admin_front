import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import { useToast } from "../context/ToastContext";

export const useDossiers = () => {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLoadingIds] = useState([]);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchDossiers = async () => {
      setLoading(true);
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers`,
        );
        const data = await res.json();
        setDossiers(data);
      } catch (err) {
        setError("Erreur chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, []);

  const deleteDossier = async (ids) => {
    try {
      // 🔹 SINGLE
      if (!Array.isArray(ids)) {
        await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers/${ids}`,
          { method: "DELETE" },
        );
        setDossiers((prev) => prev.filter((dossier) => dossier.id !== ids));
      }

      // 🔹 MULTIPLE
      else {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers`,
          {
            method: "DELETE",
            body: JSON.stringify({ ids }),
          },
        );
        const data = await res.json();

        if (data.message) {
          setDossiers((prev) =>
            prev.filter((dossier) => !ids.includes(dossier.id)),
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDossier = async (id) => {
    setLoadingIds((prev) => [...prev, id]);

    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galerie/dossiers/${id}/toggle`,
        { method: "PATCH" },
      );

      const data = await res.json();

      if (data.message) {
        showToast(data.message, "primary");

        setDossiers((prev) =>
          prev.map((dossier) =>
            dossier.id === id
              ? { ...dossier, is_visible: !dossier.is_visible }
              : dossier,
          ),
        );
      }
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  return {
    dossiers,
    setDossiers,
    loading,
    error,
    setError,
    deleteDossier,
    toggleDossier,
  };
};
