import React from "react";
import { usePayoutHold, useReleasePayout, useRefundPayout, useRetryTransferPayout } from "../../hooks/usePayoutHolds";
import { toast } from "react-toastify";

const STATUS_BADGE = {
  HELD: "bg-amber-100 text-amber-800",
  READY: "bg-blue-100 text-blue-800",
  RELEASED: "bg-green-100 text-green-800",
  RELEASE_FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
  RESTRICTED: "bg-orange-100 text-orange-800",
  RELEASE_IN_PROGRESS: "bg-blue-100 text-blue-800",
  REFUND_IN_PROGRESS: "bg-amber-100 text-amber-800",
  CREATED: "bg-gray-100 text-gray-600",
  CANCELED: "bg-gray-100 text-gray-600",
};

const PayoutHoldDetail = ({ payoutId, onClose, onRelease, onRefund }) => {
  const { data: payout, isLoading } = usePayoutHold(payoutId);
  const releaseMut = useReleasePayout();
  const refundMut = useRefundPayout();
  const retryMut = useRetryTransferPayout();

  if (!payoutId) return null;
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-8 shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <p className="text-[#6C6C6C]">Loading...</p>
        </div>
      </div>
    );
  }
  if (!payout) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-white rounded-xl p-8 shadow-xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-red-600">Payout not found.</p>
          <button type="button" onClick={onClose} className="mt-4 text-[#F77F00] hover:underline">Close</button>
        </div>
      </div>
    );
  }

  const handleRelease = async () => {
    try {
      await releaseMut.mutateAsync({ id: payoutId });
      toast.success("Payout released to merchant.");
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Release failed");
    }
  };

  const handleRetry = async () => {
    try {
      await retryMut.mutateAsync(payoutId);
      toast.success("Transfer retry initiated.");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Retry failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#E5E5E5] px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-[#232323]">Payout #{payout.id}</h3>
          <button type="button" onClick={onClose} className="text-[#6C6C6C] hover:text-[#232323] text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#9A9A9A]">Order</p>
              <p className="font-medium">{payout.order?.order_id ?? payout.order_id}</p>
            </div>
            <div>
              <p className="text-[#9A9A9A]">Status</p>
              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[payout.status] || "bg-gray-100"}`}>
                {payout.status}
              </span>
            </div>
            <div>
              <p className="text-[#9A9A9A]">Merchant</p>
              <p className="font-medium">{payout.merchant?.business_name || payout.merchant?.name || "—"}</p>
              <p className="text-xs text-[#6C6C6C]">Stripe: {payout.merchant?.stripe_status ?? "—"} (payouts_enabled: {payout.merchant?.payouts_enabled ? "yes" : "no"})</p>
            </div>
            <div>
              <p className="text-[#9A9A9A]">Amount (net to merchant)</p>
              <p className="font-medium">${payout.amount_net_dollars} {payout.currency}</p>
            </div>
            <div>
              <p className="text-[#9A9A9A]">Hold until</p>
              <p>{payout.hold_until ? new Date(payout.hold_until).toLocaleString() : "—"}</p>
            </div>
            <div>
              <p className="text-[#9A9A9A]">PaymentIntent / Transfer</p>
              <p className="text-xs break-all">{payout.payment_intent_id || "—"}</p>
              <p className="text-xs break-all text-[#6C6C6C]">{payout.transfer_id || "—"}</p>
            </div>
          </div>

          {payout.block_reason && (
            <div className="rounded-lg bg-amber-50 text-amber-800 p-3 text-sm">
              {payout.block_reason}
            </div>
          )}
          {payout.last_error && (
            <div className="rounded-lg bg-red-50 text-red-800 p-3 text-sm">
              {payout.last_error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {payout.can_release && (
              <button
                type="button"
                onClick={handleRelease}
                disabled={releaseMut.isPending}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {releaseMut.isPending ? "Releasing…" : "Release to Merchant"}
              </button>
            )}
            {payout.can_retry_transfer && (
              <button
                type="button"
                onClick={handleRetry}
                disabled={retryMut.isPending}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {retryMut.isPending ? "Retrying…" : "Retry Transfer"}
              </button>
            )}
            {payout.can_refund && (
              <button
                type="button"
                onClick={onRefund}
                className="px-4 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50"
              >
                Refund Customer
              </button>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#232323] mb-2">Audit log</h4>
            <ul className="space-y-2 text-sm">
              {(payout.audit_log || []).map((log) => (
                <li key={log.id} className="flex flex-wrap gap-2 text-[#6C6C6C] border-b border-[#F0F0F0] pb-2">
                  <span className="font-medium text-[#232323]">{log.action}</span>
                  {log.actor && <span>by {log.actor}</span>}
                  <span className="text-xs">{new Date(log.created_at).toLocaleString()}</span>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <pre className="text-xs bg-[#F9F9F9] p-1 rounded w-full overflow-x-auto">
                      {JSON.stringify(log.metadata)}
                    </pre>
                  )}
                </li>
              ))}
              {(!payout.audit_log || payout.audit_log.length === 0) && (
                <li className="text-[#9A9A9A]">No audit entries yet.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutHoldDetail;
