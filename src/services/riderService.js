import API from "./api";


export const getAllRiders = () => API.get("/riders");

export const getRiderById = (id) => API.get(`/riders/${id}`);


export const downloadRiders = (riderId) =>
  API.get(`/riders/${riderId}/documents/download`, {
    responseType: "blob",
  });

  export const statusUpdateRider = (riderId, status) => {
  return API.post("/riders/status-update", {
    id: riderId,
    status,
  });
};