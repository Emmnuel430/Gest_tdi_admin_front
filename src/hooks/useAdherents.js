import { useState, useEffect, useCallback } from "react";
import { useFetchWithToken } from "./useFetchWithToken";

export const useAdherents = (showToast) => {
  const { fetchWithToken } = useFetchWithToken();
  const [adherents, setAdherents] = useState([]);
  const [sortedAdherents, setSortedAdherents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdherents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents`,
      );
      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();

      setAdherents(data);
      setSortedAdherents(data);
    } catch (err) {
      showToast("Erreur chargement : " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAdherents();
  }, [fetchAdherents]);

  const deleteAdherent = async (id) => {
    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${id}`,
        { method: "DELETE" },
      );

      const result = await res.json();

      if (result.status === "deleted") {
        setAdherents((prev) => prev.filter((a) => a.id !== id));
        setSortedAdherents((prev) => prev.filter((a) => a.id !== id));
        showToast("Supprimé avec succès", "success");
      } else {
        throw new Error();
      }
    } catch {
      showToast("Erreur suppression", "error");
    }
  };

  const handleToggleValidate = async (adherent) => {
    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${adherent.id}/toggle-validate`,
        { method: "PATCH" },
      );

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, "success");

        setAdherents((prev) =>
          prev.map((a) =>
            a.id === adherent.id ? { ...a, is_active: !a.is_active } : a,
          ),
        );
        setSortedAdherents((prev) =>
          prev.map((a) =>
            a.id === adherent.id ? { ...a, is_active: !a.is_active } : a,
          ),
        );
      }
    } catch {
      showToast("Erreur lors de la validation", "error");
    }
  };

  return {
    adherents,
    sortedAdherents,
    setSortedAdherents,
    loading,
    deleteAdherent,
    handleToggleValidate,
  };
};
