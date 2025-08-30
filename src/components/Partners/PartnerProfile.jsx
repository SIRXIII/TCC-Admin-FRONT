import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PartnerTab from "./PartnersProfile/PartnerTab";
import PartnerAction from "./PartnersProfile/PartnerAction";
import Details from "./PartnersProfile/Details";
import PartnerOrders from "./PartnersProfile/PartnerOrders";
import PartnerProducts from "./PartnersProfile/PartnerProducts";
import backward from "../../assets/SVG/backward.svg";

const PartnerProfile = () => {
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
              Partner Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
              Detailed profile, activity, and preferences of the partner.
          </p>
        </div>
        <PartnerAction />
      </div>

      <PartnerTab activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "details" && <Details />}
      {activeTab === "products" && <PartnerProducts />}
      {activeTab === "orders" && <PartnerOrders />}
    </div>
  );
};

export default PartnerProfile;
