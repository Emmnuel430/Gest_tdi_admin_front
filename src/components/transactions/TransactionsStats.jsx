import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../../components/Layout/Loader";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const colorPalette = [
  "#0d6efd",
  "#198754",
  "#dc3545",
  "#ffc107",
  "#6610f2",
  "#20c997",
  "#fd7e14",
];

// const formatCurrency = (value) =>
//   new Intl.NumberFormat("fr-FR", {
//     style: "currency",
//     currency: "XOF",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   }).format(value || 0);

const getLastYearMonths = () => {
  const result = [];
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const cursor = new Date(start);

  while (cursor <= end) {
    result.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
    );
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return result;
};

const transformData = (data) => {
  const months = getLastYearMonths();
  const types = [...new Set(data.map((item) => item.type))];

  const datasets = types.map((type, index) => {
    const color = colorPalette[index % colorPalette.length];

    return {
      label: type,
      data: months.map((month) => {
        const found = data.find(
          (item) => item.month === month && item.type === type,
        );
        return found ? Number(found.total) : 0;
      }),
      borderColor: color,
      backgroundColor: `${color}33`,
      tension: 0.3,
      fill: false,
      pointRadius: 3,
    };
  });

  return {
    labels: months,
    datasets,
  };
};

const buildPieData = (countByType) => ({
  labels: countByType.map((item) => item.type),
  datasets: [
    {
      data: countByType.map((item) => Number(item.total)),
      backgroundColor: countByType.map(
        (_, index) => colorPalette[index % colorPalette.length],
      ),
      borderWidth: 1,
    },
  ],
});

export default function TransactionsStats() {
  const { fetchWithToken } = useFetchWithToken();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/transactions/stats`,
        );
        const json = await response.json();
        setStats(json);
      } catch (err) {
        console.error(err);
        showToast(
          "Impossible de charger les statistiques des transactions.",
          "danger",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showToast]);

  if (loading || !stats) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "40vh" }}
      >
        <Loader />
      </div>
    );
  }

  const pieData = buildPieData(stats.count_by_type || []);
  const lineData = transformData(stats.revenue_over_time || []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#fff" : "#212529",
        },
      },
      tooltip: {
        titleColor: isDarkMode ? "#fff" : "#212529",
        bodyColor: isDarkMode ? "#fff" : "#212529",
        backgroundColor: isDarkMode ? "#000" : "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#fff" : "#212529",
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#fff" : "#212529",
        },
        grid: {
          color: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        },
      },
    },
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="">📊 Stats des transactions</h1>
        <small className="text-muted">
          Suivi global des revenus et performances
        </small>
      </div>

      {/* KPI */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-muted">Revenus totaux</h6>
                </div>
                <div className="fs-1">
                  <i className="fas fa-coins"></i>
                </div>
              </div>
              <h2 className="fw-bold mb-0">
                <CountUp
                  end={stats.total_revenue}
                  duration={2}
                  separator=" "
                  suffix={" XOF"}
                />
                {/* {formatCurrency(stats.total_revenue)} */}
              </h2>
            </div>
          </div>
        </div>

        {/* Revenus par type */}
        <div className="col-12 col-md-6 col-xl-8">
          <div className="card border shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted">Répartition des revenus</small>

              <div className="mt-3 d-flex flex-wrap gap-3">
                {(stats.revenue_by_type || []).map((item, index) => (
                  <div
                    key={item.type}
                    className="px-3 py-2 rounded"
                    style={{
                      background:
                        index % 2 === 0
                          ? "rgba(13,110,253,0.1)"
                          : "rgba(25,135,84,0.1)",
                    }}
                  >
                    <div className="fw-semibold text-capitalize">
                      {item.type}
                    </div>
                    <div className="small text-muted">
                      <CountUp
                        end={item.total}
                        duration={2}
                        separator=" "
                        suffix={" XOF"}
                      />
                      {/* {formatCurrency(item.total)} */}
                    </div>
                  </div>
                ))}
              </div>

              {!(stats.revenue_by_type || []).length && (
                <span className="text-muted">Aucun revenu enregistré.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row g-3">
        {/* PIE */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="mb-3">
                <h6 className="fw-semibold mb-1">
                  Répartition des transactions
                </h6>
                <small className="text-muted">Volume par type</small>
              </div>

              <div style={{ minHeight: "320px" }}>
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: isDarkMode ? "#fff" : "#212529",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LINE */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="mb-3">
                <h6 className="fw-semibold mb-1">Évolution des revenus</h6>
                <small className="text-muted">Analyse mensuelle par type</small>
              </div>

              <div style={{ minHeight: "320px" }}>
                <Line data={lineData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
