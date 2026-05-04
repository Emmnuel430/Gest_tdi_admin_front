export const AUTH_KEYS = {
  ADMIN: { INFO: "user-info", TOKEN: "token", REDIRECT: "/admin-tdi/home" },
  ADHERENT: {
    INFO: "adherent-info",
    TOKEN: "adherent-token",
    REDIRECT: "/adherent/home",
  },
};

export const STEPS = [
  // ================= INFOS PERSO =================
  {
    id: 0,
    title: "Infos Personnelles",
    icon: <i className="fas fa-user-pen"></i>,
    fields: [
      {
        name: "date_naissance",
        label: "Date de naissance",
        type: "date",
        required: true,
      },
      {
        name: "adresse",
        label: "Adresse",
        type: "text",
        placeholder: "Ex: 123 Rue de la Paix",
        required: true,
      },
      {
        name: "situation_matrimoniale",
        label: "Situation matrimoniale",
        type: "select",
        required: true,
        options: [
          { value: "", label: "-- Sélectionner --" },
          { value: "celibataire", label: "Célibataire" },
          { value: "marie", label: "Marié(e)" },
          { value: "divorce", label: "Divorcé(e)" },
          { value: "veuf", label: "Veuf(ve)" },
        ],
      },
      {
        name: "nombre_enfants",
        label: "Nombre d'enfants",
        type: "number",
        placeholder: "0",
      },
      {
        name: "profession",
        label: "Profession",
        type: "text",
        placeholder: "Ex: Ingénieur",
        required: true,
      },
    ],
  },
  // ================= CONTACT =================
  {
    id: 1,
    title: "Contact",
    icon: <i className="fas fa-phone"></i>,
    fields: [
      {
        name: "telephone_whatsapp",
        label: "Téléphone WhatsApp",
        type: "tel",
        placeholder: "+225 07 12 30 45 67",
        required: true,
      },
      {
        name: "telephone_secondaire",
        label: "Téléphone secondaire",
        type: "tel",
        placeholder: "+225 07 12 30 45 68",
      },
    ],
  },
  // ================= URGENCE =================
  {
    id: 2,
    title: "En cas d'urgence",
    icon: <i className="fas fa-heart-circle-exclamation"></i>,
    fields: [
      {
        name: "urgence_nom",
        label: "Nom du contact d'urgence",
        type: "text",
        placeholder: "Ex: Marie Dupont",
        required: true,
      },
      {
        name: "urgence_numero",
        label: "Téléphone du contact d'urgence",
        type: "tel",
        placeholder: "+221 77 123 45 67",
        required: true,
      },
      {
        name: "urgence_lien",
        label: "Lien de parenté",
        type: "text",
        placeholder: "Ex: Mère, Frère, Ami",
        required: true,
      },
    ],
  },
  // ================= EDUCATION-RELIGIEUX-LANGUES =================
  {
    id: 3,
    title: "Éducation",
    icon: <i className="fas fa-user-graduate"></i>,
    fields: [
      {
        name: "niveau_etudes",
        label: "Niveau d'études",
        type: "select",
        required: true,
        options: [
          { value: "", label: "-- Sélectionner --" },
          { value: "primaire", label: "Primaire" },
          { value: "secondaire", label: "Secondaire" },
          { value: "baccalaureat", label: "Baccalauréat" },
          { value: "bac+2", label: "Bac + 2" },
          { value: "licence", label: "Licence" },
          { value: "master", label: "Master" },
          { value: "doctorat", label: "Doctorat" },
        ],
      },
      {
        name: "dernier_diplome",
        label: "Dernier diplôme obtenu",
        type: "text",
        placeholder: "Ex: Licence en Informatique",
      },
      {
        name: "etude_religieuse",
        label: "Cochez si vous avez deja fait des études religieuses",
        type: "checkbox",
      },
      {
        name: "institution_religieuse",
        label: "Institution religieuse",
        type: "text",
        placeholder: "Ex: Yeshiva...",
      },
      {
        name: "niveau_juif",
        label: "Niveau d'étude juive",
        type: "select",
        required: true,
        options: [
          { value: "", label: "-- Sélectionner --" },
          { value: "debutant", label: "Débutant" },
          { value: "intermediaire", label: "Intermédiaire" },
          { value: "avance", label: "Avancé" },
        ],
      },
      {
        name: "niveau_francais",
        label: "Niveau de français",
        type: "select",
        required: true,
        options: [
          { value: "", label: "-- Sélectionner --" },
          { value: "debutant", label: "Débutant" },
          { value: "intermediaire", label: "Intermédiaire" },
          { value: "avance", label: "Avancé" },
          { value: "courant", label: "Courant" },
        ],
      },
      {
        name: "niveau_hebreu",
        label: "Niveau d'hébreu",
        type: "select",
        required: true,
        options: [
          { value: "", label: "-- Sélectionner --" },
          { value: "aucun", label: "Aucun" },
          { value: "debutant", label: "Débutant" },
          { value: "intermediaire", label: "Intermédiaire" },
          { value: "avance", label: "Avancé" },
        ],
      },
    ],
  },
  // ================= OBJECTIFS =================
  {
    id: 4,
    title: "Objectifs",
    icon: "🎯",
    fields: [
      {
        name: "motivation",
        label: "Motivation pour rejoindre",
        type: "textarea",
        placeholder: "Décrivez votre motivation...",
        rows: 4,
        required: true,
      },
      {
        name: "objectifs",
        label: "Vos objectifs",
        type: "textarea",
        placeholder: "Décrivez vos objectifs...",
        rows: 4,
        required: true,
      },
    ],
  },
];
