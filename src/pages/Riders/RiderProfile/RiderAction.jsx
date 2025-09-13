import React from "react";

const RiderAction = ({rider}) => {

  return (
    <div className="flex gap-2">
      {/* <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-[#F77F00] hover:text-white transition">
        Suspend
      </button> */}
      <button
            onClick={() => handleRiderStatus(rider)}
            className={`border rounded-lg px-4 py-2 text-sm transition ${rider?.status == "Active"
              ? "border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]"
              : "border-green-600 bg-green-50 text-green-600"
              }`}
          >
            {partner && partner?.status === "Active" ? "Suspended" : "Activate"}
          </button>
      <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-[#F77F00] hover:text-white transition">
        Edit Partner Information
      </button>
    </div>
  );
};

export default RiderAction;
