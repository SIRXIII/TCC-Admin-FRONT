// import React, { useState, useEffect, useMemo } from "react";
// import { FiSearch, FiChevronDown } from "react-icons/fi";
// import ApprovedPartners from "./ApprovedPartners";
// import PendingPartners from "./PendingPartners";

// import { Link } from "react-router-dom";
// import { usePartners } from "../../hooks/usePartners";
// import Pagination from "../../components/Pagination";
// import { FaPlus } from "react-icons/fa";
// import SuspendedPartners from "./SuspendedPartners";
// import Breadcrumb from "../../components/Breadcrumb";

// const Partners = () => {

//   const { data: partners = { approved: [], pending: [], suspended: [] }, isLoading, isError } = usePartners();


//   const [activeTab, setActiveTab] = useState("approved");
//   const [search, setSearch] = useState("");
//   const [pageApproved, setPageApproved] = useState(1);
//   const [pagePending, setPagePending] = useState(1);
//   const [pageSuspended, setPageSuspended] = useState(1);
//   const [perPageApproved, setPerPageApproved] = useState(10);
//   const [perPagePending, setPerPagePending] = useState(10);
//   const [perPageSuspended, setPerPageSuspended] = useState(10);

//   const [openActionId, setOpenActionId] = useState(null);

//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   const currentData = partners?.[activeTab];


//   const page =
//     activeTab === "approved"
//       ? pageApproved
//       : activeTab === "pending"
//         ? pagePending
//         : pageSuspended;

//   const perPage =
//     activeTab === "approved"
//       ? perPageApproved
//       : activeTab === "pending"
//         ? perPagePending
//         : perPageSuspended;

//   const setPage =
//     activeTab === "approved"
//       ? setPageApproved
//       : activeTab === "pending"
//         ? setPagePending
//         : setPageSuspended;

//   const setPerPage =
//     activeTab === "approved"
//       ? setPerPageApproved
//       : activeTab === "pending"
//         ? setPerPagePending
//         : setPerPageSuspended;


//   const handleSort = (key) => {
//     setSortConfig((prev) => {
//       if (prev.key === key) {
//         return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
//       }
//       return { key, direction: "asc" };
//     });
//   };

//   const filteredPartners = useMemo(() => {
//     isLoading
//     const timer = setTimeout(() => !isLoading, 400);
//     const filtered = (currentData || []).filter((partner) => {
//       const fullName = `${partner.name ?? ""}`.toLowerCase();
//       return (
//         fullName.includes(search.toLowerCase()) ||
//         partner.email?.toLowerCase().includes(search.toLowerCase()) ||
//         partner.business_name?.toLowerCase().includes(search.toLowerCase())
//       );
//     });

//     if (!sortConfig.key) return filtered;

//     return [...filtered].sort((a, b) => {
//       let aVal = a[sortConfig.key] ?? "";
//       let bVal = b[sortConfig.key] ?? "";

//       if (typeof aVal === "string") aVal = aVal.toLowerCase();
//       if (typeof bVal === "string") bVal = bVal.toLowerCase();

//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [currentData, search, sortConfig]);


//   const paginatedPartners = useMemo(() => {
//     const start = (page - 1) * perPage;
//     return filteredPartners.slice(start, start + perPage);
//   }, [filteredPartners, page, perPage]); ``

//   return (
//     <div className="flex flex-col top-[120px] left-[281px] gap-6 p-3">
//       <div className="flex flex-col gap-4">
//         {/* <div className="flex items-center text-xs gap-1  fw4 leading-[150%] tracking-[-3%]">
//           <p className="text-[#6C6C6C]">Dashboard</p>
//           <span className="mx-2 text-[#9A9A9A]">/</span>
//           <p className="text-[#F77F00]">Partners</p>
//         </div> */}
//          <Breadcrumb
//           items={[
//             { label: "Dashboard", path: "/" },

//             { label: "Partners" },
//           ]}
//         />

//         <div className="flex justify-between gap-4 ">
//           <div className="gap-2">
//             <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]  ">
//               Partners
//             </h2>

//             {activeTab === "approved" ? (
//               <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
//                 Browse and manage partner accounts and their product listings.
//               </p>
//             ) : (
//               <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
//                 Review and approve new partner applications.
//               </p>
//             )}
//           </div>

//           {activeTab === "approved" ? (
//             <Link
//               to={`/partners/add-partner`}
//               className="flex items-center justify-center gap-2 px-4 py-1 h-[40px] bg-orange-500 text-white text-xs fw6 rounded-lg"
//             >
//               <FaPlus className="w-3 h-3" />
//               <span className="">Add Partner</span>
//             </Link>
//           ) : (
//             <p></p>
//           )}



//         </div>
//       </div>

//       <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-fit">
//         <button
//           onClick={() => setActiveTab("approved")}
//           className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "approved"
//             ? "bg-orange text-white shadow"
//             : "text-gray-600"
//             }`}
//         >
//           Approved ({partners.approved.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "pending"
//             ? "bg-orange text-white shadow"
//             : "text-gray-600"
//             }`}
//         >
//           Pending ({partners.pending.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("suspended")}
//           className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "suspended"
//             ? "bg-orange text-white shadow"
//             : "text-gray-600"
//             }`}
//         >
//           Suspended ({partners.suspended.length})
//         </button>
//       </div>


//       <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
//           <div className="relative text-[#9A9A9A] px-2 py-2 gap-3 text-xs leading-[150%] tracking-[-3%] ">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-5">
//               <FiSearch size={16} />
//             </span>
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="pl-9 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
//             />
//           </div>

//         </div>



