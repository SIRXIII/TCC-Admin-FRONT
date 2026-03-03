import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import Breadcrumb from "../components/Breadcrumb";
import { useStripeOrders } from "../hooks/useStripeOrders";

const StripePayments = () => {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError } = useStripeOrders();
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

  const totalVolume = useMemo(() => {
    return (orders || []).reduce((sum, o) => sum + (parseFloat(o?.total_price) || 0), 0);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    if (!search.trim()) return list;
    const s = search.toLowerCase();
    return list.filter(
      (o) =>
        (o?.order_id || "").toLowerCase().includes(s) ||
        (o?.traveler_name || "").toLowerCase().includes(s) ||
        (o?.partner_name || "").toLowerCase().includes(s)
    );
  }, [orders, search]);

  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
    list.sort((a, b) => {
      let aVal = key === "created_at" ? (a.created_at || "") : (a[key] ?? "");
      let bVal = key === "created_at" ? (b.created_at || "") : (b[key] ?? "");
      if (key === "total_price") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
        return (aVal - bVal) * dir;
      }
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * dir;
    });
    return list;
  }, [filteredOrders, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex ml-1 text-xs">
      <FiArrowUp
        className={
          sortConfig.key === key && sortConfig.direction === "asc"
            ? "text-[#F77F00]"
            : "text-gray-400"
        }
      />
      <FiArrowDown
        className={
          sortConfig.key === key && sortConfig.direction === "desc"
            ? "text-[#F77F00]"
            : "text-gray-400"
        }
      />
    </span>
  );

  return (
    <div className="gap-6 p-2">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Card payments" },
        ]}
      />
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#D9D9D9] p-5 shadow-sm">
            <p className="text-sm text-[#9A9A9A]">Card transactions</p>
            <p className="text-2xl font-semibold text-[#232323] mt-1">
              {Array.isArray(orders) ? orders.length : 0}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-[#D9D9D9] p-5 shadow-sm">
            <p className="text-sm text-[#9A9A9A]">Total volume (Stripe)</p>
            <p className="text-2xl font-semibold text-[#232323] mt-1">
              ${totalVolume.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#232323] mb-4">
            Stripe / card payments
          </h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Order ID, traveler, partner..."
              className="w-full max-w-md px-4 py-2 border border-[#D9D9D9] rounded-xl text-sm focus:outline-none focus:border-[#F77F00]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-[#9A9A9A]">Loading...</div>
          ) : isError ? (
            <div className="py-12 text-center text-red-600">Failed to load card payments.</div>
          ) : sortedOrders.length === 0 ? (
            <div className="py-12 text-center text-[#9A9A9A]">
              No card (Stripe) payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F9F9F9] text-[#6C6C6C] uppercase">
                    <th
                      className="px-4 py-3 text-left cursor-pointer"
                      onClick={() => handleSort("order_id")}
                    >
                      Order ID {renderSortIcon("order_id")}
                    </th>
                    <th
                      className="px-4 py-3 text-left cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      Date {renderSortIcon("created_at")}
                    </th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Partner</th>
                    <th
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() => handleSort("total_price")}
                    >
                      Amount {renderSortIcon("total_price")}
                    </th>
                    <th className="px-4 py-3 text-left">Payment status</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[#D9D9D9] hover:bg-[#FEF2E6]/50"
                    >
                      <td className="px-4 py-3 text-[#232323] font-medium">
                        {order.order_id || order.id}
                      </td>
                      <td className="px-4 py-3 text-[#4F4F4F]">
                        {order.transaction?.date || order.created_at || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#4F4F4F]">
                        {order.traveler_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-[#4F4F4F]">
                        {order.partner_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-[#232323]">
                        ${order.total_price ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            order.payment_status === "succeeded" || order.payment_status === "captured"
                              ? "bg-[#E7F7ED] text-[#088B3A]"
                              : order.payment_status === "requires_capture"
                              ? "bg-[#E1FDFD] text-[#3E77B0]"
                              : "bg-[#F9F9F9] text-[#6C6C6C]"
                          }`}
                        >
                          {order.payment_status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/orders/ordersdetail/${order.id}`,
                              { state: {} }
                            )
                          }
                          className="text-[#F77F00] hover:underline font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripePayments;
