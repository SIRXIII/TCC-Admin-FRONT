import React, { useState, useEffect, useMemo, useRef } from "react";
import Plus from "../../assets/SVG/Plus.svg";
import { FiArrowDown, FiArrowUp, FiChevronDown } from "react-icons/fi";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Rating from "../../assets/SVG/rating.svg";
import Eye from "../../assets/SVG/eye.svg";
import Edit from "../../assets/SVG/edit.svg";
import { useRiders } from "../../hooks/useRiders";
import Pagination from "../../components/Pagination";
import Breadcrumb from "../../components/Breadcrumb";


const Riders = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const statusRef = useRef(null);

  const { data: riders = [], isLoading, isError } = useRiders();


  const [selected, setSelected] = useState([]);

  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const statusColors = {
    Online: "bg-[#E7F7ED] text-[#088B3A]",
    Offline: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const sortedRiders = useMemo(() => {
    let temp = [...riders];

    if (status !== "Status") {
      temp = temp.filter(
        (r) => r.availability_status.toLowerCase() === status.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.rider_id.includes(searchTerm)
      );
    }

    if (sortConfig.key) {
      temp = [...temp].sort((a, b) => {
        let valA = a[sortConfig.key] ?? "";
        let valB = b[sortConfig.key] ?? "";


        if (sortConfig.key === "rating" || sortConfig.key === "current_assigned_orders") {
          valA = Number(valA);
          valB = Number(valB);
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return temp;
  }, [riders, status, searchTerm, sortConfig]);

  const paginatedRiders = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedRiders.slice(start, start + perPage);
  }, [sortedRiders, page, perPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, status, sortConfig]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBulkOpen(false);
      }

      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }

    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="gap-6 p-2">
      <div className="flex flex-col  gap-4">
        {/* <div className="flex items-center text-xs leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Riders</p>
        </div> */}
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/" },

            { label: "Riders" },
          ]}
        />
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          {/* Left: Title and Description */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
              Riders
            </h2>

            <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
              View and manage all registered riders in the platform.
            </p>
          </div>

          {/* Right: Add Rider Button */}
          <Link
            to="/riders/add-rider"
            className="flex items-center justify-center bg-[#F77F00] text-white text-xs font-semibold px-4 py-3 rounded-lg gap-2 w-full sm:w-[140px]"
          >
            <img src={Plus} alt="plus" className="w-4 h-4" />
            Add Riders
          </Link>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6 mt-4">
        <div className="flex  md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative text-[#9A9A9A] px-4 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search riders..."
              className="pl-8 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-full md:w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
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

        <div className="hidden lg:block overflow-x-auto p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C] cursor-pointer">
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

                <th className="px-4 py-3 text-left" onClick={() => handleSort("rider_id")}>
                  Rider ID {renderSortIcon("rider_id")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("name")}>
                  Rider Name {renderSortIcon("name")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("rating")}>
                  Rating {renderSortIcon("rating")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("current_assigned_orders")}>
                  Current Orders {renderSortIcon("current_assigned_orders")}
                </th>
                <th className="px-4 py-3 text-left" onClick={() => handleSort("availability_status")}>
                  Status {renderSortIcon("availability_status")}
                </th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">

                    <div className="flex flex-col justify-center items-center h-40 gap-2">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>


                      <p className="text-orange-500 fw5 flex items-center">
                        Loading Riders
                        <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
                          <span className="animate-bounce">.</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                        </span>
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRiders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-[200px]">
                    <div className="flex flex-col items-center justify-center h-full text-centerbg-gray-50 rounded-xl border border-dashed border-gray-300 p-6">



                      <p className="text-orange-500 font-semibold text-lg">
                        No riders found.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting filters or check back later.
                      </p>


                    </div>
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

                    <td className="px-4 py-3">{r.rider_id}</td>

                    <td className="px-4 py-3 flex gap-2.5 items-center">
                      <img
                        src={r.profile_photo}
                        alt="Rider"
                        className="w-6 h-6 rounded-xl object-cover object-center"
                        onError={(e) => { e.currentTarget.src = DefaultProfile; }}
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
                      {r.current_assigned_orders}
                    </td>

                    <td className="px-4 py-3 text-[#232323]">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.availability_status] || ""
                          }`}
                      >
                        {r.availability_status}
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
                        onClick={() => navigate(`/riders/update-rider/${r.id}`)}
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

        {/* ================= MOBILE VIEW ================= */}
        <div className="lg:hidden space-y-4 px-2">
          {paginatedRiders.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/riders/profile/${r.id}`)}
              className="bg-white rounded-xl border p-4 shadow-sm active:bg-[#FEF2E6] transition cursor-pointer relative"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <img
                    src={r.profile_photo}
                    onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    className="w-12 h-12 rounded-xl object-cover"
                    alt=""
                  />
                  <div>
                    <span className="font-semibold text-[#232323]">{r.name}</span>
                    <p className="text-xs text-[#6C6C6C]">{r.email}</p>
                    <p className="text-xs text-[#9A9A9A]">ID: {r.rider_id}</p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[r.availability_status] || ""
                    }`}
                >
                  {r.availability_status}
                </span>
              </div>

              {/* Stats */}
              <div className="flex justify-between mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <span>Rating:</span>
                  <img src={Rating} alt="" />
                  {r.rating}
                </div>
                <div className="text-[#232323]">
                  Orders: <span className="font-semibold">{r.current_assigned_orders}</span>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex justify-end gap-2 mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => navigate(`/riders/profile/${r.id}`)}
                  className="p-2 rounded-lg bg-[#F77F00] hover:bg-[#e37704]"
                >
                  <img src={Eye} alt="" />
                </button>

                <button
                  onClick={() => navigate(`/riders/update-rider/${r.id}`)}
                  className="p-2 rounded-lg bg-[#FEF2E6] hover:bg-[#f8ca99]"
                >
                  <img src={Edit} alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {paginatedRiders.length > 0 && (

          <Pagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={sortedRiders.length}
            options={[5, 10, 25, 50]}
            fullWidth={true}
          />
        )}


      </div>
    </div>
  );
};

export default Riders;
