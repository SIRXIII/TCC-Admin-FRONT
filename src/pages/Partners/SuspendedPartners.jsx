import React, { useState } from "react";
import { FiArrowDown, FiArrowUp, FiMoreHorizontal } from "react-icons/fi";
import ActionMenu from "../../components/Partners/ActionMenu";
import { useNavigate } from "react-router-dom";
import { useStatusUpdatePartner } from "../../hooks/usePartners";

const SuspendedPartners = ({ paginatedPartners, openActionId, setOpenActionId, handleSort,
  sortConfig }) => {
  const navigate = useNavigate();

  const { mutate: statusUpdate } = useStatusUpdatePartner();


  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedPartners.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleActivePartner = (id) => {
    statusUpdate({ id: id, status: "accept" });

  }

  const renderSortIcon = (key) => {
    return (
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
  };

  return (
    <table className="w-full text-left text-sm leading-[150%] tracking-[-3%]">
      <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
        <tr>
          <th className="px-4 py-3">
            <input
              type="checkbox"
              className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
              onChange={handleSelectAll}
              checked={
                selected.length === paginatedPartners.length &&
                paginatedPartners.length > 0
              }
            />
          </th>
          <th
            className="px-4 py-3 cursor-pointer select-none"
            onClick={() => handleSort("name")}
          >
            Partner Name {renderSortIcon("name")}
          </th>

          <th
            className="px-4 py-3 cursor-pointer select-none"
            onClick={() => handleSort("category")}
          >
            Category {renderSortIcon("category")}
          </th>

          <th
            className="px-4 py-3 cursor-pointer select-none"
            onClick={() => handleSort("productsCount")}
          >
            Products {renderSortIcon("productsCount")}
          </th>

          <th
            className="px-4 py-3 cursor-pointer select-none"
            onClick={() => handleSort("location")}
          >
            Location {renderSortIcon("location")}
          </th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody className="bg-[#FFFFFF] fw4 text-[#232323]">
        {paginatedPartners.length === 0 ? (

          <tr>
            <td colSpan={7} className="h-[200px]">
              <div className="flex flex-col items-center justify-center h-full text-centerp-6">



                <p className="text-orange-500 font-semibold text-lg">
                  No partners found.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting filters or check back later.
                </p>


              </div>
            </td>
          </tr>

        ) : paginatedPartners.map((partner) => (
          <tr key={partner.id} onClick={() => navigate(`/partners/profile/${partner.id}`)} className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors">
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
                checked={selected.includes(partner.id)}
                onChange={() => handleSelectOne(partner.id)}
              />
            </td>
            <td className="px-4 py-3 text-[#4F4F4F]">{partner.name}</td>
            <td className="px-4 py-3">{partner.category}</td>
            <td className="px-4 py-3">{partner.products?.length || 0}</td>
            <td className="px-4 py-3">{partner.location}</td>
            <td className="px-4 py-3">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${partner.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {partner.status}
              </span>
            </td>
            <td className="px-4 py-3 relative">
              <div className="inline-block relative">
                <button
                  className="p-1.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] w-[34px] h-[34px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionId(openActionId === partner.id ? null : partner.id);
                  }}
                >
                  <FiMoreHorizontal size={20} />
                </button>
                <ActionMenu
                  partner={partner}
                  isOpen={openActionId === partner.id}
                  setOpenActionId={setOpenActionId}
                  paginatedPartners={paginatedPartners}
                  items={[
                    {
                      label: "View Profile",
                      type: "link",
                      to: `/partners/profile/${partner.id}`,
                    },
                    {
                      label: "Active",
                      onClick: () => handleActivePartner(partner.id),
                    },
                  ]}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SuspendedPartners;
