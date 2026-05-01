import { useCallback, useEffect, useRef, useState } from "react";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import Loader from "../../components/Layout/Loader";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useToast } from "../../context/ToastContext";
import { useMedia } from "../../hooks/useMedia";

export default function MediaPicker({ dossierId, onSuccess, onDelete }) {
  const { fetchWithToken } = useFetchWithToken();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const observerRef = useRef();

  const { showToast } = useToast();
  const { ui, close, openConfirm, openDelete } = useCrudUI();
  const {
    medias,
    loading,
    uploading,
    uploadProgress,
    loadMedias,
    uploadMedias,
    deleteMedias,
  } = useMedia();

  // =========================
  // LOAD MORE (pagination)
  // =========================
  const loadMore = useCallback(async () => {
    if (loading) return;
    if (lastPage && page > lastPage) return;

    const result = await loadMedias(page);
    if (!result) return;

    setLastPage(result.lastPage);
    setPage((prev) => prev + 1);
  }, [page, lastPage, loading, loadMedias]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  // =========================
  // INFINITE SCROLL
  // =========================
  const lastElementRef = (node) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (node) observerRef.current.observe(node);
  };

  // =========================
  // SELECT
  // =========================
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // =========================
  // UPLOAD (drag & drop)
  // =========================

  const handleUpload = async (files) => {
    try {
      await uploadMedias(files);
      showToast("Images téléchargées avec succès", "success");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du téléchargement", "danger");
    }
  };

  // =========================
  // ATTACH
  // =========================

  const handleAttach = async () => {
    if (selected.length === 0) return;

    await fetchWithToken(
      `${process.env.REACT_APP_API_BASE_URL}/galerie/images/attach`,
      {
        method: "POST",
        body: JSON.stringify({
          dossier_id: dossierId,
          media_ids: selected,
        }),
      },
    );
    close();
    onSuccess();
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async () => {
    if (selected.length === 0) return;

    const result = await deleteMedias(selected);
    if (result.success) {
      showToast(`${selected.length} image(s) supprimée(s)`, "danger");
      setSelected([]);
      onDelete();
      close();
    } else {
      showToast(result.error, "danger");
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="d-flex flex-column gap-3">
      {/* DROPZONE */}
      <div
        className={`border border-2 border-dashed rounded p-4 text-center position-relative bg-body ${
          isDragging ? "border-primary" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleUpload(e.dataTransfer.files);
        }}
      >
        <i className="fa fa-cloud-upload-alt fa-2x text-primary mb-2"></i>

        <p className="mb-1 fw-semibold">Glissez-déposez vos fichiers ici</p>

        {!isDragging && (
          <small className="text-muted">ou cliquez pour parcourir</small>
        )}

        <input
          type="file"
          multiple
          className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
          style={{ cursor: "pointer" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>
      {uploading && (
        <div className="mt-3">
          <div className="progress">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* GRID */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "10vh" }}
        >
          <Loader />
        </div>
      ) : (
        <div
          className="d-flex flex-wrap gap-2 my-2 overflow-auto justify-content-start border p-2"
          style={{ maxHeight: "400px" }}
        >
          {medias.length ? (
            medias.map((media, index) => {
              const isLast = index === medias.length - 1;
              return (
                <div
                  key={media.id}
                  ref={isLast ? lastElementRef : null}
                  onClick={() => toggleSelect(media.id)}
                  className={`card position-relative border rounded overflow-hidden ${selected.includes(media.id) ? "border-primary border-2" : ""}`}
                  style={{
                    cursor: "pointer",
                    width: "auto",
                    height: "120px",
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    src={media.url}
                    alt=""
                    loading="lazy"
                    className="card-img-top h-100"
                    style={{ objectFit: "contain" }}
                  />
                  {selected.includes(media.id) && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-50 d-flex align-items-center justify-content-center text-white fs-4">
                      ✓
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted py-5 w-100">
              <i className="fa fa-image fa-4x mb-3"></i>
              <p>Aucune image trouvée.</p>
            </div>
          )}
          {/* loader pour infinite scroll */}
          {loading && medias.length > 0 && (
            <div className="w-100 d-flex justify-content-center py-2">
              <Loader />
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      {medias.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex gap-2">
            <p className="text-muted mb-0">{selected?.length} sélectionné(s)</p>
            {selected.length > 0 && (
              <button
                onClick={() => openDelete()}
                className="btn btn-danger btn-sm"
              >
                Suppr ({selected.length})
              </button>
            )}
          </div>

          <button
            onClick={() => openConfirm()}
            className="btn btn-primary"
            disabled={selected?.length === 0}
          >
            Ajouter au dossier
          </button>
        </div>
      )}

      {/* ConfirmPopup */}
      <ConfirmPopup
        show={ui.mode === "confirm"}
        onClose={close}
        onConfirm={handleAttach}
        title="Confirmer l'ajout"
        btnClass="primary"
        body={
          <p>
            Vous êtes sur le point d'ajouter <strong>{selected?.length}</strong>{" "}
            image(s) au dossier.
          </p>
        }
      />

      <ConfirmPopup
        show={ui.mode === "delete"}
        onClose={close}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        btnClass="danger"
        body={
          <p>
            Vous êtes sur le point de supprimer définitivement{" "}
            <strong>{selected?.length} image(s)</strong>. <br />* Cette action
            est irréversible.
          </p>
        }
      />
    </div>
  );
}
