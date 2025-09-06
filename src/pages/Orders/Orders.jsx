import React, { useState, useMemo } from "react";
import { FiSearch , FiChevronDown} from "react-icons/fi";
import AssignedOrders from "./AssignedOrders";
import PendingOrders from "./PendingOrders";
import Pagination from "../../components/Pagination";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [pagePending, setPagePending] = useState(1);
  const [pageAssigned, setPageAssigned] = useState(1);
  const [perPagePending, setPerPagePending] = useState(5);
  const [perPageAssigned, setPerPageAssigned] = useState(5);

  // Dummy Data
  const pendingOrders = [
    {
      id: 1,
      orderId: "ORD-1001",
      traveler: { name: "Ali Khan", email: "ali@example.com" },
      partner: { name: "Luxury Rentals", email: "rentals@example.com" },
      eta: "2 days",
      date: "2025-09-04",
      total: 120,
    },
    {
      id: 2,
      orderId: "ORD-1002",
      traveler: { name: "Sara Malik", email: "sara@example.com" },
      partner: { name: "Art Gallery", email: "art@example.com" },
      eta: "1 day",
      date: "2025-09-05",
      total: 80,
    },
  ];

  const assignedOrders = [
    {
      id: 1,
      orderId: "ORD-2001",
      traveler: { name: "Ali Khan", email: "ali@example.com" },
      rider: { name: "Rider One", email: "rider1@example.com" },
      eta: "",
      date: "2025-09-04",
      status: "In Transit",
      total: 150,
    },
    {
      id: 2,
      orderId: "ORD-2002",
      traveler: { name: "Sara Malik", email: "sara@example.com" },
      rider: { name: "Rider Two", email: "rider2@example.com" },
      eta: "1hrs",
      date: "2025-09-05",
      status: "Delivered",
      total: 220,
    },
  ];

  // Switch between pending & assigned
  const data = activeTab === "pending" ? pendingOrders : assignedOrders;
  const page = activeTab === "pending" ? pagePending : pageAssigned;
  const perPage = activeTab === "pending" ? perPagePending : perPageAssigned;
  const setPage = activeTab === "pending" ? setPagePending : setPageAssigned;
  const setPerPage =
    activeTab === "pending" ? setPerPagePending : setPerPageAssigned;

  // Filter
  const filteredOrders = data.filter((o) =>
    `${o.orderId} ${o.traveler?.name || ""} ${o.partner?.name || ""} ${
      o.rider?.name || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / perPage);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredOrders.slice(start, start + perPage);
  }, [filteredOrders, page, perPage]);

  return (
    <div className="flex flex-col top-[120px] left-[281px] gap-6 p-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs gap-1 fw4 leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Orders</p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="gap-2">
            <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
              Orders
            </h2>
            <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
              View and manage all orders in the platform.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${
            activeTab === "pending"
              ? "bg-orange text-white shadow"
              : "text-gray-600"
          }`}
        >
          Pending ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("assigned")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${
            activeTab === "assigned"
              ? "bg-orange text-white shadow"
              : "text-gray-600"
          }`}
        >
          Assigned ({assignedOrders.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
          <div className="relative text-[#9A9A9A] px-2 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
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
              className="pl-9 pr-2 px-4 py-2 gap-2 border border-[#D9D9D9] bg-[#FFFFFF] rounded-lg text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
            />
          </div>
          <button
                className="flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-0.5 text-sm text-[#9A9A9A] gap-3 max-w-[127px] h-[42px]"
              >
                Status
                <FiChevronDown size={16} />
              </button>
        </div>

        {activeTab === "pending" ? (
          <PendingOrders orders={paginatedOrders} />
        ) : (
          <AssignedOrders orders={paginatedOrders} />
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
