import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FiSearch, FiMoreVertical } from "react-icons/fi";
import profileData from "../../data/profileData";

const Profile = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Delivered: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Canceled: "bg-red-100 text-red-800",
  };

  return (
    <div className=" p-2">
      <div className="flex flex-col p-3 gap-4 ">
        <div className="flex items-center text-xs fw4 gap-1 leading-[150%] tracking-[-3%] ">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#6C6C6C]">Traveler </p>
          <span className="mx-1 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Traveler Details</p>
        </div>

        <h2 className="text-2xl fw6 font-roboto text-[#232323] leading-[140%] tracking-[-3%]">
          Travelers Details
        </h2>
        <p className="text-[#232323] fw4 text-sm leading-[150%] tracking-[-3%]">
          Detailed profile, activity, and preferences of the traveler.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Traveler Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h3 className="text-lg font-medium text-gray-800">
              {profileData.name}
            </h3>
            <p className="text-gray-600">{profileData.email}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-800">{profileData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{profileData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="text-gray-800">{profileData.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{profileData.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Last Order</p>
              <p className="font-medium text-gray-800">
                {profileData.lastOrder}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mt-1">
                Total Spent {profileData.totalSpent}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">
                Registered Email Marketing
              </p>
              <p className="font-medium text-[#9A9A9A]">
                {profileData.emailMarketingDate}
              </p>
              <div>
                <span className="inline-block mt-1 px-2 py-1 text-xs  text-[#9A9A9A] rounded">
                  {profileData.emailMarketingStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Shipping Address
          </h2>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 text-sm text-gray-500">Name</td>
                <td className="py-2 text-gray-800">
                  {profileData.shippingAddress.name}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-gray-500">Country</td>
                <td className="py-2 text-gray-800">
                  {profileData.shippingAddress.country}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-gray-500">Phone Number</td>
                <td className="py-2 text-gray-800">
                  {profileData.shippingAddress.phone}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-gray-500">Address</td>
                <td className="py-2 text-gray-800">
                  {profileData.shippingAddress.address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Billing Address
          </h2>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 text-sm text-gray-500">Name</td>
                <td className="py-2 text-gray-800">
                  {profileData.billingAddress.name}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-gray-500">Country</td>
                <td className="py-2 text-gray-800">
                  {profileData.billingAddress.country}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-gray-500">Phone Number</td>
                <td className="py-2 text-gray-800">
                  {profileData.billingAddress.phone}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-sm text-gray-500">Address</td>
                <td className="py-2 text-gray-800">
                  {profileData.billingAddress.address}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders</h2>
        <div className="mb-4">
          <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-lg shadow-sm flex-grow sm:flex-grow-0 ">
            <FiSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent w-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profileData.orders.map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.partner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
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

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 leading-[150%] tracking-[-3%] text-[#6C6C6C]">
          <p className="text-sm ">Showing 1 to 10 of 50 entries</p>

          <div className="flex items-center text-sm fw5 gap-2">
            <button className="px-2 py-1 border border-gray-300 rounded-lg">
              {"<"}
            </button>
            <button className="px-3 py-1 bg-[#F77F00] text-white rounded-lg">
              1
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-lg">
              2
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-lg">
              ...
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-lg">
              5
            </button>
            <button className="px-2 py-1 border border-gray-300 rounded-lg">
              {">"}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span>Show</span>
            <div className="relative">
              <select className="border border-gray-300 rounded-lg px-3 py-2.5 text-xs text-[#232323] pr-8">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <FiMoreVertical
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
              />
            </div>
            <span>entries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
