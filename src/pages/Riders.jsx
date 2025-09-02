import React, { useState, useEffect, useMemo, useRef } from "react";
import Plus from "../assets/SVG/Plus.svg";
import { FiChevronDown } from "react-icons/fi";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import arrow_left from "../assets/SVG/arrow-left.svg";
import arrow_right from "../assets/SVG/arrow-right.svg";
import DefaultProfile from "../assets/Images/trv_profile.jpg";
import ridersData from "../data/RidersData";
import Rating from "../assets/SVG/rating.svg";
import Eye from "../assets/SVG/eye.svg";
import Edit from "../assets/SVG/edit.svg";


const Riders = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [filteredRiders, setFilteredRiders] = useState([]);
  const [selected, setSelected] = useState([]);

  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const statusColors = {
    Online: "bg-[#E7F7ED] text-[#088B3A]",
    Offline: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  useEffect(() => {
    let temp = [...ridersData];

    if (status !== "Status") {
      temp = temp.filter(
        (r) => r.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.phone.includes(searchTerm)
      );
    }

    setFilteredRiders(temp);
    setPage(1);
  }, [searchTerm, status]);

  const totalPages = Math.ceil(filteredRiders.length / perPage);
  const paginatedRiders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRiders.slice(start, start + perPage);
  }, [filteredRiders, page, perPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedRiders.map((r) => r.id));
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

  const handleBulkAction = (action) => {
    console.log("Bulk action:", action, selected);
    setBulk(action);
    setBulkOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBulkOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [open, setOpen] = useState(false);
  const options = [5, 10, 25, 50];

  return (
    <div className="gap-6 p-2">
      <div className="flex flex-col  gap-4">
        <div className="flex items-center text-xs leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Riders</p>
        </div>
        <div className="flex justify-between   gap-4">
          <div className="gap-2">
            <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
              Riders
            </h2>

            <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
              View and manage all registered riders in the platform.
            </p>
          </div>

          <Link
            to={`/riders/add-rider`}
            className="flex items-center justify-center bg-[#F77F00] hover:bg-[#e27406] text-white text-xs font-semibold px-4 py-2 rounded-lg gap-2 w-[140px]"
          >
            <img src={Plus} alt="plus" className="w-4 h-4" />
            Add Riders
          </Link>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative text-[#9A9A9A] px-4 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search riders..."
              className="pl-8 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-0.5 text-xs text-[#9A9A9A] min-w-[79px] max-w-[110px] h-[36px]"
              >
                {status}
                <FiChevronDown size={12} />
              </button>
              {statusOpen && (
                <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 z-20">
                  {["Online", "Offline"].map((s) => (
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

        <div className="overflow-x-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-lg"
                    onChange={handleSelectAll}
                    checked={
                      selected.length === paginatedRiders.length &&
                      paginatedRiders.length > 0
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left">Rider ID</th>
                <th className="px-4 py-3 text-left">Rider Name</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Current Orders</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedRiders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No riders found.
                  </td>
                </tr>
              ) : (
                paginatedRiders.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate(`/riders/profile/${r.id}`)}
                    className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors"
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

                    <td className="px-4 py-3 flex gap-2.5 items-center">
                      <img
                        src={r.profile_photo || DefaultProfile}
                        alt="Rider"
                        className="w-6 h-6 rounded-xl object-cover object-center"
                      />
                      <div>
                        <p className="text-[#4F4F4F] text-sm">{r.name}</p>
                        <p className="text-[#6C6C6C] text-xs">{r.email}</p>
                      </div>
                    </td>

                    <td className="px-2.5 py-4 items-center gap-1.5">
                      <span className="flex gap-1.5">
                        <img src={Rating} alt="" />
                        {r.rating}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-[#232323]">
                      {r.currentOrders}
                    </td>

                    <td className="px-4 py-3 text-[#232323]">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          statusColors[r.status] || ""
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 text-right flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/riders/profile/${r.id}`)}
                        className="p-1.5 rounded-lg border bg-[#F77F00] text-[#F77F00] hover:bg-[#e37704] border-[#F77F00] hover:text-[#FFFFFF]"
                      >
                        <img src={Eye} alt="" />
                      </button>
                      <button
                        onClick={() => navigate(`/riders/edit/${r.id}`)}
                        className="p-1.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] hover:bg-[#f8ca99]"
                      >
                        <img src={Edit} alt="" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-6 text-[#6C6C6C] h-10">
          <p className="text-sm h-10 flex items-center">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, filteredRiders.length)} of{" "}
            {filteredRiders.length} entries
          </p>

          <div className="flex items-center gap-2 h-10">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              <img src={arrow_left} alt="Prev" className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition ${
                  num === page
                    ? "bg-[#F77F00] text-white border border-[#F77F00]"
                    : "border border-[#FEF2E6] hover:bg-[#FEF2E6] hover:text-[#232323]"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <img src={arrow_right} alt="Next" className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 h-10">
            <span className="text-[#232323] text-xs">Show</span>
            <div className="relative w-[62px]">
              <button
                onClick={() => setOpen(!open)}
                className="w-full h-10 px-3 border border-[#D9D9D9] rounded-lg text-sm text-[#232323] bg-white text-left"
              >
                {perPage}
              </button>
              {open && (
                <div className="absolute bottom-full mb-1 w-full bg-white border border-[#D9D9D9] rounded-lg shadow-lg z-10">
                  {options.map((n) => (
                    <div
                      key={n}
                      onClick={() => {
                        setPerPage(n);
                        setOpen(false);
                      }}
                      className="px-3 py-2 text-sm text-[#232323] hover:bg-[#FEF2E6] cursor-pointer"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              )}
              <img
                src={arrow_right}
                alt="Dropdown arrow"
                className="pointer-events-none absolute right-2 top-1/2 w-4 h-4 -translate-y-1/2 rotate-90"
              />
            </div>
            <span className="text-[#232323] text-xs">entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riders;
