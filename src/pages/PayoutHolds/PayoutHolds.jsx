import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb";
import Pagination from "../../components/Pagination";
import { usePayoutHolds } from "../../hooks/usePayoutHolds";
import PayoutHoldDetail from "./PayoutHoldDetail";
import ReleasePayoutModal from "./ReleasePayoutModal";
import RefundPayoutModal from "./RefundPayoutModal";

const STATUS_BADGE = {
  HELD: "bg-amber-100 text-amber-800",
  READY: "bg-blue-100 text-blue-800",
  RELEASED: "bg-green-100 text-green-800",
  RELEASE_FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-700",
  REFUND_IN_PROGRESS: "bg-amber-100 text-amber-800",
  RELEASE_IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESTRICTED: "bg-orange-100 text-orange-800",
  CANCELED: "bg-gray-100 text-gray-600",
  CREATED: "bg-gray-100 text-gray-600",
};

const PayoutHolds = () => {
  const [filters, setFilters] = useState({
    status: "",
    merchant_id: "",
    date_from: "",
    date_to: "",
    q: "",
    page: 1,
    per_page: 15,
  });
  const [detailId, setDetailId] = useState(null);
  const [releaseId, setReleaseId] = useState(null);
  const [refundId, setRefundId] = useState(null);

  const { data, isLoading, isError } = usePayoutHolds(filters);
  const payouts = data?.payouts ?? [];
  const pagination = data?.pagination ?? {};

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds == null || seconds <= 0) return "—";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 24) return `${Math.floor(h / 24)}d`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex flex-col gap-6 p-3">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Payout Holds" },
        ]}
      />
      <div>
        <h2 className="text-2xl font-semibold text-[#232323]">Payout Holds</h2>
        <p className="text-sm text-[#6C6C6C] mt-1">
          Held payments queue. Release to merchant after 24h or refund when needed.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-4 flex flex-wrap gap-3 items-end">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6C6C6C]">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilter("status", e.target.value)}
            className="border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="HELD">HELD</option>
            <option value="READY">READY</option>
            <option value="RELEASED">RELEASED</option>
            <option value="RELEASE_FAILED">RELEASE_FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
            <option value="RESTRICTED">RESTRICTED</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6C6C6C]">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#9A9A9A]">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Order ID, PI ID, Transfer ID"
              value={filters.q}
              onChange={(e) => handleFilter("q", e.target.value)}
              className="pl-9 pr-3 py-2 border border-[#D9D9D9] rounded-lg text-sm w-56"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6C6C6C]">From</label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleFilter("date_from", e.target.value)}
            className="border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6C6C6C]">To</label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleFilter("date_to", e.target.value)}
            className="border border-[#D9D9D9] rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#6C6C6C]">Loading...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-600">Failed to load payouts.</div>
        ) : payouts.length === 0 ? (
          <div className="p-8 text-center text-[#6C6C6C]">No payouts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F9F9F9] text-[#6C6C6C]">
                <tr>
                  <th className="px-4 py-3 text-left">ID / Order</th>
                  <th className="px-4 py-3 text-left">Merchant</th>
                  <th className="px-4 py-3 text-right">Gross</th>
                  <th className="px-4 py-3 text-right">Fee</th>
                  <th className="px-4 py-3 text-right">Net</th>
                  <th className="px-4 py-3 text-left">Paid at</th>
                  <th className="px-4 py-3 text-left">Hold until</th>
                  <th className="px-4 py-3 text-left">Time left</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#232323]">
                {payouts.map((p) => (
                  <tr key={p.id} className="border-t border-[#E5E5E5] hover:bg-[#FEF2E6]/30">
                    <td className="px-4 py-3">
                      <span className="font-medium">#{p.id}</span>
                      <br />
                      <span className="text-xs text-[#6C6C6C]">{p.order_ref || p.order_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      {p.merchant_name}
                      <br />
                      <span className="text-xs text-[#6C6C6C]">ID: {p.merchant_id}</span>
                    </td>
                    <td className="px-4 py-3 text-right">${p.amount_gross_dollars}</td>
                    <td className="px-4 py-3 text-right">${((p.amount_fee || 0) / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium">${p.amount_net_dollars}</td>
                    <td className="px-4 py-3 text-xs">{p.created_at ? new Date(p.created_at).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-xs">{p.hold_until ? new Date(p.hold_until).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-xs">{formatTimeRemaining(p.time_remaining)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[p.status] || "bg-gray-100 text-gray-700"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 justify-center">
                        <button
                          type="button"
                          onClick={() => setDetailId(p.id)}
                          className="text-[#F77F00] hover:underline text-xs"
                        >
                          View
                        </button>
                        {p.can_release && (
                          <button
                            type="button"
                            onClick={() => setReleaseId(p.id)}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Release
                          </button>
                        )}
                        {p.can_refund && (
                          <button
                            type="button"
                            onClick={() => setRefundId(p.id)}
                            className="text-red-600 hover:underline text-xs"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.total > 0 && (
          <div className="border-t border-[#E5E5E5] px-4 py-3">
            <Pagination
              page={filters.page}
              setPage={(p) => setFilters((prev) => ({ ...prev, page: p }))}
              perPage={filters.per_page}
              setPerPage={(p) => setFilters((prev) => ({ ...prev, per_page: p, page: 1 }))}
              totalItems={pagination.total ?? 0}
              options={[10, 15, 25, 50]}
            />
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {detailId && (
        <PayoutHoldDetail
          payoutId={detailId}
          onClose={() => setDetailId(null)}
          onRelease={() => { setDetailId(null); setReleaseId(detailId); }}
          onRefund={() => { setDetailId(null); setRefundId(detailId); }}
        />
      )}

      {releaseId && (
        <ReleasePayoutModal
          payoutId={releaseId}
          onClose={() => setReleaseId(null)}
          onSuccess={() => setReleaseId(null)}
        />
      )}

      {refundId && (
        <RefundPayoutModal
          payoutId={refundId}
          onClose={() => setRefundId(null)}
          onSuccess={() => setRefundId(null)}
        />
      )}
    </div>
  );
};

export default PayoutHolds;
