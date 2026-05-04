import { useState, useCallback } from "react";
import { useFetchWithToken } from "./useFetchWithToken";
import { uploadWithToken } from "../utils/uploadWithToken";

export const useMedia = () => {
  const { fetchWithToken } = useFetchWithToken();
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load medias with pagination
  const loadMedias = useCallback(
    async (page = 1) => {
      if (loading) return;

      setLoading(true);
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/media?page=${page}`,
        );
        const data = await res.json();

        // Avoid duplicates by filtering existing IDs
        setMedias((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMedias = data.data.filter((m) => !existingIds.has(m.id));
          return page === 1 ? newMedias : [...prev, ...newMedias];
        });

        return {
          data: data.data,
          lastPage: data.last_page,
          currentPage: data.current_page,
        };
      } catch (error) {
        console.error("Error loading medias:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loading, fetchWithToken],
  );

  // Upload medias
  const uploadMedias = useCallback(async (files) => {
    const formData = new FormData();
    [...files].forEach((file) => {
      formData.append("images[]", file);
    });

    setUploading(true);
    setUploadProgress(0);

    return new Promise((resolve, reject) => {
      uploadWithToken(`${process.env.REACT_APP_API_BASE_URL}/media`, formData, {
        onProgress: (percent) => {
          setUploadProgress(percent);
        },
        onSuccess: (data) => {
          // Add new medias to the beginning, avoiding duplicates
          setMedias((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMedias = data.filter((m) => !existingIds.has(m.id));
            return [...newMedias, ...prev];
          });
          setUploading(false);
          resolve(data);
        },
        onError: (err) => {
          console.error("Upload error:", err);
          setUploading(false);
          reject(err);
        },
      });
    });
  }, []);

  // Delete medias (force delete)
  const deleteMedias = useCallback(
    async (ids) => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/media/force`,
          {
            method: "DELETE",
            body: JSON.stringify({ ids }),
          },
        );

        if (response.ok) {
          // Remove deleted medias from local state
          setMedias((prev) => prev.filter((media) => !ids.includes(media.id)));
          return { success: true };
        } else {
          const error = await response.json();
          return {
            success: false,
            error: error.error || "Erreur lors de la suppression",
          };
        }
      } catch (err) {
        console.error("Delete error:", err);
        return { success: false, error: "Erreur lors de la suppression" };
      }
    },
    [fetchWithToken],
  );

  return {
    medias,
    loading,
    uploading,
    uploadProgress,
    loadMedias,
    uploadMedias,
    deleteMedias,
    setMedias,
  };
};
