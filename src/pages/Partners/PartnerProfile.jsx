import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PartnerTab from "./PartnersProfile/PartnerTab";
import PartnerAction from "./PartnersProfile/PartnerAction";
import Details from "./PartnersProfile/Details";
import PartnerOrders from "./PartnersProfile/PartnerOrders";
import PartnerProducts from "./PartnersProfile/PartnerProducts";
import backward from "../../assets/SVG/backward.svg";
import { getPartnerById } from "../../services/partnerService";
import { useStatusUpdatePartner } from "../../hooks/usePartners";
import { toast } from "react-toastify";

const PartnerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [partner, setPartner] = useState(null);

  const { mutate: statusUpdate } = useStatusUpdatePartner();


  const fetchPartner = async () => {
  try {
    const res = await getPartnerById(id);
    setPartner(res.data.data);
  } catch (error) {
    console.error("Error fetching partner data:", error);
  }
};

useEffect(() => {
  if (id) {
    fetchPartner();
  }
}, [id]);


  const handlePartnerStatus = (partner) => {
    const newStatus = partner.status === "Active" ? "suspended" : "accept";

    statusUpdate(
      { id: partner.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Partner ${newStatus === "active" ? "activated" : "suspended"} successfully!`
          );
          fetchPartner();
        },
        onError: () => {
          toast.error("Failed to update partner status");
        },
      }
    
    );
  };


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

            <Link to="/partners" className="group">
              <img
                src={backward}
                alt="backward"
                className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
            {/* <img src={backward} alt="" /> */}
            <h1 className="text-2xl  font-roboto fw6 text-[#232323]">
              Partner Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
            Detailed profile, activity, and preferences of the partner.
          </p>
        </div>
        {/* <PartnerAction /> */}
        <div className="flex gap-2">
          <button
            onClick={() => handlePartnerStatus(partner)}
            className={`border rounded-lg px-4 py-2 text-sm transition ${partner?.status == "Active"
              ? "border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]"
              : "border-green-600 bg-green-50 text-green-600"
              }`}
          >
            {partner && partner?.status === "Active" ? "Suspended" : "Activate"}
          </button>

          {/* <button className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-orange hover:text-white transition">
        Edit Partner Information
      </button> */}
        </div>
      </div>

      <PartnerTab activeTab={activeTab} setActiveTab={setActiveTab} partner={partner} />

      {activeTab === "details" && <Details partner={partner} />}
      {activeTab === "products" && <PartnerProducts partner={partner} />}
      {activeTab === "orders" && <PartnerOrders partner={partner} />}
    </div>
  );
};

export default PartnerProfile;
