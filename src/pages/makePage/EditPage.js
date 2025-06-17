import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import ToastMessage from "../../components/Layout/ToastMessage";
// import SectionForm from "./SectionForm";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState({
    title: "",
    subtitle: "",
    main_image: null,
    template: "",
    order: "",
    sections: [],
  });
  const [previewMainImage, setPreviewMainImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletedSubsectionIds, setDeletedSubsectionIds] = useState([]);

  useEffect(() => {
    // Charger les données existantes
    fetch(`${process.env.REACT_APP_API_BASE_URL}/page/${id}`)
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
            : ""
        );
      })
      .catch(() => setError("Erreur lors du chargement de la page"));
  }, [id]);

  const handlePageChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "main_image" && files) {
      setPreviewMainImage(URL.createObjectURL(files[0]));
      setPage((prev) => ({ ...prev, main_image: files[0] }));
    } else {
      setPage((prev) => ({ ...prev, [name]: value }));
    }
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
    const removed = newSections[sectionIndex].subsections[subIndex];

    // Si elle a un id (donc existe déjà en base), on l'ajoute à la liste des suppressions
    if (removed.id) {
      setDeletedSubsectionIds((prev) => [...prev, removed.id]);
    }

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

    // Données principales de la page
    formData.append("title", page.title);
    formData.append("subtitle", page.subtitle);
    formData.append("template", page.template);
    formData.append("order", page.order);

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

      // Sous-sections
      section.subsections?.forEach((sub, sj) => {
        if (sub.id) {
          formData.append(`sections[${si}][subsections][${sj}][id]`, sub.id);
        }

        formData.append(
          `sections[${si}][subsections][${sj}][title]`,
          sub.title
        );
        formData.append(
          `sections[${si}][subsections][${sj}][content]`,
          sub.content ?? ""
        );
        formData.append(
          `sections[${si}][subsections][${sj}][date]`,
          sub.date ?? ""
        );
        formData.append(
          `sections[${si}][subsections][${sj}][prix]`,
          sub.prix ?? ""
        );
        formData.append(
          `sections[${si}][subsections][${sj}][order]`,
          sub.order ?? 1
        );

        if (sub.image instanceof File) {
          formData.append(
            `sections[${si}][subsections][${sj}][image]`,
            sub.image
          );
        }
      });
    });
    deletedSubsectionIds.forEach((id) => {
      formData.append("deleted_subsections[]", id);
    });

    // Requête
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/update_page/${id}`,
        {
          method: "POST",
          body: formData,
        }
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h2 className="mb-4">Modifier la page</h2>

            {error && (
              <ToastMessage message={error} onClose={() => setError("")} />
            )}

            <form>
              {/* * Titre, sous-titre, image principale avec aperçu */}
              <div className="mb-3">
                <label className="form-label">* Titre</label>
                <input
                  name="title"
                  className="form-control"
                  value={page.title}
                  onChange={handlePageChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Sous‑titre</label>
                <input
                  name="subtitle"
                  className="form-control"
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
                  value={page.order}
                  onChange={handlePageChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Template</label>
                <select
                  name="template"
                  className="form-select"
                  value={page.template}
                  onChange={handlePageChange}
                  required
                >
                  <option value="">---</option>
                  <option value="accueil">Accueil</option>
                  <option value="classic">Classique</option>
                  <option value="boutique">Boutique</option>
                  <option value="membres">Membres</option>
                  <option value="dons">Dons</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Image principale</label>
                {page.main_image && !(page.main_image instanceof File) && (
                  <div className="alert alert-warning">
                    Une image est déjà associée à cette page. Cliquez ci-dessous
                    pour en choisir une nouvelle.
                  </div>
                )}
                <input
                  name="main_image"
                  type="file"
                  className="form-control"
                  onChange={handlePageChange}
                />
                {!!previewMainImage && (
                  <div className="mt-4 text-center">
                    <span className="text-muted text-sm">Aperçu</span>
                    <img
                      src={previewMainImage}
                      alt="Aperçu"
                      className="mt-2 img-fluid rounded shadow-sm"
                      style={{
                        maxHeight: "200px",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
              </div>

              <h4>Sections</h4>
              {page.sections.map((section, sIndex) => (
                <div key={sIndex} className="card border border-3 mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Section {sIndex + 1}</h5>

                    <div className="mb-3">
                      <label className="form-label">* Titre de section</label>
                      <input
                        type="text"
                        className="form-control"
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
                      {section.image && !(section.image instanceof File) && (
                        <div className="alert alert-warning">
                          Une image est déjà associée à cette section. Cliquez
                          ci-dessous pour en choisir une nouvelle.
                        </div>
                      )}
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

                    <h6 className="mt-4">Sous-sections</h6>
                    {section.subsections.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        className="border border-3 rounded p-3 mb-3"
                      >
                        <div className="mb-2">
                          <label className="form-label">* Titre</label>
                          <input
                            type="text"
                            className="form-control"
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
                          <ReactQuill
                            key={`section-${sIndex}-sub-${subIndex}`}
                            theme="snow"
                            value={sub.content}
                            onChange={(value) =>
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "content",
                                value
                              )
                            }
                            modules={{
                              toolbar: [
                                [{ header: [1, 2, false] }],
                                ["bold", "italic", "underline"],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["link"],
                                ["clean"],
                              ],
                            }}
                            formats={[
                              "header",
                              "bold",
                              "italic",
                              "underline",
                              "list",
                              "bullet",
                              "link",
                            ]}
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
                            value={sub.prix || ""}
                            onChange={(e) =>
                              handleSubsectionChange(
                                sIndex,
                                subIndex,
                                "prix",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Image</label>
                          {sub.image && !(sub.image instanceof File) && (
                            <div className="alert alert-warning">
                              Une image est déjà associée à cette sous-section.
                              Cliquez ci-dessous pour en choisir une nouvelle.
                            </div>
                          )}
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

              <div className="d-grid mb-4">
                <button
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
                    "Enregistrer modifications"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ConfirmPopup
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        title="Confirmer la modification"
        body={<p>Enregistrer les changements ?</p>}
      />
    </Layout>
  );
}
