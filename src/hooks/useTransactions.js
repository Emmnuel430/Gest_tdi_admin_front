import { useState, useCallback } from "react";
import { useFetchWithToken } from "./useFetchWithToken";
export const useTransactions = (showToast) => {
  const { fetchWithToken } = useFetchWithToken();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "", type: "" });

  const fetchTransactions = useCallback(
    async (page = 1, status = "", type = "") => {
      setLoading(true);
      try {
        let url = `${process.env.REACT_APP_API_BASE_URL}/transactions?page=${page}`;

        if (status) url += `&status=${status}`;
        if (type) url += `&type=${type}`;

        const res = await fetchWithToken(url);

        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();

        setTransactions(data.data || []);
        setPagination({
          current_page: data.current_page,
          per_page: data.per_page,
          total: data.total,
          last_page: data.last_page,
        });
        setFilters({ status, type });
      } catch (err) {
        showToast("Erreur chargement : " + err.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  const changeStatus = async (id, newStatus) => {
    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/transactions/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
        );
        showToast(data.message || "Statut mis à jour", "success");
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      showToast(err.message || "Erreur", "error");
    }
  };

  const goToPage = async (page) => {
    await fetchTransactions(page, filters.status, filters.type);
  };

  return {
    transactions,
    pagination,
    loading,
    filters,
    fetchTransactions,
    changeStatus,
    goToPage,
  };
};
