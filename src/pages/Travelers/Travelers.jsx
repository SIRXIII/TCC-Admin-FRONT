// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { FiMoreVertical, FiChevronDown, FiArrowDown, FiArrowUp } from "react-icons/fi";
// import { Search } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   useTravelers,
//   useBulkUpdateTravelers,
//   useExportTravelers,
//   useDeleteTravelers,
// } from "../../hooks/useTravelers";
// import DefaultProfile from "../../assets/Images/trv_profile.jpg";
// import DeleteButton from "../../components/Dialogs/DeleteButton";
// import Pagination from "../../components/Pagination";
// import Breadcrumb from "../../components/Breadcrumb";

// const Travelers = () => {
//   const navigate = useNavigate();
//   const { data: travelers = [], isLoading, isError } = useTravelers();
//   const { mutate: bulkUpdate } = useBulkUpdateTravelers();
//   const { mutate: exportData } = useExportTravelers();
//   const { mutate: deleteTraveler } = useDeleteTravelers();

//   const dropdownRef = useRef(null);
//   const statusRef = useRef(null);
//   const actionRefs = useRef({});
//   const [filteredTravelers, setFilteredTravelers] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [actionOpen, setActionOpen] = useState(null);

//   const [status, setStatus] = useState("Status");
//   const [statusOpen, setStatusOpen] = useState(false);

//   const [bulk, setBulk] = useState("Bulk Actions");
//   const [bulkOpen, setBulkOpen] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);

//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   const statusColors = {
//     active: "bg-[#E7F7ED] text-[#088B3A]",
//     suspended: "bg-[#FCECD6] text-[#CA4E2E]",
//   };

// useEffect(() => {
//   let temp = [...travelers];

//   if (status !== "Status") {
//     temp = temp.filter(
//       (t) => t.status.toLowerCase() === status.toLowerCase()
//     );
//   }

//   if (searchTerm.trim() !== "") {
//     temp = temp.filter(
//       (t) =>
//         t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.phone.includes(searchTerm)
//     );
//   }

//   setFilteredTravelers(temp);
//   setPage(1);
// }, [searchTerm, status, travelers]);

//   const sortedTravelers = useMemo(() => {
//     let sortable = [...filteredTravelers];
//     if (sortConfig.key) {
//       sortable.sort((a, b) => {
//         let aVal = a[sortConfig.key];
//         let bVal = b[sortConfig.key];

//         if (sortConfig.key === "orders") {
//           aVal = a.order ? a.order.length : 0;
//           bVal = b.order ? b.order.length : 0;
//         }

//         if (typeof aVal === "string") aVal = aVal.toLowerCase();
//         if (typeof bVal === "string") bVal = bVal.toLowerCase();

//         if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//         if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return sortable;
//   }, [filteredTravelers, sortConfig]);

//   const totalPages = Math.ceil(filteredTravelers.length / perPage);
//   const paginatedTravelers = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return sortedTravelers.slice(start, start + perPage);
//   }, [sortedTravelers, page, perPage]);

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelected(paginatedTravelers.map((t) => t.id));
//     } else {
//       setSelected([]);
//     }
//   };

//   const handleSelectOne = (id) => {
//     if (selected.includes(id)) {
//       setSelected(selected.filter((s) => s !== id));
//     } else {
//       setSelected([...selected, id]);
//     }
//   };

//   const suspendedTraveler = (id) => {
//     bulkUpdate({ ids: [id], status: "Deactivate" });
//   };

//   const handledeleteTraveler = (id) => {
//     deleteTraveler(id);
//   };
//   const handleBulkAction = (action) => {
//     console.log("Bulk action:", action, selected);
//     if (action === "Activate" || action === "Deactivate") {
//       bulkUpdate({ ids: selected, status: action });
//     }

//     if (action === "Export CSV") {
//       exportData(selected);
//     }

//     setBulk(action);
//     setBulkOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setBulkOpen(false);
//       }

//       if (statusRef.current && !statusRef.current.contains(event.target)) {
//         setStatusOpen(false);
//       }

//       if (
//         actionOpen &&
//         actionRefs.current[actionOpen] &&
//         !actionRefs.current[actionOpen].contains(event.target)
//       ) {
//         setActionOpen(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [actionOpen]);

//   const handleSort = (key) => {
//     setSortConfig((prev) => {
//       if (prev.key === key) {
//         return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
//       }
//       return { key, direction: "asc" };
//     });
//   };

