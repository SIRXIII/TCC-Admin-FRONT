import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiChevronDown, FiMoreHorizontal } from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Pagination from "../../components/Pagination";

const Refunds = () => {
  const navigate = useNavigate();

  const statusRef = useRef(null);
  const dateRef = useRef(null);
  const actionRefs = useRef({});

  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [selected, setSelected] = useState([]);

  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);

  const [dateFilter, setDateFilter] = useState("Date");
  const [dateOpen, setDateOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [openActionId, setOpenActionId] = useState(null);

  const refundsData = [
    {
      id: "REF-1001",
      orderId: "ORD-2001",
      traveler: { name: "Alice Johnson", email: "alice@mail.com" },
      partner: { name: "John Partner", email: "john.partner@mail.com" },
      date: "January 2, 2023",
      status: "Pending",
      total: "$120.00",
    },
    {
      id: "REF-1002",
      orderId: "ORD-2002",
      traveler: { name: "Michael Smith", email: "michael@mail.com" },
      partner: { name: "Sophia Carter", email: "sophia.carter@mail.com" },
      date: "January 4, 2023",
      status: "Processed",
      total: "$85.00",
    },
    {
      id: "REF-1003",
      orderId: "ORD-2003",
      traveler: { name: "Emma Brown", email: "emma@mail.com" },
      partner: { name: "David Lee", email: "david.lee@mail.com" },
      date: "January 5, 2023",
      status: "Rejected",
      total: "$60.00",
    },
  ];

  const statusColors = {
    Pending: "bg-[#E1FDFD] text-[#3E77B0]",
    Processed: "bg-[#E7F7ED] text-[#088B3A]",
    Rejected: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }

      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDateOpen(false);
      }

      if (
        openActionId &&
        actionRefs.current[openActionId] &&
        !actionRefs.current[openActionId].contains(event.target)
      ) {
        setOpenActionId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let temp = [...refundsData];

    if (status !== "Status") {
      temp = temp.filter(
        (r) => r.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (r) =>
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.traveler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.partner.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRefunds(temp);
    setPage(1);
  }, [searchTerm, status, dateFilter]);

  const paginatedRefunds = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRefunds.slice(start, start + perPage);
  }, [filteredRefunds, page, perPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedRefunds.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="gap-6 p-2">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Refund</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#232323]">Refund</h2>
          <p className="text-[#232323] text-sm">
            View and manage refund orders in the platform.
          </p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search "
              className="pl-8 pr-2 px-4 py-2 border border-gray-300 rounded-xl text-base w-[320px] focus:outline-none focus:border-[#D9D9D9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative " ref={dateRef}>
              <button
                onClick={() => setDateOpen(!dateOpen)}
                className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-1 gap-2 text-xs text-[#9A9A9A] h-[36px]"
              >
                {dateFilter}
                <FiChevronDown size={12} />
              </button>
              {dateOpen && (
                <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 z-20">
                  {["Newest", "Oldest"].map((d) => (
                    <p
                      key={d}
                      className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
                      onClick={() => {
                        setDateFilter(d);
                        setDateOpen(false);
                      }}
                    >
                      {d}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-1 gap-2 text-xs text-[#9A9A9A] h-[36px]"
              >
                {status}
                <FiChevronDown size={12} />
              </button>
              {statusOpen && (
                <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 z-20">
                  {["Pending", "Processed", "Rejected"].map((s) => (
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
          </div>
        </div>

        <div className="overflow-x-auto ">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-lg"
                    onChange={handleSelectAll}
                    checked={
                      selected.length === paginatedRefunds.length &&
                      paginatedRefunds.length > 0
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left">Refund ID</th>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Traveler Name</th>
                <th className="px-4 py-3 text-left">Partner Name</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRefunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No refunds found.
                  </td>
                </tr>
              ) : (
                paginatedRefunds.map((r) => (
                  <tr
                    key={r.id}
                    className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] transition-colors cursor-pointer"
                    onClick={() => navigate(`/refund/refundsdetail`)}
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-lg"
                        checked={selected.includes(r.id)}
                        onChange={() => handleSelectOne(r.id)}
                      />
                    </td>

                    <td className="px-4 py-3">{r.id}</td>
                    <td className="px-4 py-3">{r.orderId}</td>

                    <td className="px-4 py-3 ">
                      <div className="flex items-center gap-3">
                        <img
                          src={DefaultProfile}
                          alt="Traveler"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[#4F4F4F] text-sm">
                            {r.traveler.name}
                          </p>
                          <p className="text-[#6C6C6C] text-xs">
                            {r.traveler.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 ">
                      <div className="flex items-center gap-3">
                        <img
                          src={DefaultProfile}
                          alt="Partner"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[#4F4F4F] text-sm">
                            {r.partner.name}
                          </p>
                          <p className="text-[#6C6C6C] text-xs">
                            {r.partner.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">{r.date}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          statusColors[r.status] || ""
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">{r.total}</td>
                    <td
                      className="px-4 py-3 relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="p-2.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00]"
                        onClick={() =>
                          setOpenActionId(openActionId === r.id ? null : r.id)
                        }
                      >
                        <FiMoreHorizontal size={20} />
                      </button>

                      {openActionId === r.id && (
                        <div className="absolute right-0 gap-6 w-31 bg-white border border-[#00000033]  rounded-lg shadow-lg z-10 text-[#6C6C6C]">
                          <button
                            className="px-4 py-2 hover:bg-[#FEF2E6] w-full text-left text-sm"
                            onClick={() =>
                              navigate(`/refund/refundsdetail/${r.id}`)
                            }
                          >
                            View Detail
                          </button>
                          <button
                            className="px-4 py-2 gap-2.5 hover:bg-[#FEF2E6] w-full text-left text-sm"
                            onClick={() => navigate(`/support/chatsupport`)}
                          >
                            Chat Support
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredRefunds.length}
        />
      </div>
    </div>
  );
};

export default Refunds;
