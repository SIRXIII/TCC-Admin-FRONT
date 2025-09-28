import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import AssignedOrders from "./AssignedOrders";
import PendingOrders from "./PendingOrders";
import Pagination from "../../components/Pagination";
import { useOrders } from "../../hooks/useOrder";

const Orders = () => {
  const { data: orders = { pending: [], approved: [] }, isLoading, isError } = useOrders();

  const [activeTab, setActiveTab] = useState("assigned");
  const [search, setSearch] = useState("");
  const [pagePending, setPagePending] = useState(1);
  const [pageAssigned, setPageAssigned] = useState(1);
  const [perPagePending, setPerPagePending] = useState(10);
  const [perPageAssigned, setPerPageAssigned] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


  const getValueByPath = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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

  // Data selection
  const data = activeTab === "pending" ? orders?.pending : orders?.approved;
  const page = activeTab === "pending" ? pagePending : pageAssigned;
  const perPage = activeTab === "pending" ? perPagePending : perPageAssigned;
  const setPage = activeTab === "pending" ? setPagePending : setPageAssigned;
  const setPerPage = activeTab === "pending" ? setPerPagePending : setPerPageAssigned;

  // Filter
  const filteredOrders = data?.filter((o) =>
    `${o.orderId} ${o.traveler?.name || ""} ${o.partner?.name || ""} ${o.rider?.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  const sortedOrders = useMemo(() => {
    if (!sortConfig.key) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      const aValue = getValueByPath(a, sortConfig.key)?.toString().toLowerCase() || "";
      const bValue = getValueByPath(b, sortConfig.key)?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortConfig]);


  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedOrders.slice(start, start + perPage);
  }, [sortedOrders, page, perPage]);

  return (
    <div className="flex flex-col gap-6 p-3">

      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs gap-1 fw4 leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Orders</p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="gap-2">
            <h2 className="text-2xl fw6 font-roboto text-[#232323]">Orders</h2>
            <p className="text-[#232323] text-sm">View and manage all orders in the platform.</p>
          </div>
        </div>
      </div>


      <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-fit">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "assigned" ? "bg-orange text-white shadow" : "text-gray-600"
            }`}
        >
          Assigned ({orders.approved.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "pending" ? "bg-orange text-white shadow" : "text-gray-600"
            }`}
        >
          Pending ({orders.pending.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">

          <div className="relative text-[#9A9A9A]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-2 px-4 py-2 border border-[#D9D9D9] bg-white rounded-lg w-[320px] focus:outline-none"
            />
          </div>

          <button className="flex items-center border border-[#23232333] rounded-lg px-3 py-1 text-sm text-[#9A9A9A] gap-2 h-[42px]">
            Status <FiChevronDown size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>


            <p className="text-orange-500 fw5 flex items-center">
              Loading Orders
              <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </span>
            </p>


          </div>
        ) : activeTab === "pending" ? (
          <PendingOrders
            orders={paginatedOrders}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        ) : (
          <AssignedOrders
            orders={paginatedOrders}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}


        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredOrders.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default Orders;
