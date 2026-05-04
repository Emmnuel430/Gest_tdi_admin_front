import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
// import SectionForm from "./SectionForm";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { usePage } from "../../hooks/usePage";
import PageForm from "../../components/PageForm";

export default function EditPage() {
  const { fetchWithToken } = useFetchWithToken(); // Importation d'une fonction utilitaire pour les requêtes avec token
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    page,
    setPage,
    previewMainImage,
    setPreviewMainImage,
    error,
    setError,
    loading,
    setLoading,
    showModal,
    setShowModal,
    invalidPublishAt,
    handlePageChange,
    setPageField,
    addSection,
    removeSection,
    handleSectionChange,
    addSubsection,
    removeSubsection,
    handleSubsectionChange,
    isFormValid,
    validatePublishAtDates,
    getMinPublishAt,
    handleSectionOrderChange,
    handleSubsectionOrderChange,
  } = usePage();
  const [deleteMainImage, setDeleteMainImage] = useState(false);
  const [deletedSubsectionIds, setDeletedSubsectionIds] = useState([]);

  // Charger les données existantes
  useEffect(() => {
    // Charger les données existantes
    fetchWithToken(`${process.env.REACT_APP_API_BASE_URL}/page/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPage({
          title: data.title,
          subtitle: data.subtitle || "",
          main_image: data.main_image || null,
          template: data.template || "",
          order: data.order || "",
          sections: data.sections.map((sec) => ({
            ...sec,
            image: sec.image || null,
            subsections: sec.subsections.map((sub) => ({
              ...sub,
              image: sub.image || null,
            })),
          })),
        });
        setPreviewMainImage(
          data.main_image
            ? `${process.env.REACT_APP_API_URL}/storage/${data.main_image}`
            : "",
        );
      })
      .catch(() => setError("Erreur lors du chargement de la page"));
  }, [id, setError, setPage, setPreviewMainImage, fetchWithToken]);

  const removeSubsectionWithId = (sectionIndex, subIndex) => {
    removeSubsection(sectionIndex, subIndex, {
      onRemoveId: (id) => setDeletedSubsectionIds((prev) => [...prev, id]),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!validatePublishAtDates()) return;

    const formData = new FormData();

    // Données principales de la page
    formData.append("title", page.title);
    formData.append("subtitle", page.subtitle);
    formData.append("template", page.template);
    formData.append("order", page.order);

    // Suppression d'image principale si demandée
    if (deleteMainImage === true) {
      formData.append("delete_main_image", "1");
    }

    // Image principale de la page
    if (page.main_image instanceof File) {
      formData.append("main_image", page.main_image);
    }

    // Sections
    page.sections.forEach((section, si) => {
      if (section.id) {
        formData.append(`sections[${si}][id]`, section.id);
      }

      formData.append(`sections[${si}][title]`, section.title);
      formData.append(`sections[${si}][subtitle]`, section.subtitle || "");
      formData.append(`sections[${si}][order]`, section.order ?? 1);

      if (section.image instanceof File) {
        formData.append(`sections[${si}][image]`, section.image);
      }

      if (section.delete_image) {
        formData.append(`sections[${si}][delete_image]`, "1");
      }

      // Sous-sections
      section.subsections?.forEach((sub, sj) => {
        if (sub.id) {
          formData.append(`sections[${si}][subsections][${sj}][id]`, sub.id);
        }

        formData.append(
          `sections[${si}][subsections][${sj}][title]`,
          sub.title,
        );
        formData.append(`sections[${si}][subsections][${sj}][type]`, sub.type);
        formData.append(`sections[${si}][subsections][${sj}][link]`, sub.link);
        formData.append(
          `sections[${si}][subsections][${sj}][content]`,
          sub.content ?? "",
        );
        formData.append(
          `sections[${si}][subsections][${sj}][date]`,
          sub.date ?? "",
        );
        formData.append(
          `sections[${si}][subsections][${sj}][prix]`,
          sub.prix ?? "",
        );
        formData.append(
          `sections[${si}][subsections][${sj}][order]`,
          sub.order ?? 1,
        );

        if (sub.publish_at) {
          formData.append(
            `sections[${si}][subsections][${sj}][publish_at]`,
            sub.publish_at,
          );
        }

        if (sub.image instanceof File) {
          formData.append(
            `sections[${si}][subsections][${sj}][image]`,
            sub.image,
          );
        }

        if (sub.delete_image) {
          formData.append(
            `sections[${si}][subsections][${sj}][delete_image]`,
            "1",
          );
        }
      });
    });
    deletedSubsectionIds.forEach((id) => {
      formData.append("deleted_subsections[]", id);
    });

    // Requête
    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/update_page/${id}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("Page modifiée avec succès !");
        navigate("/admin-tdi/pages");
      } else {
        setError(data.error || "Une erreur inattendue est survenue.");
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/pages</Back>
      <PageForm
        page={page}
        handlePageChange={handlePageChange}
        addSection={addSection}
        removeSection={removeSection}
        handleSectionChange={handleSectionChange}
        addSubsection={addSubsection}
        removeSubsection={removeSubsection}
        handleSubsectionChange={handleSubsectionChange}
        invalidPublishAt={invalidPublishAt}
        getMinPublishAt={getMinPublishAt}
        isEdit={true}
        deleteMainImage={deleteMainImage}
        setDeleteMainImage={setDeleteMainImage}
        setPageField={setPageField}
        setPreviewMainImage={setPreviewMainImage}
        previewMainImage={previewMainImage}
        removeSubsectionWithId={removeSubsectionWithId}
        handleSectionOrderChange={handleSectionOrderChange}
        handleSubsectionOrderChange={handleSubsectionOrderChange}
      />

      <div className="container mt-3">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-grid">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Chargement...
                  </>
                ) : (
                  "Enregistrer modifications"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmPopup
        btnClass="success"
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmer la modification"
        body={<p>Enregistrer les changements ?</p>}
      />
      {error && <ToastMessage message={error} onClose={() => setError("")} />}
    </Layout>
  );
}
