import API from "./api";


export const getAllRefunds = () => API.get("/refunds");

export const getRefundById = (id) => API.get(`/refunds/${id}`);

export const statusUpdateRefund = (refundId, status) => {
  return API.post("/refunds/status-update", {
    id: refundId,
    status,
  });
};