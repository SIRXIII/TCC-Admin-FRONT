import React from "react";

const RiderInfo = ({ items }) => {
  return (
    <div className="flex flex-col gap-3 ">
      {items.map((item, idx) => {
        if (item.image) {
          return (
            <div key={idx} className="flex items-center justify-between py-2.5 leading-[150%] tracking-[normal]">
              <div className="flex items-center gap-6">
                <img
                  src={item.image}
                  alt={item.value}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="fw4">
                  <p className="text-lg fw6 text-[#232323]">{item.value}</p>
                  {item.email && (
                    <p className="text-xs text-[#6C6C6C]">{item.email}</p>
                  )}
                </div>
              </div>

              {item.status && (
                <span
                  className={`px-3 py-1 rounded-md text-xs fw5 ${
                    item.status === "Active"
                      ? "bg-[#E7F7ED] text-[#088B3A]"
                      : item.status === "Suspended"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              )}
            </div>
          );
        }

        return (
          <div key={idx} className="flex  justify-between fw5 gap-3">
            <div className="flex   gap-2 text-xs">
              <span className="w-40 text-[#6C6C6C]">{item.label}</span>
              <span className=" text-[#9A9A9A] text-sm"> : </span>

              <span className=" text-[#232323] ">{item.value}</span>
            </div>

            {item.actions && (
              <div className="flex gap-3">
                {item.actions.map((action, i) => (
                  <button key={i} className="text-[#F77F00] text-xs fw6">
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RiderInfo;
