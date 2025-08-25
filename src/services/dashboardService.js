
import API from "./api";


export const getStates = async () => {
  const response = await API.get("/dashboard/states");
  return response.data;
};


export const getTravelers = async () => {
  const response = await API.get("/dashboard/travelers");
  return response.data;
};


export const getTopPartners = async () => {
  const response = await API.get("/dashboard/topPartners");
  return response.data;
};

