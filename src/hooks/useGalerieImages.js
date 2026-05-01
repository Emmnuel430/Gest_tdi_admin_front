import { useState, useEffect, useCallback } from "react";
import { useFetchWithToken } from "./useFetchWithToken";
import { useToast } from "../context/ToastContext";

export const useGalerieImages = (dossierId) => {
  const { fetchWithToken } = useFetchWithToken();
  const [dossier, setDossier] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingIds, setLoadingIds] = useState([]);

  const { showToast } = useToast();

  const fetchImages = useCallback(
    async (dossierId) => {
      setLoading(true);
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/images/dossier/${dossierId}`,
        );
        const data = await res.json();
        setImages(data.images);
        setDossier(data.dossier);
      } catch {
        setError("Erreur chargement images");
      } finally {
        setLoading(false);
      }
    },
    [fetchWithToken],
  );
  useEffect(() => {
    if (!dossierId) return;

    fetchImages(dossierId);
  }, [dossierId, fetchImages]);

  const deleteImage = async (ids) => {
    try {
      // 🔹 SINGLE
      if (!Array.isArray(ids)) {
        await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/images/${ids}`,
          { method: "DELETE" },
        );
        setImages((prev) => prev.filter((img) => img.id !== ids));
      }

      // 🔹 MULTIPLE
      else {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/galerie/images`,
          {
            method: "DELETE",
            body: JSON.stringify({ ids }),
          },
        );
        const data = await res.json();

        if (data.message) {
          setImages((prev) => prev.filter((img) => !ids.includes(img.id)));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleImage = async (id) => {
    setLoadingIds((prev) => [...prev, id]);

    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/galerie/images/${id}/toggle`,
        { method: "PATCH" },
      );

      const data = await res.json();

      if (data.message) {
        showToast(data.message, "primary");

        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, is_visible: !img.is_visible } : img,
          ),
        );
      }
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  return {
    fetchImages,
    dossier,
    images,
    loading,
    error,
    loadingIds,
    deleteImage,
    toggleImage,
  };
};
