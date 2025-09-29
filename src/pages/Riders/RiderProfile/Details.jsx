import React from "react";
import RiderInfo from "./RiderInfo";
import riderImg from "../../../assets/Images/rid_profile.jpg";


const Details = ({rider}) => {

  const RiderDetails = {
  riderInfo: {
    items: [
      {
        image: rider.profile_photo,
        value: rider.name,
        email: rider.email,
        status: rider.availability_status,
      },
      { label: "Rider Name", value: rider.name },
      { label: "Email", value: rider.email },
      { label: "Rider ID", value: rider.rider_id },
      { label: "Phone", value: rider.phone },
      {
        label: "Address",
        value: rider?.address ?? "Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178",
      },
    ],
  },

  workDetails: {
    items: [
      { label: "Assigned Region", value: rider.assigned_region },
      { label: "Vehicle Type", value: rider.vehicle_type + "(" + rider.vehicle_name + ")" },
      { label: "License Plate", value: rider.license_plate },
      { label: "Avg Delivery Time", value: rider.average_delivery_time },
      { label: "Deliveries Completed", value: rider.delivered_orders_count },
      { label: "Returns Completed", value: "0" },
      { label: "Cancelled Assignments", value: rider.cancelled_orders_count },
    ],
  },

   ratingsPerformance: {
    items: [
      {
        label: "Rating (From Traveler & Partners)",
        value: rider.average_rating
          ? `${rider.average_rating} / 5 (${rider.reviews_count} reviews)`
          : "No reviews yet",
      },
      { label: "Common Complaints", value: rider?.latest_complaint?.message },
      { label: "Bonus Eligibility", value: "Yes (Top performer Q2 2025)" },
    ],
  },

  verification: {
    items: [
      {
        label: "Driver's License",
        value: rider?.license_status,
        actions: Object.values(rider.documents).filter(Boolean).length > 0 ?["View", "Download"] : [],
        docUrls: Object.values(rider.documents).filter(Boolean),
      },
      { label: "Insurance", value: rider?.insurance },
    ],
  },
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col  gap-6 justify-between  ">
        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className=" text-lg fw6 gap-6 ">Rider Information</h3>
          <RiderInfo items={RiderDetails.riderInfo.items} riderId={rider.id} />
        </div>

        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6 gap-6 ">Verification & Compliance</h3>
          <RiderInfo items={RiderDetails.verification.items} riderId={rider.id} />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg flex fw6 gap-6 ">Work Details</h3>
          <RiderInfo items={RiderDetails.workDetails.items} riderId={rider.id} />
        </div>

        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6 gap-6">Ratings & Performance</h3>
          <RiderInfo items={RiderDetails.ratingsPerformance.items} riderId={rider.id} />
        </div>
      </div>
    </div>
  );
};

export default Details;
