import React, { useState, useMemo } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import Eye from "../../assets/SVG/eyeorange.svg";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import ticketsData from "../../data/ticketsData";
import DefaultProfile from "../../assets/Images/rid_profile.jpg";

const Support = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedTickets.map((t) => t.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-[#E5F6FD] text-[#0AA6D7]";
      case "In Progress":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Resolved":
        return "bg-[#E7F7ED] text-[#088B3A]";
      default:
        return "";
    }
  };

  const filteredTickets = useMemo(() => {
    return ticketsData.filter(
      (t) =>
        t.ticketId.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTickets.slice(start, start + perPage);
  }, [filteredTickets, page, perPage]);

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        <div className="flex items-center text-xs gap-1 leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className=" text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Support</p>
        </div>
        <div>
          <h2 className="text-2xl font-roboto fw6 text-[#232323] leading-[140%] tracking-[-3%]">
            Support Ticket
          </h2>
          <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
            View and manage all queries from the users in the platform.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border-color overflow-x-auto p-6 gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
          <div className="relative text-[#9A9A9A]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
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
              className="pl-9 pr-2 py-2 border border-[#D9D9D9] rounded-lg text-base w-[320px] focus:outline-none"
            />
          </div>
          <button className="flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-2 text-sm text-[#9A9A9A] gap-3 max-w-[127px]">
            Status
            <FiChevronDown size={16} />
          </button>
        </div>

        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-[#F9F9F9] text-[#6C6C6C] font-medium">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                  onChange={handleSelectAll}
                  checked={
                    selected.length === paginatedTickets.length &&
                    paginatedTickets.length > 0
                  }
                />
              </th>
              <th className="px-4 py-3">Ticket ID</th>
              <th className="px-4 py-3">User Type</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>
          <tbody
            className="bg-white text-[#232323]"
            onClick={() => navigate(`/support/chatsupport`)}
          >
            {paginatedTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-[#FEF2E6] cursor-pointer transition-colors"
              >
                <td className="px-2.5 py-4 gap-2.5">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                    checked={selected.includes(ticket.id)}
                    onChange={() => handleSelectOne(ticket.id)}
                  />
                </td>
                <td className="p-2.5  gap-2.5  ">{ticket.ticketId}</td>
                <td className="p-2.5  gap-2.5">{ticket.userType}</td>
                <td className="px-2.5 py-4 gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ticket.image || DefaultProfile}
                      alt={ticket.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="p-0.5 flex flex-col ">
                      <span className=" text-[#4F4F4F]">{ticket.name}</span>
                      <span className="text-xs text-[#6C6C6C]">
                        {ticket.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-2.5  gap-2.5">{ticket.subject}</td>
                <td className="p-2.5  gap-2.5">{ticket.date}</td>
                <td className="p-2.5  gap-2.5">
                  <span
                    className={`px-3 py-1 text-xs fw5 rounded-md ${getStatusClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="p-2.5  gap-2.5">
                  <button
                    className="p-2.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] hover:bg-[#FEF2E6] "
                    onClick={() => navigate(`/support/chatsupport`)}
                  >
                    <img src={Eye} alt="view" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredTickets.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
        />
      </div>
    </div>
  );
};

export default Support;
