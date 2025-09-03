import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import ActionMenu from "../../components/Partners/ActionMenu";
import { useNavigate } from "react-router-dom";
import { useStatusUpdatePartner } from "../../hooks/usePartners";

const SuspendedPartners = ({ paginatedPartners, openActionId, setOpenActionId }) => {
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
    statusUpdate({id: id, status: "accept" });
    
  } 

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
          <th className="px-4 py-3">Partner Name</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Products</th>
          <th className="px-4 py-3">Location</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody className="bg-[#FFFFFF] fw4 text-[#232323]">
        {paginatedPartners.map((partner) => (
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
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  partner.status === "Active"
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
