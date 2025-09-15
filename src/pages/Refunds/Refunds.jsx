import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiChevronDown, FiMoreHorizontal } from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Pagination from "../../components/Pagination";
import { useRefunds } from "../../hooks/useRefund";

const Refunds = () => {
  const navigate = useNavigate();

  const statusRef = useRef(null);
  // const dateRef = useRef(null);
  const actionRefs = useRef({});

  const { data: refunds = [], isLoading, isError } = useRefunds();


  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [selected, setSelected] = useState([]);

  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);

  // const [dateFilter, setDateFilter] = useState("Date");
  // const [dateOpen, setDateOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [openActionId, setOpenActionId] = useState(null);


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

      // if (dateRef.current && !dateRef.current.contains(event.target)) {
      //   setDateOpen(false);
      // }

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
    let temp = [...refunds];

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
  }, [searchTerm, status, refunds]);

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
            {/* <div className="relative " ref={dateRef}>
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
            </div> */}

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

        <div className="overflow-x-auto min-h-[400px]">
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

            {/* <tbody>
              {paginatedRefunds.length === 0 ? (
                
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No refunds found.
                  </td>
                </tr>
              ) : (
                paginatedRefunds.map((r, index) => (
                  const isNearBottom = index >= paginatedRefunds.length - 3;
                 return (
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

                    <td className="px-4 py-3">{r.refund_id}</td>
                    <td className="px-4 py-3">#{r.id}</td>

                    <td className="px-4 py-3 ">
                      <div className="flex items-center gap-3">
                        <img
                          src={r?.order?.traveler_photo || DefaultProfile}
                          alt="Traveler"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[#4F4F4F] text-sm">
                            {r.order?.traveler_name}
                          </p>
                          <p className="text-[#6C6C6C] text-xs">
                            {r.order?.traveler_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 ">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.order?.partner_photo ||DefaultProfile}
                          alt="Partner"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[#4F4F4F] text-sm">
                            {r.order?.partner_name}
                          </p>
                          <p className="text-[#6C6C6C] text-xs">
                            {r?.order?.partner_email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">{r.requested_at}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.status] || ""
                          }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">${r.amount}</td>
                    <td
                      className="px-4 py-3 relative text-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="p-1.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00]"
                        onClick={() =>
                          setOpenActionId(openActionId === r.id ? null : r.id)
                        }
                      >
                        <FiMoreHorizontal size={20} />
                      </button> 

                      {openActionId === r.id && (
                        <div
                          className={`absolute w-[140px] bg-white rounded-md shadow-[0_0_3px_#00000033] z-40 ${isNearBottom ? "bottom-full mb-1" : "top-full mt-1"
                            } right-0`}
                        // className="absolute right-4 gap-6 w-31 bg-white border border-[#00000033]  rounded-lg shadow-lg z-10 text-[#6C6C6C]"
                        >
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
                 )
                ))
              )}
            </tbody> */}
            <tbody>
              {paginatedRefunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4">
                    No refunds found.
                  </td>
                </tr>
              ) : (
                paginatedRefunds.map((r, index) => {

                  const isNearBottom = index >= paginatedRefunds.length - 2;

                  return (
                    <tr
                      key={r.id}
                      className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] transition-colors cursor-pointer"
                      onClick={() => navigate(`/refund/refundsdetail/${r.id}`)}
                    >
                      {/* Checkbox */}
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

                      {/* Refund Info */}
                      <td className="px-4 py-3">{r.refund_id}</td>
                      <td className="px-4 py-3">#{r.id}</td>
                      <td className="px-4 py-3">{r.order?.traveler_name}</td>
                      <td className="px-4 py-3">{r.order?.partner_name}</td>
                      <td className="px-4 py-3">{r.requested_at}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.status] || ""
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">${r.amount}</td>

                      {/* Action */}
                      <td
                        className="px-4 py-3 relative text-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="p-1.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00]"
                          onClick={() =>
                            setOpenActionId(openActionId === r.id ? null : r.id)
                          }
                        >
                          <FiMoreHorizontal size={20} />
                        </button>

                        {openActionId === r.id && (
                          <div
                            className={`absolute w-[140px] bg-white  rounded-md z-5 ${isNearBottom ? "bottom-full" : "top-full"
                              } right-4`}
                              style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
                          >
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
                  );
                })
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
