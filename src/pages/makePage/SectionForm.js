import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SectionForm({
  section,
  onChange,
  onAddSub,
  onRemoveSub,
  onChangeSub,
}) {
  const handleSectionInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      onChange(name, files[0]);
    } else {
      onChange(name, value);
    }
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label">Titre de la section</label>
        <input
          className="form-control"
          name="title"
          value={section.title}
          onChange={handleSectionInput}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Sous-titre</label>
        <input
          className="form-control"
          name="subtitle"
          value={section.subtitle}
          onChange={handleSectionInput}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Image de la section</label>
        <input
          type="file"
          className="form-control"
          name="image"
          onChange={handleSectionInput}
        />
      </div>

      <div className="mt-4">
        <h6>Sous-sections</h6>
        {section.subsections.map((sub, sj) => (
          <div key={sj} className="border rounded p-3 mb-3 bg-body">
            <div className="mb-2">
              <label className="form-label">Titre</label>
              <input
                className="form-control"
                value={sub.title}
                onChange={(e) => onChangeSub(sj, "title", e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Contenu</label>
              <ReactQuill
                theme="snow"
                value={sub.content}
                onChange={(value) => onChangeSub(sj, "content", value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => onChangeSub(sj, "image", e.target.files[0])}
              />
            </div>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => onRemoveSub(sj)}
              >
                Supprimer cette sous-section
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onAddSub}
        >
          + Ajouter une sous-section
        </button>
      </div>
    </>
  );
}
