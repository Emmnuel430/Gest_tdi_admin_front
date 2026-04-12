import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
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
      StarterKit,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Heading.configure({
        levels: [1, 2],
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
        <div className="d-flex align-items-center gap-2">
          <i className="fa fa-pen text-primary"></i>
          <strong>Éditeur de contenu</strong>
        </div>

        {/* Police */}
        <select
          className="form-select form-select-sm w-auto"
          onChange={(e) => setFont(e.target.value)}
          value={
            fonts.find((font) =>
              editor?.isActive("textStyle", { fontFamily: font }),
            ) || ""
          }
        >
          <option value="" disabled>
            Monserrat
          </option>

          {fonts.map((font) => (
            <option key={font} value={font} className="fw-semibold">
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* TOOLBAR */}
      <div
        className="bg-body border-bottom p-2 d-flex flex-wrap justify-content-between gap-2 sticky-top"
        style={{ top: "48px", zIndex: 9 }}
      >
        {/* HEADINGS */}
        <div className="btn-group btn-group-sm">
          <button
            type="button"
            title="Titre 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`btn border ${
              editor.isActive("heading", { level: 1 }) && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-heading"></i> 1
          </button>

          <button
            type="button"
            title="Titre 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`btn border ${
              editor.isActive("heading", { level: 2 }) && editor.isFocused
                ? "btn-primary"
                : "bg-body"
            }`}
          >
            <i className="fa fa-heading"></i> 2
          </button>
        </div>

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

        <div className="btn-group btn-group-sm gap-2">
          <button
            type="button"
            title="Ajouter un lien"
            onClick={addLink}
            className="btn btn-outline-primary btn-sm"
          >
            <i className="fa fa-link"></i>
          </button>

          <button
            type="button"
            title="Nettoyer le formatage"
            onClick={clearFormatting}
            className="btn btn-outline-danger btn-sm"
          >
            <i className="fa fa-eraser"></i>
          </button>
        </div>
      </div>

      {/* CONTENT SCROLLABLE */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{
          minHeight: "150px",
        }}
      >
        <EditorContent
          editor={editor}
          className="px-3 py-2"
          style={{
            minHeight: "150px",
          }}
        />
      </div>
    </div>
  );
}
