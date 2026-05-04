import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useToast } from "../../context/ToastContext";
import ContentForm from "../../components/contents/ContentForm";

const UpdateContent = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { id } = useParams();
  const { showToast } = useToast();
  const { ui, close, openConfirm } = useCrudUI();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    type: "",
    content: "",
    lien: "",
    publish_at: "",
    visibility: null,
    plan_ids: [],
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/subscription-plans`,
        );
        if (response.ok) {
          const data = await response.json();
          setPlans(data.data);
        }
      } catch (err) {
        showToast("Erreur lors du chargement des plans", "danger");
      }
    };
    fetchPlans();
  }, [showToast]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/contents/${id}`,
        );
        const result = await response.json();

        if (response.ok && result.data) {
          const data = result.data;

          // 🎯 MAPPING VISIBILITY
          let visibility = "public";

          if (data.is_student_only) {
            visibility = "students";
          } else if (data.plans && data.plans.length > 0) {
            visibility = "plans";
          }

          // 🎯 MAPPING PLAN IDS
          const plan_ids = data.plans?.map((p) => p.id) || [];

          setForm({
            title: data.title || "",
            type: data.type || "",
            content: data.content || "",
            lien: data.lien || "",
            publish_at: data.publish_at
              ? new Date(data.publish_at).toISOString().slice(0, 16)
              : "",
            visibility,
            plan_ids,
          });
        } else {
          showToast(result.message || "Erreur lors du chargement.", "danger");
        }
      } catch (err) {
        showToast("Erreur lors du chargement du contenu.", "danger");
      }
    };
    fetchContent();
  }, [id, showToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlanChange = (planId) => {
    setForm((prev) => ({
      ...prev,
      plan_ids: prev.plan_ids.includes(planId)
        ? prev.plan_ids.filter((id) => id !== planId)
        : [...prev.plan_ids, planId],
    }));
  };

  const handleConfirm = async () => {
    if (!ui.data) return;

    await handleSubmit(ui.data);
    close();
  };

  const handleSubmit = async (formData) => {
    if (!formData.title || !formData.type) {
      showToast("Veuillez remplir tous les champs obligatoires.", "info");
      return;
    }

    if (formData.publish_at) {
      const chosenDate = new Date(formData.publish_at);
      const minDate = new Date(Date.now() + 5 * 60 * 1000);
      if (chosenDate < minDate) {
        showToast(
          "La date de publication doit être au moins 5 minutes après maintenant.",
          "info",
        );
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/contents/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(result.message || "Erreur lors de la mise à jour.", "danger");
        return;
      }

      showToast("Contenu mis à jour !", "success");
      navigate("/admin-tdi/contenu");
    } catch (err) {
      showToast("Une erreur s'est produite.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/contenu</Back>
      <ContentForm
        text={"Modifier le contenu"}
        form={form}
        setForm={setForm}
        plans={plans}
        loading={loading}
        handleChange={handleChange}
        handlePlanChange={handlePlanChange}
        onSubmit={() => openConfirm(form)}
        buttonText="Mettre à jour"
      />

      <ConfirmPopup
        show={ui.mode === "confirm"}
        onClose={close}
        onConfirm={handleConfirm}
        title="Confirmer la modification"
        body={<p>Voulez-vous vraiment modifier ce contenu ?</p>}
      />
    </Layout>
  );
};

export default UpdateContent;
