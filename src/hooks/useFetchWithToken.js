import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export function useFetchWithToken() {
  const { admin, logoutAdmin, logoutAdherent } = useAuth();

  const fetchWithToken = useCallback(
    async (url, options = {}) => {
      const token = sessionStorage.getItem(admin ? "token" : "adherent-token");

      const headers = {
        Accept: "application/json",
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });

      if (response.status === 401) {
        admin ? logoutAdmin() : logoutAdherent();

        window.location.href = admin ? "/" : process.env.REACT_APP_VITRINE_URL;

        throw new Error("Non autorisé");
      }

      if (response.status === 422) {
        const errorData = await response.json();
        throw new ValidationError(errorData.errors);
      }

      return response;
    },
    [admin, logoutAdmin, logoutAdherent],
  ); // 🔥 important

  return { fetchWithToken };
}

export class ValidationError extends Error {
  constructor(errors) {
    super("Validation Error");
    this.name = "ValidationError";
    this.type = "validation";
    this.errors = errors;
  }
}
