import api from "./api";

const paymentService = {
  createPayment: (jobId, amount) =>
    api.post("/payments/create", { jobId, amount }).then((res) => res.data),
  confirmPayment: (id) => api.put(`/payments/${id}/confirm`).then((res) => res.data),
  getPaymentHistory: () => api.get("/payments/history").then((res) => res.data),
};

export default paymentService;