//         {isLoading ? (
//           <div className="flex flex-col justify-center items-center h-40 gap-2">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>


//             <p className="text-orange-500 fw5 flex items-center">
//               Loading Partners
//               <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
//                 <span className="animate-bounce">.</span>
//                 <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
//                 <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
//               </span>
//             </p>


//           </div>
//         ) : activeTab === "approved" ? (
//           <ApprovedPartners
//             paginatedPartners={paginatedPartners}
//             openActionId={openActionId}
//             handleSort={handleSort}
//             sortConfig={sortConfig}
//             setOpenActionId={setOpenActionId}
//           />
//         ) : activeTab === "pending" ? (
//           <PendingPartners
//             paginatedPartners={paginatedPartners}
//             openActionId={openActionId}
//             handleSort={handleSort}
//             sortConfig={sortConfig}
//             setOpenActionId={setOpenActionId}
//           />
//         ) : (
//           <SuspendedPartners
//             paginatedPartners={paginatedPartners}
//             openActionId={openActionId}
//             handleSort={handleSort}
//             sortConfig={sortConfig}
//             setOpenActionId={setOpenActionId}
//           />
//         )}


//         {paginatedPartners.length > 0 && (

//           <Pagination
//             page={page}
//             setPage={setPage}
//             perPage={perPage}
//             setPerPage={setPerPage}
//             totalItems={filteredPartners.length}
//             options={[5, 10, 25, 50]}
//             fullWidth={true}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default Partners;


import React, { useState, useEffect, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import ApprovedPartners from "./ApprovedPartners";
import PendingPartners from "./PendingPartners";
import SuspendedPartners from "./SuspendedPartners";
import { Link } from "react-router-dom";
import { usePartners } from "../../hooks/usePartners";
import Pagination from "../../components/Pagination";
import { FaPlus } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumb";

const Partners = () => {
  const { data: partners = { approved: [], pending: [], suspended: [] }, isLoading } = usePartners();

  const [activeTab, setActiveTab] = useState("approved");
  const [search, setSearch] = useState("");

  const [pageApproved, setPageApproved] = useState(1);
  const [pagePending, setPagePending] = useState(1);
  const [pageSuspended, setPageSuspended] = useState(1);

  const [perPageApproved, setPerPageApproved] = useState(10);
  const [perPagePending, setPerPagePending] = useState(10);
  const [perPageSuspended, setPerPageSuspended] = useState(10);

  const [openActionId, setOpenActionId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const currentData = partners?.[activeTab];

  const page =
    activeTab === "approved"
      ? pageApproved
      : activeTab === "pending"
        ? pagePending
        : pageSuspended;

  const perPage =
    activeTab === "approved"
      ? perPageApproved
      : activeTab === "pending"
        ? perPagePending
        : perPageSuspended;

  const setPage =
    activeTab === "approved"
      ? setPageApproved
      : activeTab === "pending"
        ? setPagePending
        : setPageSuspended;

  const setPerPage =
    activeTab === "approved"
      ? setPerPageApproved
      : activeTab === "pending"
        ? setPerPagePending
        : setPerPageSuspended;

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const filteredPartners = useMemo(() => {
    const filtered = (currentData || []).filter((p) => {
      const q = search.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.business_name?.toLowerCase().includes(q)
      );
    });

    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key] ?? "";
      let bVal = b[sortConfig.key] ?? "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [currentData, search, sortConfig]);

  const paginatedPartners = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredPartners.slice(start, start + perPage);
  }, [filteredPartners, page, perPage]);

  return (
    <div className="flex flex-col gap-6 p-3 sm:p-6">
      <Breadcrumb items={[{ label: "Dashboard", path: "/" }, { label: "Partners" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#232323]">Partners</h2>
          <p className="text-sm text-[#232323] mt-1">
            {activeTab === "approved"
              ? "Browse and manage partner accounts and their product listings."
              : "Review and approve new partner applications."}
          </p>
        </div>

        {activeTab === "approved" && (
          <Link
            to="/partners/add-partner"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 h-[40px] bg-orange-500 text-white text-xs font-semibold rounded-lg"
          >
            <FaPlus className="w-3 h-3" />
            Add Partner
          </Link>
        )}
      </div>

      <div className="flex gap-2 bg-[#FEECD9] rounded-lg p-2 overflow-x-auto">
        {["approved", "pending", "suspended"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition ${activeTab === tab ? "bg-orange text-white shadow" : "text-gray-600"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({partners[tab].length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border-color shadow-sm p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-[320px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border-color  rounded-xl text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
            <p className="text-orange-500 font-medium">Loading Partners...</p>
          </div>
        ) : activeTab === "approved" ? (
          <ApprovedPartners
            paginatedPartners={paginatedPartners}
            openActionId={openActionId}
            handleSort={handleSort}
            sortConfig={sortConfig}
            setOpenActionId={setOpenActionId}
          />
        ) : activeTab === "pending" ? (
          <PendingPartners
            paginatedPartners={paginatedPartners}
            openActionId={openActionId}
            handleSort={handleSort}
            sortConfig={sortConfig}
            setOpenActionId={setOpenActionId}
          />
        ) : (
          <SuspendedPartners
            paginatedPartners={paginatedPartners}
            openActionId={openActionId}
            handleSort={handleSort}
            sortConfig={sortConfig}
            setOpenActionId={setOpenActionId}
          />
        )}

        {paginatedPartners.length > 0 && (
          <Pagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={filteredPartners.length}
            options={[5, 10, 25, 50]}
            fullWidth
          />
        )}
      </div>
    </div>
  );
};

export default Partners;
