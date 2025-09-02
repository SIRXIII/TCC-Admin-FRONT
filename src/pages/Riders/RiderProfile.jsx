import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RiderTabs from "./RiderProfile/RiderTab";
import RiderAction from "./RiderProfile/RiderAction";
import Details from "./RiderProfile/Details";
import RiderOrders from "./RiderProfile/RiderOrders";
import backward from "../../assets/SVG/backward.svg";

const RiderProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="flex flex-col p-3 gap-6">
      <div className="flex items-center text-xs fw4  text-[#6C6C6C] gap-1 leading-[150%] tracking-[-3%]">
        <span>Dashboard</span>
        <span>/</span>
        <span>Partners</span>
        <span>/</span>
        <span className="text-[#F77F00] capitalize">Details</span>
      </div>

      <div className="flex  items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <img src={backward} alt="" />
            <h1 className="text-2xl  font-roboto fw6 text-[#232323]">
              Rider Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
              Detailed profile, activity, and preferences of the Rider.
          </p>
        </div>
        <RiderAction />
      </div>

      <RiderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "details" && <Details />}
      {activeTab === "orders" && <RiderOrders />}
    </div>
  );
};

export default RiderProfile;
