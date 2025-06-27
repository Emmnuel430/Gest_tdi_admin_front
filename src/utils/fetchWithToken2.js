export async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("adherent-token");

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const finalOptions = {
    ...options,
    headers,
    credentials: "include",
  };

  const response = await fetch(url, finalOptions);

  // Si le token est invalide ou expiré
  if (response.status === 401) {
    localStorage.removeItem("adherent-token");
    localStorage.removeItem("adherent-info");
    window.location.href = process.env.REACT_APP_VITRINE_URL; // Redirection vers la page d'accueil
    throw new Error("Non autorisé");
  }

  // Cas d'erreur 422 : Erreur de validation Laravel
  if (response.status === 422) {
    const errorData = await response.json();
    console.error("Erreur de validation :", errorData);
    throw new Error("Erreur de validation");
  }

  return response;
}
