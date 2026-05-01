import { useState, useCallback } from "react";
import { useFetchWithToken } from "./useFetchWithToken";
const PAGE_SIZE = 15;

const buildPagination = (items, page = 1, perPage = PAGE_SIZE) => {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const current_page = Math.min(Math.max(1, page), last_page);
  const start = (current_page - 1) * perPage;

  return {
    pageOrders: items.slice(start, start + perPage),
    pagination: {
      current_page,
      per_page: perPage,
      total,
      last_page,
    },
  };
};

const filterOrders = (orders, status = "") => {
  if (!status) return orders;
  return orders.filter((order) => order.status === status);
};

export const useOrders = (showToast) => {
  const { fetchWithToken } = useFetchWithToken();
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: PAGE_SIZE,
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "" });

  const fetchOrders = useCallback(
    async (page = 1, status = "") => {
      setLoading(true);

      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/orders`;
        const res = await fetchWithToken(url);

        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();
        const items = Array.isArray(data.data) ? data.data : [];

        setAllOrders(items);

        const filtered = filterOrders(items, status);
        const { pageOrders, pagination: pageInfo } = buildPagination(
          filtered,
          page,
        );

        setOrders(pageOrders);
        setPagination(pageInfo);
        setFilters({ status });
      } catch (err) {
        showToast("Erreur chargement : " + err.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast, fetchWithToken],
  );

  const changeStatus = async (id, newStatus) => {
    try {
      const res = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/orders/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setAllOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order,
          );
          const filtered = filterOrders(updatedOrders, filters.status);
          const { pageOrders, pagination: pageInfo } = buildPagination(
            filtered,
            pagination.current_page,
          );

          setOrders(pageOrders);
          setPagination(pageInfo);

          return updatedOrders;
        });

        showToast(data.message || "Statut mis à jour", "success");
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      showToast(err.message || "Erreur", "error");
    }
  };

  const goToPage = async (page) => {
    const filtered = filterOrders(allOrders, filters.status);
    const { pageOrders, pagination: pageInfo } = buildPagination(
      filtered,
      page,
    );

    setOrders(pageOrders);
    setPagination(pageInfo);
  };

  return {
    orders,
    pagination,
    loading,
    filters,
    fetchOrders,
    changeStatus,
    goToPage,
  };
};
