import { useState } from "react";

const getEmptySubsection = (order = 1) => ({
  title: "",
  content: "",
  date: "",
  prix: "",
  image: null,
  order,
  publish_at: null,
});

const getEmptySection = (order = 1) => ({
  title: "",
  subtitle: "",
  image: null,
  order,
  subsections: [],
});

const getDefaultPageState = () => ({
  title: "",
  subtitle: "",
  main_image: null,
  template: "",
  order: "",
  sections: [],
});

const getMinPublishAt = () =>
  new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

const isFieldRequiredValid = (value) =>
  value !== null && value !== undefined && value.toString().trim() !== "";

const isFormValid = (page, invalidPublishAt) => {
  if (!page?.title || !page.template) return false;
  if (!Array.isArray(page.sections) || page.sections.length === 0) return false;

  for (const section of page.sections) {
    if (!isFieldRequiredValid(section.title)) return false;
    if (Array.isArray(section.subsections)) {
      for (const sub of section.subsections) {
        if (!isFieldRequiredValid(sub.title)) return false;
      }
    }
  }

  if (Object.keys(invalidPublishAt).length > 0) return false;
  return true;
};

export const usePage = (initialState = getDefaultPageState()) => {
  const [page, setPage] = useState(initialState);
  const [invalidPublishAt, setInvalidPublishAt] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewMainImage, setPreviewMainImage] = useState("");

  /* ---------- PAGE ---------- */
  const handlePageChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "main_image" && files && files[0]) {
      setPreviewMainImage(URL.createObjectURL(files[0]));
      setPage((prev) => ({ ...prev, main_image: files[0] }));
      return;
    }

    setPage((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const setPageField = (field, value) => {
    setPage((prev) => ({ ...prev, [field]: value }));
  };
  /* ---------- SECTIONS ---------- */

  const addSection = () => {
    setPage((prev) => ({
      ...prev,
      sections: [...prev.sections, getEmptySection(prev.sections.length + 1)],
    }));
  };

  const removeSection = (index) => {
    setPage((prev) => {
      const newSections = [...prev.sections];
      newSections.splice(index, 1);
      return { ...prev, sections: newSections };
    });
  };

  const handleSectionChange = (index, field, value) => {
    setPage((prev) => {
      const newSections = [...prev.sections];
      newSections[index][field] = value;
      return { ...prev, sections: newSections };
    });
  };

  const handleSectionOrderChange = (index, newOrder) => {
    setPage((prev) => {
      const sections = [...prev.sections];

      const currentOrder = sections[index].order || index + 1;

      // Trouver la section qui a déjà cet ordre
      const targetIndex = sections.findIndex(
        (s, i) => (s.order || i + 1) === newOrder,
      );

      // Swap
      if (targetIndex !== -1) {
        sections[targetIndex].order = currentOrder;
      }

      sections[index].order = newOrder;

      return { ...prev, sections };
    });
  };
  /* ---------- SUBSECTIONS ---------- */
  const addSubsection = (sectionIndex) => {
    setPage((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].subsections.push(
        getEmptySubsection(newSections[sectionIndex].subsections.length + 1),
      );
      return { ...prev, sections: newSections };
    });
  };

  const removeSubsection = (sectionIndex, subIndex, { onRemoveId } = {}) => {
    setPage((prev) => {
      const newSections = [...prev.sections];
      const removed = newSections[sectionIndex]?.subsections?.[subIndex];
      if (removed?.id && typeof onRemoveId === "function") {
        onRemoveId(removed.id);
      }
      newSections[sectionIndex].subsections.splice(subIndex, 1);
      return { ...prev, sections: newSections };
    });
  };

  const handleSubsectionChange = (sectionIndex, subIndex, field, value) => {
    setPage((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].subsections[subIndex][field] = value;
      return { ...prev, sections: newSections };
    });
  };

  const handleSubsectionOrderChange = (sectionIndex, subIndex, newOrder) => {
    setPage((prev) => {
      const sections = [...prev.sections];
      const subs = [...sections[sectionIndex].subsections];

      const currentOrder = subs[subIndex].order || subIndex + 1;

      const targetIndex = subs.findIndex(
        (s, i) => (s.order || i + 1) === newOrder,
      );

      if (targetIndex !== -1) {
        subs[targetIndex].order = currentOrder;
      }

      subs[subIndex].order = newOrder;

      sections[sectionIndex].subsections = subs;

      return { ...prev, sections };
    });
  };

  const validatePublishAtDates = () => {
    setInvalidPublishAt({});
    setError("");

    for (let sIndex = 0; sIndex < page.sections.length; sIndex++) {
      const section = page.sections[sIndex];
      for (
        let subIndex = 0;
        subIndex < (section.subsections?.length || 0);
        subIndex++
      ) {
        const sub = section.subsections[subIndex];
        if (sub.publish_at) {
          const chosenDate = new Date(sub.publish_at);
          const minDate = new Date(Date.now() + 5 * 60 * 1000);
          if (chosenDate < minDate) {
            setError(
              "La date de publication doit être au moins 5 minutes après maintenant.",
            );
            setInvalidPublishAt({ [`${sIndex}-${subIndex}`]: true });
            setShowModal(false);
            setLoading(false);
            return false;
          }
        }
      }
    }

    return true;
  };

  return {
    page,
    setPage,
    previewMainImage,
    setPreviewMainImage,
    invalidPublishAt,
    setInvalidPublishAt,
    error,
    setError,
    loading,
    setLoading,
    showModal,
    setShowModal,
    handlePageChange,
    handleSectionOrderChange,
    setPageField,
    addSection,
    removeSection,
    handleSectionChange,
    addSubsection,
    removeSubsection,
    handleSubsectionChange,
    handleSubsectionOrderChange,
    isFormValid: () => isFormValid(page, invalidPublishAt),
    validatePublishAtDates,
    getMinPublishAt,
  };
};
