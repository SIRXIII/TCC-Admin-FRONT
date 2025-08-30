import par_profile from "../assets/Images/par_profile.png"; 

const partnerDetails = {
  partnerInfo: {
    items: [
      {
        value: "Trendz",
        email: "trendz@mail.com",
        status: "Active",
        image: par_profile,
      },
      { label: "Business Name", value: "Trendz" },
      { label: "Email", value: "trendz@mail.com" },
      { label: "Owner", value: "Shawn Obrain" },
      { label: "Address", value: "Moscow ul. Varshavskaya" },
      { label: "Phone", value: "+38 (094) 730-24-25" },
      { label: "Store Timing", value: "Mon-Sat 10am - 8pm" },
    ],
  },

  businessDetails: {
    items: [
      { label: "Business Type", value: "Luxury Fashion Rentals" },
      { label: "Registered Since", value: "March 2024" },
      { label: "Total Products", value: "18" },
      { label: "Active Products", value: "95" },
      { label: "Pending Approval", value: "6" },
      { label: "Total Orders", value: "145" },
      { label: "Revenue", value: "$34,000" },
    ],
  },

  supportRating: {
    items: [
      { label: "Rating", value: "4.6 / 5 (320 reviews)" },
      { label: "Complaints", value: "Late delivery, Limited size options" },
    ],
  },

  verification: {
    items: [
      { label: "Business License", value: "Uploaded", actions: ["View", "Download"] },
      { label: "Tax ID", value: "35-8945263" },
      { label: "Owner Name", value: "Shawn Obrain" },
      { label: "ID Proof", value: "Driver's License - Verified" },
      { label: "Inspection", value: "Completed" },
      { label: "Store Timing", value: "Mon-Sat 10am - 8pm" },
    ],
  },
};

export default partnerDetails;
