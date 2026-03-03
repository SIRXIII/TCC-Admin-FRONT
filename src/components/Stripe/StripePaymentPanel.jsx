import React, { useState } from "react";
import {
  captureOrderPayment,
  cancelOrderPayment,
  refundOrderPayment,
  debugOrderPayment,
} from "../../services/stripeService";

/**
 * StripePaymentPanel
 *
 * Rendered inside the order detail page whenever an order has Stripe
 * payment data.  Shows the full payment timeline and provides admin actions:
 *   – Release Now (capture + transfer to partner)
 *   – Cancel (void if not yet captured)
 *   – Refund (full or partial, optional transfer reversal)
 *   – Debug (fetch live Stripe PI data)
 */
const StripePaymentPanel = ({ order, onActionComplete }) => {
  const [loading, setLoading]       = useState("");
  const [error, setError]           = useState("");
  const [debugData, setDebugData]   = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount]       = useState("");
  const [reverseTransfer, setReverseTransfer] = useState(false);
  const [showConfirm, setShowConfirm]         = useState(null); // "capture" | "cancel"

  if (!order?.payment_intent_id && !order?.payment_status) return null;

  const ps = order.payment_status;
  const canCapture = ps === "holding" || ps === "authorized";
  const canCancel  = ["pending", "holding", "authorized"].includes(ps);
  const canRefund  = ["captured", "transfer_created", "completed"].includes(ps);

  const doAction = async (type) => {
    setLoading(type);
    setError("");
    try {
      if (type === "capture") {
        await captureOrderPayment(order.id);
      } else if (type === "cancel") {
        await cancelOrderPayment(order.id);
      }
      onActionComplete?.();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading("");
      setShowConfirm(null);
    }
  };

  const doRefund = async () => {
    setLoading("refund");
    setError("");
    try {
      const payload = {};
      if (refundAmount) payload.amount = parseFloat(refundAmount);
      if (reverseTransfer) payload.reverse_transfer = true;
      await refundOrderPayment(order.id, payload);
      setShowRefundModal(false);
      onActionComplete?.();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading("");
    }
  };

  const doDebug = async () => {
    setLoading("debug");
    setError("");
    try {
      const res = await debugOrderPayment(order.id);
      setDebugData(res.data.data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 rounded-2xl shadow-sm gap-6">
      <h2 className="text-lg font-semibold text-[#232323]">Payment (Stripe)</h2>

      {/* Timeline */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoRow label="Payment Status">
          <PaymentStatusBadge status={ps} />
        </InfoRow>
        <InfoRow label="Payment Intent">
          <span className="font-mono text-xs text-[#6C6C6C]">{order.payment_intent_id || "—"}</span>
        </InfoRow>
        {order.stripe_charge_id && (
          <InfoRow label="Charge ID">
            <span className="font-mono text-xs text-[#6C6C6C]">{order.stripe_charge_id}</span>
          </InfoRow>
        )}
        <InfoRow label="Amount">
          <span className="text-[#232323] font-medium">${order.total_price} {order.currency?.toUpperCase()}</span>
        </InfoRow>
        {order.authorized_at && (
          <InfoRow label="Authorized At">
            <span>{fmtDate(order.authorized_at)}</span>
          </InfoRow>
        )}
        {order.release_at && (
          <InfoRow label="Release At (auto-capture)">
            <span className={isInFuture(order.release_at) ? "text-amber-600 font-medium" : "text-green-600 font-medium"}>
              {fmtDate(order.release_at)}
            </span>
          </InfoRow>
        )}
        {order.captured_at && (
          <InfoRow label="Captured At">
            <span className="text-green-600">{fmtDate(order.captured_at)}</span>
          </InfoRow>
        )}
        {order.canceled_at && (
          <InfoRow label="Canceled At">
            <span className="text-red-600">{fmtDate(order.canceled_at)}</span>
          </InfoRow>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {canCapture && (
          <ActionBtn
            label="Release Now"
            color="green"
            loading={loading === "capture"}
            onClick={() => setShowConfirm("capture")}
          />
        )}
        {canCancel && (
          <ActionBtn
            label="Cancel Payment"
            color="red"
            loading={loading === "cancel"}
            onClick={() => setShowConfirm("cancel")}
          />
        )}
        {canRefund && (
          <ActionBtn
            label="Refund"
            color="amber"
            loading={loading === "refund"}
            onClick={() => setShowRefundModal(true)}
          />
        )}
        <ActionBtn
          label="Debug"
          color="gray"
          loading={loading === "debug"}
          onClick={doDebug}
        />
      </div>

      {/* Confirmation modal – capture / cancel */}
      {showConfirm && (
        <ConfirmModal
          title={showConfirm === "capture" ? "Release Payment Now?" : "Cancel Payment?"}
          message={
            showConfirm === "capture"
              ? "This will immediately capture the held payment and transfer the partner's share. This bypasses the 24-hour hold."
              : "This will void the PaymentIntent. The user will not be charged. This cannot be undone."
          }
          confirmLabel={showConfirm === "capture" ? "Yes, Release" : "Yes, Cancel"}
          confirmColor={showConfirm === "capture" ? "green" : "red"}
          loading={loading === showConfirm}
          onConfirm={() => doAction(showConfirm)}
          onClose={() => setShowConfirm(null)}
        />
      )}

      {/* Refund modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-[#232323]">Issue Refund</h3>
            <div className="flex flex-col gap-3">
              <label className="text-sm text-[#6C6C6C]">
                Refund Amount (USD) – leave blank for full refund
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                max={order.total_price}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder={`Max: $${order.total_price}`}
                className="border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F77F00]"
              />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={reverseTransfer}
                  onChange={(e) => setReverseTransfer(e.target.checked)}
                  className="w-4 h-4"
                />
                Also reverse partner transfer (if already sent)
              </label>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 text-sm border border-[#D9D9D9] rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={doRefund}
                disabled={loading === "refund"}
                className="px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                {loading === "refund" ? "Refunding…" : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug output */}
      {debugData && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-[#232323] mb-2">Debug – Live Stripe Data</p>
          <pre className="text-xs text-[#6C6C6C] overflow-auto max-h-64 whitespace-pre-wrap">
            {JSON.stringify(debugData, null, 2)}
          </pre>
          <button
            onClick={() => setDebugData(null)}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const InfoRow = ({ label, children }) => (
  <>
    <div className="text-[#9A9A9A]">{label}</div>
    <div className="text-[#232323]">{children}</div>
  </>
);

const PAYMENT_STATUS_STYLES = {
  unpaid:           "bg-gray-100 text-gray-600",
  pending:          "bg-blue-100 text-blue-600",
  authorized:       "bg-yellow-100 text-yellow-700",
  holding:          "bg-amber-100 text-amber-700",
  captured:         "bg-green-100 text-green-700",
  transfer_created: "bg-emerald-100 text-emerald-700",
  completed:        "bg-green-200 text-green-800",
  failed:           "bg-red-100 text-red-600",
  refunded:         "bg-purple-100 text-purple-700",
  canceled:         "bg-gray-200 text-gray-600",
};

const PaymentStatusBadge = ({ status }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${PAYMENT_STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
    {status?.replace(/_/g, " ") || "—"}
  </span>
);

const ActionBtn = ({ label, color, loading, onClick }) => {
  const colors = {
    green: "bg-green-600 hover:bg-green-700 text-white",
    red:   "bg-red-600 hover:bg-red-700 text-white",
    amber: "bg-amber-500 hover:bg-amber-600 text-white",
    gray:  "bg-gray-200 hover:bg-gray-300 text-[#232323]",
  };
  return (
    <button
      onClick={onClick}
      disabled={!!loading}
      className={`px-4 py-2 text-sm rounded-lg font-medium transition disabled:opacity-50 ${colors[color]}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {label}…
        </span>
      ) : label}
    </button>
  );
};

const ConfirmModal = ({ title, message, confirmLabel, confirmColor, loading, onConfirm, onClose }) => {
  const colorMap = { green: "bg-green-600 hover:bg-green-700", red: "bg-red-600 hover:bg-red-700" };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-[#232323]">{title}</h3>
        <p className="text-sm text-[#6C6C6C]">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-[#D9D9D9] rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm text-white rounded-lg disabled:opacity-50 ${colorMap[confirmColor]}`}
          >
            {loading ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const fmtDate = (d) => d ? new Date(d).toLocaleString() : "—";
const isInFuture = (d) => d && new Date(d) > new Date();

export default StripePaymentPanel;
