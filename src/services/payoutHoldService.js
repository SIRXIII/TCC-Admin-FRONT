import API from "./api";

const BASE = "/admin/payouts";

export const getPayouts = (params = {}) =>
  API.get(BASE, { params: { per_page: 15, ...params } });

export const getPayoutById = (id) => API.get(`${BASE}/${id}`);

export const releasePayout = (id, body = {}) =>
  API.post(`${BASE}/${id}/release`, body);

export const refundPayout = (id, body = {}) =>
  API.post(`${BASE}/${id}/refund`, body);

export const retryTransferPayout = (id) =>
  API.post(`${BASE}/${id}/retry-transfer`);
