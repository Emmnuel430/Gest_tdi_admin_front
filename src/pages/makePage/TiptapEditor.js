// TiptapEditor.js
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import { useEffect } from "react";

const fonts = [
  "Arial",
  "Georgia",
  "Impact",
  "Tahoma",
  "Times New Roman",
  "Verdana",
];

const TiptapEditor = ({ value, onChange }) => {
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
    <div className="border p-2 rounded">
      {/* Police */}
      <select
        className="mb-2 border p-1"
        onChange={(e) => setFont(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Choisir une police
        </option>
        {fonts.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="btn"
        >
          Titre 1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="btn"
        >
          Titre 2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="btn"
        >
          Gras
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="btn"
        >
          Italique
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="btn"
        >
          Souligné
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="btn"
        >
          • Liste
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="btn"
        >
          1. Liste
        </button>
        <button type="button" onClick={addLink} className="btn">
          🔗 Lien
        </button>
        <button
          type="button"
          onClick={clearFormatting}
          className="btn text-red-500"
        >
          ✖ Nettoyer (style)
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[150px] p-2 border rounded"
      />
    </div>
  );
};

export default TiptapEditor;
