import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getTravelerById } from "../../services/travelerService";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Pagination from "../../components/Pagination";
import Orders from "../../components/Orders";
import ImagePreviewGallery from "../../components/ImagePreviewGallery";
import Breadcrumb from "../../components/Breadcrumb";

const GEOAPIFY_KEY = import.meta.env.VITE_APP_GEOAPIFY_KEY;


const TravelerProfile = () => {
  const { id } = useParams();
  const [traveler, setTraveler] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);


  useEffect(() => {
    const fetchTraveler = async () => {
      try {
        const res = await getTravelerById(id);
        setTraveler(res.data.data);
      } catch (error) {
        console.error("Error fetching traveler data:", error);
      }
    };
    fetchTraveler();
  }, [id]);

  if (!traveler) return
  <div className="flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-orange-500 font-medium">Loading travelers...</span>
  </div>;




  const statusColors = {
    pending: "bg-[#E1FDFD] text-[#3E77B0]",
    delivered: "bg-[#E7F7ED] text-[#088B3A]",
    "in progress": "bg-[#FEFCDD] text-[#B2A23F]",
    canceled: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  const getVisiblePages = () => {
    let pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) pages.push(i);
    return pages;
  };

  const filteredOrders = traveler.order.filter((order) =>
    order.id.toString().includes(searchTerm) ||
    order.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentPageData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const shippingAddress = traveler.addresses.find(a => a.type === "shipping");
  const billingAddress = traveler.addresses.find(a => a.type === "billing");

  console.log("billingAddress", billingAddress);



  const lastOrder = traveler.order[traveler.order.length - 1];
  const lastOrderDate = lastOrder?.created_at ? new Date(lastOrder.created_at) : null;
  const lastOrderId = lastOrder?.id || "N/A";



  let daysAgo = "";
  if (lastOrderDate) {
    const now = new Date();
    const diffTime = Math.abs(now - lastOrderDate);
    daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysAgo = daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
  }

  return (
    <div className="flex flex-col p-4 top-[120px] left-[281px] gap-6">

      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
          <p>Dashboard</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p>Traveler</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Traveler Details</p>
        </div> */}
          <Breadcrumb
                  items={[
                    { label: "Dashboard", path: "/" },
                    { label: "Traveler", path: "/travelers" },
      
                    { label: "Traveler Details" },
                  ]}
                />

        <div className="flex flex-col gap-3">

          <h2 className="text-2xl fw6 font-roboto text-[#232323]">Traveler Details</h2>
          <p className="text-sm fw4 text-[#232323]">
            Detailed profile, activity, and preferences of the traveler.
          </p>
        </div>
      </div>


      <div className="flex flex-row gap-6">

        <div className="flex flex-col gap-6 flex-1">
          <div className="p-6 flex flex-col gap-6 rounded-lg bg-white" style={{ boxShadow: "0px 0px 3px 0px #00000033" }}>
            <h2 className="text-lg fw6 text-[#232323]">
              Traveler Information
            </h2>
            <div className="flex items-center gap-4 py-2.5">
              <img
                src={traveler.profile_photo}
                alt="Traveler"
                className="w-14 h-14 rounded-xl object-cover object-center cursor-pointer"
                onClick={() => setPreviewImage(traveler.profile_photo || URL(DefaultProfile))}

                onError={(e) => {
                  e.currentTarget.src = DefaultProfile;
                }}
              />
              <div>
                <h3 className="text-lg fw6 text-[#232323]">
                  {traveler.name}
                </h3>
                {/* <p className="text-xs text-[#6C6C6C]">{traveler.email}</p> */}
                <p className="text-xs text-[#6C6C6C]">
                  <a href={`mailto:${traveler?.email}`} className="hover:underline">
                    {traveler?.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { label: "Full Name", value: traveler.name },
                { label: "Email", value: traveler.email },
                { label: "Country", value: traveler.country },
                { label: "Phone", value: traveler.phone },
              ].map((item) => (
                <div className="flex text-xs fw5 gap-3" key={item.label}>
                  <p className="text-[#9A9A9A] w-1/3">{item.label}</p>
                  <p className="text-[#9A9A9A]">:</p>
                  <p className="text-[#232323] w-2/3">
                    {item.label === "Email" ? (
                      <a href={`mailto:${item.value}`} className="hover:underline">
                        {item.value}
                      </a>
                    ) : item.label === "Phone" ? (
                      <a href={`tel:${item.value}`} className="hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </p>
                </div>
              ))}
            </div>



            <hr className="border border-[#D9D9D9]" />


            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm fw6">Last Order</p>
                <p className="fw5 text-xs text-[#9A9A9A]">{daysAgo} <span className="text-[#F77F00]">{lastOrderId ?? "#" + lastOrderId}</span></p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm fw6">Total Spent</p>
                <p className="fw5 text-xs text-[#9A9A9A]">${traveler.total_amount_spent}</p>
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm fw6">Registered</p>
                <p className="fw5 text-xs  text-[#9A9A9A]">{traveler.created_at}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm fw6">Email Marketing</p>
                <p className="fw5 text-xs  text-[#9A9A9A]">Subscribed</p>
              </div>
            </div>



          </div>

          {shippingAddress && (
            <div
              className="p-6 flex flex-col gap-6 rounded-lg bg-white"
              style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
            >
              <h2 className="text-lg fw6 text-[#232323]">Shipping Address</h2>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Name", value: shippingAddress.name },
                  { label: "Country", value: shippingAddress.country },
                  { label: "Phone Number", value: shippingAddress.phone },
                  { label: "Address", value: shippingAddress.address },
                ].map((item) => (
                  <div className="flex text-xs fw5 gap-3" key={item.label}>
                    <p className="text-[#9A9A9A] w-1/3">{item.label}</p>
                    <p className="text-[#9A9A9A]">:</p>
                    <p className="text-[#232323] w-2/3">
                      {item.label === "Phone Number" ? (
                        <a href={`tel:${item.value}`} className="hover:underline">
                          {item.value}
                        </a>
                      ) : item.label === "Address" ? (
              <a
                href={
                  shippingAddress.latitude && shippingAddress.longitude
                    ? `https://www.google.com/maps?q=${shippingAddress.latitude},${shippingAddress.longitude}`
                    : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(item.value)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {item.value}
              </a>
            ) : (
                        item.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* {billingAddress && (
            <div className="p-6 flex flex-col gap-6 rounded-lg bg-white" style={{ boxShadow: "0px 0px 3px 0px #00000033" }}>
              <h2 className="text-lg fw6 text-[#232323]">
                Billing Address
              </h2>


              <div className="flex flex-col gap-3">
                {[
                  { label: "Name", value: billingAddress.name },
                  { label: "Country", value: billingAddress.country },
                  { label: "Phone Number", value: billingAddress.phone },
                  { label: "Address", value: billingAddress.address },
                ].map((item) => (
                  <div className="flex text-xs fw5 gap-3" key={item.label}>
                    <p className="text-[#9A9A9A] w-1/3">{item.label}</p>
                    <p className="text-[#9A9A9A]">:</p>
                    <p className="text-[#232323] w-2/3">
                      {item.label === "Phone Number" ? (
                        <a href={`tel:${item.value}`} className="hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )} */}

{billingAddress && (
  <div
    className="p-6 flex flex-col gap-6 rounded-lg bg-white"
    style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
  >
    <h2 className="text-lg fw6 text-[#232323]">Billing Address</h2>

    <div className="flex flex-col gap-3">
      {[
        { label: "Name", value: billingAddress.name },
        { label: "Country", value: billingAddress.country },
        { label: "Phone Number", value: billingAddress.phone },
        { label: "Address", value: billingAddress.address },
      ].map((item) => (
        <div className="flex text-xs fw5 gap-3" key={item.label}>
          <p className="text-[#9A9A9A] w-1/3">{item.label}</p>
          <p className="text-[#9A9A9A]">:</p>
          <p className="text-[#232323] w-2/3">
            {item.label === "Phone Number" ? (
              <a href={`tel:${item.value}`} className="hover:underline">
                {item.value}
              </a>
            ) : item.label === "Address" ? (
              <a
                href={
                  billingAddress.latitude && billingAddress.longitude
                    ? `https://www.google.com/maps?q=${billingAddress.latitude},${billingAddress.longitude}`
                    : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(item.value)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

        </div>


        <Orders order={traveler} />
      </div>
      <ImagePreviewGallery imageUrl={previewImage} onClose={() => setPreviewImage(null)} />

    </div>
  );
};

export default TravelerProfile;
