import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useToast } from "../../context/ToastContext";

const UpdateAdherents = () => {
  const { id } = useParams();
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const { ui, close, openConfirm } = useCrudUI();

  // Handler générique (clé du truc)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch adherent
  useEffect(() => {
    const fetchAdherent = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/adherents/${id}`,
        );

        const result = await response.json();

        if (response.ok && result.data) {
          setForm({
            nom: result.data.nom || "",
            prenom: result.data.prenom || "",
            email: result.data.email || "",
            contact: result.data.contact || "",
          });
        } else {
          showToast(result.message || "Erreur chargement", "danger");
        }
      } catch (err) {
        showToast("Erreur serveur", "danger");
      }
    };

    fetchAdherent();
  }, [id, showToast, fetchWithToken]);

  // Submit
  const handleSubmit = async () => {
    if (!form.nom || !form.prenom || !form.email) {
      showToast("Champs obligatoires manquants", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/adherents/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(form),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(result.message || "Erreur update", "danger");
        return;
      }

      showToast("Adhérent mis à jour", "success");
      navigate("/admin-tdi/adherents");
    } catch (err) {
      showToast("Erreur réseau", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/adherents</Back>

      <div className="col-md-6 offset-md-3 mt-5">
        <h2 className="fw-bold mb-4">Modifier un adhérent</h2>

        {/* NOM */}
        <div className="mb-3">
          <label className="form-label">Nom *</label>
          <input
            type="text"
            name="nom"
            className="form-control"
            value={form.nom}
            onChange={handleChange}
          />
        </div>

        {/* PRENOM */}
        <div className="mb-3">
          <label className="form-label">Prénom *</label>
          <input
            type="text"
            name="prenom"
            className="form-control"
            value={form.prenom}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* CONTACT */}
        <div className="mb-3">
          <label className="form-label">Contact</label>
          <input
            type="text"
            name="contact"
            className="form-control"
            value={form.contact}
            onChange={handleChange}
          />
        </div>

        {/* BTN */}
        <button
          className="btn btn-primary w-100"
          onClick={() => openConfirm()}
          disabled={loading}
        >
          {loading ? "Chargement..." : "Mettre à jour"}
        </button>
      </div>

      {/* CONFIRM */}
      <ConfirmPopup
        show={ui.mode === "confirm"}
        onClose={close}
        onConfirm={() => {
          close();
          handleSubmit();
        }}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier cet adhérent ?</p>}
      />
    </Layout>
  );
};

export default UpdateAdherents;
