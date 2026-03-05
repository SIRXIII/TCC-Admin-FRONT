import React, { useState } from "react";
import { usePayoutHold, useRefundPayout } from "../../hooks/usePayoutHolds";
import { toast } from "react-toastify";

const RefundPayoutModal = ({ payoutId, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [reverseTransfer, setReverseTransfer] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const { data: payout } = usePayoutHold(payoutId);
  const refundMut = useRefundPayout();

  const fullAmountDollars = payout ? payout.amount_gross_dollars : 0;
  const amountDollars = amount === "" ? fullAmountDollars : parseFloat(amount) || 0;
  const alreadyReleased = payout?.transfer_id && payout?.status === "RELEASED";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed && alreadyReleased) {
      toast.error("Please confirm that you understand refunding after payout may require recovering funds from merchant.");
      return;
    }
    try {
      await refundMut.mutateAsync({
        id: payoutId,
        amount: amountDollars,
        reason: reason || undefined,
        reverse_transfer: reverseTransfer,
      });
      toast.success("Refund processed.");
      onSuccess?.();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Refund failed");
    }
  };

  if (!payoutId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-[#232323] mb-2">Refund Customer</h3>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 mb-4">
          Refunding will return funds to the customer. If the payout was already released to the merchant, you may need to recover funds from the merchant separately.
        </div>

        {payout && (
          <p className="text-sm text-[#6C6C6C] mb-4">
            Gross amount: <strong>${payout.amount_gross_dollars}</strong> {payout.currency}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#6C6C6C] mb-1">Amount to refund (USD, optional – default full)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
              placeholder={String(fullAmountDollars)}
            />
          </div>
          <div>
            <label className="block text-sm text-[#6C6C6C] mb-1">Reason (optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Customer request"
            />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={reverseTransfer} onChange={(e) => setReverseTransfer(e.target.checked)} />
            <span className="text-sm">Reverse transfer to merchant (if already released)</span>
          </label>
          {alreadyReleased && (
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
              <span className="text-sm text-amber-800">
                I understand that refunding after payout may require recovering funds from the merchant.
              </span>
            </label>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D9D9D9] text-[#232323] hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={refundMut.isPending || (alreadyReleased && !confirmed)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60"
            >
              {refundMut.isPending ? "Processing…" : "Refund"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundPayoutModal;
