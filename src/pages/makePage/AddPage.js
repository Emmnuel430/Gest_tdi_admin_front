import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Importation du modal de confirmation
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken"; // Importation d'une fonction utilitaire pour les requêtes avec token
import { usePage } from "../../hooks/usePage";
import PageForm from "../../components/PageForm";

const AddPage = () => {
  const {
    page,
    error,
    setError,
    loading,
    setLoading,
    showModal,
    setShowModal,
    invalidPublishAt,
    handlePageChange,
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
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    if (!validatePublishAtDates()) return;

    const formData = new FormData();
    formData.append("title", page.title);
    formData.append("subtitle", page.subtitle || "");
    formData.append("template", page.template || "");
    formData.append("order", page.order || "");

    if (page.main_image instanceof File) {
      formData.append("main_image", page.main_image);
    }

    page.sections.forEach((section, sIndex) => {
      formData.append(`sections[${sIndex}][title]`, section.title);
      formData.append(`sections[${sIndex}][subtitle]`, section.subtitle || "");
      formData.append(`sections[${sIndex}][order]`, section.order || 1);

      if (section.image instanceof File) {
        formData.append(`sections[${sIndex}][image]`, section.image);
      }

      section.subsections?.forEach((sub, subIndex) => {
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][title]`,
          sub.title,
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][type]`,
          sub.type,
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][link]`,
          sub.link,
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][content]`,
          sub.content || "",
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][date]`,
          sub.date || "",
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][prix]`,
          sub.prix !== null && sub.prix !== undefined ? sub.prix : "",
        );

        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][order]`,
          sub.order || 1,
        );

        if (sub.publish_at) {
          formData.append(
            `sections[${sIndex}][subsections][${subIndex}][publish_at]`,
            sub.publish_at,
          );
        }

        if (sub.image instanceof File) {
          formData.append(
            `sections[${sIndex}][subsections][${subIndex}][image]`,
            sub.image,
          );
        }
      });
    });

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/add_page`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (response.ok) {
        alert("Page créée avec succès !");
        navigate("/admin-tdi/pages");
      } else {
        setError("Erreur : " + data.error);
      }
    } catch (error) {
      setError("Erreur serveur", error);
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
                  <>Ajouter</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation si besoin */}
      <ConfirmPopup
        btnClass="primary"
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmer la création de la page"
        body={<p>Voulez-vous vraiment enregistrer cette page ?</p>}
      />
      {error && <ToastMessage message={error} onClose={() => setError(null)} />}
    </Layout>
  );
};

export default AddPage;
