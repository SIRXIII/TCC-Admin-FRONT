import API from "./api";


export const getAllOrders = () => API.get("/orders");

export const getOrderById = (id) => API.get(`/orders/${id}`);

/** Orders paid with card (Stripe) only */
export const getStripeOrders = (params = {}) =>
  API.get("/orders", { params: { stripe: 1, per_page: 50, ...params } });