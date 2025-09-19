import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import DefaultProfile from "../../../assets/Images/trv_profile.jpg";
import Pagination from "../../../components/Pagination";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const PartnerOrders = ({ partner, isLoading }) => {
  if (!partner) return <p className="text-center py-4">No partner data found.</p>;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const orders = partner.order || [];

  const statusColors = {
    pending: "bg-[#E1FDFD] text-[#3E77B0]",
    delivered: "bg-[#E7F7ED] text-[#088B3A]",
    shipped: "bg-[#FEFCDD] text-[#B2A23F]",
    cancelled: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  // const renderSortIcon = (key) => {
  //   if (sortConfig.key !== key) return "↕"; // neutral arrow
  //   return sortConfig.direction === "asc" ? "▲" : "▼"; // single arrow
  // };
  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1 text-xs">
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

  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) =>
      o.id.toString().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key] ?? "";
        const valB = b[sortConfig.key] ?? "";
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [orders, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

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
              <tr className="bg-[#F9F9F9] uppercase text-[#6C6C6C] cursor-pointer">
                <th className="px-4 py-3 text-left" onClick={() => handleSort("id")}>
                  Order ID {renderSortIcon("id")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("partnerName")}>
                  Partner {renderSortIcon("partnerName")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("created_at")}>
                  Date {renderSortIcon("created_at")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("items_count")}>
                  Items {renderSortIcon("items_count")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("total_price")}>
                  Total {renderSortIcon("total_price")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("status")}>
                  Status {renderSortIcon("status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <p className="text-orange-500 font-medium flex items-center justify-center">
                      Loading Orders
                      <span className="flex space-x-1 ml-2 text-2xl font-bold leading-none">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                          .
                        </span>
                        <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                          .
                        </span>
                      </span>
                    </p>
                  </td>
                </tr>
              ) : currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-[#6C6C6C]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((o) => (
                  <tr key={o.id} className="bg-white">
                    <td className="px-4 py-3">{o.id}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={partner.profile_photo || DefaultProfile}
                        alt={partner.name || "-"}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = DefaultProfile)}
                      />
                      <span>{partner.name || "-"}</span>
                    </td>
                    <td className="px-4 py-3">{o.created_at}</td>
                    <td className="px-4 py-3">{o.items_count}</td>
                    <td className="px-4 py-3">{o.total_price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[o.status?.toLowerCase()] ||
                          "bg-gray-100 text-gray-600"
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

        {totalPages > 1 && (

          <Pagination
            page={currentPage}
            setPage={setCurrentPage}
            perPage={itemsPerPage}
            setPerPage={setItemsPerPage}
            totalItems={filteredOrders.length}
            options={[5, 10, 25, 50]}
            fullWidth={true}
          />
        )}

      </div>
    </div>
  );
};

export default PartnerOrders;
