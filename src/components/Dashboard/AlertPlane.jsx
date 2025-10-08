import React from "react";
import AlertData from "../../data/AlertData";
import { useLatestNotification } from "../../hooks/useDashboard";
const AlertPlane = () => {


  const { data: notifications, isLoading, error } = useLatestNotification();

  if (isLoading) return <p>Loading travelers...</p>

  console.log("notificartions ", notifications);

  return (
    <div className="flex flex-col border-color rounded-lg p-6 gap-6">
      <h3 className="text-lg fw4 font-roboto gap-[214px]">Alerts Panel</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white gap-4"
          >
            <div className="flex justify-between items-start">
            
                <h6
                  className={`text-md text-[#202020]  mb-2 font-roboto fw5 gap-4 leading-[28px] tracking-[-1%]`}
                >
                  {item.label}
                </h6>
             

              {/* <span
                className={`px-3 py-1 text-xs rounded-md fw5 gap-2.5 ${item.statusColor} whitespace-nowrap`}
              >
                {item.status}
              </span> */}
            </div>
             <div className="flex flex-col leading-[150%] fw5 tracking-[-3%] gap-3">
                  <p className="text-sm  text-[#232323] ">
                    {item.value}
                  </p>
                  <p className={`text-xs ${item.descriptionColor} `}>
                    {item.description}
                  </p>
                </div>
            <div className="text-end">
              <p className="text-xs text-gray-500 mt-2">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPlane;
