import React, { useState } from "react";
import { usePayoutHold, useReleasePayout } from "../../hooks/usePayoutHolds";
import { toast } from "react-toastify";

const ReleasePayoutModal = ({ payoutId, onClose, onSuccess }) => {
  const [force, setForce] = useState(false);
  const [note, setNote] = useState("");
  const { data: payout } = usePayoutHold(payoutId);
  const releaseMut = useReleasePayout();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await releaseMut.mutateAsync({ id: payoutId, force, note });
      toast.success("Payout released to merchant.");
      onSuccess?.();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Release failed");
    }
  };

  if (!payoutId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-[#232323] mb-2">Release to Merchant</h3>
        {payout && (
          <p className="text-sm text-[#6C6C6C] mb-4">
            Net amount: <strong>${payout.amount_net_dollars}</strong> {payout.currency} → {payout.merchant?.business_name || payout.merchant?.name || "Merchant"}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
            <span className="text-sm">Force release (even if merchant payouts restricted)</span>
          </label>
          <div>
            <label className="block text-sm text-[#6C6C6C] mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
              placeholder="e.g. Manual early release"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-[#D9D9D9] text-[#232323] hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={releaseMut.isPending}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
            >
              {releaseMut.isPending ? "Releasing…" : "Release"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReleasePayoutModal;
