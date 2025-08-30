import React from "react";
import partnerDetails from "../../../data/PartnerDetails";
import PartnerInfo from "./PartnerInfo";

const Details = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#FFFFFF] shadow rounded-lg p-6 h-[400px]">
        <h3 className="text-lg fw6 mb-4">Partner Information</h3>
        <PartnerInfo items={partnerDetails.partnerInfo.items} />
      </div>

      <div className="bg-[#FFFFFF] shadow rounded-lg p-6 h-[350px]">
        <h3 className="text-lg fw6 mb-4">Business Details</h3>
        <PartnerInfo items={partnerDetails.businessDetails.items} />
      </div>

      <div className="bg-[#FFFFFF]  shadow rounded-lg p-6 h-[200px]">
        <h3 className="text-lg fw6 mb-6">Support & Rating</h3>
        <PartnerInfo items={partnerDetails.supportRating.items} />
      </div>

      <div className="bg-[#FFFFFF] shadow rounded-lg p-6 h-[280px]">
        <h3 className="text-lg fw6 mb-4">
          Verification & Compliance
        </h3>
        <PartnerInfo items={partnerDetails.verification.items} />
      </div>
    </div>
  );
};

export default Details;
