import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiMoreVertical, FiChevronDown } from "react-icons/fi";
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

const Travelers = () => {
  const navigate = useNavigate();
  const { data: travelers = [], isLoading, isError } = useTravelers();    
  const { mutate: bulkUpdate } = useBulkUpdateTravelers();
  const { mutate: exportData } = useExportTravelers();
  const {mutate: deleteTraveler} = useDeleteTravelers()



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
          t.phone.includes(searchTerm)
      );
    }

    setFilteredTravelers(temp);
    setPage(1);
  }, [searchTerm, status, travelers]);

  const totalPages = Math.ceil(filteredTravelers.length / perPage);
  const paginatedTravelers = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTravelers.slice(start, start + perPage);
  }, [filteredTravelers, page, perPage]);

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
    bulkUpdate({ids: [id], status: "Deactivate" });
    
  } 

  const handledeleteTraveler = (id) => {

    deleteTraveler(id);
  }
  const handleBulkAction = (action) => {
    console.log("Bulk action:", action, selected);
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBulkOpen(false);
      }

       if (statusRef.current && !statusRef.current.contains(event.target)) {
      setStatusOpen(false);
    }

       if (
      actionOpen &&
      actionRefs.current[actionOpen] &&
      !actionRefs.current[actionOpen].contains(event.target)
    ) {
      setActionOpen(null);
    }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionOpen]);

  const [open, setOpen] = useState(false);
  const options = [5, 10, 25, 50];

  return (
    <div className="gap-6 mb-10">
      <div className="flex flex-col p-3 gap-4">
        <div className="flex items-center text-xs leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Travelers</p>
        </div>

        <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
          Travelers
        </h2>

        <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
          View and manage all registered travelers in the platform.
        </p>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6">
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
                  ${
                    selected.length === 0
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

        <div className="overflow-x-auto">
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
                <th className="px-4 py-3 text-left">Traveler Name</th>
                <th className="px-4 py-3 text-left">Phone Number</th>
                <th className="px-4 py-3 text-left">Orders</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedTravelers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No travelers found.
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
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          statusColors[t.status.toLowerCase()]
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
                            className={`absolute w-32 bg-white border border-[#D9D9D9] rounded-md shadow-lg z-40 
                ${
                  [
                    paginatedTravelers[paginatedTravelers.length - 1].id,
                    paginatedTravelers[paginatedTravelers.length - 2].id,
                  ].includes(t.id)
                    ? "bottom-full mb-0.5"
                    : "top-full mt-0.5"
                }
                right-0`}
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
                              className={`block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] `}
                            >
                              Suspend
                            </button>
                            )}
                           
                            <DeleteButton onDelete={() => handledeleteTraveler(t.id)} />
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

     
        <Pagination
  page={page}
  setPage={setPage}
  perPage={perPage}
  setPerPage={setPerPage}
  totalItems={filteredTravelers.length}
  fullWidth={true}
/>
      </div>
    </div>
  );
};

export default Travelers;
