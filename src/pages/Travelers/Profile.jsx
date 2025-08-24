import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import profileData from "../../data/profileData";
import Pic from "../../assets/SVG/pic.svg";

const Profile = () => {
  
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(profileData.orders.length / itemsPerPage);

  const currentPageData = profileData.orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getVisiblePages = () => {
    return [1, 2, 3, 4, 5];
  };

  const statusColors = {
    Pending: "bg-[#E1FDFD] text[#3E77B0]",
    Delivered: "bg-[#E7F7ED] text-[#088B3A]",
    "In Progress": "bg-[#FEFCDD] text-[#B2A23F]",
    Canceled: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center text-xs gap-1 leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#6C6C6C]">Traveler</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Traveler Details</p>
        </div>

        <h2 className="text-2xl font-semibold text-[#232323] leading-[140%] tracking-[-3%]">
          Travelers Details
        </h2>
        <p className="text-[#232323] text-sm leading-[150%] tracking-[-3%]">
          Detailed profile, activity, and preferences of the traveler.
        </p>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-6">
          <div className="w-[362px] h-[465px] gap-6 rounded-lg p-6 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.2)] bg-[#FFFFFF]">
            <h2 className="text-lg fw6 text-[#232323] mb-4 leading-[150%] tracking-[-3%]">
              Traveler Information
            </h2>

            <div className="py-2.5 flex items-center gap-4">
              <img src={Pic} alt="pic" className="w-14 h-14 rounded-xl" />
              <div className="leading-[150%] tracking-[-3%]">
                <h3 className="text-lg font-semibold text-[#232323]">
                  {profileData.name}
                </h3>
                <p className="text-[#6C6C6C] text-xs">{profileData.email}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {profileData.details.map((detail, index) => (
                <div key={index} className="flex">
                  <p className="text-sm text-[#9A9A9A] w-1/3">{detail.label}</p>
                  <p className="text-[#232323] w-2/3">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="grid grid-cols-2 gap-4">
                {profileData.stats.map((stat, index) => (
                  <div key={index} className="pt-4">
                    <p className="text-sm text-[#232323]">{stat.label}</p>
                    <span className="inline-block text-xs text-[#9A9A9A]">
                      {stat.label === "Last Order" ? (
                        <>
                          <span>7 days ago </span>
                          <span className="text-[#F77F00]">#1374</span>
                        </>
                      ) : (
                        stat.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-[0px_0px_3px_0px_rgba(0,0,0,0.2)] rounded-lg p-6 w-[362px] h-[256px]">
            <h2 className="text-lg fw6 text-[#232323] mb-4 leading-[150%] tracking-[-3%]">
              Shipping Address
            </h2>
            <div className="space-y-3">
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">Name</span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.shippingAddress.name}
                </span>
              </div>
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">Country</span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.shippingAddress.country}
                </span>
              </div>
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">
                  Phone Number
                </span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.shippingAddress.phone}
                </span>
              </div>
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">Address</span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.shippingAddress.address}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-[0px_0px_3px_0px_rgba(0,0,0,0.2)] rounded-lg p-6 w-[362px] h-[256px]">
            <h2 className="text-lg fw6 text-[#232323] mb-4 leading-[150%] tracking-[-3%]">
              Billing Address
            </h2>
            <div className="space-y-3">
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">Name</span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.billingAddress.name}
                </span>
              </div>
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">Country</span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.billingAddress.country}
                </span>
              </div>
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">
                  Phone Number
                </span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.billingAddress.phone}
                </span>
              </div>
              <div className="flex items-center leading-[150%] tracking-[-3%]">
                <span className="text-sm text-[#9A9A9A] w-28">Address</span>
                <span className="text-sm text-[#9A9A9A] px-2">:</span>
                <span className="text-[#232323] text-sm flex-1">
                  {profileData.billingAddress.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF]  rounded-lg p-6 w-[749px] h-[747px] flex flex-col shadow-[0px_0px_3px_0px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between leading-[150%] tracking-[-3%]">
            <h2 className="text-lg fw6 text-[#232323] mb-4">Orders</h2>
            <span className="text-[#9A9A9A] fw6 text-sm ">
              Total spent <span className="text-[#4F4F4F]">$34,980.34</span> on
              10 orders
            </span>
          </div>

          <div className="mb-4">
            <div className="flex items-center border border-[#D9D9D9] bg-[#FFFFFF] px-3 py-2 rounded-lg ">
              <FiSearch className="text-gray-400 mr-2" size={16} />
              <input
                type="text"
                placeholder="Search in orders"
                className="outline-none text-sm text-[#9A9A9A]  bg-transparent w-full"
              />
            </div>
          </div>

          <div className="overflow-auto w-[749px] h-[747px] text-left">
            <table className="w-[701px] h-[518px]    ">
              <thead className="bg-[#F9F9F9]  ">
                <tr className="  fw6 justify-center text-xs text-[#6C6C6C] leading-[150%] tracking-[-3%] ">
                  <th className="p-2.5 gap-2.5">Order ID</th>
                  <th className="p-2.5 gap-2.5">Partner</th>
                  <th className="p-2.5 gap-2.5">Date</th>
                  <th className="p-2.5 gap-2.5">Item</th>
                  <th className="p-2.5 gap-2.5">Total</th>
                  <th className="p-2.5 gap-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="bg-[#FFFFFF] fw5 justify-between text-xs text-[#232323] leading-[150%] tracking-[-3%]  ">
                {profileData.orders.map((order, index) => (
                  <tr key={index}>
                    <td className="p-2.5 gap-2.5 text-[#F77F00]">{order.id}</td>
                    <td className="p-2.5 gap-2.5">{order.partner}</td>
                    <td className="p-2.5 gap-2.5">{order.date}</td>
                    <td className="p-2.5 gap-2.5">{order.items}</td>
                    <td className="p-2.5 gap-2.5">{order.total}</td>
                    <td className="p-2.5 gap-2.5">
                      <span
                        className={`px-2 py-1 text-xs fw5 rounded-md ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 text-[#6C6C6C]">
            <p className="text-xs leading-[150%] tracking-[-3%] ">
              Showing 1 to 10 of 50 entries
            </p>

            <div className="flex items-center text-sm gap-2 bg-[#FFFFFF]">
              <button
                className={`p-3 border border-[#D9D9D9] rounded-lg ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>

              {getVisiblePages().map((page) => (
                <button
                  key={page}
                  className={`p-3 rounded-lg min-w-[44px] ${
                    page === currentPage
                      ? "bg-[#F77F00] text-white"
                      : page > totalPages
                      ? "opacity-50 cursor-not-allowed text-[#232323]"
                      : "text-[#232323] hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }}
                  disabled={page > totalPages}
                >
                  {page}
                </button>
              ))}

              <button
                className={`p-3 border border-[#D9D9D9] rounded-lg ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer text-[#232323]"
                }`}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#232323] bg-[#FFFFFF] leading-[150%] tracking-[-3%]">
              <span>Show</span>
              <div className="relative">
                <select className="border border-[#D9D9D9] rounded-lg px-3 py-2.5 text-xs text-[#232323] pr-3">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <FiMoreVertical
                  size={16}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#FFFFFF]"
                />
              </div>
              <span>entries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
