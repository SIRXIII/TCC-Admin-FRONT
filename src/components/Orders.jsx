import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import DefaultProfile from "../assets/Images/trv_profile.jpg";
// import DefaultProfile from "../";
import Pagination from "./Pagination";

const Orders = ({order}) => {
  if (!order) return <p className="text-center py-4">No data found.</p>;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const orders = order.order || [];

  console.log("orders", orders);
  const statusColors = {
  pending: "bg-[#E1FDFD] text-[#3E77B0]",
  delivered: "bg-[#E7F7ED] text-[#088B3A]",
  shipped: "bg-[#FEFCDD] text-[#B2A23F]",
  cancelled: "bg-[#FCECD6] text-[#CA4E2E]",
};


  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      o.id.toString().includes(searchTerm.toLowerCase()) ||
      o.traveler_name.toString().includes(searchTerm.toLowerCase()) ||
      o.partner_name.toString().includes(searchTerm.toLowerCase()) ||
      o.status.toString().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  console.log("currentPageData", currentPageData);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 flex flex-col gap-6 min-h-[400px]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#232323]">Orders</h2>
          <span className="text-sm text-[#9A9A9A]">
            Total orders{" "}
            <span className="fw6 text-[#232323]">{orders.length}</span>
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
            className="w-full pl-8 pr-2 px-4 py-2.5 border border-[#D9D9D9] rounded-xl text-sm focus:outline-none focus:border-[#F77F00]"
          />
        </div>

        <div className="overflow-x-auto overflow-y-auto min-h-[200px]">
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
                  <td colSpan={6} className="text-center py-4 text-[#6C6C6C]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((o) => (
                  <tr key={o.id} className="bg-white">
                    <td className="px-4 py-3 text-[#F77F00] fw5 text-sm">#{o.id}</td>
                     <td className="px-4 py-3 ">
                      <div className="flex items-center gap-2">

                      <img
                        src={o.traveler_photo || DefaultProfile}
                        alt={o.traveler_name}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = DefaultProfile)}
                        />
                      <span>{o?.traveler_name}</span>
                        </div>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={o.partner_photo || DefaultProfile}
                        alt={o?.partner_name || "-"}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = DefaultProfile)}
                      />
                      <span>{o?.partner_name}</span>
                    </td>
                    <td className="px-4 py-3">{o.created_at}</td>
                    <td className="px-4 py-3">{o.items_count}</td>
                    <td className="px-4 py-3">{o.total_price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          statusColors[o.status?.toLowerCase()] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status === "shipped" ? "In Progress" : o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
       
         <Pagination
          page={currentPage}
          setPage={setCurrentPage}
          perPage={itemsPerPage}
          setPerPage={setItemsPerPage}
          totalItems={filteredOrders.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default Orders;