//   // const getSortIndicator = (key) => {
//   //   if (sortConfig.key !== key) return "↕";
//   //   return sortConfig.direction === "asc" ? "▲" : "▼";
//   // };
//   const getSortIndicator = (key) => {
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
//     <div className="gap-6 mb-10">
//       <div className="flex flex-col p-3 gap-4">
//         {/* <div className="flex items-center text-xs leading-[150%] tracking-[-3%]">
//           <p className="text-[#6C6C6C]">Dashboard</p>
//           <span className="mx-2 text-[#9A9A9A]">/</span>
//           <p className="text-[#F77F00]">Travelers</p>
//         </div> */}
//          <Breadcrumb
//           items={[
//             { label: "Dashboard", path: "/" },

//             { label: "Travelers" },
//           ]}
//         />

//         <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
//           Travelers
//         </h2>

//         <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
//           View and manage all registered travelers in the platform.
//         </p>
//       </div>

//       <div className="bg-[#FFFFFF] rounded-lg border-color p-6">
//         <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
//           <div className="relative text-[#9A9A9A] px-4 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-6">
//               <Search size={16} />
//             </span>
//             <input
//               type="text"
//               placeholder="Search travelers..."
//               className="pl-8 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="relative" ref={statusRef}>
//               <button
//                 onClick={() => setStatusOpen(!statusOpen)}
//                 className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-0.5 text-xs text-[#9A9A9A] min-w-[79px] max-w-[110px] h-[36px]"
//               >
//                 {status}
//                 <FiChevronDown size={12} />
//               </button>
//               {statusOpen && (
//                 <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 h-27 z-20">
//                   {["Status", "Active", "Suspended"].map((s) => (
//                     <p
//                       key={s}
//                       className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
//                       onClick={() => {
//                         setStatus(s);
//                         setStatusOpen(false);
//                       }}
//                     >
//                       {s}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => selected.length > 0 && setBulkOpen(!bulkOpen)}
//                 disabled={selected.length === 0}
//                 className={`flex items-center justify-between border rounded-md px-4 py-2 text-xs w-[127px] h-[42px]
//                   ${selected.length === 0
//                     ? "bg-[#FEF2E6] text-[#F77F00] cursor-not-allowed"
//                     : "bg-[#FEF2E6] text-[#F77F00] cursor-pointer "
//                   }`}
//               >
//                 {bulk}
//                 <FiChevronDown size={18} />
//               </button>
//               {bulkOpen && (
//                 <div className="absolute mt-1 bg-white border-color text-[#9A9A9A] rounded-lg shadow-lg w-32 z-20">
//                   {["Activate", "Deactivate", "Export CSV"].map((b) => (
//                     <p
//                       key={b}
//                       className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
//                       onClick={() => handleBulkAction(b)}
//                     >
//                       {b}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
//                 <th className="px-4 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 rounded-lg"
//                     onChange={handleSelectAll}
//                     checked={
//                       selected.length === paginatedTravelers.length &&
//                       paginatedTravelers.length > 0
//                     }
//                   />
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left cursor-pointer"
//                   onClick={() => handleSort("name")}
//                 >
//                   Traveler Name {getSortIndicator("name")}
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left cursor-pointer"
//                   onClick={() => handleSort("phone")}
//                 >
//                   Phone Number {getSortIndicator("phone")}
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left cursor-pointer"
//                   onClick={() => handleSort("orders")}
//                 >
//                   Orders {getSortIndicator("orders")}
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left cursor-pointer"
//                   onClick={() => handleSort("status")}
//                 >
//                   Status {getSortIndicator("status")}
//                 </th>
//                 <th className="px-4 py-3 text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-10">

//                     <div className="flex flex-col justify-center items-center h-40 gap-2">
//                       <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>

