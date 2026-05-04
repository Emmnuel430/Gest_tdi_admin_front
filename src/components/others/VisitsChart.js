import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Loader from "../Layout/Loader";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function VisitsChart() {
  const { fetchWithToken } = useFetchWithToken();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week"); // day / week / month
  const { isDarkMode } = useTheme();

  // Fetch visits
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/visits/stats?period=${period}`,
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading || !data)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "20vh" }}
      >
        {" "}
        <Loader />{" "}
      </div>
    );
  const chartData = {
    // Plus besoin de data.weekly ou data.months, on utilise les clés uniformes
    labels: data.labels || [],
    datasets: [
      {
        label: `Visites (${period})`,
        data: data.counts || [], // Utilise data.counts renvoyé par le nouveau backend
        fill: true,
        backgroundColor: isDarkMode
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,123,255,0.1)",
        borderColor: "#007bff",
        tension: 0.3,
        pointBackgroundColor: "#007bff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: isDarkMode ? "#fff" : "#212529" } },
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
          maxRotation: 45, // Incline les labels si ils sont trop longs
          minRotation: 0,
        },
      },
      y: { ticks: { color: isDarkMode ? "#fff" : "#212529" } },
    },
  };

  return (
    <div className="row g-3">
      {/* Cards visites aujourd'hui et total */}
      <div className="col-md-4 d-flex flex-column gap-3 justify-content-evenly">
        <div className="card text-center p-3 bg-body rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
          <h6>Visites aujourd'hui</h6>
          <span className="fs-2 fw-bold">
            <CountUp
              end={data.today}
              duration={2}
              separator=" "
              // suffix={""}
            />
            {/* {data.today} */}
          </span>
        </div>
        <div className="card text-center p-3 bg-body rounded shadow-sm h-100 d-flex align-items-center justify-content-center">
          <h6>Total visites</h6>
          <span className="fs-2 fw-bold">
            <CountUp
              end={data.total}
              duration={2}
              separator=" "
              // suffix={""}
            />
            {/* {data.total} */}
          </span>
        </div>
      </div>

      {/* Graph et dropdown */}
      <div className="col-md-8">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6>Graphiques</h6>
          <select
            className="form-select w-auto"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Jour (Semaine en cours)</option>
            <option value="week">Semaines du mois</option>
            <option value="month">Mois de l'année</option>
            <option value="year">5 dernières années</option>
          </select>
        </div>

        <div className="card p-3 bg-body rounded shadow-sm">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}
