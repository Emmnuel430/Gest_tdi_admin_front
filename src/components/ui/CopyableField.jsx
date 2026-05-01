import { useState } from "react";

export default function CopyableField({ value, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Erreur copie :", err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className={`
        d-inline-flex align-items-center gap-2
         bg-body px-3 py-2 rounded border
        position-relative
        ${className}
      `}
      style={{ userSelect: "all", cursor: "pointer" }}
      title="Cliquer pour copier"
    >
      <span className="font-monospace fw-semibold">{value}</span>

      <span className={`small ${copied ? "text-success" : "text-muted"}`}>
        {!copied ? (
          <i className="fas fa-copy"></i>
        ) : (
          <i className="fas fa-check"></i>
        )}
      </span>
    </div>
  );
}
