import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import arrow_left from "../../../assets/SVG/arrow-left.svg";
import arrow_right from "../../../assets/SVG/arrow-right.svg";
import DefaultProfile from "../../../assets/Images/trv_profile.jpg";
import riderOrders from "../../../data/RiderOrders";

const RiderOrders = () => {
  const orders = riderOrders;

  if (!orders || orders.length === 0) {
    return <p className="text-center py-4">No orders found.</p>;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const statusColors = {
    pending: "bg-[#E1FDFD] text-[#3E77B0]",
    delivered: "bg-[#E7F7ED] text-[#088B3A]",
    inprogress: "bg-[#FEFCDD] text-[#B2A23F]",
    cancelled: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      o.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage)
  );

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, o) => {
      const num = parseFloat(o.total_price?.replace(/[^0-9.]/g, "")) || 0;
      return sum + num;
    }, 0);
  }, [orders]);

  const [open, setOpen] = useState(false);
    const options = [ 10, 25, 50];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#232323]">Orders</h2>
          <span className="text-sm text-[#9A9A9A]">
            Total spent{" "}
            <span className="text-[#4F4F4F] font-medium">
              ${totalSpent.toFixed(2)}
            </span>{" "}
            on {orders.length} orders
          </span>
        </div>

        <div className="relative text-[#9A9A9A] text-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2 px-4 py-2.5 border border-[#D9D9D9] rounded-xl text-sm focus:outline-none focus:border-[#D9D9D9]"
          />
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F9F9F9] uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Traveler Name</th>
                <th className="px-4 py-3 text-left">Partner Name</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-[#6C6C6C] ">
                    No orders found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((o) => (
                  <tr key={o.id} className="bg-white hover:bg-[#FEF2E6]">
                    <td className="px-4 py-3">{o.id}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={o.traveler_photo || DefaultProfile}
                        alt={o.traveler_name || "Traveler"}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = DefaultProfile)}
                      />
                      <span>{o.traveler_name}</span>
                    </td>
                    <td className="px-4 py-3">{o.partner_name}</td>
                    <td className="px-4 py-3">{o.created_at}</td>
                    <td className="px-4 py-3">{o.items_count}</td>
                    <td className="px-4 py-3">{o.total_price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          statusColors[o.status?.toLowerCase()] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-6 text-[#6C6C6C] h-10">
          <p className="text-sm flex items-center">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} entries
          </p>

          <div className="flex items-center gap-2 h-10">
            <button
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#D9D9D9] hover:bg-[#F77F00] ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              <img src={arrow_left} alt="Prev" className="w-4 h-4 " />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition ${
                  num === currentPage
                    ? "bg-[#F77F00] text-white border border-[#F77F00]"
                    : "border border-[#FEF2E6] hover:bg-[#FEF2E6]"
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-[#D9D9D9] hover:bg-[#F77F00] ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
            >
              <img src={arrow_right} alt="Next" className="w-4 h-4 " />
            </button>
          </div>

         <div className="flex items-center gap-2 h-10">
  <span className="text-[#232323] text-xs">Show</span>
  <div className="relative w-[62px]">
    <button
      onClick={() => setOpen(!open)}
      className="w-full h-10 px-3 border border-[#D9D9D9] rounded-lg text-sm text-[#232323] hover:bg-[#FEF2E6] bg-white text-left"
    >
      {itemsPerPage}
    </button>
    {open && (
      <div className="absolute bottom-full mb-1 w-full bg-white border border-[#D9D9D9] rounded-lg shadow-lg z-10">
        {options.map((n) => (
          <div
            key={n}
            onClick={() => {
              setItemsPerPage(n);
              setOpen(false);
            }}
            className="px-3 py-2 text-sm text-[#232323] hover:bg-[#FEF2E6] cursor-pointer"
          >
            {n}
          </div>
        ))}
      </div>
    )}
    <img
      src={arrow_right}
      alt="Dropdown arrow"
      className="pointer-events-none absolute right-2 top-1/2 w-4 h-4 -translate-y-1/2 rotate-90"
    />
  </div>
  <span className="text-[#232323] text-xs">entries</span>
</div>

        </div>
      </div>
    </div>
  );
};

export default RiderOrders;
