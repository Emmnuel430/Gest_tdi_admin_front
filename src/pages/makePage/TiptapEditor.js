import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align"; // Nouveau : requis pour l'alignement
import { useEffect, useState } from "react";

const fonts = [
  "Arial",
  "Georgia",
  "Impact",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // On désactive le heading du StarterKit pour le configurer sur-mesure en dessous
      }),
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], // Activé de H1 à H6
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"], // Applique l'alignement sur les titres et paragraphes
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => setRefresh((v) => v + 1);

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value, editor]);

  const setFont = (font) => {
    editor?.chain().focus().setFontFamily(font).run();
  };

  // Gestion simplifiée du changement de titre via le select UI
  const handleHeadingChange = (level) => {
    if (level === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: parseInt(level) })
        .run();
    }
  };

  // Détermine la valeur actuelle du select des titres selon le texte sélectionné
  const getCurrentHeadingValue = () => {
    if (!editor) return "p";
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) return String(i);
    }
    return "p";
  };

  const addLink = () => {
    const url = window.prompt("Entrez l'URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  if (!editor) return null;

  return (
    <div
      className="border rounded shadow-sm d-flex flex-column"
      style={{ maxHeight: "500px" }}
    >
      {/* HEADER */}
      <div
        className="bg-body border-bottom p-2 d-flex flex-column flex-md-row align-items-center justify-content-between sticky-top"
        style={{ zIndex: 10 }}
      >
        <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
          <i className="fa fa-pen text-primary"></i>
          <strong>Éditeur de contenu</strong>
        </div>

        {/* Sélection de la police */}
        <select
          className="form-select form-select-sm w-auto"
          onChange={(e) => setFont(e.target.value)}
          // UX : La police du select lui-même s'adapte à la police actuellement sélectionnée
  style={{ 
    fontFamily: fonts.find((font) => editor?.isActive("textStyle", { fontFamily: font })) || "inherit" 
  }}
          value={
            fonts.find((font) =>
              editor?.isActive("textStyle", { fontFamily: font }),
            ) || ""
          }
        >
          <option value="" disabled>
            Montserrat (Défaut)
          </option>
          {fonts.map((font) => (
            <option key={font} value={font} className="fw-semibold" // Aperçu UX : Chaque option adopte sa propre police de caractères
      style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* TOOLBAR */}
      <div
        className="bg-body border-bottom p-2 d-flex flex-wrap justify-content-start align-items-center gap-2 sticky-top"
        style={{ top: "44px", zIndex: 9 }}
      >
        {/* SÉLECTEUR DE TITRES H1-H6 DYNAMIQUE */}
        <div className="d-flex align-items-center">
          <select
            className="form-select form-select-sm bg-body border fw-medium"
            style={{ minWidth: "160px" }}
            value={getCurrentHeadingValue()}
            onChange={(e) => handleHeadingChange(e.target.value)}
          >
            <option value="p">Texte normal (Paragraphe)</option>
            <option value="1" className="fs-2 fw-bold">
              Titre 1
            </option>
            <option value="2" className="fs-3 fw-bold">
              Titre 2
            </option>
            <option value="3" className="fs-4 fw-bold">
              Titre 3
            </option>
            <option value="4" className="fs-5 fw-bold">
              Titre 4
            </option>
            <option value="5" className="fs-6 text-muted fw-bold">
              Titre 5
            </option>
            <option value="6" className="small text-muted text-uppercase">
              Titre 6
            </option>
          </select>
        </div>

        {/* ALIGNEMENTS TEXTE */}
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            title="Aligner à gauche"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`btn border ${
              editor.isActive({ textAlign: "left" }) ? "btn-primary" : "bg-body"
            }`}
          >
            <i className="fa fa-align-left"></i>
          </button>
          <button
            type="button"
            title="Centrer"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`btn border ${
              editor.isActive({ textAlign: "center" })
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-align-center"></i>
          </button>
          <button
            type="button"
            title="Aligner à droite"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`btn border ${
              editor.isActive({ textAlign: "right" })
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-align-right"></i>
          </button>
          <button
            type="button"
            title="Justifier"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`btn border ${
              editor.isActive({ textAlign: "justify" })
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-align-justify"></i>
          </button>
        </div>

        {/* FORMATS DE BASE */}
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            title="Gras"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`btn border ${
              editor.isActive("bold") && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-bold"></i>
          </button>

          <button
            type="button"
            title="Italique"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`btn border ${
              editor.isActive("italic") && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-italic"></i>
          </button>

          <button
            type="button"
            title="Souligné"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`btn border ${
              editor.isActive("underline") && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-underline"></i>
          </button>
        </div>

        {/* LISTES */}
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            title="Liste à puces"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn border ${
              editor.isActive("bulletList") && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-list-ul"></i>
          </button>

          <button
            type="button"
            title="Liste numérotée"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`btn border ${
              editor.isActive("orderedList") && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-list-ol"></i>
          </button>
        </div>

        {/* LIENS ET NETTOYAGE */}
        <div className="btn-group btn-group-sm gap-2 ms-md-auto">
          <button
            type="button"
            title="Ajouter un lien"
            onClick={addLink}
            className="btn btn-outline-primary btn-sm rounded"
          >
            <i className="fa fa-link"></i>
          </button>

          <button
            type="button"
            title="Nettoyer le formatage"
            onClick={clearFormatting}
            className="btn btn-outline-danger btn-sm rounded"
          >
            <i className="fa fa-eraser"></i>
          </button>
        </div>
      </div>

      {/* CONTENT SCROLLABLE */}
      <div className="flex-grow-1 overflow-auto" style={{ minHeight: "150px" }}>
        <EditorContent
          editor={editor}
          className="px-3 py-2"
          style={{ minHeight: "150px" }}
        />
      </div>
    </div>
  );
}
