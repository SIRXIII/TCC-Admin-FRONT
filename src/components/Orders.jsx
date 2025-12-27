// import React, { useState, useMemo, useEffect } from "react";
// import { Search } from "lucide-react";
// import DefaultProfile from "../assets/Images/trv_profile.jpg";
// import Pagination from "./Pagination";
// import { FiArrowDown, FiArrowUp } from "react-icons/fi";

// const Orders = ({ order }) => {
//   if (!order) return <p className="text-center py-4">No data found.</p>;

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   const orders = order.order || [];

//   const statusColors = {
//     pending: "bg-[#E1FDFD] text-[#3E77B0]",
//     delivered: "bg-[#E7F7ED] text-[#088B3A]",
//     shipped: "bg-[#FEFCDD] text-[#B2A23F]",
//     cancelled: "bg-[#FCECD6] text-[#CA4E2E]",
//   };

//   const getValueByPath = (obj, path) =>
//     path.split(".").reduce((acc, part) => acc && acc[part], obj);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const renderSortIcon = (key) => (
//     <span className="inline-flex flex-row ml-1 text-xs">
//       <FiArrowUp
//         className={
//           sortConfig.key === key && sortConfig.direction === "asc"
//             ? "text-[#F77F00]"
//             : "text-gray-400"
//         }
//       />
//       <FiArrowDown
//         className={
//           sortConfig.key === key && sortConfig.direction === "desc"
//             ? "text-[#F77F00]"
//             : "text-gray-400"
//         }
//       />
//     </span>
//   );

//   const filteredOrders = useMemo(() => {
//     let result = orders.filter(
//       (o) =>
//         o.id.toString().includes(searchTerm.toLowerCase()) ||
//         o.traveler_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         o.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         o.status?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (sortConfig.key) {
//       result = [...result].sort((a, b) => {
//         const valA =
//           getValueByPath(a, sortConfig.key)?.toString().toLowerCase() || "";
//         const valB =
//           getValueByPath(b, sortConfig.key)?.toString().toLowerCase() || "";
//         if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return result;
//   }, [orders, searchTerm, sortConfig]);

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

//   const currentPageData = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredOrders.slice(start, start + itemsPerPage);
//   }, [filteredOrders, currentPage, itemsPerPage]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filteredOrders]);

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 flex flex-col gap-6 min-h-[400px]">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold text-[#232323]">Orders</h2>
//           <span className="text-sm text-[#9A9A9A]">
//             Total orders{" "}
//             <span className="fw6 text-[#232323]">{orders.length}</span>
//           </span>
//         </div>

