import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TiptapEditor from "./TiptapEditor";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup"; // Importation du modal de confirmation
import ToastMessage from "../../components/Layout/ToastMessage";
import { fetchWithToken } from "../../utils/fetchWithToken"; // Importation d'une fonction utilitaire pour les requêtes avec token

const AddPage = () => {
  const [error, setError] = useState(""); // Message d'erreur en cas de problème
  const [page, setPage] = useState({
    title: "",
    subtitle: "",
    main_image: null,
    template: "",
    order: "",
    sections: [],
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePageChange = (e) => {
    const { name, value, files } = e.target;
    setPage((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const addSection = () => {
    setPage((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          subtitle: "",
          image: null,
          order: prev.sections.length + 1,
          subsections: [],
        },
      ],
    }));
  };

  const removeSection = (index) => {
    const newSections = [...page.sections];
    newSections.splice(index, 1);
    setPage({ ...page, sections: newSections });
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...page.sections];
    newSections[index][field] = value;
    setPage({ ...page, sections: newSections });
  };

  const addSubsection = (sectionIndex) => {
    const newSections = [...page.sections];
    newSections[sectionIndex].subsections.push({
      title: "",
      content: "",
      date: "",
      prix: "",
      image: null,
      order: newSections[sectionIndex].subsections.length + 1,
    });
    setPage({ ...page, sections: newSections });
  };

  const removeSubsection = (sectionIndex, subIndex) => {
    const newSections = [...page.sections];
    newSections[sectionIndex].subsections.splice(subIndex, 1);
    setPage({ ...page, sections: newSections });
  };

  const handleSubsectionChange = (sectionIndex, subIndex, field, value) => {
    const newSections = [...page.sections];
    newSections[sectionIndex].subsections[subIndex][field] = value;
    setPage({ ...page, sections: newSections });
  };

  const handleSubmit = async () => {
    setLoading(true);
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
          sub.title
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][content]`,
          sub.content || ""
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][date]`,
          sub.date || ""
        );
        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][prix]`,
          sub.prix !== null && sub.prix !== undefined ? sub.prix : ""
        );

        formData.append(
          `sections[${sIndex}][subsections][${subIndex}][order]`,
          sub.order || 1
        );

        if (sub.image instanceof File) {
          formData.append(
            `sections[${sIndex}][subsections][${subIndex}][image]`,
            sub.image
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
        }
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="mb-4">Créer une page</h2>

            {error && (
              <ToastMessage message={error} onClose={() => setError(null)} />
            )}

            <form>
              <div className="mb-3">
                <label className="form-label">* Titre</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Ex: Bienvenue, À propos, Nos activités..."
                  value={page.title}
                  onChange={handlePageChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Sous-titre</label>
                <input
                  type="text"
                  name="subtitle"
                  className="form-control"
                  placeholder="Ex: Introduction, Notre histoire, Détails complémentaires..."
                  value={page.subtitle}
                  onChange={handlePageChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Numéro d'ordre</label>
                <input
                  type="number"
                  name="order"
                  className="form-control"
                  placeholder="Ex: 1, 2, 3 (pour définir l'ordre d'affichage)"
                  value={page.order}
                  onChange={handlePageChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">* Template</label>
                <select
                  name="template"
                  className="form-select"
                  value={page.template}
                  onChange={handlePageChange}
                  required
                >
                  <option value="">-- Choisir un modèle de page --</option>
                  <option value="accueil">Accueil</option>
                  <option value="classic">Classique</option>
                  <option value="boutique">Boutique</option>
                  <option value="membres">Membres</option>
                  <option value="parachiot">Parachiot</option>
                  <option value="dons">Dons</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Image principale</label>
                <input
                  type="file"
                  name="main_image"
                  className="form-control"
                  placeholder="Image affichée en haut de la page"
                  onChange={handlePageChange}
                />
              </div>

              <h4 className="mb-3">Sections</h4>
              {page.sections.map((section, sIndex) => (
                <div key={sIndex} className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Section {sIndex + 1}</h5>

                    <div className="mb-3">
                      <label className="form-label">* Titre de section</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: Nos valeurs, Galerie, Contact..."
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(sIndex, "title", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Sous-titre</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Complément d'information de la section"
                        value={section.subtitle}
                        onChange={(e) =>
                          handleSectionChange(
                            sIndex,
                            "subtitle",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          handleSectionChange(
                            sIndex,
                            "image",
                            e.target.files[0]
                          )
                        }
                      />
                    </div>

                    {section.subsections.map((sub, subIndex) => (
                      <div key={subIndex} className="border rounded p-3 mb-3">
                        <h5 className="mb-2">
                          Sous-section {sIndex + 1}-{subIndex + 1}
                        </h5>
                        <hr />

                        <div className="mb-2">
                          <label className="form-label">* Titre</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Activité 1, Article 2, Service 3..."
                            value={sub.title}
                            onChange={(e) =>
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "title",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Contenu</label>
                          <TiptapEditor
                            value={sub.content}
                            onChange={(value) =>
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "content",
                                value
                              )
                            }
                          />
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={sub.date || ""}
                            onChange={(e) =>
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">
                            Prix (seulement pour la boutique)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Ex: 5000 (en FCFA)"
                            value={sub.prix || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const prix =
                                value === "" ? null : parseFloat(value);
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "prix",
                                prix
                              );
                            }}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Image</label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) =>
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "image",
                                e.target.files[0]
                              )
                            }
                          />
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger mt-2"
                          onClick={() => removeSubsection(sIndex, subIndex)}
                        >
                          Supprimer sous-section
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => addSubsection(sIndex)}
                    >
                      + Ajouter sous-section
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeSection(sIndex)}
                    >
                      Supprimer section
                    </button>
                  </div>
                </div>
              ))}

              <div className="d-grid mb-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={addSection}
                >
                  + Ajouter section
                </button>
              </div>

              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                  disabled={loading || !page.title || !page.template}
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
            </form>
          </div>
        </div>
      </div>

      {/* onSubmit={handleSubmit} */}

      {/* Modal de confirmation si besoin */}
      <ConfirmPopup
        show={showModal}
        onClose={handleCancel}
        onConfirm={handleSubmit}
        title="Confirmer la création de la page"
        body={<p>Voulez-vous vraiment enregistrer cette page ?</p>}
      />
    </Layout>
  );
};

export default AddPage;
