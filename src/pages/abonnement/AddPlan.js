import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Back from "../../components/Layout/Back";
import ConfirmPopup from "../../components/Layout/ConfirmPopup";
import { useFetchWithToken } from "../../hooks/useFetchWithToken";
import { useToast } from "../../context/ToastContext";
import SubscriptionPlanForm from "../../components/forms/SubscriptionPlanForm";
import { buildPayload } from "../../utils/buildPayload";

const AddPlan = () => {
  const { fetchWithToken } = useFetchWithToken();
  const { showToast } = useToast();

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

  const navigate = useNavigate();

  const handleConfirm = () => {
    setShowModal(false);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = buildPayload(formData);

    try {
      const response = await fetchWithToken(
        `${process.env.REACT_APP_API_BASE_URL}/subscription-plans`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        showToast(
          result.message || "Erreur lors de l'ajout du plan.",
          "danger",
        );
        setLoading(false);
        return;
      }

      showToast("Plan d'abonnement créé !", "success");
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
        <h1>Ajouter un plan</h1>

        <SubscriptionPlanForm
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          onSubmit={() => setShowModal(true)}
          submitLabel="Ajouter le plan"
        />

        <ConfirmPopup
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          title="Confirmer l'ajout"
          body={<p>Voulez-vous vraiment créer ce plan ?</p>}
        />
      </div>
    </Layout>
  );
};

export default AddPlan;
