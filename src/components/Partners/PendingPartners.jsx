import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import ActionMenu from "./ActionMenu";
import { Link } from "react-router-dom";

const PendingPartners = ({
  paginatedPartners,
  openActionId,
  setOpenActionId,
}) => {
  const [selected, setSelected] = useState([]);
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedPartners.map((p) => p.id));
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
    <table className="w-full text-left text-sm leading-[150%] tracking-[-3%]">
      <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5 justify-center ">
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
          <th className="px-4 py-3">Location</th>
          <th className="px-4 py-3">Documents</th>
          <th className="px-4 py-3">Date Applied</th>
          <th className="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody className="bg-[#FFFFFF] fw4 text-[#232323] ">
        {paginatedPartners.map((partner) => (
          <tr key={partner.id} className="hover:bg-[#FEF2E6]">
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#9A9A9A]"
                checked={selected.includes(partner.id)}
                onChange={() => handleSelectOne(partner.id)}
              />
            </td>
            <td className="px-4 py-3  text-[#4F4F4F]">{partner.name}</td>
            <td className="px-4 py-3">{partner.category}</td>
            <td className="px-4 py-3">{partner.location}</td>
            <td className="px-4 py-3">
              <Link
                to={`/documents/${partner.id}`}
                className="text-blue-600 hover:text-[blue-800 ] text-sm font-medium underline"
              >
                View
              </Link>
            </td>

            <td className="px-4 py-3">{partner.dateApplied}</td>

            <td className="px-4 py-3 relative">
              <div className="inline-block relative">
                <button
                  className="p-1.5 rounded-lg border bg-[#FCECD6] text-[#CA4E2E]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionId(
                      openActionId === partner.id ? null : partner.id
                    );
                  }}
                >
                  <FiMoreHorizontal size={24} />
                </button>
                <ActionMenu
                  partner={partner}
                  isOpen={openActionId === partner.id}
                  setOpenActionId={setOpenActionId}
                  paginatedPartners={paginatedPartners}
                  items={[
                    {
                      label: "Accept",
                      onClick: (p) => console.log("Accept", p),
                    },
                    {
                      label: "Reject",
                      onClick: (p) => console.log("Reject", p),
                    },
                    {
                      label: "Request Information",
                      onClick: (p) => console.log("Request Info", p),
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

export default PendingPartners;