//         {/* Search */}
//         <div className="relative text-[#9A9A9A] text-xs">
//           <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//             <Search size={16} />
//           </span>
//           <input
//             type="text"
//             placeholder="Search orders..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-8 pr-2 px-4 py-2.5 border border-[#D9D9D9] rounded-xl text-sm focus:outline-none focus:border-[#F77F00]"
//           />
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto overflow-y-auto min-h-[200px]">
//           <table className="w-full border-collapse text-sm">
//             <thead>
//               <tr className="bg-[#F9F9F9] uppercase text-[#6C6C6C] cursor-pointer">
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("id")}>
//                   Order ID {renderSortIcon("id")}
//                 </th>
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("traveler_name")}>
//                   Traveler Name {renderSortIcon("traveler_name")}
//                 </th>
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("partner_name")}>
//                   Partner Name {renderSortIcon("partner_name")}
//                 </th>
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("created_at")}>
//                   Date {renderSortIcon("created_at")}
//                 </th>
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("items_count")}>
//                   Items {renderSortIcon("items_count")}
//                 </th>
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("total_price")}>
//                   Total {renderSortIcon("total_price")}
//                 </th>
//                 <th className="px-4 py-3 text-left" onClick={() => handleSort("status")}>
//                   Status {renderSortIcon("status")}
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentPageData.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="h-[200px]">
//                     <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">
//                       <p className="text-orange-500 font-semibold text-lg">
//                         No orders found
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Try adjusting filters or check back later.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 currentPageData.map((o) => (
//                   <tr key={o.id} className="bg-white">
//                     <td className="px-4 py-3 text-[#F77F00] fw5 text-sm">#{o.id}</td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-2">
//                         <img
//                           src={o.traveler_photo || DefaultProfile}
//                           alt={o.traveler_name}
//                           className="w-6 h-6 rounded-full object-cover"
//                           onError={(e) => (e.currentTarget.src = DefaultProfile)}
//                         />
//                         <span>{o?.traveler_name}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 flex items-center gap-2">
//                       <img
//                         src={o.partner_photo || DefaultProfile}
//                         alt={o?.partner_name || "-"}
//                         className="w-6 h-6 rounded-full object-cover"
//                         onError={(e) => (e.currentTarget.src = DefaultProfile)}
//                       />
//                       <span>{o?.partner_name}</span>
//                     </td>
//                     <td className="px-4 py-3">{o.created_at}</td>
//                     <td className="px-4 py-3">{o.items_count}</td>
//                     <td className="px-4 py-3">{o.total_price}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded-md text-xs font-medium ${
//                           statusColors[o.status?.toLowerCase()] ||
//                           "bg-gray-100 text-gray-600"
//                         }`}
//                       >
//                         {o.status === "shipped" ? "In Progress" : o.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>


//         {filteredOrders.length > 1 && (
//           <Pagination
//             page={currentPage}
//             setPage={setCurrentPage}
//             perPage={itemsPerPage}
//             setPerPage={setItemsPerPage}
//             totalItems={filteredOrders.length}
//             options={[5, 10, 25, 50]}
//             fullWidth={true}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;




import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import DefaultProfile from "../assets/Images/trv_profile.jpg";
import Pagination from "./Pagination";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const Orders = ({ order }) => {
  if (!order) return <p className="text-center py-4">No data found.</p>;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const orders = order.order || [];

  const statusColors = {
    pending: "bg-[#E1FDFD] text-[#3E77B0]",
    delivered: "bg-[#E7F7ED] text-[#088B3A]",
    shipped: "bg-[#FEFCDD] text-[#B2A23F]",
    cancelled: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const getValueByPath = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1 text-xs">
      <FiArrowUp
        className={sortConfig.key === key && sortConfig.direction === "asc" ? "text-[#F77F00]" : "text-gray-400"}
      />
      <FiArrowDown
        className={sortConfig.key === key && sortConfig.direction === "desc" ? "text-[#F77F00]" : "text-gray-400"}
      />
    </span>
  );

  const filteredOrders = useMemo(() => {
    let result = orders.filter(
      (o) =>
        o.id.toString().includes(searchTerm.toLowerCase()) ||
        o.traveler_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const valA = getValueByPath(a, sortConfig.key)?.toString().toLowerCase() || "";
        const valB = getValueByPath(b, sortConfig.key)?.toString().toLowerCase() || "";
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [orders, searchTerm, sortConfig]);

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  useEffect(() => setCurrentPage(1), [filteredOrders]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 flex flex-col gap-6 min-h-[400px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#232323]">Orders</h2>
          <span className="text-sm text-[#9A9A9A]">
            Total orders <span className="fw6 text-[#232323]">{orders.length}</span>
          </span>
        </div>

        {/* Search */}
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

        {/* Large screen table */}
        <div className="overflow-x-auto overflow-y-auto min-h-[200px] hidden md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F9F9F9] uppercase text-[#6C6C6C] cursor-pointer">
                <th className="px-4 py-3 text-left" onClick={() => handleSort("id")}>
                  Order ID {renderSortIcon("id")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("traveler_name")}>
                  Traveler Name {renderSortIcon("traveler_name")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("partner_name")}>
                  Partner Name {renderSortIcon("partner_name")}
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
              {currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-[200px]">
                    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">
                      <p className="text-orange-500 font-semibold text-lg">No orders found</p>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting filters or check back later.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPageData.map((o) => (
                  <tr key={o.id} className="bg-white">
                    <td className="px-4 py-3 text-[#F77F00] fw5 text-sm">#{o.id}</td>
                     <td className="px-4 py-3">
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
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img src={o.partner_photo || DefaultProfile} alt={o.partner_name || "-"} className="w-6 h-6 rounded-full object-cover" />
                      <span>{o.partner_name}</span>
                    </td>
                    <td className="px-4 py-3">{o.created_at}</td>
                    <td className="px-4 py-3">{o.items_count}</td>
                    <td className="px-4 py-3">{o.total_price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[o.status?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                        {o.status === "shipped" ? "In Progress" : o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Small screen table view with headings */}
        <div className="md:hidden flex flex-col gap-4">
          {currentPageData.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">
              <p className="text-orange-500 font-semibold text-lg">No orders found</p>
              <p className="text-sm text-gray-500 pt-1 ">Try adjusting filters or check back later.</p>
            </div>
          ) : (
            currentPageData.map((o) => (
              <div key={o.id} className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Order ID:</span>
                  <span className="text-[#F77F00] fw5">#{o.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Traveler Name:</span>
                  <div className="flex items-center gap-2">
                    <img src={o.traveler_photo || DefaultProfile} alt={o.traveler_name} className="w-6 h-6 rounded-full object-cover" />
                    <span>{o.traveler_name}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Partner Name:</span>
                  <div className="flex items-center gap-2">
                    <img src={o.partner_photo || DefaultProfile} alt={o.partner_name || "-"} className="w-6 h-6 rounded-full object-cover" />
                    <span>{o.partner_name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{o.created_at}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Items:</span>
                  <span>{o.items_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span>{o.total_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[o.status?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                    {o.status === "shipped" ? "In Progress" : o.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredOrders.length > 1 && (
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

export default Orders;
