// import React, { useState } from "react";
// import { FiMoreHorizontal, FiChevronUp, FiChevronDown, FiArrowDown, FiArrowUp, FiTrash2 } from "react-icons/fi";
// import ActionMenu from "../../components/Partners/ActionMenu";
// import { useNavigate } from "react-router-dom";
// import { useStatusUpdatePartner } from "../../hooks/usePartners";
// import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";
// import API from "../../services/api";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";

// const ApprovedPartners = ({
//   paginatedPartners,
//   openActionId,
//   setOpenActionId,
//   handleSort,
//   sortConfig,
// }) => {
//   const navigate = useNavigate();
//   const { mutate: statusUpdate } = useStatusUpdatePartner();
//   const queryClient = useQueryClient();

//   const [selected, setSelected] = useState([]);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelected(paginatedPartners.map((p) => p.id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
//     );
//   };

//   const handleSuspendPartner = (id) => {
//     statusUpdate({ id: id, status: "suspended" });
//   };

//   const handleBulkDelete = async () => {
//     if (selected.length === 0) {
//       toast.error("Please select at least one partner to delete");
//       return;
//     }

//     try {
//       const response = await API.post("/partners/bulk-delete", {
//         ids: selected,
//       });

//       if (response.data?.success) {
//         toast.success(response.data?.message || `${selected.length} partner(s) deleted successfully`);
//         setSelected([]);
//         queryClient.invalidateQueries({ queryKey: ["partners"] });
//         setShowDeleteDialog(false);
//       } else {
//         toast.error(response.data?.message || "Failed to delete partners");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to delete partners");
//     }
//   };


//   const renderSortIcon = (key) => {
//     return (
//       <span className="inline-flex flex-row ml-1 text-xs">
//         <FiArrowUp
//           className={
//             sortConfig.key === key && sortConfig.direction === "asc"
//               ? "text-[#F77F00]"
//               : "text-gray-400"
//           }
//         />
//         <FiArrowDown
//           className={
//             sortConfig.key === key && sortConfig.direction === "desc"
//               ? "text-[#F77F00]"
//               : "text-gray-400"
//           }
//         />
//       </span>
//     );
//   };


//   return (
//     <>
//       {selected.length > 0 && (
//         <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
//           <span className="text-sm text-orange-800">
//             {selected.length} partner(s) selected
//           </span>
//           <button
//             onClick={() => setShowDeleteDialog(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <FiTrash2 size={16} />
//             Delete Selected
//           </button>
//         </div>
//       )}

//       <ConfirmDialog
//         isOpen={showDeleteDialog}
//         title="Delete Partners"
//         message={`Are you sure you want to delete ${selected.length} partner(s)? This action cannot be undone.`}
//         onConfirm={handleBulkDelete}
//         onCancel={() => setShowDeleteDialog(false)}
//       />

//       <table className="w-full text-left text-sm leading-[150%] tracking-[-3%]">
//         <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
//           <tr>
//             <th className="px-4 py-3">
//               <input
//                 type="checkbox"
//                 className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
//                 onChange={handleSelectAll}
//                 checked={
//                   selected.length === paginatedPartners.length &&
//                   paginatedPartners.length > 0
//                 }
//               />
//             </th>

//             <th
//               className="px-4 py-3 cursor-pointer select-none"
//               onClick={() => handleSort("name")}
//             >
//               Partner Name {renderSortIcon("name")}
//             </th>

//             <th
//               className="px-4 py-3 cursor-pointer select-none"
//               onClick={() => handleSort("business_name")}
//             >
//               Business Name {renderSortIcon("business_name")}
//             </th>

//             <th
//               className="px-4 py-3 cursor-pointer select-none"
//               onClick={() => handleSort("productsCount")}
//             >
//               Products {renderSortIcon("productsCount")}
//             </th>

//             {/* <th
//             className="px-4 py-3 cursor-pointer select-none"
//             onClick={() => handleSort("location")}
//           >
//             Location {renderSortIcon("location")}
//           </th> */}

//             <th
//               className="px-4 py-3 cursor-pointer select-none"
//             // onClick={() => handleSort("status")}
//             >
//               Status
//             </th>

//             <th className="px-4 py-3">Action</th>
//           </tr>
//         </thead>

//         <tbody className="bg-[#FFFFFF] fw4 text-[#232323]">
//           {paginatedPartners.length === 0 ? (

