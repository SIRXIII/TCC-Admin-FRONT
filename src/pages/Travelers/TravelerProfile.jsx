import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getTravelerById } from "../../services/travelerService";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Pagination from "../../components/Pagination";


const TravelerProfile = () => {
  const { id } = useParams();
  const [traveler, setTraveler] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

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

  if (!traveler) return <p>Loading...</p>;




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
        <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
          <p>Dashboard</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p>Traveler</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Traveler Details</p>
        </div>
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
                className="w-14 h-14 rounded-xl object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = DefaultProfile;
                }}
              />
              <div>
                <h3 className="text-lg fw6 text-[#232323]">
                  {traveler.name}
                </h3>
                <p className="text-xs text-[#6C6C6C]">{traveler.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 ">
              {[
                { label: "Full Name", value: traveler.name },
                { label: "Email", value: traveler.email },
                { label: "Country", value: traveler.country },
                { label: "Phone", value: traveler.phone },
              ].map((item) => (
                <div className="flex text-xs fw5 gap-3" key={item.label}>
                  <p className="text-[#9A9A9A] w-1/3">{item.label}</p>
                  <p className="text-[#9A9A9A]">:</p>
                  <p className="text-[#232323] w-2/3">{item.value}</p>
                </div>
              ))}
            </div>


            <hr className="border border-[#D9D9D9]" />


            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm fw6">Last Order</p>
                <p className="fw5 text-xs text-[#9A9A9A]">{daysAgo} <span className="text-[#F77F00]">{lastOrderId ?? "#"+lastOrderId}</span></p>
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
            <div className="p-6 flex flex-col gap-6 rounded-lg bg-white" style={{ boxShadow: "0px 0px 3px 0px #00000033" }}>
              <h2 className="text-lg fw6 text-[#232323]">
                Shipping Address
              </h2>


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
                    <p className="text-[#232323] w-2/3">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}


          {billingAddress && (
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
                    <p className="text-[#232323] w-2/3">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="flex flex-col gap-6 flex-2">
          <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 gap-6 flex flex-col min-h-[400px]">

            <div className="flex justify-between">
              <h2 className="text-lg fw6 text-[#232323]">
                Orders
              </h2>
              <span className="text-sm text-[#9A9A9A] ml-2">
                Total spent <span className="text-[#4F4F4F] fw6">${traveler.total_amount_spent}</span> on {traveler.order.length} orders
              </span>
            </div>



            <div className="relative text-[#9A9A9A] text-xs leading-[150%] tracking-[-3%]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-8 pr-2 px-4 py-2.5 border border-[#D9D9D9] rounded-xl text-sm leading-[150%] focus:outline-none focus:border-[#F77F00]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>


            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Partner</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-[#6C6C6C]">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    currentPageData.map((t) => (
                      <tr key={t.id} className="text-sm bg-[#FFFFFF]">

                        <td className="px-4 py-3 leading-[150%] tracking-[-3%] h-[48px]">

                          <p className="text-[#F77F00] text-xs ">#{t.id}</p>

                        </td>
                        <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%] h-[48px] flex gap-2.5">
                          <div><img src={t?.partner_photo} alt={t.partner_name || '-'} className="w-6 h-6 rounded-full object-cover object-center" onError={(e) => { e.currentTarget.src = DefaultProfile; }} /></div>
                          <div>

                            {t.partner_name || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%] h-[48px]">
                          {t.created_at}
                        </td>
                        <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%] h-[48px]">
                          {t.items_count}
                        </td>
                        <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%] h-[48px]">
                          {t.total_price}
                        </td>
                        <td className="px-4 py-3 text-[#232323] leading-[150%] tracking-[-3%] h-[48px]">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[t.status.toLowerCase()]
                              }`}
                          >
                            {t.status}
                          </span>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>



            <Pagination
              page={currentPage}
              setPage={setCurrentPage}
              perPage={itemsPerPage}
              setPerPage={setItemsPerPage}
              totalItems={filteredOrders.length}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelerProfile;
