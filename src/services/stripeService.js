import API from "./api";

// ---------------------------------------------------------------------------
// Partner Connect Onboarding
// ---------------------------------------------------------------------------

/**
 * Create (or retrieve existing) Stripe Express connected account for a partner.
 */
export const createPartnerConnectAccount = (partnerId) =>
  API.post(`/stripe/partners/${partnerId}/connect`);

/**
 * Generate a one-time Stripe-hosted onboarding link for a partner.
 * Returns { url, expires_at }.
 */
export const createPartnerAccountLink = (partnerId) =>
  API.post(`/stripe/partners/${partnerId}/account-link`);

/**
 * Query + persist the current Stripe account status for a partner.
 * Returns { stripe_account_id, charges_enabled, payouts_enabled,
 *           details_submitted, requirements_due, onboarding_complete }.
 */
export const getPartnerConnectStatus = (partnerId) =>
  API.get(`/stripe/partners/${partnerId}/connect-status`);

// ---------------------------------------------------------------------------
// Admin Payment Overrides
// ---------------------------------------------------------------------------

/**
 * Early-release: capture the PaymentIntent immediately and transfer
 * the partner share.
 */
export const captureOrderPayment = (orderId) =>
  API.post(`/stripe/orders/${orderId}/capture`);

/**
 * Cancel the PaymentIntent (must be in pending/holding state).
 */
export const cancelOrderPayment = (orderId) =>
  API.post(`/stripe/orders/${orderId}/cancel`);

/**
 * Issue a full or partial refund.
 * @param {number} orderId
 * @param {{ amount?: number, reverse_transfer?: boolean, reason?: string }} data
 */
export const refundOrderPayment = (orderId, data = {}) =>
  API.post(`/stripe/orders/${orderId}/refund`, data);

/**
 * Debug endpoint – returns live Stripe PaymentIntent data + DB state.
 */
export const debugOrderPayment = (orderId) =>
  API.get(`/stripe/orders/${orderId}/debug`);