//             <tr>
//               <td colSpan={7} className="h-[200px]">
//                 <div className="flex flex-col items-center justify-center h-full text-centerp-6">



//                   <p className="text-orange-500 font-semibold text-lg">
//                     No partners found.
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Try adjusting filters or check back later.
//                   </p>


//                 </div>
//               </td>
//             </tr>

//           ) : paginatedPartners.map((partner) => (
//             <tr
//               key={partner.id}
//               onClick={() => navigate(`/partners/profile/${partner.id}`)}
//               className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors"
//             >
//               <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
//                 <input
//                   type="checkbox"
//                   className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
//                   checked={selected.includes(partner.id)}
//                   onChange={() => handleSelectOne(partner.id)}
//                 />
//               </td>

//               <td className="px-4 py-3 text-[#4F4F4F]">{partner.name}</td>
//               <td className="px-4 py-3">{partner.business_name}</td>
//               <td className="px-4 py-3">{partner.products?.length || 0}</td>
//               {/* <td className="px-4 py-3">{partner.location}</td> */}

//               <td className="px-4 py-3">
//                 <span
//                   className={`px-3 py-1 text-xs font-medium rounded-full ${partner.status === "Active"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                     }`}
//                 >
//                   {partner.status}
//                 </span>
//               </td>

//               <td className="px-4 py-3 relative">
//                 <div className="inline-block relative">
//                   <button
//                     className="p-1.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] w-[34px] h-[34px]"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setOpenActionId(
//                         openActionId === partner.id ? null : partner.id
//                       );
//                     }}
//                   >
//                     <FiMoreHorizontal size={20} />
//                   </button>

//                   <ActionMenu
//                     partner={partner}
//                     isOpen={openActionId === partner.id}
//                     setOpenActionId={setOpenActionId}
//                     paginatedPartners={paginatedPartners}
//                     items={[
//                       {
//                         label: "View Profile",
//                         type: "link",
//                         to: `/partners/profile/${partner.id}`,
//                       },
//                       {
//                         label: "Suspend",
//                         onClick: () => handleSuspendPartner(partner.id),
//                       },
//                       {
//                         label: "Edit",
//                         type: "link",
//                         to: `/partners/update-partner/${partner.id}`

//                       }
//                     ]}
//                   />
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default ApprovedPartners;


