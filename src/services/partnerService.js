import API from "./api";


export const getAllPartners = () => API.get("/partners");

export const getPartnerById = (id) => API.get(`/partners/${id}`);


export const statusUpdatePartner = (partnersId, status) => {
  return API.post("/partners/status-update", {
    id: partnersId,
    status,
  });
};


export const downloadPartners = (partnerId) =>
  API.get(`/partners/${partnerId}/documents/download`, {
    responseType: "blob",
  });
