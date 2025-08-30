import React from "react";
import { Link } from "react-router-dom";

const ActionMenu = ({ partner, isOpen, setOpenActionId, paginatedPartners, items }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute w-40 bg-white border border-[#F77F00] rounded-md shadow-lg z-40
        ${
          [
            paginatedPartners[paginatedPartners.length - 1]?.id,
            paginatedPartners[paginatedPartners.length - 2]?.id,
          ].includes(partner.id)
            ? "bottom-full mb-1"
            : "top-full mt-1"
        }
        right-0`}
    >
      {items.map((item, idx) =>
        item.type === "link" ? (
          <Link
            key={idx}
            to={item.to.replace(":id", partner.id)} 
            onClick={() => setOpenActionId(null)}
            className="block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6]"
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={idx}
            onClick={() => {
              item.onClick?.(partner);
              setOpenActionId(null);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6]"
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
};

export default ActionMenu;
