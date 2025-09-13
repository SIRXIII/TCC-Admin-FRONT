import API from "./api";


export const getAllOrders = () => API.get("/orders");

export const getOrderById = (id) => API.get(`/orders/${id}`);