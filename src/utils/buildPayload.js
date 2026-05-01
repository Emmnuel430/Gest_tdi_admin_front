export const buildPayload = (formData) => ({
  name: formData.name.trim(),
  billing_type: formData.billing_type,

  price: formData.price !== "" ? parseInt(formData.price, 10) : null,

  duration_months:
    formData.duration_months !== ""
      ? parseInt(formData.duration_months, 10)
      : null,

  registration_fee:
    formData.registration_fee !== ""
      ? parseInt(formData.registration_fee, 10)
      : null,

  monthly_price:
    formData.monthly_price !== "" ? parseInt(formData.monthly_price, 10) : null,

  total_payments:
    formData.total_payments !== ""
      ? parseInt(formData.total_payments, 10)
      : null,

  is_student_plan: !!formData.is_student_plan,

  advantages: formData.advantages?.filter((a) => a.trim() !== ""),
});