import React, { useState } from "react";
import { FiMoreHorizontal, FiArrowDown, FiArrowUp, FiTrash2 } from "react-icons/fi";
import ActionMenu from "../../components/Partners/ActionMenu";
import { Link, useNavigate } from "react-router-dom";
import { useStatusUpdatePartner } from "../../hooks/usePartners";
import ConfirmDialog from "../../components/Dialogs/ConfirmDialog";
import API from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ApprovedPartners = ({
  paginatedPartners,
  openActionId,
  setOpenActionId,
  handleSort,
  sortConfig,
}) => {
  const navigate = useNavigate();
  const { mutate: statusUpdate } = useStatusUpdatePartner();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedPartners.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSuspendPartner = (id) => {
    statusUpdate({ id: id, status: "suspended" });
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      toast.error("Please select at least one partner to delete");
      return;
    }

    try {
      const response = await API.post("/partners/bulk-delete", {
        ids: selected,
      });

      if (response.data?.success) {
        toast.success(response.data?.message || `${selected.length} partner(s) deleted successfully`);
        setSelected([]);
        queryClient.invalidateQueries({ queryKey: ["partners"] });
        setShowDeleteDialog(false);
      } else {
        toast.error(response.data?.message || "Failed to delete partners");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete partners");
    }
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex ml-1 text-xs">
      <FiArrowUp
        className={sortConfig.key === key && sortConfig.direction === "asc" ? "text-[#F77F00]" : "text-gray-400"}
      />
      <FiArrowDown
        className={sortConfig.key === key && sortConfig.direction === "desc" ? "text-[#F77F00]" : "text-gray-400"}
      />
    </span>
  );

  return (
    <>
      {selected.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
          <span className="text-sm text-orange-800">{selected.length} partner(s) selected</span>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiTrash2 size={16} />
            Delete Selected
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Partners"
        message={`Are you sure you want to delete ${selected.length} partner(s)? This action cannot be undone.`}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left text-sm leading-[150%] tracking-[-3%]">
          <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
                  onChange={handleSelectAll}
                  checked={selected.length === paginatedPartners.length && paginatedPartners.length > 0}
                />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("name")}>
                Partner Name {renderSortIcon("name")}
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("business_name")}>
                Business Name {renderSortIcon("business_name")}
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("productsCount")}>
                Products {renderSortIcon("productsCount")}
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white fw4 text-[#232323]">
            {paginatedPartners.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-[200px] text-center">
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <p className="text-orange-500 font-semibold text-lg">No partners found.</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting filters or check back later.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedPartners.map((partner) => (
                <tr key={partner.id} onClick={() => navigate(`/partners/profile/${partner.id}`)} className="hover:bg-[#FEF2E6] cursor-pointer transition-colors">
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
                      checked={selected.includes(partner.id)}
                      onChange={() => handleSelectOne(partner.id)}
                    />
                  </td>
                  <td className="px-4 py-3 text-[#4F4F4F]">{partner.name}</td>
                  <td className="px-4 py-3">{partner.business_name}</td>
                  <td className="px-4 py-3">{partner.products?.length || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${partner.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 relative">
                    <div className="inline-block relative">
                      <button
                        className="p-1.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] w-[34px] h-[34px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionId(openActionId === partner.id ? null : partner.id);
                        }}
                      >
                        <FiMoreHorizontal size={20} />
                      </button>
                      <ActionMenu
                        partner={partner}
                        isOpen={openActionId === partner.id}
                        setOpenActionId={setOpenActionId}
                        paginatedPartners={paginatedPartners}
                        items={[
                          { label: "View Profile", type: "link", to: `/partners/profile/${partner.id}` },
                          { label: "Suspend", onClick: () => handleSuspendPartner(partner.id) },
                          { label: "Edit", type: "link", to: `/partners/update-partner/${partner.id}` },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW (Card like Travelers) ================= */}
      <div className="space-y-4 md:hidden">
        {paginatedPartners.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center p-6">
            <p className="text-orange-500 font-semibold text-lg">No partners found.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting filters or check back later.</p>
          </div>
        ) : (
          paginatedPartners.map((partner) => (
            <div
              key={partner.id}
              className="border-color rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition relative"
            >
              <div className="flex items-center justify-between gap-4 pb-3">
                <div
                  className="flex-1 min-w-0 cursor-pointer text-[#4F4F4F] text-sm"
                  onClick={() => navigate(`/partners/profile/${partner.id}`)}
                >
                  <div className="truncate text-[#4F4F4F] ">
                    <span className="text-sm fw5 text-[#6C6C6C]">Partner Name:</span>{partner.name}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${partner.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  {partner.status}
                </span>

                <div
                  className="relative"
                  onPointerDown={(e) => e.stopPropagation()} // ⭐ critical
                >
                  <button
                    type="button"
                    className="p-1.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] w-[34px] h-[34px]"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setOpenActionId(
                        openActionId === partner.id ? null : partner.id
                      );
                    }}
                  >
                    <FiMoreHorizontal size={20} />
                  </button>

                  <ActionMenu
                    partner={partner}
                    isOpen={openActionId === partner.id}
                    setOpenActionId={setOpenActionId}
                    paginatedPartners={paginatedPartners}
                    items={[
                      { label: "View Profile", type: "link", to: `/partners/profile/${partner.id}` },
                      { label: "Suspend", onClick: () => handleSuspendPartner(partner.id) },
                      { label: "Edit", type: "link", to: `/partners/update-partner/${partner.id}` },
                    ]}
                  />
                </div>
              </div>

              < div
                onClick={() => navigate(`/partners/profile/${partner.id}`)}
                className="grid gap-2 text-xs text-[#4F4F4F] cursor-pointer justify-between"
              >
                <div className="flex gap-1 truncate text-sm">
                  <span className="text-sm fw5 text-[#6C6C6C]">Business Name:</span>{" "}
                  <span className="truncate">{partner.business_name}</span>
                </div>
                <div className="flex gap-1 text-sm">
                  <span className="text-sm fw5 text-[#6C6C6C]">Products:</span>{" "}
                  <span >{partner.products?.length || 0}</span>
                </div>
              </div>
            </div >
          ))
        )}
      </div >


    </>
  );
};

export default ApprovedPartners;
