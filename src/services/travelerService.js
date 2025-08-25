import API from "./api";


export const getTravelers = () => API.get("/travelers");

export const getTravelerById = (id) => API.get(`/travelers/${id}`);

export const exportTravelers = (travelerIds) => {
  return API.post("/travelers/export", { ids: travelerIds }, { responseType: "blob" });
};

export const bulkUpdateTravelers = (travelerIds, status) => {
  return API.post("/travelers/bulk-update", {
    ids: travelerIds,
    status,
  });
};