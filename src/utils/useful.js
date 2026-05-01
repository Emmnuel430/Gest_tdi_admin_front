const STATUS_CONFIG = {
  pending: {
    bg: "bg-info",
    text: "text-info",
    color: "info",
  },
  success: {
    bg: "bg-success",
    text: "text-success",
    color: "success",
  },
  delivered: {
    bg: "bg-success",
    text: "text-success",
    color: "success",
  },
  failed: {
    bg: "bg-danger",
    text: "text-danger",
    color: "danger",
  },
  canceled: {
    bg: "bg-danger",
    text: "text-danger",
    color: "danger",
  },
  refunded: {
    bg: "bg-warning",
    text: "text-warning",
    color: "warning",
  },
};

export const getTypeLabel = (type) => {
  const types = {
    subscription: "Abonnement",
    donation: "Donation",
    tsedaka: "Donation",
    cart: "Achat",
    "prayer-request": "Prière",
  };
  return types[type] || type;
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: "En attente",
    delivered: "Livrée",
    canceled: "Annulée",
    success: "Réussi",
    failed: "Échoué",
    refunded: "Remboursé",
  };
  return labels[status] || status;
};

export const getStatusColor = (status) => {
  return STATUS_CONFIG[status]?.color || "secondary";
};

export const truncate = (text, max = 8) =>
  text.length > max ? text.slice(0, max) + "..." : text;

export const formatPrenom = (prenom) => {
  if (!prenom) return "";

  const parts = prenom.trim().split(" ");

  if (parts.length === 1) return parts[0];

  return parts
    .map((p, index) => (index === 0 ? p : `${p.charAt(0).toUpperCase()}.`))
    .join(" ");
};

export const formatPrice = (value) => {
  if (value == null) return "-";
  const amount = parseFloat(value);
  return new Intl.NumberFormat("fr-FR").format(amount);
};

// ------------------------
export function StatusIndicator({ status }) {
  const color = STATUS_CONFIG[status]?.bg || "bg-secondary";

  return (
    <span
      className={`d-inline-block rounded-circle ${color}`}
      style={{
        width: "10px",
        height: "10px",
      }}
    ></span>
  );
}

export function UserName({ name, className = "" }) {
  if (!name) {
    return <span className={className}>-</span>;
  }

  const parts = name.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return (
    <span className={className}>
      <span className="fw-semibold text-uppercase">{firstName}</span>{" "}
      {lastName && <span className="text-capitalize">{lastName}</span>}
    </span>
  );
}
