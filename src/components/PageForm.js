import React from "react";
import TiptapEditor from "../pages/makePage/TiptapEditor";
import SectionsSidebar from "./SectionsSidebar";
import { useSectionFocus } from "../hooks/useSectionFocus";

const PageForm = ({
  page,
  handlePageChange,
  addSection,
  removeSection,
  handleSectionChange,
  addSubsection,
  removeSubsection,
  handleSubsectionChange,
  invalidPublishAt,
  getMinPublishAt,
  isEdit = false,
  deleteMainImage = false,
  setDeleteMainImage = () => {},
  setPageField = () => {},
  setPreviewMainImage = () => {},
  previewMainImage = "",
  removeSubsectionWithId = () => {},
  handleSectionOrderChange,
  handleSubsectionOrderChange,
}) => {
  const { sectionRefs, activeSection, setActiveSection } = useSectionFocus(
    page.sections.length,
  );

  const getOrderOptions = (length) => {
    return Array.from({ length }, (_, i) => i + 1);
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h2 className="mb-4">
            {isEdit ? "Modifier la page" : "Créer une page"}
          </h2>

          <SectionsSidebar
            sections={page.sections}
            sectionRefs={sectionRefs}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <form>
            {/* Pages */}
            {/* * Titre, sous-titre, image principale avec aperçu */}
            <div className="mb-3">
              <label className="form-label">* Titre</label>
              <input
                name="title"
                className="form-control"
                placeholder={
                  isEdit ? "" : "Ex: Bienvenue, À propos, Nos activités..."
                }
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
                placeholder={
                  isEdit
                    ? ""
                    : "Ex: Introduction, Notre histoire, Détails complémentaires..."
                }
                value={page.subtitle}
                onChange={handlePageChange}
              />
            </div>
            <div className="row mb-3">
              {/* ORDER */}
              <div className="col-md-4">
                <label className="form-label">Numéro d'ordre</label>
                <input
                  type="number"
                  name="order"
                  className="form-control"
                  placeholder={isEdit ? "" : "Ex: 1, 2, 3"}
                  value={page.order}
                  onChange={handlePageChange}
                />
              </div>

              {/* TEMPLATE */}
              <div className="col-md-8">
                <label className="form-label">
                  {isEdit ? "" : "* "}Template
                </label>
                <select
                  name="template"
                  className="form-select"
                  value={page.template}
                  onChange={handlePageChange}
                  required
                >
                  <option value="">
                    {isEdit ? "---" : "-- Choisir un modèle de page --"}
                  </option>
                  <option value="accueil">Accueil</option>
                  <option value="classic">Classique</option>
                  <option value="boutique">Boutique</option>
                  <option value="membres">Membres</option>
                  <option value="parachiot">Parachiot</option>
                  <option value="dons">Dons</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Image principale</label>
              {isEdit &&
                page.main_image &&
                !(page.main_image instanceof File) &&
                !deleteMainImage && (
                  <div className="alert alert-warning">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger mb-2"
                      onClick={() => {
                        setDeleteMainImage(true);
                        setPageField("main_image", null);
                        setPreviewMainImage(null);
                      }}
                    >
                      Supprimer l'image
                    </button>{" "}
                    <br />
                    Une image est déjà associée à cette page. Cliquez ci-dessous
                    pour en choisir une nouvelle.
                  </div>
                )}
              <input
                name="main_image"
                type="file"
                className="form-control"
                placeholder={isEdit ? "" : "Image affichée en haut de la page"}
                onChange={handlePageChange}
              />
              {isEdit && !!previewMainImage && (
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

            {/* Sections */}
            <h4>Sections</h4>
            {page.sections.map((section, sIndex) => (
              <div
                key={sIndex}
                className={`card ${isEdit ? "border border-3" : ""} mb-4`}
                ref={sectionRefs.current[sIndex]}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Section {sIndex + 1}</h5>

                    <div className="d-flex flex-row align-items-center gap-2">
                      <label htmlFor="order">N° : </label>
                      <select
                        className="form-select form-select-sm w-auto"
                        value={section.order || sIndex + 1}
                        name="order"
                        id="order"
                        onChange={(e) =>
                          handleSectionOrderChange(
                            sIndex,
                            parseInt(e.target.value),
                          )
                        }
                      >
                        {getOrderOptions(page.sections.length).map((order) => (
                          <option key={order} value={order}>
                            {order}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">* Titre de section</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        isEdit ? "" : "Ex: Nos valeurs, Galerie, Contact..."
                      }
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
                      placeholder={
                        isEdit ? "" : "Complément d'information de la section"
                      }
                      value={section.subtitle}
                      onChange={(e) =>
                        handleSectionChange(sIndex, "subtitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image</label>

                    {isEdit &&
                      section.image &&
                      !(section.image instanceof File) &&
                      !section.delete_image && (
                        <div className="alert alert-warning">
                          <button
                            type="button"
                            className="mb-2 px-3 py-1 btn btn-danger text-white rounded"
                            onClick={() =>
                              handleSectionChange(sIndex, "delete_image", true)
                            }
                          >
                            Supprimer l'image
                          </button>{" "}
                          <br />
                          Une image est déjà associée à cette section. Cliquez
                          ci-dessous pour en choisir une nouvelle.
                        </div>
                      )}

                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) =>
                        handleSectionChange(sIndex, "image", e.target.files[0])
                      }
                    />
                  </div>

                  {/* Sous-sections */}
                  {section.subsections.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className={`border ${isEdit ? "border-3" : ""} rounded p-3 mb-3 ${
                        invalidPublishAt[`${sIndex}-${subIndex}`]
                          ? "border-danger border-5"
                          : ""
                      }`}
                    >
                      <div className="mb-2 d-flex justify-content-between align-items-center">
                        <h5 className="card-title">
                          Sous-section {sIndex + 1}-{subIndex + 1}
                        </h5>

                        <div className="d-flex flex-row align-items-center gap-2">
                          <label htmlFor="order">N° : </label>
                          <select
                            className="form-select form-select-sm w-auto"
                            value={sub.order || subIndex + 1}
                            onChange={(e) =>
                              handleSubsectionOrderChange(
                                sIndex,
                                subIndex,
                                parseInt(e.target.value),
                              )
                            }
                          >
                            {getOrderOptions(section.subsections.length).map(
                              (order) => (
                                <option key={order} value={order}>
                                  {order}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                      <hr />
                      <div className="mb-2">
                        <label className="form-label">* Titre</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={
                            isEdit
                              ? ""
                              : "Ex: Activité 1, Article 2, Service 3..."
                          }
                          value={sub.title}
                          onChange={(e) =>
                            handleSubsectionChange(
                              sIndex,
                              subIndex,
                              "title",
                              e.target.value,
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
                              value,
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
                              e.target.value,
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
                          placeholder={isEdit ? "" : "Ex: 5000 (en FCFA)"}
                          value={sub.prix || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            const prix =
                              value === "" ? null : parseFloat(value);
                            handleSubsectionChange(
                              sIndex,
                              subIndex,
                              "prix",
                              prix,
                            );
                          }}
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label">Image</label>

                        {/* Si une image existe déjà (et pas supprimée), afficher un message */}
                        {isEdit &&
                          sub.image &&
                          !(sub.image instanceof File) &&
                          !sub.delete_image && (
                            <div className="alert alert-warning">
                              <button
                                type="button"
                                className="mb-2 px-3 py-1 btn btn-danger text-white rounded"
                                onClick={() =>
                                  handleSubsectionChange(
                                    sIndex,
                                    subIndex,
                                    "delete_image",
                                    true,
                                  )
                                }
                              >
                                Supprimer l'image
                              </button>
                              <br />
                              Une image est déjà associée à cette sous-section.
                              Cliquez ci-dessous pour en choisir une nouvelle.
                            </div>
                          )}

                        {/* Toujours afficher input file */}

                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) =>
                            handleSubsectionChange(
                              sIndex,
                              subIndex,
                              "image",
                              e.target.files[0],
                            )
                          }
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label">
                          Date de publication différée
                        </label>
                        <input
                          type="datetime-local"
                          className={`form-control ${
                            invalidPublishAt[`${sIndex}-${subIndex}`]
                              ? "is-invalid"
                              : ""
                          }`}
                          min={getMinPublishAt()}
                          value={sub.publish_at || ""}
                          onChange={(e) =>
                            handleSubsectionChange(
                              sIndex,
                              subIndex,
                              "publish_at",
                              e.target.value,
                            )
                          }
                        />
                        {invalidPublishAt[`${sIndex}-${subIndex}`] && (
                          <div className="invalid-feedback">
                            Date de publication invalide (doit être ≥ maintenant
                            + 5min)
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() =>
                          isEdit
                            ? removeSubsectionWithId(sIndex, subIndex)
                            : removeSubsection(sIndex, subIndex)
                        }
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageForm;
