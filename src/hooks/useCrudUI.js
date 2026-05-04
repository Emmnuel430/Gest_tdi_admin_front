import { useState } from "react";

export const useCrudUI = () => {
  // 1. État pour la sélection (indépendant des modals)
  const [selectedIds, setSelectedIds] = useState([]);

  // 2. État unique pour TOUTES les modals
  // mode: 'delete' | 'toggle' | 'details' | null
  const [ui, setUi] = useState({ mode: null, data: null, variant: null });

  // --- LOGIQUE SÉLECTION ---
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // --- GESTION DES MODALS (FUSIONNÉE) ---
  const open = (mode, data = null, variant = null) => {
    setUi({ mode, data, variant });
  };
  const close = () => setUi({ mode: null, data: null, variant: null });

  return {
    // Sélection
    selectedIds,
    setSelectedIds,
    toggleSelect,
    resetSelection: () => setSelectedIds([]),

    // État UI unique
    ui,
    setUi,
    close,

    // Actions spécifiques (plus lisibles dans le composant)
    openDelete: (item) => open("delete", item, "single"),
    openBulkDelete: () => open("delete", selectedIds, "multiple"),
    openToggle: (item) => open("toggle", item),
    openDetails: (item) => open("details", item),
    openStatus: (item, status) => open("status", { order: item, status }),
    openConfirm: (data = null) => open("confirm", data),

    // Utilitaire pour le toggle
    confirmToggle: (callback) => {
      if (ui.data) callback(ui.data);
      close();
    },
  };
};
