import React, { useState } from "react";
import { FiSearch, FiMoreVertical, FiChevronDown } from "react-icons/fi";
import { Search } from "lucide-react";
import travelers from "../data/traveler";
import { Link } from "react-router-dom";

const Travelers = () => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [status, setStatus] = useState("Status");
  const [bulk, setBulk] = useState("Bulk Actions");
  const [selected, setSelected] = useState([]);
  const [actionOpen, setActionOpen] = useState(null);

  const statusColors = {
    Active: "bg-[#E7F7ED] text-[#088B3A]",
    Suspended: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(travelers.map((t) => t.id));
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

  return (
    <div className="gap-6">
      <div className="flex flex-col p-3 gap-4 ">
        <div className="flex items-center text-xs leading-[150%] tracking-[-3%] ">
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

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6 ">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative text-[#9A9A9A] px-4 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search "
              className="pl-8 pr-2 px-4 py-2 gap-2 border border-gray-300 rounded-xl text-base w-[320px] leading-[150%] focus:outline-none focus:border-[#D9D9D9]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-0.5 text-xs text-[#9A9A9A] w-[79px] h-[36px]"
              >
                {status}
                <FiChevronDown size={12} />
              </button>
              {statusOpen && (
                <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 h-27">
                  {["Status", "Active", "Suspended"].map((s) => (
                    <p
                      key={s}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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

            <div className="relative">
              <button
                onClick={() => setBulkOpen(!bulkOpen)}
                className="flex items-center justify-between border bg-[#FEF2E6] text-[#F77F00] rounded-md px-4 py-2 text-xs  w-[127px] h-[42px]"
              >
                {bulk}
                <FiChevronDown size={18} />
              </button>
              {bulkOpen && (
                <div className="absolute mt-1 bg-white border-color text-[#9A9A9A] rounded-lg shadow-lg w-32 z-20">
                  {["Bulk Actions", "Activate", "Deactivate", "Export CSV"].map(
                    (b) => (
                      <p
                        key={b}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                          setBulk(b);
                          setBulkOpen(false);
                        }}
                      >
                        {b}
                      </p>
                    )
                  )}
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
                    onChange={handleSelectAll}
                    checked={selected.length === travelers.length}
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
              {travelers.map((t) => (
                <tr key={t.id} className="text-sm bg-[#FFFFFF]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(t.id)}
                      onChange={() => handleSelectOne(t.id)}
                    />
                  </td>
                  <td className="px-4 py-3 leading-[150%] tracking-[-3%]">
                    <div className="fw4 ">
                      <p className=" text-[#4F4F4F] text-sm">{t.name}</p>
                      <p className="text-[#6C6C6C] text-xs">{t.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%]">
                    {t.phone}
                  </td>
                  <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%]">
                    {t.orders}
                  </td>
                  <td className="px-4 py-3  text-[#232323] leading-[150%] tracking-[-3%]">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        statusColors[t.statuses]
                      }`}
                    >
                      {t.statuses}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <div className="inline-block">
                      <button
                        className="p-1.5 rounded-lg border bg-[#FCECD6] text-[#CA4E2E]"
                        onClick={() =>
                          setActionOpen(actionOpen === t.id ? null : t.id)
                        }
                      >
                        <FiMoreVertical size={16} />
                      </button>
                      {actionOpen === t.id && (
                        <div className="absolute right-0 mt-2 w-30 bg-white border-color rounded-md shadow-lg z-10 flex flex-col">
                          <Link
                            to={`/travelers/profile/${t.id}`}
                            className="px-4 py-2 text-center text-sm text-[#9A9A9A] "
                          >
                            View Profile
                          </Link>
                          <button className="px-4 py-2 text-center text-sm text-[#9A9A9A] ">
                            Edit
                          </button>
                          <button className="px-4 py-2 text-center text-sm text-[#9A9A9A] ">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 leading-[150%] tracking-[-3%] text-[#6C6C6C]">
          <p className="text-sm ">Showing 1 to 10 of 256 entries</p>

          <div className="flex items-center text-sm fw5 gap-2">
            <button className="px-2 py-1 border-color rounded-lg">{"<"}</button>
            <button className="px-3 py-1 bg-[#F77F00] text-white rounded-lg">
              1
            </button>
            <button className="px-2 py-1 border-color   rounded-lg">2</button>
            <button className="px-2 py-1 border-color   rounded-lg">...</button>
            <button className="px-2 py-1 border-color   rounded-lg">17</button>
            <button className="px-2 py-1 border-color  rounded-lg ">
              {">"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span>Show</span>
            <select className=" border-color rounded-lg px-3 py-2.5 text-xs text-[#232323] justify-center">
              <FiMoreVertical
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 "
              />
              <option>05</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Travelers;
