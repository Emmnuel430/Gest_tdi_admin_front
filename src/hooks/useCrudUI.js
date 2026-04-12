import { useState } from "react";

export const useCrudUI = () => {
  // 🔹 SELECTION
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const resetSelection = () => setSelectedIds([]);

  // 🔹 DELETE MODAL
  const [modal, setModal] = useState({
    show: false,
    type: null, // "single" | "multiple"
    data: null,
  });

  const openSingleDelete = (item) => {
    setModal({ show: true, type: "single", data: item });
  };

  const openMultipleDelete = () => {
    setModal({ show: true, type: "multiple", data: selectedIds });
  };

  const closeModal = () => {
    setModal({ show: false, type: null, data: null });
  };

  // 🔹 TOGGLE
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedToggle, setSelectedToggle] = useState(null);

  const openToggle = (item) => {
    setSelectedToggle(item);
    setToggleModal(true);
  };

  const closeToggle = () => {
    setSelectedToggle(null);
    setToggleModal(false);
  };

  const confirmToggle = (callback) => {
    if (!selectedToggle) return;
    callback(selectedToggle);
    closeToggle();
  };

  return {
    // selection
    selectedIds,
    setSelectedIds,
    toggleSelect,
    resetSelection,

    // delete modal
    modal,
    openSingleDelete,
    openMultipleDelete,
    closeModal,

    // toggle
    toggleModal,
    selectedToggle,
    openToggle,
    closeToggle,
    confirmToggle,
  };
};
