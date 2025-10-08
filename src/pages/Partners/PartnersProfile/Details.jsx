import React from "react";
import partnerDetails from "../../../data/PartnerDetails";
import PartnerInfo from "./PartnerInfo";

const Details = ({ partner }) => {


  if (!partner) return <div>Loading partner details...</div>;

  const activeProducts = partner.products.filter(p => p.status === "active").length;
  const pendingProducts = partner.products.filter(p => p.status === "inactive").length;

let storeAvailability = {};
if (partner?.availability) {
  if (typeof partner.availability === "string") {
    try {
      storeAvailability = JSON.parse(partner.availability);
    } catch (e) {
      console.error("Invalid JSON in availability:", e);
      storeAvailability = {};
    }
  } else if (typeof partner.availability === "object") {
    storeAvailability = partner.availability;
  }
}


  const partnerInfo = {
    items: [
      {
        value: partner?.name,
        email: partner?.email,
        status: partner?.status,
        image: partner?.profile_photo,
      },
      { label: "Business Name", value: partner?.business_name },
      { label: "Email", value: partner?.email },
      { label: "Owner", value: partner?.name },
      // { label: "Address", value: partner?.address },
      { label: "Address", value: partner?.address, latitude: partner?.latitude, longitude: partner?.longitude },
      { label: "Phone", value: partner?.phone },
      ],
  };

  const businessDetails = {

    items: [
      { label: "Business Type", value: partner.category },
      { label: "Registered Since", value: partner.created_at },
      { label: "Total Products", value: partner.products.length },
      { label: "Active Products", value: activeProducts },
      { label: "Pending Approval", value: pendingProducts },
      { label: "Total Orders", value: partner.order.length },
      { label: "Revenue", value: "$" + partner?.total_sales },
    ],

  };

  const verification = {
    items: [
      {
        label: "Business License",
        value: partner.documents?.license?.length > 0 ? "Uploaded" : "No document found",
        actions: partner.documents?.license?.length > 0 ? ["View", "Download"] : [],
        docUrl: partner.documents?.license?.map(doc => doc.file_path) || [],
      },
      {
        label: "Tax ID",
        value: partner.tax_id || "Not Available",
      },
      {
        label: "Owner Name",
        value: partner.name || "Not Available",
      },
      {
        label: "ID Proof",
        value: partner.documents?.owner_id_card?.length > 0 ? "Driver’s License - Verified" : "Driver’s License - Not Verified",

      },
      {
        label: "Inspection Status",
        value: partner.status === 'active' ? "Completed" : "Not Completed",
      },
     
    ],
  };

  const supportRating = {
    items: [
      {
        label: "Rating",
        value: partner.average_rating
          ? `${partner.average_rating} / 5 (${partner.reviews_count} reviews)`
          : "No reviews yet",
      },
      { label: "Common Complaints", value: partner?.latest_complaint?.message },

    ],
  };

const availableDays = Object.entries(storeAvailability)
  .filter(([day, info]) => info.checked)
  .map(([day, info]) => ({
    label: day,
    value: `${info.start_time} - ${info.end_time}`,
  }));



  return (


    <div className="flex flex-row gap-6">
      <div className="flex flex-col flex-1  gap-6">
        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6">Partner Information</h3>
          <PartnerInfo items={partnerInfo.items} partnerId={partner.id} />
        </div>


        <div className="bg-[#FFFFFF]  shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6">Store Timing</h3>
          <PartnerInfo items={availableDays} partnerId={partner.id} />
        </div>


        <div className="bg-[#FFFFFF]  shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6">Support & Rating</h3>
          <PartnerInfo items={supportRating.items} partnerId={partner.id} />
        </div>


      </div>
      <div className="flex flex-col flex-1 gap-6">

        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6">Business Details</h3>
          <PartnerInfo items={businessDetails.items} partnerId={partner.id} />
        </div>

        <div className="bg-[#FFFFFF] shadow rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg fw6">
            Verification & Compliance
          </h3>
          <PartnerInfo items={verification.items} partnerId={partner.id} />
        </div>
      </div>
    </div>

  );
};

export default Details;
