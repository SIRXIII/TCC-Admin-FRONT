import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RiderTabs from "./RiderProfile/RiderTab";
import RiderAction from "./RiderProfile/RiderAction";
import Details from "./RiderProfile/Details";
import RiderOrders from "./RiderProfile/RiderOrders";
import backward from "../../assets/SVG/backward.svg";
import { getRiderById } from "../../services/riderService";
import { useStatusUpdateRider } from "../../hooks/useRiders";
import { toast } from "react-toastify";
import PartnerOrders from "../Partners/PartnersProfile/PartnerOrders";
import Orders from "../../components/Orders";

const RiderProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [rider, setRider] = useState(null);

  const { mutate: statusUpdate } = useStatusUpdateRider();

  const fetchRider = async () => {
    try {
      const res = await getRiderById(id);
      setRider(res.data.data);
    } catch (error) {
      console.error("Error fetching rider data:", error);
    }
  };

  useEffect(() => {
    if (id) {

      fetchRider();
    }
  }, [id]);

  if (!rider) return <p>Loading...</p>;

  const handleRiderStatus = (rider) => {
    const newStatus = rider.status === "Active" ? "suspended" : "active";

    statusUpdate(
      { id: rider.id, status: newStatus },

      {
        onSuccess: () => {
          console.log("onSuccess newstatus", newStatus)
          toast.success(
            `Rider ${newStatus === "active" ? "suspended" : "active"} successfully!`
          );
          fetchRider();
        },
        onError: () => {
          toast.error("Failed to update rider status");
        },
      }

    );
  };


  return (
    <div className="flex flex-col p-3 gap-6">
      <div className="flex items-center text-xs fw4  text-[#6C6C6C] gap-1 leading-[150%] tracking-[-3%]">
        <span>Dashboard</span>
        <span>/</span>
        <span>Rider</span>
        <span>/</span>
        <span className="text-[#F77F00] capitalize">Details</span>
      </div>

      <div className="flex  items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <Link to="/riders" className="group">
              <img
                src={backward}
                alt="backward"
                className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
            <h1 className="text-2xl  font-roboto fw6 text-[#232323]">
              Rider Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
            Detailed profile, activity, and preferences of the Rider.
          </p>
        </div>
        {/* <RiderAction /> */}
        <div className="flex gap-2">

          <button
            onClick={() => handleRiderStatus(rider)}
            className={`border rounded-lg px-4 py-2 text-sm transition ${rider?.status == "Active"
              ? "border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]"
              : "border-green-600 bg-green-50 text-green-600"
              }`}
          >
            {rider && rider?.status === "Active" ? "Suspended" : "Active"}
          </button>
          <Link to={`/riders/update-rider/${id}`}  className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-[#F77F00] hover:text-white transition">
            Edit Partner Information
          </Link>
        </div>
      </div>

      <RiderTabs activeTab={activeTab} setActiveTab={setActiveTab} rider={rider} />

      {activeTab === "details" && <Details rider={rider} />}
      {/* {activeTab === "orders" && <RiderOrders />} */}
      {activeTab === "orders" && <Orders order={rider} />}
    </div>
  );
};

export default RiderProfile;
