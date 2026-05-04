import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useCrudUI } from "../../hooks/useCrudUI";
import { useToast } from "../../context/ToastContext";
import ContentForm from "../../components/contents/ContentForm";

const AddContent = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();
  const { ui, close } = useCrudUI();
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
    await handleSubmit();
    close();
  };

  const handleSubmit = async () => {
    if (!form.title || !form.type) {
      showToast("Veuillez remplir tous les champs obligatoires.", "info");
      return;
    }

    if (form.publish_at) {
      const chosenDate = new Date(form.publish_at);
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
        `${process.env.REACT_APP_API_BASE_URL}/contents`,
        {
          method: "POST",
          body: JSON.stringify(form),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(result.message || "Erreur lors de l'ajout.", "danger");
        return;
      }

      showToast("Contenu ajouté !", "success");
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
      <>
        <ContentForm
          text={"Ajouter un contenu"}
          form={form}
          setForm={setForm}
          plans={plans}
          loading={loading}
          handleChange={handleChange}
          handlePlanChange={handlePlanChange}
          onSubmit={handleSubmit}
          buttonText="Créer"
        />
      </>

      <ConfirmPopup
        show={ui.mode === "confirm"}
        onClose={close}
        onConfirm={handleConfirm}
        title="Confirmer l'ajout"
        body={<p>Voulez-vous vraiment ajouter ce contenu ?</p>}
      />
    </Layout>
  );
};

export default AddContent;