//                       <p className="text-orange-500 fw5 flex items-center">
//                         Loading Travelers
//                         <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
//                           <span className="animate-bounce">.</span>
//                           <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
//                           <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
//                         </span>
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : paginatedTravelers.length === 0 ? (

//                 <tr>
//                   <td colSpan={7} className="h-[200px]">
//                     <div className="flex flex-col items-center justify-center h-full text-centerp-6">

//                       <p className="text-orange-500 font-semibold text-lg">
//                         No travelers found.
//                       </p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Try adjusting filters or check back later.
//                       </p>

//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedTravelers.map((t) => (
//                   <tr
//                     key={t.id}
//                     onClick={() => navigate(`/travelers/profile/${t.id}`)}
//                     className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors"
//                   >
//                     <td
//                       className="px-4 py-3"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 rounded-lg"
//                         checked={selected.includes(t.id)}
//                         onChange={() => handleSelectOne(t.id)}
//                       />
//                     </td>

//                     <td className="px-4 py-3 flex gap-2.5 items-center">
//                       <img
//                         src={t.profile_photo}
//                         alt="Traveler"
//                         className="w-6 h-6 rounded-xl object-cover object-center"
//                         onError={(e) => {
//                           e.currentTarget.src = DefaultProfile;
//                         }}
//                       />
//                       <div>
//                         <p className="text-[#4F4F4F] text-sm">{t.name}</p>
//                         <p className="text-[#6C6C6C] text-xs">{t.email}</p>
//                       </div>
//                     </td>

//                     <td className="px-4 py-3 text-[#232323]">{t.phone}</td>
//                     <td className="px-4 py-3 text-[#232323]">
//                       {t.order ? t.order.length : 0}
//                     </td>
//                     <td className="px-4 py-3 text-[#232323]">
//                       <span
//                         className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[t.status.toLowerCase()]
//                           }`}
//                       >
//                         {t.status}
//                       </span>
//                     </td>

//                     <td
//                       className="px-4 py-3 text-right relative overflow-visible"
//                       ref={(el) => (actionRefs.current[t.id] = el)}
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <div className="inline-block relative">
//                         <button
//                           className="p-1.5 rounded-lg border bg-[#FCECD6] text-[#CA4E2E]"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setActionOpen(actionOpen === t.id ? null : t.id);
//                           }}
//                         >
//                           <FiMoreVertical size={16} />
//                         </button>
//                         {actionOpen === t.id && (
//                           <div
//                             className={`absolute w-32 bg-white border border-[#D9D9D9] rounded-md shadow-lg z-40
//                 ${[
//                                 paginatedTravelers[paginatedTravelers.length - 1].id,
//                                 paginatedTravelers[paginatedTravelers.length - 2].id,
//                               ].includes(t.id)
//                                 ? "bottom-full mb-0.5"
//                                 : "top-full mt-0.5"
//                               }
//                 right-0`}
//                           >
//                             <Link
//                               to={`/travelers/profile/${t.id}`}
//                               onClick={(e) => e.stopPropagation()}
//                               className="block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6]"
//                             >
//                               View Profile
//                             </Link>
//                             {t.status === "Active" && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   suspendedTraveler(t.id);
//                                   setActionOpen(null);
//                                 }}
//                                 className={`block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] `}
//                               >
//                                 Suspend
//                               </button>
//                             )}

//                             <DeleteButton
//                               onDelete={() => handledeleteTraveler(t.id)}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {paginatedTravelers.length > 0 && (

//           <Pagination
//             page={page}
//             setPage={setPage}
//             perPage={perPage}
//             setPerPage={setPerPage}
//             totalItems={filteredTravelers.length}
//             options={[5, 10, 25, 50]}
//             fullWidth={true}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default Travelers;

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiMoreVertical,
  FiChevronDown,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useTravelers,
  useBulkUpdateTravelers,
  useExportTravelers,
  useDeleteTravelers,
} from "../../hooks/useTravelers";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import DeleteButton from "../../components/Dialogs/DeleteButton";
import Pagination from "../../components/Pagination";
import Breadcrumb from "../../components/Breadcrumb";

