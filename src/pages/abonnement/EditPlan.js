import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useToast } from "../../context/ToastContext";
import SubscriptionPlanForm from "../../components/forms/SubscriptionPlanForm";
import { buildPayload } from "../../utils/buildPayload";

const EditPlan = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { id } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    billing_type: "monthly",
    price: "",
    duration_months: "",
    registration_fee: "",
    monthly_price: "",
    total_payments: "",
    advantages: [],
    is_student_plan: false,
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.REACT_APP_API_BASE_URL}/subscription-plans/${id}`,
        );
        const data = await response.json();

        setFormData({
          name: data.name || "",
          billing_type: data.billing_type || "monthly",
          price: data.price ?? "",
          duration_months: data.duration_months ?? "",
          registration_fee: data.registration_fee ?? "",
          monthly_price: data.monthly_price ?? "",
          total_payments: data.total_payments ?? "",
          advantages: Array.isArray(data.advantages) ? data.advantages : [],

          is_student_plan:
            data.is_student_plan === 1 || data.is_student_plan === true,
        });
      } catch (err) {
        showToast("Impossible de charger le plan.", "danger");
      }
    };

    loadPlan();
  }, [id, showToast]);

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = buildPayload(formData);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/subscription-plans/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(
          result.message || "Erreur lors de la mise à jour du plan.",
          "danger",
        );
        setLoading(false);
        return;
      }

      showToast("Plan d'abonnement modifié !", "success");
      navigate("/admin-tdi/subscription-plans");
    } catch (err) {
      showToast("Une erreur s'est produite.", "danger");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Back>admin-tdi/subscription-plans</Back>
      <div className="col-sm-8 offset-sm-2 mt-5">
        <h1>Modifier le plan</h1>

        <SubscriptionPlanForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onSubmit={() => setShowModal(true)}
          submitLabel="Mettre à jour"
        />

        <ConfirmPopup
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          title="Confirmer la modification"
          body={<p>Voulez-vous vraiment modifier ce plan ?</p>}
        />
      </div>
    </Layout>
  );
};

export default EditPlan;
