import React from "react";
import RiderInfo from "./RiderInfo";
import riderImg from "../../../assets/Images/rid_profile.jpg";

const RiderDetails = {
  riderInfo: {
    items: [
      {
        image: riderImg,
        value: "Jason Miller",
        email: "jasonmiller@mail.com",
        status: "Active",
      },
      { label: "Rider Name", value: "Jason Miller" },
      { label: "Email", value: "jasonmiller@mail.com" },
      { label: "Rider ID", value: "RDR-0987" },
      { label: "Phone", value: "+38 (094) 730-24-25" },
      {
        label: "Address",
        value: "Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178",
      },
    ],
  },

  workDetails: {
    items: [
      { label: "Assigned Region", value: "Brooklyn, Queens, Manhattan" },
      { label: "Vehicle Type", value: "Motorbike (Yamaha R3)" },
      { label: "License Plate", value: "NY-7832" },
      { label: "Avg Delivery Time", value: "32 mins" },
      { label: "Deliveries Completed", value: "831" },
      { label: "Returns Completed", value: "243" },
      { label: "Cancelled Assignments", value: "12" },
    ],
  },

  ratingsPerformance: {
    items: [
      {
        label: "Rating (From Traveler & Partners)",
        value: "4.8 / 5 (689 reviews)",
      },
      { label: "Common Complaints", value: "Common Complaints" },
      { label: "Bonus Eligibility", value: "Yes (Top performer Q2 2025)" },
    ],
  },

  verification: {
    items: [
      {
        label: "Driver's License",
        value: "Uploaded",
        actions: ["View", "Download"],
      },
      { label: "Insurance", value: "Active (Expires: Dec 2025)" },
    ],
  },
};

const Details = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col  gap-6 justify-between  ">
        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className=" text-lg fw6 gap-6 ">Rider Information</h3>
          <RiderInfo items={RiderDetails.riderInfo.items} />
        </div>

        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6 gap-6 ">Verification & Compliance</h3>
          <RiderInfo items={RiderDetails.verification.items} />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg flex fw6 gap-6 ">Work Details</h3>
          <RiderInfo items={RiderDetails.workDetails.items} />
        </div>

        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6 gap-6">Ratings & Performance</h3>
          <RiderInfo items={RiderDetails.ratingsPerformance.items} />
        </div>
      </div>
    </div>
  );
};

export default Details;