const Travelers = () => {
  const navigate = useNavigate();
  const { data: travelers = [], isLoading, isError } = useTravelers();
  const { mutate: bulkUpdate } = useBulkUpdateTravelers();
  const { mutate: exportData } = useExportTravelers();
  const { mutate: deleteTraveler } = useDeleteTravelers();

  const dropdownRef = useRef(null);
  const statusRef = useRef(null);
  const actionRefs = useRef({});
  const [filteredTravelers, setFilteredTravelers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [actionOpen, setActionOpen] = useState(null);

  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);

  const [bulk, setBulk] = useState("Bulk Actions");
  const [bulkOpen, setBulkOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const statusColors = {
    active: "bg-[#E7F7ED] text-[#088B3A]",
    suspended: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  useEffect(() => {
    let temp = [...travelers];

    if (status !== "Status") {
      temp = temp.filter(
        (t) => t.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.phone && t.phone.includes(searchTerm))
      );
    }

    setFilteredTravelers(temp);
    setPage(1);
  }, [searchTerm, status, travelers]);

  const sortedTravelers = useMemo(() => {
    let sortable = [...filteredTravelers];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "orders") {
          aVal = a.order ? a.order.length : 0;
          bVal = b.order ? b.order.length : 0;
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredTravelers, sortConfig]);

  const totalPages = Math.ceil(filteredTravelers.length / perPage);
  const paginatedTravelers = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedTravelers.slice(start, start + perPage);
  }, [sortedTravelers, page, perPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedTravelers.map((t) => t.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const suspendedTraveler = (id) => {
    bulkUpdate({ ids: [id], status: "Deactivate" });
  };

  const handledeleteTraveler = (id) => {
    deleteTraveler(id);
  };

  const handleBulkAction = (action) => {
    if (action === "Activate" || action === "Deactivate") {
      bulkUpdate({ ids: selected, status: action });
    }
    if (action === "Export CSV") {
      exportData(selected);
    }
    setBulk(action);
    setBulkOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionOpen &&
        actionRefs.current[actionOpen] &&
        !actionRefs.current[actionOpen].contains(event.target)
      ) {
        setActionOpen(null);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBulkOpen(false);
      }

      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [actionOpen]);


  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIndicator = (key) => {
    return (
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
  };

  return (
    <div className="gap-6 mb-10">
      <div className="flex flex-col p-3 gap-4">
        <Breadcrumb
          items={[{ label: "Dashboard", path: "/" }, { label: "Travelers" }]}
        />
        <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
          Travelers
        </h2>
        <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
          View and manage all registered travelers in the platform.
        </p>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative text-[#9A9A9A] px-4 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search travelers..."
              className="pl-8 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-0.5 text-xs text-[#9A9A9A] min-w-[79px] max-w-[110px] h-[36px]"
              >
                {status}
                <FiChevronDown size={12} />
              </button>
              {statusOpen && (
                <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 h-27 z-20">
                  {["Status", "Active", "Suspended"].map((s) => (
                    <p
                      key={s}
                      className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
                      onClick={() => {
                        setStatus(s);
                        setStatusOpen(false);
                      }}
                    >
                      {s}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => selected.length > 0 && setBulkOpen(!bulkOpen)}
                disabled={selected.length === 0}
                className={`flex items-center justify-between border rounded-md px-4 py-2 text-xs w-[127px] h-[42px]
                  ${selected.length === 0
                    ? "bg-[#FEF2E6] text-[#F77F00] cursor-not-allowed"
                    : "bg-[#FEF2E6] text-[#F77F00] cursor-pointer "
                  }`}
              >
                {bulk}
                <FiChevronDown size={18} />
              </button>
              {bulkOpen && (
                <div className="absolute mt-1 bg-white border-color text-[#9A9A9A] rounded-lg shadow-lg w-32 z-20">
                  {["Activate", "Deactivate", "Export CSV"].map((b) => (
                    <p
                      key={b}
                      className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
                      onClick={() => handleBulkAction(b)}
                    >
                      {b}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= MOBILE VIEW (Same data + Action menu) ================= */}
        <div className="space-y-4 lg:hidden">
          {paginatedTravelers.map((t) => (
            <div
              key={t.id}
              className="border-color rounded-xl px-2 py-3 bg-white  hover:shadow-md transition relative"
            >
              <div className="flex items-center gap-4 pb-3">
                <input
                  type="checkbox"
                  checked={selected.includes(t.id)}
                  onChange={() => handleSelectOne(t.id)}
                  className="w-4 h-4 rounded-lg"
                />

                <img
                  src={t.profile_photo || DefaultProfile}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/travelers/profile/${t.id}`)}
                >
                  <p className="text-sm font-semibold text-[#232323] truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#6C6C6C] truncate">{t.email}</p>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${t.status === "Active"
                    ? "bg-[#E7F7ED] text-[#088B3A]"
                    : "bg-[#FCECD6] text-[#ED6C3C]"
                    }`}
                >
                  {t.status}
                </span>

                <div
                  className="relative"
                  ref={(el) => (actionRefs.current[t.id] = el)}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionOpen(actionOpen === t.id ? null : t.id);
                    }}
                    className="p-1.5 rounded-lg border bg-[#FCECD6] text-[#CA4E2E]"
                  >
                    <FiMoreVertical size={16} />
                  </button>

                  {actionOpen === t.id && (
                    <div
                      className="absolute right-0 top-full mt-1 w-32 bg-white border rounded-md shadow-lg z-50"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Link
                        to={`/travelers/profile/${t.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block px-4 py-2 text-sm hover:bg-[#FEF2E6]"
                      >
                        View Profile
                      </Link>

                      {t.status === "Active" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            suspendedTraveler(t.id);
                            setActionOpen(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-[#FEF2E6]"
                        >
                          Suspend
                        </button>
                      )}

                      <div onClick={(e) => e.stopPropagation()}>
                        <DeleteButton onDelete={() => handledeleteTraveler(t.id)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                onClick={() => navigate(`/travelers/profile/${t.id}`)}
                className="grid grid-cols-2 gap-3  text-xs text-[#4F4F4F] cursor-pointer"
              >
                <div>
                  <span className="font-medium">Country:</span> {t.country}
                </div>

                <div>
                  <span className="font-medium">Total Orders:</span>{" "}
                  {t?.order?.length ?? 0}
                </div>

                <div className="col-span-2">
                  <span className="font-medium">Last Active:</span> {t.last_active}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP VIEW (Table) ================= */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-lg"
                    onChange={handleSelectAll}
                    checked={
                      selected.length === paginatedTravelers.length &&
                      paginatedTravelers.length > 0
                    }
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Traveler Name {getSortIndicator("name")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("phone")}
                >
                  Phone Number {getSortIndicator("phone")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("orders")}
                >
                  Orders {getSortIndicator("orders")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {getSortIndicator("status")}
                </th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <div className="flex flex-col justify-center items-center h-40 gap-2">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                      <p className="text-orange-500 fw5 flex items-center">
                        Loading Travelers
                        <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
                          <span className="animate-bounce">.</span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          >
                            .
                          </span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          >
                            .
                          </span>
                        </span>
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedTravelers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-[200px]">
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <p className="text-orange-500 font-semibold text-lg">
                        No travelers found.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting filters or check back later.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTravelers.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/travelers/profile/${t.id}`)}
                    className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors"
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-lg"
                        checked={selected.includes(t.id)}
                        onChange={() => handleSelectOne(t.id)}
                      />
                    </td>

                    <td className="px-4 py-3 flex gap-2.5 items-center">
                      <img
                        src={t.profile_photo}
                        alt="Traveler"
                        className="w-6 h-6 rounded-xl object-cover object-center"
                        onError={(e) => {
                          e.currentTarget.src = DefaultProfile;
                        }}
                      />
                      <div>
                        <p className="text-[#4F4F4F] text-sm">{t.name}</p>
                        <p className="text-[#6C6C6C] text-xs">{t.email}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[#232323]">{t.phone}</td>
                    <td className="px-4 py-3 text-[#232323]">
                      {t.order ? t.order.length : 0}
                    </td>
                    <td className="px-4 py-3 text-[#232323]">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[t.status.toLowerCase()]
                          }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td
                      className="px-4 py-3 text-right relative overflow-visible"
                      ref={(el) => (actionRefs.current[t.id] = el)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-block relative">
                        <button
                          className="p-1.5 rounded-lg border bg-[#FCECD6] text-[#CA4E2E]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionOpen(actionOpen === t.id ? null : t.id);
                          }}
                        >
                          <FiMoreVertical size={16} />
                        </button>
                        {actionOpen === t.id && (
                          <div
                            className={`absolute w-32 bg-white border border-[#D9D9D9] rounded-md shadow-lg z-40 ${[
                              paginatedTravelers[
                                paginatedTravelers.length - 1
                              ]?.id,
                              paginatedTravelers[
                                paginatedTravelers.length - 2
                              ]?.id,
                            ].includes(t.id)
                              ? "bottom-full mb-0.5"
                              : "top-full mt-0.5"
                              } right-0`}
                          >
                            <Link
                              to={`/travelers/profile/${t.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6]"
                            >
                              View Profile
                            </Link>
                            {t.status === "Active" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  suspendedTraveler(t.id);
                                  setActionOpen(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6]"
                              >
                                Suspend
                              </button>
                            )}
                            <DeleteButton
                              onDelete={() => handledeleteTraveler(t.id)}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {paginatedTravelers.length > 0 && (
          <Pagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={filteredTravelers.length}
            options={[5, 10, 25, 50]}
            fullWidth={true}
          />
        )}
      </div>
    </div>
  );
};

export default Travelers;
