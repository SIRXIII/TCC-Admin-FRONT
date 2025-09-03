import React, { useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import ActionMenu from "../../components/Partners/ActionMenu";
import { Link, useNavigate } from "react-router-dom";
import { useStatusUpdatePartner } from "../../hooks/usePartners";
import RequestInformation from "../../components/Dialogs/RequestInformation";

const PendingPartners = ({
  paginatedPartners,
  openActionId,
  setOpenActionId,
}) => {
  const navigate = useNavigate();

  const { mutate: statusUpdate } = useStatusUpdatePartner();

  const [selected, setSelected] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

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

  const handleSuspendPartner = (id, status) => {
    statusUpdate({ id: id, status: status });

  }

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
          <tr key={partner.id} onClick={() => navigate(`/partners/profile/${partner.id}`)} className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors">
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

            <td className="px-4 py-3">{partner.created_at}</td>

            <td className="px-4 py-3 relative">
              <div className="inline-block relative">
                <button
                  className="p-1.5 rounded-lg border bg-[#FCECD6] text-[#CA4E2E]  w-[34px] h-[34px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionId(
                      openActionId === partner.id ? null : partner.id
                    );
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
                      label: "Accept",
                      onClick: () => handleSuspendPartner(partner.id, "accept"),
                    },
                    {
                      label: "Reject",
                      onClick: () => handleSuspendPartner(partner.id, "reject"),
                    },
                    {
                      label: "Request Information",
                      onClick: (partner) => {
                        setSelectedPartner(partner);
                        setIsDialogOpen(true);
                      },

                    },
                  ]}
                />
                <RequestInformation
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  onSend={() => setIsDialogOpen(false)}
                  partner={selectedPartner}
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
